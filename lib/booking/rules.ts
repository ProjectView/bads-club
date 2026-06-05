/**
 * Règles de validation et de calcul — fonctions pures, testables sans I/O.
 * Toute la logique métier vit ici. Pas d'appel réseau, pas d'état partagé.
 */

import {
  ADVANCE_WINDOW_DAYS,
  CANCELLATION_POLICY,
  COURTS,
  MAX_ACTIVE_BOOKINGS,
  OPEN_HOURS,
  PETANQUE_PRICING,
  SLOT_DURATION_MIN,
  ZONE_LABEL,
  ZONE_PRICE_EUR,
  ZONE_WINDOWS,
  type Zone,
} from "./config";
import type { Court, PriceQuote, SlotKey, SportId } from "./types";

// ---------- Slot keys ----------

/** Format stable et triable : "BAD-02@2026-05-22T19:00" (heure locale). */
export function slotKey(courtId: string, startsAt: Date): SlotKey {
  return `${courtId}@${formatLocal(startsAt)}`;
}

export function parseSlotKey(key: SlotKey): { courtId: string; startsAt: Date } {
  const [courtId, iso] = key.split("@");
  return { courtId, startsAt: parseLocal(iso) };
}

// ---------- Horaires d'ouverture ----------

export function isWithinOpenHours(slotStart: Date): boolean {
  const dow = slotStart.getDay();
  const hours = OPEN_HOURS[dow];
  if (!hours) return false;
  const slotEnd = new Date(slotStart.getTime() + SLOT_DURATION_MIN * 60_000);
  return isAfterOrEqual(slotStart, hours.open) && isBeforeOrEqual(slotEnd, hours.close);
}

function isAfterOrEqual(d: Date, hhmm: string): boolean {
  const [h, m] = hhmm.split(":").map(Number);
  return d.getHours() > h || (d.getHours() === h && d.getMinutes() >= m);
}

function isBeforeOrEqual(d: Date, hhmm: string): boolean {
  const [h, m] = hhmm.split(":").map(Number);
  return d.getHours() < h || (d.getHours() === h && d.getMinutes() <= m);
}

// ---------- Fenêtre de réservation ----------

export function isWithinAdvanceWindow(slotStart: Date, now: Date, isMember: boolean): boolean {
  const maxDays = isMember ? ADVANCE_WINDOW_DAYS.member : ADVANCE_WINDOW_DAYS.guest;
  const horizon = new Date(now.getTime() + maxDays * 86_400_000);
  return slotStart >= now && slotStart <= horizon;
}

// ---------- Limites par user ----------

export function maxActiveBookings(isMember: boolean): number {
  return isMember ? MAX_ACTIVE_BOOKINGS.member : MAX_ACTIVE_BOOKINGS.guest;
}

// ---------- Zones tarifaires ----------

/**
 * Détermine la zone tarifaire d'un créneau (badminton/squash uniquement).
 * Le créneau appartient à une zone si son point de départ tombe dans une plage
 * de cette zone. Pour la pétanque, retourne `null`.
 *
 * Returns `null` si aucune plage ne matche (cas limite : zone non couverte par
 * la grille publique — par défaut on considère cela comme un créneau "non
 * réservable au tarif standard", à signaler côté UI).
 */
export function getZoneForSlot(slotStart: Date, sportId: SportId): Zone | null {
  if (sportId === "petanque") return null;
  const dow = slotStart.getDay();
  const minutesOfDay = slotStart.getHours() * 60 + slotStart.getMinutes();
  for (const zone of ["red", "blue", "green"] as Zone[]) {
    for (const w of ZONE_WINDOWS[zone]) {
      if (!w.daysOfWeek.includes(dow)) continue;
      const start = w.startHour * 60 + w.startMin;
      const end = w.endHour * 60 + w.endMin;
      if (minutesOfDay >= start && minutesOfDay < end) return zone;
    }
  }
  return null;
}

// ---------- Pricing ----------

export function quotePrice(args: {
  courtId: string;
  slotStart: Date;
  /** isMember est conservé pour de futurs avantages, mais la grille publique
   *  ne fait actuellement aucune distinction membre/non-membre. */
  isMember?: boolean;
}): PriceQuote {
  const court = COURTS.find(c => c.id === args.courtId);
  if (!court) throw new Error(`Court not found: ${args.courtId}`);

  // Pétanque : tarif fixe à l'heure (le slot est de 60 min).
  if (court.sportId === "petanque") {
    const cents = Math.round(PETANQUE_PRICING.perHour * 100);
    return {
      base: { cents, currency: "EUR" },
      total: { cents, currency: "EUR" },
      zone: null,
      zoneLabel: null,
      notes: ["Tarif unique pétanque · 1 heure"],
    };
  }

  // Badminton / Squash : tarif selon la zone temporelle.
  const zone = getZoneForSlot(args.slotStart, court.sportId);
  if (!zone) {
    // Hors plage tarifée explicite — on prend le tarif Bleue par défaut et on signale.
    const cents = Math.round(ZONE_PRICE_EUR.blue * 100);
    return {
      base: { cents, currency: "EUR" },
      total: { cents, currency: "EUR" },
      zone: "blue",
      zoneLabel: ZONE_LABEL.blue,
      notes: ["Tarif Bleue par défaut · zone non couverte explicitement"],
    };
  }

  const cents = Math.round(ZONE_PRICE_EUR[zone] * 100);
  return {
    base: { cents, currency: "EUR" },
    total: { cents, currency: "EUR" },
    zone,
    zoneLabel: ZONE_LABEL[zone],
    notes: [`Zone ${ZONE_LABEL[zone]} · 1 heure`],
  };
}

// ---------- Annulation ----------

export function computeCancellationRefund(args: {
  slotStart: Date;
  paidCents: number;
  now: Date;
}): { refundCents: number; refundRate: number; tooLate: boolean } {
  const hoursBefore = (args.slotStart.getTime() - args.now.getTime()) / 3_600_000;
  const tier = CANCELLATION_POLICY.find(t => hoursBefore >= t.hoursBefore);
  if (!tier) return { refundCents: 0, refundRate: 0, tooLate: true };
  return {
    refundCents: Math.round(args.paidCents * tier.refundRate),
    refundRate: tier.refundRate,
    tooLate: tier.refundRate === 0,
  };
}

// ---------- Plat principal : un user peut-il prendre ce slot ? ----------

export function canBookSlot(args: {
  courtId: string;
  slotStart: Date;
  now: Date;
  isMember: boolean;
  isAdmin?: boolean;
  userActiveBookings: number;
}): { ok: true } | { ok: false; reason: string } {
  if (args.slotStart < args.now) return { ok: false, reason: "Créneau passé." };
  if (!isWithinOpenHours(args.slotStart)) return { ok: false, reason: "Hors horaires d'ouverture." };
  if (!args.isAdmin && !isWithinAdvanceWindow(args.slotStart, args.now, args.isMember)) {
    return {
      ok: false,
      reason: `Réservation possible jusqu'à ${args.isMember ? ADVANCE_WINDOW_DAYS.member : ADVANCE_WINDOW_DAYS.guest} jours à l'avance.`,
    };
  }
  const max = maxActiveBookings(args.isMember);
  if (!args.isAdmin && args.userActiveBookings >= max) {
    return { ok: false, reason: `Tu as déjà ${max} réservations actives. Annule-en une pour réserver à nouveau.` };
  }
  return { ok: true };
}

// ---------- helpers date ----------

function pad(n: number) { return String(n).padStart(2, "0"); }

export function formatLocal(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function parseLocal(s: string): Date {
  const [date, time] = s.split("T");
  const [y, m, d] = date.split("-").map(Number);
  const [h, min] = time.split(":").map(Number);
  return new Date(y, m - 1, d, h, min, 0, 0);
}

/** Génère tous les départs possibles pour un jour donné, selon les horaires + le pas. */
export function enumerateSlotStarts(day: Date): Date[] {
  const dow = day.getDay();
  const hours = OPEN_HOURS[dow];
  if (!hours) return [];
  const [oh, om] = hours.open.split(":").map(Number);
  const [ch, cm] = hours.close.split(":").map(Number);
  const start = new Date(day);
  start.setHours(oh, om, 0, 0);
  const closeAt = new Date(day);
  closeAt.setHours(ch, cm, 0, 0);

  const out: Date[] = [];
  for (let t = start.getTime(); t + SLOT_DURATION_MIN * 60_000 <= closeAt.getTime(); t += SLOT_DURATION_MIN * 60_000) {
    out.push(new Date(t));
  }
  return out;
}

export function listCourtsForSport(sportId: SportId): Court[] {
  return COURTS.filter(c => c.sportId === sportId && c.isActive);
}
