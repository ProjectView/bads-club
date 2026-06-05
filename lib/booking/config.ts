/**
 * Règles métier — un seul endroit à modifier si le club change ses conditions.
 *
 * Source des tarifs : grille publique du Bad's Club (vente2.png), récupérée le 2026-05-20.
 *
 * Modèle tarifaire = TARIFICATION PAR ZONE TEMPORELLE
 *   - Zone Rouge (heures pleines)
 *   - Zone Bleue (heures intermédiaires)
 *   - Zone Verte (heures creuses)
 *   Le sport (badminton vs squash) n'influence PAS le prix : ils partagent la même grille.
 *   La pétanque a son propre modèle (tarif au quart d'heure).
 *
 * Les durées sont en minutes sauf indication contraire.
 */

import type { Court, SportId } from "./types";

export const SLOT_DURATION_MIN = 60;

/** Pas d'affichage de la grille. 60 min = créneaux à l'heure pile. */
export const GRID_STEP_MIN = 60;

/** Durée pendant laquelle un user peut maintenir son créneau pendant le paiement. */
export const HOLD_TTL_MIN = 8;

/** Combien de jours à l'avance on peut réserver. À valider avec le club. */
export const ADVANCE_WINDOW_DAYS = {
  member: 14,
  guest: 7,
} as const;

/** Nb max de réservations actives (à venir, non annulées) simultanément par user. */
export const MAX_ACTIVE_BOOKINGS = {
  member: 5,
  guest: 2,
} as const;

// -----------------------------------------------------------------------------
// Tarification par zone (Badminton & Squash)
// -----------------------------------------------------------------------------

export type Zone = "red" | "blue" | "green";

/**
 * Zones tarifaires. Chaque zone est définie par une liste de plages
 * (jours de la semaine + heure début + heure fin, exclues).
 * dayOfWeek : 0 = dimanche, 1 = lundi, … 6 = samedi.
 */
type ZoneWindow = { daysOfWeek: number[]; startHour: number; startMin: number; endHour: number; endMin: number };

export const ZONE_WINDOWS: Record<Zone, ZoneWindow[]> = {
  // Zone Rouge : semaine 12h15→13h45 et 18h15→22h00
  red: [
    { daysOfWeek: [1,2,3,4,5], startHour: 12, startMin: 15, endHour: 13, endMin: 45 },
    { daysOfWeek: [1,2,3,4,5], startHour: 18, startMin: 15, endHour: 22, endMin: 0 },
  ],
  // Zone Bleue : semaine 10h→12h15 et 16h→18h15, week-end 9h→19h30
  blue: [
    { daysOfWeek: [1,2,3,4,5], startHour: 10, startMin: 0,  endHour: 12, endMin: 15 },
    { daysOfWeek: [1,2,3,4,5], startHour: 16, startMin: 0,  endHour: 18, endMin: 15 },
    { daysOfWeek: [0,6],       startHour: 9,  startMin: 0,  endHour: 19, endMin: 30 },
  ],
  // Zone Verte : semaine 13h45→16h00
  green: [
    { daysOfWeek: [1,2,3,4,5], startHour: 13, startMin: 45, endHour: 16, endMin: 0 },
  ],
};

/** Tarif unitaire (€/heure) pour badminton & squash, par zone. */
export const ZONE_PRICE_EUR: Record<Zone, number> = {
  red: 22,
  blue: 18,
  green: 15,
};

export const ZONE_LABEL: Record<Zone, string> = {
  red: "Rouge",
  blue: "Bleue",
  green: "Verte",
};

// -----------------------------------------------------------------------------
// Pétanque
// -----------------------------------------------------------------------------

export const PETANQUE_PRICING = {
  per30Min: 10,
  perHour: 20,
} as const;

// -----------------------------------------------------------------------------
// Locations de matériel
// -----------------------------------------------------------------------------

export const EQUIPMENT_RENTAL_EUR = {
  racket: 2,      // raquette badminton ou squash
  shoes: 2,       // chaussures
} as const;

// -----------------------------------------------------------------------------
// Politique d'annulation
// -----------------------------------------------------------------------------

/**
 * D'après le site officiel : "pour les annulations non effectuées la veille
 * au plus tard, le terrain sera dû." → seuil à 24h.
 * On garde un palier intermédiaire 50% / 0% pour les futures évolutions,
 * mais par défaut, conformément au site :
 *   ≥ 24h → 100% remboursé · < 24h → 0%
 */
export const CANCELLATION_POLICY = [
  { hoursBefore: 24, refundRate: 1.0 },
  { hoursBefore: 0,  refundRate: 0.0 },
] as const;

// -----------------------------------------------------------------------------
// Horaires d'ouverture
// -----------------------------------------------------------------------------

/** 0 = dim, 1 = lun, … 6 = sam. `null` = fermé. */
export const OPEN_HOURS: Record<number, { open: string; close: string } | null> = {
  0: { open: "09:00", close: "19:30" }, // dim
  1: { open: "10:00", close: "22:45" }, // lun
  2: { open: "10:00", close: "22:45" }, // mar
  3: { open: "10:00", close: "22:45" }, // mer
  4: { open: "10:00", close: "22:45" }, // jeu
  5: { open: "10:00", close: "22:45" }, // ven
  6: { open: "09:00", close: "19:30" }, // sam
};

// -----------------------------------------------------------------------------
// Catalogue des terrains (à terme : /courts dans Firestore)
// -----------------------------------------------------------------------------

/**
 * Le `hourlyRate` est un tarif "moyen indicatif" — le vrai prix est calculé
 * dynamiquement par `quotePrice()` selon la zone temporelle du créneau.
 */
export const COURTS: Court[] = [
  ...Array.from({ length: 4 }, (_, i) => ({
    id: `BAD-${String(i + 1).padStart(2, "0")}`,
    sportId: "badminton" as SportId,
    label: `Terrain ${i + 1}`,
    number: i + 1,
    isActive: true,
    hourlyRate: ZONE_PRICE_EUR.blue,
  })),
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `SQS-${String(i + 1).padStart(2, "0")}`,
    sportId: "squash" as SportId,
    label: `Terrain ${i + 1}`,
    number: i + 1,
    isActive: true,
    hourlyRate: ZONE_PRICE_EUR.blue,
  })),
  ...Array.from({ length: 4 }, (_, i) => ({
    id: `PET-${String(i + 1).padStart(2, "0")}`,
    sportId: "petanque" as SportId,
    label: `Terrain ${i + 1}`,
    number: i + 1,
    isActive: true,
    hourlyRate: PETANQUE_PRICING.perHour,
  })),
  // Tennis de table — nombre de tables à confirmer avec le client (default 2)
  ...Array.from({ length: 2 }, (_, i) => ({
    id: `TT-${String(i + 1).padStart(2, "0")}`,
    sportId: "tennis_table" as SportId,
    label: `Table ${i + 1}`,
    number: i + 1,
    isActive: true,
    hourlyRate: 12,
    notes: "Nombre de tables à confirmer avec le club",
  })),
  // Baseball — simulateur, 1 unité (à confirmer)
  {
    id: "BBL-01",
    sportId: "baseball" as SportId,
    label: "Simulateur",
    number: 1,
    isActive: true,
    hourlyRate: 25,
    notes: "Tarif à confirmer avec le club",
  },
];

export const SPORTS: Record<SportId, { label: string; code: string }> = {
  badminton:    { label: "Badminton",       code: "BAD" },
  squash:       { label: "Squash",          code: "SQS" },
  petanque:     { label: "Pétanque",        code: "PET" },
  tennis_table: { label: "Tennis de table", code: "TT"  },
  baseball:     { label: "Baseball",        code: "BBL" },
};
