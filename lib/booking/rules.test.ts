/**
 * Smoke tests sans framework — exécution :
 *
 *   npx tsx lib/booking/rules.test.ts
 *
 * (ou simplement `node --experimental-strip-types lib/booking/rules.test.ts` sur Node 22.6+)
 *
 * Vérifie que les frontières des zones tarifaires sont conformes à la grille publique
 * du Bad's Club (vente2.png), pour badminton & squash.
 */

import { getZoneForSlot, quotePrice } from "./rules";
import { ZONE_PRICE_EUR } from "./config";

type Case = {
  label: string;
  date: string;          // YYYY-MM-DD
  time: string;          // HH:mm — début du créneau
  sport: "badminton" | "squash" | "petanque";
  expectedZone: "red" | "blue" | "green" | null;
};

const cases: Case[] = [
  // --- Zone Rouge : semaine 12h15–13h45 et 18h15–22h ---
  { label: "Lundi 12h15 (limite basse rouge)",   date: "2026-05-25", time: "12:15", sport: "badminton", expectedZone: "red" },
  { label: "Mardi 13h00 (cœur rouge midi)",      date: "2026-05-26", time: "13:00", sport: "squash",    expectedZone: "red" },
  { label: "Mercredi 13h44 (juste sous limite)", date: "2026-05-27", time: "13:30", sport: "badminton", expectedZone: "red" },
  { label: "Jeudi 18h15 (limite basse rouge soir)", date: "2026-05-28", time: "18:15", sport: "badminton", expectedZone: "red" },
  { label: "Vendredi 21h00 (cœur rouge soir)",   date: "2026-05-29", time: "21:00", sport: "squash",    expectedZone: "red" },

  // --- Zone Bleue : semaine 10h–12h15 et 16h–18h15 ---
  { label: "Lundi 10h00 (limite basse bleue)",   date: "2026-05-25", time: "10:00", sport: "badminton", expectedZone: "blue" },
  { label: "Mardi 11h00 (cœur bleue matin)",     date: "2026-05-26", time: "11:00", sport: "squash",    expectedZone: "blue" },
  { label: "Mercredi 16h00 (limite basse bleue après-midi)", date: "2026-05-27", time: "16:00", sport: "badminton", expectedZone: "blue" },
  { label: "Jeudi 17h00 (cœur bleue après-midi)", date: "2026-05-28", time: "17:00", sport: "squash",   expectedZone: "blue" },

  // --- Zone Bleue week-end (9h–19h30) ---
  { label: "Samedi 09h00 (limite basse bleue WE)", date: "2026-05-30", time: "09:00", sport: "badminton", expectedZone: "blue" },
  { label: "Samedi 15h00 (cœur bleue WE)",       date: "2026-05-30", time: "15:00", sport: "squash",    expectedZone: "blue" },
  { label: "Dimanche 19h00 (fin bleue WE)",      date: "2026-05-31", time: "19:00", sport: "badminton", expectedZone: "blue" },

  // --- Zone Verte : semaine 13h45–16h ---
  { label: "Lundi 13h45 (limite basse verte)",   date: "2026-05-25", time: "13:45", sport: "badminton", expectedZone: "green" },
  { label: "Mardi 14h00 (cœur verte)",           date: "2026-05-26", time: "14:00", sport: "squash",    expectedZone: "green" },
  { label: "Vendredi 15h00 (cœur verte)",        date: "2026-05-29", time: "15:00", sport: "badminton", expectedZone: "green" },

  // --- Pétanque : toujours null ---
  { label: "Lundi 18h pétanque",                 date: "2026-05-25", time: "18:00", sport: "petanque",  expectedZone: null },
  { label: "Samedi 11h pétanque",                date: "2026-05-30", time: "11:00", sport: "petanque",  expectedZone: null },
];

let passed = 0;
let failed = 0;

console.log("\n  🏸  Smoke tests zones tarifaires Bad's Club\n");

for (const c of cases) {
  const [y, m, d] = c.date.split("-").map(Number);
  const [h, min] = c.time.split(":").map(Number);
  const slotStart = new Date(y, m - 1, d, h, min, 0, 0);

  const zone = getZoneForSlot(slotStart, c.sport);
  const ok = zone === c.expectedZone;

  console.log(
    `  ${ok ? "✓" : "✗"}  ${c.label.padEnd(50)} → ${String(zone).padEnd(7)} ${ok ? "" : `(attendu: ${c.expectedZone})`}`
  );
  if (ok) passed++; else failed++;
}

// Test pricing : un slot Rouge bad = 22€, Bleu squash = 18€, Vert bad = 15€
console.log("\n  💶  Tests pricing\n");

const priceCases: { courtId: string; date: string; time: string; expectedEur: number; label: string }[] = [
  { courtId: "BAD-01", date: "2026-05-25", time: "19:00", expectedEur: 22, label: "BAD Lundi 19h (Rouge)" },
  { courtId: "SQS-02", date: "2026-05-30", time: "11:00", expectedEur: 18, label: "SQS Samedi 11h (Bleue WE)" },
  { courtId: "BAD-03", date: "2026-05-26", time: "14:30", expectedEur: 15, label: "BAD Mardi 14h30 (Verte)" },
  { courtId: "PET-01", date: "2026-05-25", time: "19:00", expectedEur: 20, label: "PET Lundi 19h (forfait 1h)" },
];

for (const p of priceCases) {
  const [y, m, d] = p.date.split("-").map(Number);
  const [h, min] = p.time.split(":").map(Number);
  const start = new Date(y, m - 1, d, h, min, 0, 0);
  const q = quotePrice({ courtId: p.courtId, slotStart: start });
  const actualEur = q.total.cents / 100;
  const ok = actualEur === p.expectedEur;
  console.log(`  ${ok ? "✓" : "✗"}  ${p.label.padEnd(40)} → ${actualEur.toFixed(2)}€  ${ok ? "" : `(attendu: ${p.expectedEur}€)`}`);
  if (ok) passed++; else failed++;
}

console.log(`\n  → ${passed} ok, ${failed} ko\n`);
process.exit(failed === 0 ? 0 : 1);
