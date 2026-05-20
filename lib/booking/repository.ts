/**
 * Repository — interface entre la logique métier et la persistence.
 *
 * Aujourd'hui : impl in-memory (singleton module-level) — suffit pour la maquette.
 *
 * Demain (Firestore) : remplacer chaque méthode par sa version Firestore.
 * L'unicité du slot est garantie par un docId déterministe `slotKey` dans la collection
 * `bookings` (en plus de `holds`), et par une transaction atomique :
 *
 *   await runTransaction(db, async tx => {
 *     const existing = await tx.get(doc(db, "bookings", slotKey));
 *     if (existing.exists()) throw { code: "slot_taken" };
 *     const hold = await tx.get(doc(db, "holds", slotKey));
 *     if (hold.exists() && hold.data().userId !== uid && hold.data().expiresAt > now) {
 *       throw { code: "slot_taken" };
 *     }
 *     tx.set(doc(db, "bookings", slotKey), bookingDoc);
 *     tx.delete(doc(db, "holds", slotKey));
 *   });
 */

import type { Booking, Hold, SlotKey } from "./types";
import type { WaitlistEntry } from "./waitlist";

export interface BookingRepository {
  /** Toutes les réservations confirmées dont le slot recouvre la fenêtre [from, to]. */
  listBookingsInRange(from: Date, to: Date): Promise<Booking[]>;

  /** Tous les holds non expirés dans la fenêtre. */
  listActiveHoldsInRange(from: Date, to: Date, now: Date): Promise<Hold[]>;

  /** Réservation par slotKey (un seul booking confirmé possible par slotKey). */
  getBookingBySlot(slotKey: SlotKey): Promise<Booking | null>;

  /** Hold actif pour ce slot (s'il existe et n'est pas expiré). */
  getActiveHold(slotKey: SlotKey, now: Date): Promise<Hold | null>;

  /** Hold par id, non purgé. Utilisé par confirmHold pour retrouver un hold précis. */
  getHoldById(holdId: string, now: Date): Promise<Hold | null>;

  /** Pose atomique d'un hold. Doit échouer si conflit (slot booké ou hold tiers actif). */
  putHold(hold: Hold, now: Date): Promise<{ ok: true } | { ok: false; reason: "slot_taken" }>;

  /** Supprime un hold (par son id), seulement si appartient à userId. */
  releaseHold(holdId: string, userId: string): Promise<void>;

  /** Confirme atomiquement un hold en booking (idempotent sur le slotKey). */
  confirmHold(args: {
    holdId: string;
    booking: Booking;
    now: Date;
  }): Promise<{ ok: true; booking: Booking } | { ok: false; reason: "hold_expired" | "hold_not_yours" | "slot_taken" }>;

  /** Bookings à venir non annulés pour un user. */
  listActiveByUser(userId: string, now: Date): Promise<Booking[]>;

  /** Marque une résa comme annulée. */
  cancelBooking(bookingId: string, now: Date, refundCents: number): Promise<Booking | null>;

  // ---- Waitlist ----
  /** Ajoute un user à la file d'attente d'un slot. Idempotent par (slotKey, userId). */
  addToWaitlist(entry: WaitlistEntry): Promise<{ position: number }>;
  removeFromWaitlist(slotKey: SlotKey, userId: string): Promise<void>;
  /** Premier entry "pending" sur ce slot (ordre joinedAt asc). */
  firstPendingForSlot(slotKey: SlotKey): Promise<WaitlistEntry | null>;
  /** Liste pour debug / admin. */
  listWaitlist(slotKey: SlotKey): Promise<WaitlistEntry[]>;
  /** Tous les slots où l'user est en file. */
  listWaitlistByUser(userId: string): Promise<WaitlistEntry[]>;
  updateWaitlistEntry(slotKey: SlotKey, userId: string, patch: Partial<WaitlistEntry>): Promise<void>;
}

// -----------------------------------------------------------------------------
// Impl in-memory pour la maquette.
// Genère quelques bookings/holds pour donner du relief à la grille.
// -----------------------------------------------------------------------------

class InMemoryRepository implements BookingRepository {
  private bookings = new Map<string, Booking>();
  private bookingsBySlot = new Map<SlotKey, string>();
  private holds = new Map<string, Hold>();
  private holdsBySlot = new Map<SlotKey, string>();
  private waitlist = new Map<SlotKey, WaitlistEntry[]>();

  constructor() {
    this.seed();
  }

  async addToWaitlist(entry: WaitlistEntry): Promise<{ position: number }> {
    const list = this.waitlist.get(entry.slotKey) ?? [];
    // Idempotence : si l'user est déjà dedans, on retourne juste sa position.
    const existing = list.findIndex(e => e.userId === entry.userId);
    if (existing >= 0) return { position: existing + 1 };
    list.push(entry);
    this.waitlist.set(entry.slotKey, list);
    return { position: list.length };
  }

  async removeFromWaitlist(slotKey: SlotKey, userId: string): Promise<void> {
    const list = this.waitlist.get(slotKey);
    if (!list) return;
    const filtered = list.filter(e => e.userId !== userId);
    if (filtered.length === 0) this.waitlist.delete(slotKey);
    else this.waitlist.set(slotKey, filtered);
  }

  async firstPendingForSlot(slotKey: SlotKey): Promise<WaitlistEntry | null> {
    const list = this.waitlist.get(slotKey);
    if (!list) return null;
    return list.find(e => e.status === "pending") ?? null;
  }

  async listWaitlist(slotKey: SlotKey): Promise<WaitlistEntry[]> {
    return [...(this.waitlist.get(slotKey) ?? [])];
  }

  async listWaitlistByUser(userId: string): Promise<WaitlistEntry[]> {
    const out: WaitlistEntry[] = [];
    for (const list of this.waitlist.values()) {
      for (const e of list) if (e.userId === userId) out.push(e);
    }
    return out;
  }

  async updateWaitlistEntry(slotKey: SlotKey, userId: string, patch: Partial<WaitlistEntry>): Promise<void> {
    const list = this.waitlist.get(slotKey);
    if (!list) return;
    const idx = list.findIndex(e => e.userId === userId);
    if (idx < 0) return;
    list[idx] = { ...list[idx], ...patch };
  }

  async listBookingsInRange(from: Date, to: Date): Promise<Booking[]> {
    return [...this.bookings.values()].filter(
      b => b.status === "confirmed" && b.endsAt > from && b.startsAt < to
    );
  }

  async listActiveHoldsInRange(from: Date, to: Date, now: Date): Promise<Hold[]> {
    this.purgeExpiredHolds(now);
    return [...this.holds.values()].filter(h => h.endsAt > from && h.startsAt < to);
  }

  async getBookingBySlot(slotKey: SlotKey): Promise<Booking | null> {
    const id = this.bookingsBySlot.get(slotKey);
    if (!id) return null;
    const b = this.bookings.get(id);
    return b && b.status === "confirmed" ? b : null;
  }

  async getHoldById(holdId: string, now: Date): Promise<Hold | null> {
    const h = this.holds.get(holdId);
    if (!h) return null;
    if (h.expiresAt <= now) {
      this.holds.delete(holdId);
      this.holdsBySlot.delete(h.slotKey);
      return null;
    }
    return h;
  }

  async getActiveHold(slotKey: SlotKey, now: Date): Promise<Hold | null> {
    const id = this.holdsBySlot.get(slotKey);
    if (!id) return null;
    const h = this.holds.get(id);
    if (!h) return null;
    if (h.expiresAt <= now) {
      this.holds.delete(h.id);
      this.holdsBySlot.delete(slotKey);
      return null;
    }
    return h;
  }

  async putHold(hold: Hold, now: Date): Promise<{ ok: true } | { ok: false; reason: "slot_taken" }> {
    // Atomicité simulée — en Firestore on utilise une transaction.
    if (await this.getBookingBySlot(hold.slotKey)) return { ok: false, reason: "slot_taken" };
    const existing = await this.getActiveHold(hold.slotKey, now);
    if (existing && existing.userId !== hold.userId) return { ok: false, reason: "slot_taken" };
    // Si l'user a déjà un hold sur ce slot, on l'écrase (renouvelle).
    if (existing) this.holds.delete(existing.id);
    this.holds.set(hold.id, hold);
    this.holdsBySlot.set(hold.slotKey, hold.id);
    return { ok: true };
  }

  async releaseHold(holdId: string, userId: string): Promise<void> {
    const h = this.holds.get(holdId);
    if (!h || h.userId !== userId) return;
    this.holds.delete(holdId);
    this.holdsBySlot.delete(h.slotKey);
  }

  async confirmHold(args: { holdId: string; booking: Booking; now: Date }) {
    const h = this.holds.get(args.holdId);
    if (!h) return { ok: false as const, reason: "hold_expired" as const };
    if (h.userId !== args.booking.ownerId) return { ok: false as const, reason: "hold_not_yours" as const };
    if (h.expiresAt <= args.now) {
      this.holds.delete(args.holdId);
      this.holdsBySlot.delete(h.slotKey);
      return { ok: false as const, reason: "hold_expired" as const };
    }
    const slotKey = h.slotKey;
    if (this.bookingsBySlot.has(slotKey)) return { ok: false as const, reason: "slot_taken" as const };

    this.bookings.set(args.booking.id, args.booking);
    this.bookingsBySlot.set(slotKey, args.booking.id);
    this.holds.delete(args.holdId);
    this.holdsBySlot.delete(slotKey);
    return { ok: true as const, booking: args.booking };
  }

  async listActiveByUser(userId: string, now: Date): Promise<Booking[]> {
    return [...this.bookings.values()].filter(
      b => b.ownerId === userId && b.status === "confirmed" && b.endsAt > now
    );
  }

  async cancelBooking(bookingId: string, now: Date, refundCents: number): Promise<Booking | null> {
    const b = this.bookings.get(bookingId);
    if (!b) return null;
    const updated: Booking = { ...b, status: "cancelled", cancelledAt: now, cancellationRefundCents: refundCents };
    this.bookings.set(bookingId, updated);
    // Le slot redevient libre.
    this.bookingsBySlot.delete(`${b.courtId}@${localKey(b.startsAt)}`);
    return updated;
  }

  // ---- helpers ----

  private purgeExpiredHolds(now: Date) {
    for (const [id, h] of this.holds) {
      if (h.expiresAt <= now) {
        this.holds.delete(id);
        this.holdsBySlot.delete(h.slotKey);
      }
    }
  }

  private seed() {
    // Quelques bookings sur les 3 jours à venir pour donner du relief à la grille.
    const days = [0, 1, 2];
    const samples = [
      { court: "BAD-01", hour: 18 },
      { court: "BAD-01", hour: 19 },
      { court: "BAD-03", hour: 20 },
      { court: "SQS-02", hour: 12 },
      { court: "SQS-04", hour: 19 },
      { court: "PET-01", hour: 17 },
      { court: "PET-03", hour: 18 },
    ];
    const seedNow = new Date();
    for (const d of days) {
      for (const s of samples) {
        const start = new Date(seedNow);
        start.setDate(seedNow.getDate() + d);
        start.setHours(s.hour, 0, 0, 0);
        const end = new Date(start.getTime() + 60 * 60_000);
        const id = `seed-${s.court}-${d}-${s.hour}`;
        const slotKey = `${s.court}@${localKey(start)}`;
        const booking: Booking = {
          id,
          courtId: s.court,
          sportId: s.court.startsWith("BAD") ? "badminton" : s.court.startsWith("SQS") ? "squash" : "petanque",
          ownerId: "seed-user",
          startsAt: start,
          endsAt: end,
          status: "confirmed",
          priceCents: 1800,
          isMemberRate: false,
          participants: 2,
          createdAt: new Date(),
        };
        this.bookings.set(id, booking);
        this.bookingsBySlot.set(slotKey, id);
      }
    }
  }
}

function localKey(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Singleton — en Firestore on n'a évidemment pas besoin de cette astuce.
const _global = globalThis as unknown as { __bads_repo?: BookingRepository };
export const repo: BookingRepository = _global.__bads_repo ?? (_global.__bads_repo = new InMemoryRepository());
