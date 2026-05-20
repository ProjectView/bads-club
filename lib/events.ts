export type EventCategory = 'afterwork' | 'evg' | 'team-building' | 'brunch' | 'tournoi' | 'soiree'

export interface ClubEvent {
  id: string
  title: string
  subtitle?: string
  date: string       // ISO: "2025-06-06"
  time?: string      // "19h00"
  endTime?: string   // "23h00"
  category: EventCategory
  description: string
  price?: string
  capacity?: string
  cta?: string
  past?: boolean
  img?: string       // path in /public, e.g. "/evenements/afterwork.jpeg"
}

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  afterwork:      'Afterwork',
  evg:            'EVG / EVJF',
  'team-building':'Team Building',
  brunch:         'Brunch',
  tournoi:        'Tournoi',
  soiree:         'Soirée',
}

export const CATEGORY_COLORS: Record<EventCategory, { from: string; to: string; accent: string }> = {
  afterwork:      { from: '#1a1400', to: '#0d0d0d', accent: '#bda41a' },
  evg:            { from: '#0f0014', to: '#0d0d0d', accent: '#9b4dca' },
  'team-building':{ from: '#001a0a', to: '#0d0d0d', accent: '#2ecc71' },
  brunch:         { from: '#1a0a00', to: '#0d0d0d', accent: '#e67e22' },
  tournoi:        { from: '#00101a', to: '#0d0d0d', accent: '#3498db' },
  soiree:         { from: '#1a0010', to: '#0d0d0d', accent: '#e91e8c' },
}

export const EVENTS: ClubEvent[] = [
  // ── À VENIR ────────────────────────────────────────────────
  {
    id: 'afterwork-juin-2025',
    img: '/evenements/afterwork.jpeg',
    title: 'Afterwork du Vendredi',
    subtitle: 'Sport + Bière = Vendredi réussi',
    date: '2025-06-06',
    time: '18h30',
    endTime: '23h00',
    category: 'afterwork',
    description:
      'Chaque vendredi, le Bad\'s Club ouvre ses terrains en formule afterwork. Une heure de sport (badminton, squash ou pétanque au choix), puis le bar vous attend avec une sélection de bières en pression et planches apéro. Le meilleur moyen de finir la semaine.',
    price: 'Formule sport + boisson dès 18€',
    capacity: 'Places limitées',
    cta: 'Réserver',
  },
  {
    id: 'brunch-juin-2025',
    title: 'Brunch du Dernier Dimanche',
    subtitle: 'Buffet complet · Boissons incluses',
    date: '2025-06-29',
    time: '11h00',
    endTime: '15h00',
    category: 'brunch',
    description:
      'Le rendez-vous incontournable du dimanche lyonnais. Buffet chaud et froid en illimité, viennoiseries, œufs, charcuterie, fromages, jus de fruits et boissons chaudes incluses. Ambiance détendue dans nos 1500m², réservation conseillée.',
    price: '28€ / personne',
    capacity: 'Réservation recommandée',
    cta: 'Réserver une table',
  },
  {
    id: 'tournoi-bad-juillet-2025',
    title: 'Tournoi Interne Badminton',
    subtitle: 'Tous niveaux · Par équipes de 2',
    date: '2025-07-12',
    time: '10h00',
    endTime: '18h00',
    category: 'tournoi',
    description:
      'Premier tournoi interne de la saison sur nos 4 terrains. Format double mixte, tous niveaux acceptés. La journée se finit autour d\'un buffet partagé au bar. Trophées et lots à gagner pour les 3 premières équipes.',
    price: '12€ / joueur · repas inclus',
    capacity: '16 équipes maximum',
    cta: 'S\'inscrire',
  },
  {
    id: 'soiree-baseball-aout-2025',
    title: 'Nuit du Simulateur',
    subtitle: 'Session baseball nocturne · En équipes',
    date: '2025-08-01',
    time: '20h00',
    endTime: '00h00',
    category: 'soiree',
    description:
      'Une soirée exceptionnelle autour de notre simulateur de baseball motion capture — le seul de la région. Sessions en équipes de 4, classement en temps réel, DJ en fond de salle et formule boissons illimitée. Venez battre le record du soir.',
    price: 'Formule soirée dès 35€',
    capacity: '40 personnes max',
    cta: 'Réserver',
  },
  {
    id: 'evg-aout-2025',
    title: 'Package EVG / EVJF',
    subtitle: 'Sur mesure · Privatisation possible',
    date: '2025-08-16',
    time: 'À définir',
    category: 'evg',
    description:
      'Organisez l\'enterrement de vie de garçon ou de jeune fille parfait au Bad\'s Club. Activités combinables au choix (squash, badminton, pétanque, baseball), espace privatisable jusqu\'à 40 personnes, formule repas + boissons sur mesure. Devis rapide sur demande.',
    price: 'Sur devis',
    capacity: 'Jusqu\'à 40 personnes',
    cta: 'Demander un devis',
  },

  // ── PASSÉS ────────────────────────────────────────────────
  {
    id: 'afterwork-mai-2025',
    img: '/evenements/afterwork.jpeg',
    title: 'Afterwork du Vendredi',
    subtitle: 'Édition Mai 2025',
    date: '2025-05-16',
    time: '18h30',
    endTime: '23h00',
    category: 'afterwork',
    description:
      'Retour en images sur notre afterwork du mois de mai — plus de 60 participants, terrains complets et bar animé jusqu\'en fin de soirée.',
    past: true,
  },
  {
    id: 'brunch-mai-2025',
    title: 'Brunch du Dimanche',
    subtitle: 'Édition Mai · Complet',
    date: '2025-05-25',
    time: '11h00',
    endTime: '15h00',
    category: 'brunch',
    description:
      'Brunch de mai sold-out en 48h. 80 couverts, buffet élargi avec corner sucré. Prochain rendez-vous fin juin, réservez tôt.',
    past: true,
  },
  {
    id: 'team-building-avril-2025',
    title: 'Séminaire Team Building',
    subtitle: 'Entreprise Lyon · Privatisation totale',
    date: '2025-04-24',
    time: '14h00',
    endTime: '22h00',
    category: 'team-building',
    description:
      'Une journée team building complète pour une entreprise lyonnaise de 35 personnes — ateliers sport, escape game improvisé sur les terrains, puis dîner au bar. Une formule qu\'on renouvelle avec plaisir.',
    past: true,
  },
]
