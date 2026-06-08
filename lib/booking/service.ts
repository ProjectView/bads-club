/**
 * Service métier — orchestre repository + règles.
 * C'est ce que la UI appelle. Aucune logique métier ne doit fuir dans les composants.
 */

import { COURTS, HOLD_TTL_MIN, SLOT_DURATION_MIN, SPORTS, ZONE_LABEL } from "./config";
import { repo } from "./repository";
import {
  canBookSlot,
  computeCancellationRefund,
  enumerateSlotStarts,
  listCourtsForSport,
  quotePrice,
  slotKey,
} from "./rules";
import type {
  Booking,
  BookingError,
  Hold,
  PriceQuote,
  Slot,
  SportId,
} from "./types";
import { WAITLIST_GRACE_MIN, type WaitlistEntry } from "./waitlist";
import { notifications } from "@/lib/notifications/dispatcher";
import type { BookingSnapshot, RecipientSnapshot } from "@/lib/notifications/events";

// -----------------------------------------------------------------------------
// Lecture : grille de disponibilités
// -----------------------------------------------------------------------------

export type AvailabilityCell = {
  courtId: string;
  courtLabel: string;
  slots: Slot[];
};

/**
 * Construit la grille des disponibilités pour un sport, à une date donnée.
 * Combine slots théoriques (depuis OPEN_HOURS) + bookings confirmés + holds actifs.
 */
export async function getAvailability(args: {
  sportId: SportId;
  day: Date;          // n'importe quelle heure du jour, on tronque
  now?: Date;
  currentUserId?: string;
}): Promise<AvailabilityCell[]> {
  const now = args.now ?? new Date();
  const dayStart = new Date(args.day);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(dayStart.getTime() + 86_400_000);

  const courts = listCourtsForSport(args.sportId);
  const [bookings, holds] = await Promise.all([
    repo.listBookingsInRange(dayStart, dayEnd),
    repo.listActiveHoldsInRange(dayStart, dayEnd, now),
  ]);

  const bookedSet = new Set(bookings.map(b => slotKey(b.courtId, b.startsAt)));
  const heldByOther = new Map<string, string>(); // slotKey → userId
  for (const h of holds) {
    if (h.userId !== args.currentUserId) heldByOther.set(h.slotKey, h.userId);
  }

  const starts = enumerateSlotStarts(dayStart);
  return courts.map<AvailabilityCell>(court => ({
    courtId: court.id,
    courtLabel: court.label,
    slots: starts.map<Slot>(start => {
      const key = slotKey(court.id, start);
      const end = new Date(start.getTime() + SLOT_DURATION_MIN * 60_000);
      let status: Slot["status"] = "free";
      if (end <= now) status = "past";
      else if (bookedSet.has(key)) status = "booked";
      else if (heldByOther.has(key)) status = "held";

      const q = quotePrice({ courtId: court.id, slotStart: start });
      return {
        key,
        courtId: court.id,
        sportId: args.sportId,
        startsAt: start,
        endsAt: end,
        status,
        zone: q.zone,
        priceCents: q.total.cents,
      };
    }),
  }));
}

// -----------------------------------------------------------------------------
// Hold + confirmation
// -----------------------------------------------------------------------------

export async function createHold(args: {
  courtId: string;
  slotStart: Date;
  userId: string;
  isMember: boolean;
  isAdmin?: boolean;
  now?: Date;
}): Promise<{ hold: Hold; quote: PriceQuote } | { error: BookingError }> {
  const now = args.now ?? new Date();
  const userActive = (await repo.listActiveByUser(args.userId, now)).length;

  const check = canBookSlot({
    courtId: args.courtId,
    slotStart: args.slotStart,
    now,
    isMember: args.isMember,
    isAdmin: args.isAdmin,
    userActiveBookings: userActive,
  });
  if (!check.ok) return { error: errorFromReason(check.reason) };

  const key = slotKey(args.courtId, args.slotStart);
  const end = new Date(args.slotStart.getTime() + SLOT_DURATION_MIN * 60_000);

  const hold: Hold = {
    id: `hold_${cryptoRandom()}`,
    slotKey: key,
    courtId: args.courtId,
    startsAt: args.slotStart,
    endsAt: end,
    userId: args.userId,
    expiresAt: new Date(now.getTime() + HOLD_TTL_MIN * 60_000),
    intent: "checkout",
    createdAt: now,
  };

  const result = await repo.putHold(hold, now);
  if (!result.ok) {
    return { error: { code: "slot_taken", message: "Ce créneau vient d'être pris par quelqu'un d'autre." } };
  }

  const quote = quotePrice({ courtId: args.courtId, slotStart: args.slotStart, isMember: args.isMember });
  return { hold, quote };
}

export async function confirmHold(args: {
  holdId: string;
  userId: string;
  paymentIntentId?: string;
  isMember: boolean;
  participants?: number;
  now?: Date;
}): Promise<{ booking: Booking } | { error: BookingError }> {
  const now = args.now ?? new Date();

  const hold = await repo.getHoldById(args.holdId, now);
  if (!hold) return { error: { code: "hold_expired", message: "Le créneau n'est plus réservé pour toi." } };
  if (hold.userId !== args.userId) return { error: { code: "hold_not_yours", message: "Ce hold ne t'appartient pas." } };

  const quote = quotePrice({ courtId: hold.courtId, slotStart: hold.startsAt, isMember: args.isMember });
  const booking: Booking = {
    id: `bkg_${cryptoRandom()}`,
    courtId: hold.courtId,
    sportId: sportFromCourt(hold.courtId),
    ownerId: args.userId,
    startsAt: hold.startsAt,
    endsAt: hold.endsAt,
    status: "confirmed",
    priceCents: quote.total.cents,
    isMemberRate: args.isMember,
    paymentIntentId: args.paymentIntentId,
    participants: args.participants ?? 2,
    createdAt: now,
  };

  const result = await repo.confirmHold({ holdId: args.holdId, booking, now });
  if (!result.ok) {
    return { error: { code: result.reason, message: messageFromReason(result.reason) } };
  }

  // --- Notifications ---
  const snapshot = bookingToSnapshot(result.booking);
  const recipient = await loadRecipient(args.userId);
  await Promise.all([
    notifications.emit({
      type: "booking.confirmed",
      audience: "member",
      recipientId: args.userId,
      data: { booking: snapshot, recipient, paymentIntentId: args.paymentIntentId },
      links: { primary: "/mon-compte#reservations" },
    }),
    notifications.emit({
      type: "admin.booking_created",
      audience: "admin",
      recipientId: null,
      data: { booking: snapshot, bookedBy: recipient },
      links: { primary: "/admin/notifications" },
    }),
  ]);

  return { booking: result.booking };
}

export async function releaseHold(holdId: string, userId: string): Promise<void> {
  return repo.releaseHold(holdId, userId);
}

// -----------------------------------------------------------------------------
// Annulation
// -----------------------------------------------------------------------------

export async function cancelBooking(args: {
  bookingId: string;
  userId: string;
  now?: Date;
}): Promise<{ booking: Booking; refundCents: number } | { error: BookingError }> {
  const now = args.now ?? new Date();
  const bookings = await repo.listActiveByUser(args.userId, new Date(0));
  const booking = bookings.find(b => b.id === args.bookingId);
  if (!booking) return { error: { code: "not_found", message: "Réservation introuvable." } };

  const refund = computeCancellationRefund({
    slotStart: booking.startsAt,
    paidCents: booking.priceCents,
    now,
  });
  if (refund.tooLate) {
    return { error: { code: "cancellation_too_late", message: "Annulation trop tardive — non remboursable." } };
  }
  const cancelled = await repo.cancelBooking(args.bookingId, now, refund.refundCents);
  if (!cancelled) return { error: { code: "not_found", message: "Réservation introuvable." } };

  // --- Notifications ---
  const snapshot = bookingToSnapshot(cancelled);
  const recipient = await loadRecipient(args.userId);
  await Promise.all([
    notifications.emit({
      type: "booking.cancelled",
      audience: "member",
      recipientId: args.userId,
      data: { booking: snapshot, recipient, refundCents: refund.refundCents, cancelledBy: "member" },
      links: { primary: "/reservation" },
    }),
    notifications.emit({
      type: "admin.booking_cancelled",
      audience: "admin",
      recipientId: null,
      data: { booking: snapshot, cancelledBy: recipient, refundCents: refund.refundCents },
      links: { primary: "/admin/notifications" },
    }),
  ]);

  // --- Libération du créneau pour la file d'attente ---
  await releaseSlotToWaitlist({ courtId: cancelled.courtId, startsAt: cancelled.startsAt, endsAt: cancelled.endsAt, now });

  return { booking: cancelled, refundCents: refund.refundCents };
}

// -----------------------------------------------------------------------------
// Waitlist
// -----------------------------------------------------------------------------

export async function joinWaitlist(args: {
  courtId: string;
  slotStart: Date;
  userId: string;
}): Promise<{ position: number } | { error: BookingError }> {
  const key = slotKey(args.courtId, args.slotStart);
  const booking = await repo.getBookingBySlot(key);
  if (!booking) return { error: { code: "not_found", message: "Ce créneau n'est pas réservé, pas besoin de file d'attente." } };
  const entry: WaitlistEntry = {
    slotKey: key,
    courtId: args.courtId,
    startsAt: args.slotStart,
    endsAt: new Date(args.slotStart.getTime() + SLOT_DURATION_MIN * 60_000),
    userId: args.userId,
    joinedAt: new Date(),
    status: "pending",
  };
  return repo.addToWaitlist(entry);
}

export async function leaveWaitlist(args: { courtId: string; slotStart: Date; userId: string }): Promise<void> {
  await repo.removeFromWaitlist(slotKey(args.courtId, args.slotStart), args.userId);
}

export async function listWaitlistByUser(userId: string): Promise<WaitlistEntry[]> {
  return repo.listWaitlistByUser(userId);
}

/**
 * Notifie le premier en file d'attente qu'un créneau s'est libéré.
 * En prod, on stocke un expiresAt et un cron passe en `expired` puis désigne le suivant.
 */
async function releaseSlotToWaitlist(args: { courtId: string; startsAt: Date; endsAt: Date; now: Date }) {
  const key = slotKey(args.courtId, args.startsAt);
  const first = await repo.firstPendingForSlot(key);
  if (!first) return;

  const expiresAt = new Date(args.now.getTime() + WAITLIST_GRACE_MIN * 60_000);
  await repo.updateWaitlistEntry(key, first.userId, {
    status: "notified",
    notifiedAt: args.now,
    expiresAt,
  });

  const recipient = await loadRecipient(first.userId);
  const court = COURTS.find(c => c.id === args.courtId);
  const sportId = court?.sportId ?? "badminton";
  const q = quotePrice({ courtId: args.courtId, slotStart: args.startsAt });

  await notifications.emit({
    type: "waitlist.slot_available",
    audience: "member",
    recipientId: first.userId,
    data: {
      slot: {
        courtId: args.courtId,
        courtLabel: court?.label ?? args.courtId,
        sportId,
        sportLabel: SPORTS[sportId].label,
        zone: q.zone,
        zoneLabel: q.zoneLabel,
        startsAt: args.startsAt.toISOString(),
        endsAt: args.endsAt.toISOString(),
        priceCents: q.total.cents,
      },
      recipient,
      expiresAt: expiresAt.toISOString(),
      position: 1,
    },
    links: { primary: "/reservation" },
  });
}

// -----------------------------------------------------------------------------
// Helpers notif
// -----------------------------------------------------------------------------

function bookingToSnapshot(b: Booking): BookingSnapshot {
  const court = COURTS.find(c => c.id === b.courtId);
  const q = quotePrice({ courtId: b.courtId, slotStart: b.startsAt });
  return {
    bookingId: b.id,
    courtId: b.courtId,
    courtLabel: court?.label ?? b.courtId,
    sportId: b.sportId,
    sportLabel: SPORTS[b.sportId].label,
    zone: q.zone,
    zoneLabel: q.zoneLabel,
    startsAt: b.startsAt.toISOString(),
    endsAt: b.endsAt.toISOString(),
    priceCents: b.priceCents,
  };
}

/**
 * En prod, on lit /users/{uid} dans Firestore.
 * Ici on retourne un snapshot synthétique pour la maquette.
 */
async function loadRecipient(userId: string): Promise<RecipientSnapshot> {
  // Mock alignement avec les DEMO_USERS dans lib/auth.ts
  if (userId === "user-001") {
    return { uid: userId, displayName: "Léa Martin", email: "lea@example.com", phone: "06 12 34 56 78" };
  }
  if (userId === "admin-001") {
    return { uid: userId, displayName: "Jonathan · Admin", email: "admin@badsclub.com" };
  }
  return { uid: userId, displayName: "Membre Bad's", email: `${userId}@example.com` };
}

// -----------------------------------------------------------------------------
// Devis (read-only, sans hold)
// -----------------------------------------------------------------------------

export function getQuote(args: { courtId: string; slotStart: Date; isMember: boolean }): PriceQuote {
  return quotePrice(args);
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function sportFromCourt(courtId: string): SportId {
  if (courtId.startsWith("BAD")) return "badminton";
  if (courtId.startsWith("SQS")) return "squash";
  return "petanque";
}

function errorFromReason(reason: string): BookingError {
  if (reason.includes("passé")) return { code: "in_the_past", message: reason };
  if (reason.includes("ouverture")) return { code: "outside_open_hours", message: reason };
  if (reason.includes("réservations actives")) return { code: "max_active_reached", message: reason, max: 5 };
  if (reason.includes("avance")) return { code: "outside_advance_window", message: reason };
  return { code: "slot_taken", message: reason };
}

function messageFromReason(r: "hold_expired" | "hold_not_yours" | "slot_taken"): string {
  if (r === "hold_expired") return "Le créneau n'est plus réservé pour toi (délai dépassé).";
  if (r === "hold_not_yours") return "Ce hold ne t'appartient pas.";
  return "Ce créneau vient d'être pris.";
}

function cryptoRandom(): string {
  // Préfère crypto.randomUUID quand dispo (Node 20+ et navigateurs modernes).
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().slice(0, 12);
  }
  return Math.random().toString(36).slice(2, 14);
}
