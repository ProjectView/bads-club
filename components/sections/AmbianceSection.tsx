import Image from 'next/image'
import Link from 'next/link'
import RevealBlock from '@/components/ui/RevealBlock'
import styles from './AmbianceSection.module.css'

const TICKER_ITEMS = [
  '4 terrains de badminton',
  '5 terrains de squash',
  '4 terrains de pétanque',
  'Simulateur baseball unique en France',
  'Bar & restaurant 1500m²',
  'Brunch le dimanche',
  'Séminaires & events',
]

const SPORT_CARDS = [
  {
    num: '01',
    title: 'Badminton',
    tagline: 'Raquettes en main, terrain à toi.',
    detail: '4 terrains disponibles',
    img: '/Bad.jpg',
    objectPosition: 'center center',
    badge: null,
  },
  {
    num: '02',
    title: 'Squash',
    tagline: 'Quatre murs, zéro excuse.',
    detail: '5 terrains disponibles',
    img: '/Squash.jpg',
    objectPosition: 'center center',
    badge: null,
  },
  {
    num: '03',
    title: 'Pétanque',
    tagline: 'Cochonnet, boules, bière. Dans cet ordre.',
    detail: '4 terrains couverts',
    img: '/Petanque.jpg',
    objectPosition: 'center center',
    badge: null,
  },
  {
    num: '04',
    title: 'Baseball',
    tagline: "Seul simulateur de la région. L'essayer c'est l'adopter.",
    detail: 'Simulateur motion capture 3D',
    img: '/Baseball.jpg',
    objectPosition: 'center center',
    badge: 'Exclusivité régionale',
  },
]

export default function AmbianceSection() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <section className={styles.section}>
      <RevealBlock>
        <p className={styles.label}>— L&apos;expérience Bad&apos;s</p>
      </RevealBlock>
      <RevealBlock>
        <h2 className={styles.headline}>
          SUEZ LA SUEUR.<br />
          <span className={styles.gold}>MÉRITEZ</span> VOTRE VERRE.
        </h2>
      </RevealBlock>

      <div className={styles.tickerRow}>
        <div className={styles.tickerInner}>
          {doubled.map((item, i) => (
            <span key={i} className={styles.tickerItem}>{item}</span>
          ))}
        </div>
      </div>

      <RevealBlock delay={0.2} className={styles.cardsReveal}>
        <div className={styles.cardsGrid}>
          {SPORT_CARDS.map((card) => (
            <Link href="/sport" key={card.num} className={styles.card}>
              {/* Photo */}
              <div className={styles.cardPhoto}>
                <Image
                  src={card.img}
                  alt={card.title}
                  fill
                  className={styles.cardImg}
                  sizes="(max-width: 768px) 100vw, 25vw"
                  style={{ objectPosition: card.objectPosition }}
                />
              </div>

              {/* Overlay permanent */}
              <div className={styles.cardOverlay} />

              {/* Badge exclusivité */}
              {card.badge && (
                <div className={styles.cardBadge}>{card.badge}</div>
              )}

              {/* Numéro fantôme */}
              <div className={styles.cardNum}>{card.num}</div>

              {/* Panneau bas — visible au repos, s'étend au hover */}
              <div className={styles.cardPanel}>
                <div className={styles.cardPanelInner}>
                  <span className={styles.cardTitle}>{card.title}</span>
                  <div className={styles.cardReveal}>
                    <p className={styles.cardTagline}>{card.tagline}</p>
                    <span className={styles.cardDetail}>{card.detail}</span>
                    <span className={styles.cardCta}>Réserver →</span>
                  </div>
                </div>
                <span className={styles.cardLine} />
              </div>
            </Link>
          ))}
        </div>
      </RevealBlock>
    </section>
  )
}
