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
