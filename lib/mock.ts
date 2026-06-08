export const SPORTS = [
  { id: "badminton", label: "Badminton", courts: 4, price: 18, color: "lime", code: "BAD" },
  { id: "squash", label: "Squash", courts: 5, price: 16, color: "amber", code: "SQS" },
  { id: "petanque", label: "Pétanque", courts: 4, price: 12, color: "cream", code: "PET" },
] as const;

export const SLOTS = [
  "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00", "18:00", "19:00", "20:00", "21:00",
];

export type Slot = { time: string; status: "free" | "booked" | "mine" };

export function generateGrid(courts: number): Slot[][] {
  return Array.from({ length: courts }, (_, c) =>
    SLOTS.map((time, i) => {
      const seed = (c * 7 + i * 13) % 17;
      let status: Slot["status"] = "free";
      if (seed < 6) status = "booked";
      if (c === 1 && i === 7) status = "mine";
      return { time, status };
    })
  );
}

export const GROUPS = [
  {
    id: "double-mixte-jeudi",
    name: "Double mixte du jeudi",
    sport: "Badminton",
    members: 14,
    next: "Jeu. 22 mai · 19h00",
    last: "Léa : on prend les terrains 2 & 3, je booke",
    avatar: "🏸",
    activity: 92,
  },
  {
    id: "squash-after-work",
    name: "Squash After-Work",
    sport: "Squash",
    members: 23,
    next: "Mar. 27 mai · 18h30",
    last: "Marc : qui prend le créneau de 19h ?",
    avatar: "🎾",
    activity: 67,
  },
  {
    id: "petanque-club-lounge",
    name: "Pétanque Lounge",
    sport: "Pétanque",
    members: 31,
    next: "Ven. 23 mai · 20h00",
    last: "Sophie : on enchaîne sur le bar après ?",
    avatar: "🥖",
    activity: 88,
  },
  {
    id: "compet-interclubs",
    name: "Compét' Inter-Clubs",
    sport: "Badminton",
    members: 8,
    next: "Dim. 25 mai · 14h00",
    last: "Coach Antoine : briefing à 13h30",
    avatar: "🏆",
    activity: 100,
  },
  {
    id: "decouverte-debutants",
    name: "Découverte débutants",
    sport: "Mixte",
    members: 19,
    next: "Sam. 24 mai · 10h00",
    last: "Julie : super accueil la dernière fois !",
    avatar: "✨",
    activity: 54,
  },
];

export const MESSAGES = [
  { from: "Léa M.", time: "18:42", text: "Salut la team ! On reconduit demain soir ?", you: false, avatar: "LM" },
  { from: "Antoine R.", time: "18:44", text: "Présent. Je prends le terrain 2.", you: false, avatar: "AR" },
  { from: "Toi", time: "18:47", text: "Compte sur moi 💪 je booke le 3 en parallèle.", you: true, avatar: "TM" },
  { from: "Sophie B.", time: "18:51", text: "On est combien au total ? Je peux ramener une copine qui débute.", you: false, avatar: "SB" },
  { from: "Léa M.", time: "18:53", text: "8 confirmés. Bienvenue à elle ! On enchaîne sur un verre au lounge après ?", you: false, avatar: "LM" },
  { from: "Marc D.", time: "19:02", text: "Oui pour le verre. Je réserve une table de 10 à 21h.", you: false, avatar: "MD" },
];

export const ARTICLES = [
  {
    id: "tournoi-printemps-2026",
    title: "Tournoi de Printemps 2026 — les inscriptions sont ouvertes",
    excerpt: "Le rendez-vous incontournable du club revient pour sa 14ème édition. Trois tableaux ouverts (simple homme, simple dame, double mixte), plus de 80 joueurs attendus sur le week-end des 14 et 15 juin.",
    date: "20 mai 2026",
    status: "Publié",
    channels: ["Instagram", "Facebook", "LinkedIn"],
    cover: "from-[#d6ff3e] to-[#a8d423]",
  },
  {
    id: "nouveau-coach-squash",
    title: "Bienvenue à Théo, nouveau coach squash",
    excerpt: "Ex-joueur du circuit professionnel, Théo rejoint l'équipe pour les cours collectifs et le perfectionnement. Premières séances dès le 1er juin.",
    date: "18 mai 2026",
    status: "Programmé",
    channels: ["Instagram", "Facebook"],
    cover: "from-[#ff8a3c] to-[#c14d2a]",
  },
  {
    id: "menu-printemps-lounge",
    title: "Le menu du Lounge passe au printemps",
    excerpt: "Carte renouvelée par le chef : produits locaux des Halles Paul Bocuse, options veggies, planches à partager et nouveaux cocktails signature.",
    date: "15 mai 2026",
    status: "Brouillon",
    channels: ["Instagram"],
    cover: "from-[#f4ede0] to-[#e6ddc8]",
  },
  {
    id: "interclubs-victoire",
    title: "Victoire des Bad's en championnat interclubs",
    excerpt: "L'équipe première décroche le maintien en N2 après une saison à rebondissements. Bravo à toute l'équipe et au capitaine Antoine.",
    date: "12 mai 2026",
    status: "Publié",
    channels: ["Instagram", "Facebook"],
    cover: "from-[#3498db] to-[#2c3e50]",
  },
  {
    id: "ecole-badminton-enfants",
    title: "L'école de badminton ouvre aux 6-12 ans",
    excerpt: "Tous les mercredis après-midi à partir de septembre, cours encadrés par Pauline (DEJEPS). Inscriptions en ligne dès le 1er juin.",
    date: "10 mai 2026",
    status: "Programmé",
    channels: ["Instagram", "Facebook", "LinkedIn"],
    cover: "from-[#d6ff3e] to-[#27ae60]",
  },
  {
    id: "afterwork-entreprise-mai",
    title: "After-work entreprises : 3 dates ce mois-ci",
    excerpt: "Pack sport + apéro pour vos équipes : 90 min de badminton ou squash + planche apéro au Lounge. À partir de 12 personnes.",
    date: "5 mai 2026",
    status: "Publié",
    channels: ["LinkedIn"],
    cover: "from-[#c14d2a] to-[#8b3010]",
  },
];

export const ADMIN_STATS = {
  bookingsToday: 47,
  bookingsThisWeek: 312,
  newMembersThisMonth: 18,
  occupancyRate: 73,
  revenueThisMonth: 8420,
  pendingArticles: 2,
};

export const TODAY_BOOKINGS = [
  { id: "b1", time: "10:00", court: "BAD-01", member: "Pierre Dubois",   sport: "Badminton", duration: 60, status: "confirmé" },
  { id: "b2", time: "11:00", court: "BAD-02", member: "Camille Faure",   sport: "Badminton", duration: 60, status: "confirmé" },
  { id: "b3", time: "12:15", court: "SQS-03", member: "Marc Lefèvre",    sport: "Squash",    duration: 60, status: "confirmé" },
  { id: "b4", time: "13:30", court: "PET-02", member: "Sophie Bernard",  sport: "Pétanque",  duration: 60, status: "confirmé" },
  { id: "b5", time: "14:00", court: "BAD-04", member: "Antoine Roche",   sport: "Badminton", duration: 60, status: "en cours" },
  { id: "b6", time: "17:30", court: "SQS-01", member: "Léa Martin",      sport: "Squash",    duration: 60, status: "confirmé" },
  { id: "b7", time: "18:15", court: "BAD-03", member: "Thomas Garnier",  sport: "Badminton", duration: 60, status: "confirmé" },
  { id: "b8", time: "19:00", court: "BAD-01", member: "Groupe Double mixte (8)", sport: "Badminton", duration: 60, status: "confirmé" },
  { id: "b9", time: "19:30", court: "PET-01", member: "Julien Moreau",   sport: "Pétanque",  duration: 60, status: "en attente" },
  { id: "b10", time: "20:30", court: "SQS-04", member: "Coach Théo (cours collectif)", sport: "Squash", duration: 60, status: "confirmé" },
];

export const EVENTS = [
  {
    id: "olympiade-mai-2026",
    title: "Olympiade pour tous",
    subtitle: "Soirée en binômes · 5 sports en 2 heures",
    date: "Jeu. 29 mai 2026 · 18h00",
    place: "Bad's Club · 1er étage",
    price: 22,
    capacity: 60,
    enrolled: 47,
    cover: "from-[#d6ff3e] to-[#a8d423]",
    description: "Le club organise sa 4ème Olympiade : badminton, squash, pétanque, tennis de table, baseball — 5 ateliers, 5 binômes, 1 grand gagnant. Soirée festive avec verre de bienvenue inclus, planche apéro à la fin pour tout le monde au Lounge.",
    tags: ["Loisir", "Mixte", "Tous niveaux", "Tournoi interne"],
  },
  {
    id: "fléchettes-printemps",
    title: "Les fléchettes du Lounge",
    subtitle: "Tournoi amical bar-style · prix lots Bad's",
    date: "Ven. 6 juin 2026 · 20h30",
    place: "Bad's Lounge",
    price: 8,
    capacity: 32,
    enrolled: 11,
    cover: "from-[#3498db] to-[#2c3e50]",
    description: "Première édition du tournoi fléchettes au Lounge. Format double élimination, conso comprise, lots Bad's pour les 3 premiers (raquettes, abonnement, tee-shirts).",
    tags: ["Lounge", "Conviviale", "Inédit"],
  },
  {
    id: "tournoi-printemps-14-15-juin",
    title: "Tournoi de Printemps 2026",
    subtitle: "14ème édition · 3 tableaux · 80 joueurs",
    date: "Sam-Dim. 14–15 juin 2026",
    place: "Bad's Club · 4 terrains badminton",
    price: 18,
    capacity: 80,
    enrolled: 62,
    cover: "from-[#ff8a3c] to-[#c14d2a]",
    description: "Le rendez-vous incontournable du club revient pour sa 14ème édition. Trois tableaux ouverts : simple homme, simple dame, double mixte. Tarif adhérent 18€, non-adhérents 28€. Buvette et restauration assurées par le Lounge tout le week-end.",
    tags: ["Compétition", "FFBaD homologué", "Adhérents & non-adhérents"],
  },
];

// ─── Planning ────────────────────────────────────────────────────────────────

export const PLANNING_HOURS = [
  "10:00","11:00","12:00","13:00","14:00","15:00",
  "16:00","17:00","18:00","19:00","20:00","21:00",
];

export const PLANNING_COURTS = [
  { id: "BAD-01", sport: "Badminton", label: "BAD 01", color: "#d6ff3e" },
  { id: "BAD-02", sport: "Badminton", label: "BAD 02", color: "#d6ff3e" },
  { id: "BAD-03", sport: "Badminton", label: "BAD 03", color: "#d6ff3e" },
  { id: "BAD-04", sport: "Badminton", label: "BAD 04", color: "#d6ff3e" },
  { id: "SQS-01", sport: "Squash",    label: "SQS 01", color: "#ff8a3c" },
  { id: "SQS-02", sport: "Squash",    label: "SQS 02", color: "#ff8a3c" },
  { id: "SQS-03", sport: "Squash",    label: "SQS 03", color: "#ff8a3c" },
  { id: "SQS-04", sport: "Squash",    label: "SQS 04", color: "#ff8a3c" },
  { id: "SQS-05", sport: "Squash",    label: "SQS 05", color: "#ff8a3c" },
  { id: "PET-01", sport: "Pétanque",  label: "PET 01", color: "#f4ede0" },
  { id: "PET-02", sport: "Pétanque",  label: "PET 02", color: "#f4ede0" },
  { id: "PET-03", sport: "Pétanque",  label: "PET 03", color: "#f4ede0" },
  { id: "PET-04", sport: "Pétanque",  label: "PET 04", color: "#f4ede0" },
] as const;

export type PlanningStatus = "confirmed" | "in_progress" | "blocked" | "pending";
export type PlanningBooking = {
  id: string; courtId: string; hour: string;
  member: string; status: PlanningStatus; price?: number;
};

export const PLANNING_BOOKINGS: PlanningBooking[] = [
  // Badminton
  { id: "p1",  courtId: "BAD-01", hour: "10:00", member: "Pierre Dubois",       status: "confirmed",   price: 18 },
  { id: "p2",  courtId: "BAD-02", hour: "10:00", member: "Camille Faure",       status: "confirmed",   price: 18 },
  { id: "p3",  courtId: "BAD-01", hour: "11:00", member: "Léa Martin",          status: "confirmed",   price: 18 },
  { id: "p4",  courtId: "BAD-03", hour: "11:00", member: "Thomas Garnier",      status: "confirmed",   price: 18 },
  { id: "p5",  courtId: "BAD-02", hour: "13:00", member: "Pierre Dubois",       status: "confirmed",   price: 18 },
  { id: "p6",  courtId: "BAD-04", hour: "14:00", member: "Groupe Double mixte", status: "confirmed",   price: 18 },
  { id: "p7",  courtId: "BAD-01", hour: "14:00", member: "Julien Moreau",       status: "pending",     price: 18 },
  { id: "p8",  courtId: "BAD-03", hour: "17:00", member: "Antoine Roche",       status: "confirmed",   price: 22 },
  { id: "p9",  courtId: "BAD-04", hour: "17:00", member: "Sarah Petit",         status: "confirmed",   price: 22 },
  { id: "p10", courtId: "BAD-01", hour: "18:00", member: "Camille Faure",       status: "confirmed",   price: 22 },
  { id: "p11", courtId: "BAD-02", hour: "18:00", member: "Marc Lefèvre",        status: "in_progress", price: 22 },
  { id: "p12", courtId: "BAD-03", hour: "19:00", member: "Groupe Compét",       status: "confirmed",   price: 22 },
  { id: "p13", courtId: "BAD-04", hour: "19:00", member: "Thomas Garnier",      status: "confirmed",   price: 22 },
  { id: "p14", courtId: "BAD-01", hour: "20:00", member: "Léa Martin",          status: "confirmed",   price: 16 },
  { id: "p15", courtId: "BAD-02", hour: "21:00", member: "Pierre Dubois",       status: "confirmed",   price: 16 },
  // Squash
  { id: "p16", courtId: "SQS-01", hour: "10:00", member: "Marc Lefèvre",        status: "confirmed",   price: 16 },
  { id: "p17", courtId: "SQS-02", hour: "11:00", member: "Antoine Roche",       status: "confirmed",   price: 16 },
  { id: "p18", courtId: "SQS-01", hour: "13:00", member: "Sophie Bernard",      status: "confirmed",   price: 16 },
  { id: "p19", courtId: "SQS-04", hour: "14:00", member: "Coach Théo (cours)",  status: "confirmed",   price: 16 },
  { id: "p20", courtId: "SQS-03", hour: "14:00", member: "Maintenance",         status: "blocked"              },
  { id: "p21", courtId: "SQS-03", hour: "15:00", member: "Maintenance",         status: "blocked"              },
  { id: "p22", courtId: "SQS-03", hour: "16:00", member: "Maintenance",         status: "blocked"              },
  { id: "p23", courtId: "SQS-01", hour: "18:00", member: "Marc Lefèvre",        status: "confirmed",   price: 20 },
  { id: "p24", courtId: "SQS-02", hour: "19:00", member: "Thomas Garnier",      status: "confirmed",   price: 20 },
  { id: "p25", courtId: "SQS-05", hour: "20:00", member: "Sarah Petit",         status: "confirmed",   price: 20 },
  { id: "p26", courtId: "SQS-04", hour: "20:00", member: "Antoine Roche",       status: "confirmed",   price: 20 },
  // Pétanque
  { id: "p27", courtId: "PET-01", hour: "14:00", member: "Bernard Nguyen",      status: "pending",     price: 12 },
  { id: "p28", courtId: "PET-02", hour: "15:00", member: "Léa Martin",          status: "confirmed",   price: 12 },
  { id: "p29", courtId: "PET-03", hour: "20:00", member: "Sophie Bernard",      status: "confirmed",   price: 12 },
  { id: "p30", courtId: "PET-01", hour: "20:00", member: "Groupe Pétanque",     status: "confirmed",   price: 12 },
];

// ─── Analytics ───────────────────────────────────────────────────────────────

export const REVENUE_7D = [
  { day: "Lun", label: "02/06", revenue: 980,  bookings: 32 },
  { day: "Mar", label: "03/06", revenue: 1240, bookings: 41 },
  { day: "Mer", label: "04/06", revenue: 870,  bookings: 29 },
  { day: "Jeu", label: "05/06", revenue: 1560, bookings: 52 },
  { day: "Ven", label: "06/06", revenue: 1890, bookings: 63 },
  { day: "Sam", label: "07/06", revenue: 2100, bookings: 70 },
  { day: "Dim", label: "08/06", revenue: 1420, bookings: 47 },
];

export const SPORT_ANALYTICS = [
  { sport: "Badminton", courts: 4, bookings: 156, revenue: 2808, occupancy: 81, color: "#d6ff3e" },
  { sport: "Squash",    courts: 5, bookings: 134, revenue: 2144, occupancy: 67, color: "#ff8a3c" },
  { sport: "Pétanque",  courts: 4, bookings:  82, revenue:  984, occupancy: 51, color: "#f4ede0" },
];

// Heatmap taux d'occupation : 7 jours x 12 heures (10h → 21h)
// Lignes = jours (Lun→Dim), colonnes = heures (10h→21h)
export const OCCUPANCY_HEATMAP = [
  // 10h  11h  12h  13h  14h  15h  16h  17h  18h  19h  20h  21h
  [  28,  42,  18,  22,  55,  62,  70,  76,  88,  92,  78,  38 ], // Lun
  [  33,  48,  24,  28,  60,  68,  74,  82,  91,  96,  84,  48 ], // Mar
  [  22,  34,  14,  18,  44,  52,  64,  72,  80,  86,  74,  32 ], // Mer
  [  38,  54,  30,  34,  64,  72,  80,  88,  96, 100,  90,  54 ], // Jeu
  [  48,  64,  38,  44,  70,  76,  86,  92,  96, 100,  96,  68 ], // Ven
  [  72,  84,  68,  64,  80,  86,  90,  96, 100,  96,  92,  78 ], // Sam
  [  62,  74,  58,  52,  68,  74,  84,  90,  94,  90,  84,  58 ], // Dim
];

export const TOP_MEMBERS = [
  { name: "Pierre Dubois",   bookings: 234, revenue: 3744, badge: "VIP" },
  { name: "Sarah Petit",     bookings: 198, revenue: 3168, badge: "VIP" },
  { name: "Antoine Roche",   bookings: 156, revenue: 2496, badge: "" },
  { name: "Marc Lefèvre",    bookings: 112, revenue: 1792, badge: "" },
  { name: "Thomas Garnier",  bookings:  67, revenue: 1072, badge: "" },
];

export const ADMIN_MEMBERS = [
  { id: "m1", name: "Léa Martin",       email: "lea.martin@gmail.com",        joined: "2024-09-12", bookings: 87,  status: "actif",  type: "annuel" },
  { id: "m2", name: "Antoine Roche",    email: "antoine.r@orange.fr",         joined: "2023-01-03", bookings: 156, status: "actif",  type: "annuel" },
  { id: "m3", name: "Camille Faure",    email: "camille.faure@outlook.com",   joined: "2024-11-20", bookings: 42,  status: "actif",  type: "annuel" },
  { id: "m4", name: "Pierre Dubois",    email: "pierre.dubois@free.fr",       joined: "2022-05-18", bookings: 234, status: "actif",  type: "annuel" },
  { id: "m5", name: "Sophie Bernard",   email: "sophie.b@laposte.net",        joined: "2025-02-08", bookings: 23,  status: "actif",  type: "trimestriel" },
  { id: "m6", name: "Marc Lefèvre",     email: "m.lefevre@gmail.com",         joined: "2023-09-15", bookings: 112, status: "actif",  type: "annuel" },
  { id: "m7", name: "Thomas Garnier",   email: "t.garnier@gmail.com",         joined: "2024-03-22", bookings: 67,  status: "actif",  type: "annuel" },
  { id: "m8", name: "Julien Moreau",    email: "julien.m@hotmail.fr",         joined: "2025-01-14", bookings: 18,  status: "actif",  type: "découverte" },
  { id: "m9", name: "Sarah Petit",      email: "sarah.petit@gmail.com",       joined: "2022-11-30", bookings: 198, status: "actif",  type: "annuel" },
  { id: "m10",name: "Bernard Nguyen",   email: "bernard@projectview.fr",      joined: "2026-05-20", bookings: 0,   status: "nouveau", type: "découverte" },
];

// ─── Commande au bar (QR code table) ────────────────────────────────────────

export type BarCategory = "Bières" | "Softs & Cocktails" | "Planches & Snacks" | "Pinsas";

export type BarMenuItem = {
  id: string;
  name: string;
  detail?: string;
  category: BarCategory;
  price: number; // en euros
  badge?: string;
};

export const BAR_ORDER_MENU: BarMenuItem[] = [
  { id: "b1",  name: "Blonde 25cl",        detail: "Reitter hell 5°",          category: "Bières",            price: 3.50, badge: "Pression" },
  { id: "b2",  name: "IPA 25cl",           detail: "Hubster Hop Side 6°",      category: "Bières",            price: 4.00, badge: "Pression" },
  { id: "b3",  name: "NEIPA 25cl",         detail: "BRP Juice Junkie 5.4°",    category: "Bières",            price: 4.50, badge: "Pression" },
  { id: "b4",  name: "La Chouffe 33cl",    detail: "8°",                       category: "Bières",            price: 6.50 },
  { id: "b5",  name: "Cidre Appie Bio",    detail: "4,7°",                     category: "Bières",            price: 6.00 },
  { id: "s1",  name: "Limonade artisanale",                                    category: "Softs & Cocktails", price: 4.00 },
  { id: "s2",  name: "Spritz maison",      detail: "Aperol · prosecco · soda", category: "Softs & Cocktails", price: 7.50, badge: "Best-seller" },
  { id: "s3",  name: "Mojito",             detail: "Rhum · menthe · citron vert", category: "Softs & Cocktails", price: 8.00 },
  { id: "s4",  name: "Café / thé",                                             category: "Softs & Cocktails", price: 2.00 },
  { id: "p1",  name: "Planche charcuterie", detail: "Sélection locale",        category: "Planches & Snacks", price: 12.00 },
  { id: "p2",  name: "Planche fromages",    detail: "Sélection régionale",     category: "Planches & Snacks", price: 12.00 },
  { id: "p3",  name: "Frites maison",                                          category: "Planches & Snacks", price: 5.00 },
  { id: "p4",  name: "Nachos",              detail: "Cheddar · guacamole",     category: "Planches & Snacks", price: 8.50 },
  { id: "z1",  name: "Pinsa Margherita",                                       category: "Pinsas",            price: 11.00 },
  { id: "z2",  name: "Pinsa Bad's",         detail: "Burrata · jambon cru · roquette", category: "Pinsas",    price: 14.00, badge: "Signature" },
  { id: "z3",  name: "Pinsa Veggie",        detail: "Légumes grillés · pesto", category: "Pinsas",            price: 12.50 },
];

export const BAR_TABLES = [
  { id: "T01", label: "Table 1",  zone: "Terrasse" },
  { id: "T02", label: "Table 2",  zone: "Terrasse" },
  { id: "T03", label: "Table 3",  zone: "Lounge" },
  { id: "T04", label: "Table 4",  zone: "Lounge" },
  { id: "T05", label: "Table 5",  zone: "Lounge" },
  { id: "T06", label: "Table 6",  zone: "Bar" },
  { id: "T07", label: "Table 7",  zone: "Bar" },
  { id: "T08", label: "Table 8",  zone: "Mezzanine" },
] as const;

export type BarOrderStatus = "reçue" | "en préparation" | "prête" | "récupérée";

export type BarOrderLine = { itemId: string; name: string; qty: number; price: number };

export type BarOrder = {
  id: string;
  tableId: string;
  tableLabel: string;
  lines: BarOrderLine[];
  total: number;
  status: BarOrderStatus;
  placedAt: string; // heure HH:MM
  paymentMethod: "CB" | "Apple Pay" | "Google Pay";
};

export const BAR_ORDERS: BarOrder[] = [
  {
    id: "ord_2461", tableId: "T03", tableLabel: "Table 3",
    lines: [
      { itemId: "s2", name: "Spritz maison", qty: 2, price: 7.5 },
      { itemId: "p1", name: "Planche charcuterie", qty: 1, price: 12 },
    ],
    total: 27.0, status: "en préparation", placedAt: "18:42", paymentMethod: "Apple Pay",
  },
  {
    id: "ord_2460", tableId: "T07", tableLabel: "Table 7",
    lines: [
      { itemId: "b2", name: "IPA 25cl", qty: 3, price: 4 },
      { itemId: "p3", name: "Frites maison", qty: 2, price: 5 },
    ],
    total: 22.0, status: "reçue", placedAt: "18:39", paymentMethod: "CB",
  },
  {
    id: "ord_2459", tableId: "T01", tableLabel: "Table 1",
    lines: [
      { itemId: "z2", name: "Pinsa Bad's", qty: 2, price: 14 },
      { itemId: "s1", name: "Limonade artisanale", qty: 2, price: 4 },
    ],
    total: 36.0, status: "prête", placedAt: "18:31", paymentMethod: "Google Pay",
  },
  {
    id: "ord_2458", tableId: "T05", tableLabel: "Table 5",
    lines: [
      { itemId: "b1", name: "Blonde 25cl", qty: 4, price: 3.5 },
    ],
    total: 14.0, status: "récupérée", placedAt: "18:12", paymentMethod: "CB",
  },
];
