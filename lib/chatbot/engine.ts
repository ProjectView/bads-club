/**
 * Moteur du chatbot du site — 100% mock / règles, pas d'appel LLM.
 *
 * Le bot fait deux choses :
 *  1. Répond aux questions fréquentes (horaires, tarifs, sports, bar, etc.)
 *     à partir d'une base de connaissances par mots-clés.
 *  2. Cherche dans les données de réservation/membres si le nom de la
 *     personne avec qui il discute correspond à quelqu'un de connu, et
 *     restitue ses informations (prochaine réservation, statut membre…).
 *
 * NB : tout est branché sur `lib/mock.ts` pour la démo. En prod, l'étape 2
 * interrogerait Firestore (collection `bookings` filtrée par `ownerId`/nom)
 * et l'étape 1 pourrait être augmentée par un vrai LLM avec ces mêmes
 * données injectées en contexte (RAG léger sur le catalogue + les FAQ).
 */

import { ADMIN_MEMBERS, TODAY_BOOKINGS, SPORTS, EVENTS, BAR_ORDER_MENU } from "@/lib/mock";
import { OPEN_HOURS, ZONE_PRICE_EUR, ADVANCE_WINDOW_DAYS } from "@/lib/booking/config";

// -----------------------------------------------------------------------------
// 1. Recherche d'une personne dans les données du club
// -----------------------------------------------------------------------------

export type PersonMatch = {
  name: string;
  email?: string;
  memberType?: string;
  bookingsCount?: number;
  todaysBookings: { time: string; court: string; sport: string; status: string }[];
};

function normalize(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

/** Cherche une personne par nom/prénom (correspondance partielle) dans les membres + résas du jour. */
export function findPerson(query: string): PersonMatch | null {
  const q = normalize(query);
  if (q.length < 2) return null;

  const member = ADMIN_MEMBERS.find(m => {
    const n = normalize(m.name);
    return n.includes(q) || q.split(/\s+/).some(part => part.length > 1 && n.includes(part));
  });

  const todaysBookings = TODAY_BOOKINGS.filter(b => {
    const n = normalize(b.member);
    return n.includes(q) || q.split(/\s+/).some(part => part.length > 1 && n.includes(part));
  }).map(b => ({ time: b.time, court: b.court, sport: b.sport, status: b.status }));

  const matchedBooking = TODAY_BOOKINGS.find(b => {
    const n = normalize(b.member);
    return n.includes(q) || q.split(/\s+/).some(part => part.length > 1 && n.includes(part));
  });

  if (!member && !matchedBooking) return null;

  return {
    name: member?.name ?? matchedBooking?.member ?? query,
    email: member?.email,
    memberType: member?.type,
    bookingsCount: member?.bookings,
    todaysBookings,
  };
}

export function describePerson(p: PersonMatch): string {
  const lines: string[] = [];
  if (p.memberType) {
    lines.push(`Je retrouve ${p.name} dans nos membres (formule ${p.memberType}${typeof p.bookingsCount === "number" ? `, ${p.bookingsCount} réservations au compteur` : ""}).`);
  } else {
    lines.push(`Je retrouve ${p.name} dans le planning du jour.`);
  }
  if (p.todaysBookings.length > 0) {
    const list = p.todaysBookings
      .map(b => `${b.time} · ${b.sport} (${b.court}) — ${b.status}`)
      .join("\n");
    lines.push(`Voici ce que je vois pour aujourd'hui :\n${list}`);
  } else {
    lines.push("Je ne vois pas de réservation à votre nom pour aujourd'hui — vous pouvez en créer une depuis la page Réservation.");
  }
  return lines.join("\n\n");
}

// -----------------------------------------------------------------------------
// 2. Base de connaissances (FAQ par mots-clés)
// -----------------------------------------------------------------------------

type Topic = {
  id: string;
  keywords: string[];
  reply: (message: string) => string;
};

// -----------------------------------------------------------------------------
// Recherche fine dans la carte du bar — pour répondre avec un peu de répondant
// plutôt qu'avec une liste générique quand quelqu'un demande un plat précis.
// -----------------------------------------------------------------------------

const FOOD_TOPICS: { keywords: string[]; match: (item: typeof BAR_ORDER_MENU[number]) => boolean; quip: string }[] = [
  {
    keywords: ["planche", "charcuterie", "saucisson", "jambon"],
    match: i => /charcuterie/i.test(i.name),
    quip: "Idéal à partager après un match — ou juste avant, on ne juge pas 😄",
  },
  {
    keywords: ["fromage", "plateau de fromage"],
    match: i => /fromage/i.test(i.name),
    quip: "De quoi reprendre des forces avant le prochain set (ou juste profiter du Lounge sans bouger).",
  },
  {
    keywords: ["frite", "frites"],
    match: i => /frites/i.test(i.name),
    quip: "Croustillantes et maison — la récompense classique post-effort.",
  },
  {
    keywords: ["nachos"],
    match: i => /nachos/i.test(i.name),
    quip: "Cheddar fondu et guacamole — parfait à partager devant un match sur le terrain d'à côté.",
  },
  {
    keywords: ["pinsa", "pizza"],
    match: i => /pinsa/i.test(i.category) || /pinsa/i.test(i.name),
    quip: "Pâte légère et garnitures généreuses — la Bad's en signature, burrata et jambon cru.",
  },
  {
    keywords: ["biere", "bière", "blonde", "ipa", "pression", "houblon"],
    match: i => i.category === "Bières",
    quip: "Plusieurs bières en pression et en bouteille, de la blonde légère à l'IPA bien houblonnée.",
  },
  {
    keywords: ["cocktail", "soft", "limonade", "jus", "sans alcool"],
    match: i => i.category === "Softs & Cocktails",
    quip: "De quoi se rafraîchir sans forcément lever le coude.",
  },
];

function findMenuReply(norm: string): string | null {
  for (const food of FOOD_TOPICS) {
    if (!food.keywords.some(kw => norm.includes(normalize(kw)))) continue;
    const items = BAR_ORDER_MENU.filter(food.match).slice(0, 4);
    if (items.length === 0) continue;
    const list = items.map(i => `• ${i.name}${i.detail ? ` (${i.detail})` : ""} — ${i.price.toFixed(2).replace(".", ",")} €`).join("\n");
    return `Oui, tout à fait, on en sert ! 🙂\n${list}\n\n${food.quip}\n\n` +
      `Vous pouvez les commander au comptoir, ou directement depuis votre table en scannant le QR code dessus.`;
  }
  return null;
}

function dayLabel(d: number) {
  return ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"][d];
}

function hoursSummary(): string {
  const groups = new Map<string, number[]>();
  for (let d = 0; d < 7; d++) {
    const h = OPEN_HOURS[d];
    const key = h ? `${h.open} – ${h.close}` : "fermé";
    groups.set(key, [...(groups.get(key) ?? []), d]);
  }
  const lines: string[] = [];
  for (const [hours, days] of groups) {
    const labels = days.map(dayLabel);
    const range = labels.length > 1
      ? `${labels[0].charAt(0).toUpperCase()}${labels[0].slice(1)} → ${labels[labels.length - 1]}`
      : `${labels[0].charAt(0).toUpperCase()}${labels[0].slice(1)}`;
    lines.push(`• ${range} : ${hours}`);
  }
  return lines.join("\n");
}

const TOPICS: Topic[] = [
  {
    id: "horaires",
    keywords: ["horaire", "heure", "ouvert", "ouverture", "ferme", "fermeture", "ouvre"],
    reply: () => `Voici nos horaires d'ouverture :\n${hoursSummary()}\n\nLes terrains sont réservables par créneaux d'une heure.`,
  },
  {
    id: "tarifs",
    keywords: ["tarif", "prix", "combien", "coute", "coûte", "€", "euro", "abonnement"],
    reply: () => `Le tarif dépend de la tranche horaire (badminton & squash partagent la même grille) :\n` +
      `• Heure de pointe (zone rouge) : ${ZONE_PRICE_EUR.red} €\n` +
      `• Heure standard (zone bleue) : ${ZONE_PRICE_EUR.blue} €\n` +
      `• Heure creuse (zone verte) : ${ZONE_PRICE_EUR.green} €\n\n` +
      `Les membres bénéficient d'un tarif préférentiel et peuvent réserver jusqu'à ${ADVANCE_WINDOW_DAYS.member} jours à l'avance ` +
      `(contre ${ADVANCE_WINDOW_DAYS.guest} jours pour les non-membres). Le détail complet est sur la page Tarifs.`,
  },
  {
    id: "reservation",
    keywords: ["reserv", "réserv", "creneau", "créneau", "booker", "annuler", "annulation"],
    reply: () => `Pour réserver, direction la page Réservation : choisissez votre sport, une date, puis simplement un horaire — ` +
      `le terrain est attribué automatiquement à votre arrivée, pas besoin de le choisir vous-même. ` +
      `Vous pouvez annuler depuis votre espace « Mon compte » (les conditions de remboursement dépendent du délai avant le créneau).`,
  },
  {
    id: "sports",
    keywords: ["sport", "badminton", "squash", "petanque", "pétanque", "activit", "terrain"],
    reply: () => {
      const list = SPORTS.map(s => `• ${s.label} — ${s.courts} terrains, à partir de ${s.price} €/h`).join("\n");
      return `Voici les activités disponibles au club :\n${list}\n\nChaque sport a sa propre page avec photos et infos pratiques.`;
    },
  },
  {
    id: "bar",
    keywords: ["bar", "boisson", "manger", "restaurant", "carte", "menu", "snack", "biere", "bière", "cocktail", "qr",
      "planche", "charcuterie", "fromage", "frite", "nachos", "pinsa", "pizza", "soft", "limonade"],
    reply: (message) => {
      const norm = normalize(message);
      const specific = findMenuReply(norm);
      if (specific) return specific;
      const sample = BAR_ORDER_MENU.slice(0, 4).map(i => `• ${i.name} — ${(i.price).toFixed(2).replace(".", ",")} €`).join("\n");
      return `Notre bar-restaurant est ouvert aux mêmes horaires que le club. Un aperçu de la carte :\n${sample}\n…\n\n` +
        `Vous pouvez aussi commander directement depuis votre table en scannant le QR code posé dessus : ` +
        `vous composez votre commande, vous payez en ligne, et vous n'avez plus qu'à venir la récupérer au comptoir quand elle est prête.`;
    },
  },
  {
    id: "evenements",
    keywords: ["evenement", "événement", "event", "tournoi", "soiree", "soirée", "agenda"],
    reply: () => {
      if (!EVENTS.length) return "Aucun événement programmé pour le moment — revenez bientôt, l'agenda se remplit régulièrement !";
      const list = EVENTS.slice(0, 3).map(e => `• ${e.title} — ${e.date}`).join("\n");
      return `Voici les prochains événements au club :\n${list}\n\nRetrouvez le programme complet sur la page Événements.`;
    },
  },
  {
    id: "contact",
    keywords: ["contact", "adresse", "telephone", "téléphone", "mail", "email", "ou etes", "où êtes", "localis"],
    reply: () => `Vous pouvez nous écrire à john.olivier@badsclub.com — le club est basé à Lyon (7ème). ` +
      `Pour toute question urgente liée à une réservation en cours, le plus rapide reste de passer par votre espace « Mon compte ».`,
  },
  {
    id: "membre",
    keywords: ["membre", "adhesion", "adhésion", "abonn", "carte de membre", "inscription", "inscrire"],
    reply: () => `Devenir membre permet de profiter de tarifs préférentiels, d'une fenêtre de réservation élargie ` +
      `(${ADVANCE_WINDOW_DAYS.member} jours à l'avance contre ${ADVANCE_WINDOW_DAYS.guest} pour les non-membres) et d'un accès prioritaire aux événements. ` +
      `L'inscription se fait directement en ligne, depuis la page de connexion / création de compte.`,
  },
];

const GREETINGS = ["bonjour", "salut", "hello", "coucou", "bonsoir", "hey"];
const THANKS = ["merci", "top", "parfait", "super", "cool", "nickel"];

function pickIntent(message: string): Topic | null {
  const m = normalize(message);
  let best: { topic: Topic; score: number } | null = null;
  for (const topic of TOPICS) {
    const score = topic.keywords.reduce((acc, kw) => acc + (m.includes(normalize(kw)) ? 1 : 0), 0);
    if (score > 0 && (!best || score > best.score)) best = { topic, score };
  }
  return best?.topic ?? null;
}

// -----------------------------------------------------------------------------
// 3. Point d'entrée : génère une réponse à partir du message + du contexte
// -----------------------------------------------------------------------------

export type ChatContext = {
  /** Nom de la personne avec qui le bot discute, si on l'a identifié (auth ou auto-présentation). */
  knownName?: string | null;
  /** Vrai si le tour précédent du bot demandait explicitement le nom de l'utilisateur. */
  awaitingName?: boolean;
};

export type BotReply = {
  text: string;
  /** Si renseigné, le widget mémorise ce nom pour personnaliser la suite de la conversation. */
  learnedName?: string;
  /** Vrai si cette réponse demande le nom — le widget doit alors traiter le message suivant comme une réponse. */
  asksForName?: boolean;
};

// Phrases d'introduction explicites uniquement — on évite "je suis" tout seul,
// trop ambigu ("je suis pas sûr", "je suis content"…) et source de faux positifs.
const NAME_INTRO_RE = /\b(?:je m['’]appelle|moi c['’]est|mon nom est|mon nom c['’]est|on m['’]appelle|ici c['’]est)\s+([a-zà-öø-ÿ][a-zà-öø-ÿ\-' ]{1,40})/i;

// Mots fréquents qui ne sont jamais des prénoms/noms — sert à filtrer les
// faux positifs si jamais une phrase ressemble à une présentation.
const NAME_STOPWORDS = new Set([
  "pas", "sur", "sûr", "sure", "la", "le", "les", "un", "une", "des", "du", "de",
  "content", "contente", "fatigue", "fatigué", "fatiguée", "ici", "la-bas", "ok",
  "daccord", "d'accord", "bien", "mal", "nul", "top", "cool", "chaud", "froid",
  "perdu", "perdue", "en", "train", "venu", "venue", "arrive", "arrivee",
]);

function looksLikeAName(candidate: string): boolean {
  const words = candidate.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0 || words.length > 3) return false;
  return words.every(w => w.length >= 2 && !NAME_STOPWORDS.has(normalize(w)));
}

const WANTS_PERSONAL_INFO = /\b(reservation|réservation|planning|creneau|créneau|prevu|prévu|mes infos|mon profil|mon compte|mes resas|mes réservations)\b/;

export function getBotReply(message: string, context: ChatContext = {}): BotReply {
  const trimmed = message.trim();
  const norm = normalize(trimmed);

  // Si le tour précédent demandait son nom, on traite directement la réponse comme un nom
  // (ex : le bot demande "quel est votre nom ?" et l'utilisateur répond juste "Camille Faure").
  if (context.awaitingName) {
    const candidate = trimmed.replace(/^(c'est|je m['’]appelle|moi c['’]est)\s+/i, "").trim();
    if (looksLikeAName(candidate)) {
      const person = findPerson(candidate);
      if (person) {
        return { text: `Merci ${candidate.split(" ")[0]} ! ${describePerson(person)}`, learnedName: candidate };
      }
      return {
        text: `Merci ! Je ne retrouve pas de réservation ou de profil au nom de « ${candidate} » — ` +
          `vérifiez l'orthographe, ou je peux vous aider à réserver un nouveau créneau si besoin.`,
        learnedName: candidate,
      };
    }
    // Ne ressemble pas à un nom → on ne bloque pas la conversation, on traite le message normalement.
  }

  // L'utilisateur se présente explicitement → on tente de le retrouver dans nos données.
  const introMatch = trimmed.match(NAME_INTRO_RE);
  if (introMatch) {
    const candidate = introMatch[1].trim().replace(/\s+/g, " ");
    if (looksLikeAName(candidate)) {
      const person = findPerson(candidate);
      if (person) {
        return { text: `Enchanté, ${candidate.split(" ")[0]} ! ${describePerson(person)}`, learnedName: candidate };
      }
      return {
        text: `Enchanté, ${candidate.split(" ")[0]} ! Je ne retrouve pas encore de réservation ou de profil à ce nom dans nos données — ` +
          `si vous êtes déjà membre, vérifiez l'orthographe, sinon je peux vous aider à découvrir le club ou à réserver un premier créneau.`,
        learnedName: candidate,
      };
    }
    // Phrase du type "je m'appelle pas comme ça" / "moi c'est pas grave" → on ignore, ce n'est pas un nom.
  }

  // Question sur "mes réservations / mon planning…" → il faut un nom pour chercher.
  if (WANTS_PERSONAL_INFO.test(norm)) {
    const name = context.knownName;
    if (name) {
      const person = findPerson(name);
      if (person) return { text: describePerson(person) };
      return { text: `Je n'ai pas retrouvé de réservation à votre nom (${name}) — voulez-vous que je vous aide à en créer une depuis la page Réservation ?` };
    }
    return { text: "Bien sûr, je peux vérifier ça — quel est votre nom et prénom ?", asksForName: true };
  }

  // Recherche directe d'un nom mentionné (ex: "est-ce que Pierre Dubois a une résa ?")
  const directNameMatch = trimmed.match(/([A-ZÀ-Ý][a-zà-ÿ]+(?:\s+[A-ZÀ-Ý][a-zà-ÿ]+){0,2})/);
  if (directNameMatch && /\b(reservation|réservation|planning|creneau|créneau|inscrit|membre)\b/.test(norm)) {
    const person = findPerson(directNameMatch[1]);
    if (person) return { text: describePerson(person) };
  }

  // FAQ par intention — on regarde d'abord si la phrase porte une vraie question
  // (ex: "salut, vous servez des planches ?" doit répondre sur les planches,
  // pas se contenter de saluer en retour).
  const topic = pickIntent(trimmed);
  if (topic) return { text: topic.reply(trimmed) };

  // Salutations pures (rien d'autre à se mettre sous la dent dans le message)
  const wordCount = norm.split(/\s+/).filter(Boolean).length;
  if (wordCount <= 4 && (GREETINGS.some(g => norm.startsWith(g)) || GREETINGS.some(g => norm === g))) {
    return {
      text: context.knownName
        ? `Re-bonjour ${context.knownName.split(" ")[0]} ! Je peux vous renseigner sur les horaires, les tarifs, le bar, ou retrouver vos réservations — que puis-je faire pour vous ?`
        : `Bonjour et bienvenue chez Bad's Club ! Je peux répondre à vos questions sur les horaires, les tarifs, les sports, le bar… ` +
          `Et si vous me dites votre nom, je peux même vérifier si vous avez une réservation en cours 😉`,
    };
  }

  // Remerciements
  if (THANKS.some(t => norm.includes(t))) {
    return { text: "Avec plaisir ! N'hésitez pas si vous avez d'autres questions — je suis là 🙂" };
  }

  // Repli générique
  return {
    text: `Je n'ai pas toutes les réponses (je suis un assistant de démo, pas encore branché à une vraie IA), ` +
      `mais je peux vous aider sur : les horaires, les tarifs, les sports proposés, le bar & les commandes en QR code, ` +
      `les événements, ou retrouver votre prochaine réservation si vous me donnez votre nom. Que souhaitez-vous savoir ?`,
  };
}
