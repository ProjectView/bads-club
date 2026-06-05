import Link from 'next/link'
import Image from 'next/image'
import styles from './page.module.css'

export const metadata = {
  title: "Sport — Bad's Club · Badminton, Squash, Pétanque, Baseball",
  description: 'Badminton (4 terrains), squash (5 terrains), pétanque couverte, simulateur baseball unique en Auvergne-Rhône-Alpes.',
}

const SPORTS = [
  {
    id: 'badminton',
    num: '01',
    label: 'Raquette & volant',
    name: 'BADMINTON',
    sub: '4 terrains homologués',
    desc: "Quatre terrains aux normes FFBad dans une salle dédiée. Sols en bois flottant, éclairage LED anti-éblouissement et hauteur sous plafond réglementaire. Idéal pour l'entraînement comme pour les matchs entre amis.",
    stats: [
      { val: '4', label: 'Terrains' },
      { val: '3', label: 'Zones tarifaires' },
      { val: '7j/7', label: 'Ouverture' },
    ],
    zones: [
      { name: 'ROUGE', color: '#e74c3c', desc: 'Heures pleines', price: 'à partir de 9€' },
      { name: 'BLEU',  color: '#3498db', desc: 'Heures creuses', price: 'à partir de 7€' },
      { name: 'VERT',  color: '#2ecc71', desc: 'Petits matins',  price: 'à partir de 5€' },
    ],
    cta: 'Réserver un terrain',
    ghost: 'BADMINTON',
    img: '/Bad.jpg',
    flip: false,
  },
  {
    id: 'squash',
    num: '02',
    label: 'Murs & vitesse',
    name: 'SQUASH',
    sub: '5 terrains vitrés',
    desc: "Cinq terrains dont plusieurs avec paroi de fond vitrée pour une expérience spectateur optimale. Courts professionnels avec revêtement homologué PSF, parfaits pour tous les niveaux — du débutant au compétiteur.",
    stats: [
      { val: '5', label: 'Terrains' },
      { val: '3', label: 'Zones tarifaires' },
      { val: 'PSF', label: 'Homologation' },
    ],
    zones: [
      { name: 'ROUGE', color: '#e74c3c', desc: 'Heures pleines', price: 'à partir de 9€' },
      { name: 'BLEU',  color: '#3498db', desc: 'Heures creuses', price: 'à partir de 7€' },
      { name: 'VERT',  color: '#2ecc71', desc: 'Petits matins',  price: 'à partir de 5€' },
    ],
    cta: 'Réserver un terrain',
    ghost: 'SQUASH',
    img: '/Squash.jpg',
    flip: true,
  },
  {
    id: 'petanque',
    num: '03',
    label: 'Tradition & convivialité',
    name: 'PÉTANQUE',
    sub: 'Boulodrome couvert',
    desc: "Un boulodrome intérieur pour jouer quelle que soit la météo. Aire de jeu en terre battue, boules disponibles sur place. La pétanque à Lyon version lounge — une partie avant l'apéro, c'est la formule gagnante.",
    stats: [
      { val: '3€', label: 'Par personne' },
      { val: '∞', label: 'Parties illimitées' },
      { val: '+ bar', label: 'Sur place' },
    ],
    zones: null,
    prices: [
      { label: 'Entrée pétanque', price: '3€ / pers.' },
      { label: 'Location boules', price: 'Incluse' },
      { label: 'Groupe privatif', price: 'Sur devis' },
    ],
    cta: 'Réserver une piste',
    ghost: 'PÉTANQUE',
    img: '/Petanque.jpg',
    flip: false,
  },
  {
    id: 'baseball',
    num: '04',
    label: 'Unique en Auvergne-Rhône-Alpes',
    name: 'SIMULATEUR',
    nameSub: 'BASEBALL',
    sub: 'Expérience immersive',
    desc: "Le seul simulateur de baseball professionnel de la région. Technologie de capture de mouvement, pitching machine réglable de 50 à 130 km/h, replay vidéo instantané. Une attraction inédite à Lyon — pour les groupes, les soirées team-building ou l'initiation en famille.",
    stats: [
      { val: '1', label: 'Unique en AURA' },
      { val: '130', label: 'km/h max' },
      { val: 'HD', label: 'Replay vidéo' },
    ],
    zones: null,
    prices: [
      { label: '30 min', price: '15€ / pers.' },
      { label: '1h', price: '25€ / pers.' },
      { label: 'Groupe (6+)', price: 'Sur devis' },
    ],
    cta: 'Réserver une session',
    ghost: 'BASE\nBALL',
    img: '/Baseball.jpg',
    flip: true,
  },
]

export default function SportPage() {
  return (
    <main className={styles.page}>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.heroLabel}>— Le terrain de jeu</p>
          <h1 className={styles.heroTitle}>
            4 SPORTS<br />
            <span className={styles.gold}>1 ADRESSE</span>
          </h1>
          <p className={styles.heroSub}>
            Badminton · Squash · Pétanque · Simulateur baseball
          </p>
        </div>
        <div className={styles.heroStats}>
          <div className={styles.heroStat}>
            <span className={styles.heroStatNum}>9</span>
            <span className={styles.heroStatLabel}>Terrains de raquette</span>
          </div>
          <div className={styles.heroStat}>
            <span className={styles.heroStatNum}>1999</span>
            <span className={styles.heroStatLabel}>Fondation</span>
          </div>
          <div className={styles.heroStat}>
            <span className={styles.heroStatNum}>7j/7</span>
            <span className={styles.heroStatLabel}>Ouverture</span>
          </div>
        </div>
      </section>

      {/* ── SPORTS ── */}
      {SPORTS.map((sport) => (
        <section key={sport.id} id={sport.id} className={`${styles.sportSection} ${sport.flip ? styles.flip : ''}`}>

          {/* Ghost background */}
          <div className={styles.ghost} aria-hidden>
            {sport.ghost}
          </div>

          {/* Visual col */}
          <div className={styles.visual}>
            {sport.img && (
              <Image
                src={sport.img}
                alt={sport.name}
                fill
                className={styles.visualImg}
                sizes="50vw"
              />
            )}
            <span className={styles.visualNum}>{sport.num}</span>
          </div>

          {/* Content col */}
          <div className={styles.content}>
            <p className={styles.sportLabel}>{sport.label}</p>
            <h2 className={styles.sportName}>
              {sport.name}
              {sport.nameSub && <><br /><span className={styles.gold}>{sport.nameSub}</span></>}
            </h2>
            <p className={styles.sportSub}>{sport.sub}</p>
            <p className={styles.sportDesc}>{sport.desc}</p>

            {/* Stats */}
            <div className={styles.statsRow}>
              {sport.stats.map((s) => (
                <div key={s.label} className={styles.stat}>
                  <span className={styles.statVal}>{s.val}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>

            {/* Zones ou tarifs */}
            {sport.zones ? (
              <div className={styles.zones}>
                {sport.zones.map((z) => (
                  <div key={z.name} className={styles.zone}>
                    <span className={styles.zoneDot} style={{ background: z.color }} />
                    <div>
                      <span className={styles.zoneName} style={{ color: z.color }}>{z.name}</span>
                      <span className={styles.zoneDesc}>{z.desc}</span>
                    </div>
                    <span className={styles.zonePrice}>{z.price}</span>
                  </div>
                ))}
              </div>
            ) : sport.prices ? (
              <div className={styles.prices}>
                {sport.prices.map((p) => (
                  <div key={p.label} className={styles.priceRow}>
                    <span className={styles.priceLabel}>{p.label}</span>
                    <span className={styles.priceVal}>{p.price}</span>
                  </div>
                ))}
              </div>
            ) : null}

            <Link href="/reservation" className={styles.cta}>
              <span>{sport.cta} →</span>
            </Link>
          </div>

        </section>
      ))}

      {/* ── CTA GLOBAL ── */}
      <section className={styles.ctaSection}>
        <p className={styles.ctaLabel}>— Envie de tout essayer ?</p>
        <h2 className={styles.ctaTitle}>PRIVATISATION<br /><span className={styles.gold}>& GROUPES</span></h2>
        <p className={styles.ctaSub}>
          Soirées team-building, anniversaires, EVG/EVJF — on s'occupe de tout.
          Combinaison sport + bar + restauration sur mesure.
        </p>
        <Link href="/reservation" className={styles.ctaBtn}>
          <span>Demander un devis</span>
        </Link>
      </section>

    </main>
  )
}
