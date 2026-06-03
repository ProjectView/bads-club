import Link from 'next/link'
import Image from 'next/image'
import { EVENTS, CATEGORY_LABELS, CATEGORY_COLORS, ClubEvent } from '@/lib/events'
import styles from './page.module.css'

function EventVisual({ event }: { event: ClubEvent }) {
  const colors = CATEGORY_COLORS[event.category]
  return (
    <div
      className={styles.visual}
      style={!event.img ? { background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)` } : undefined}
    >
      {event.img && (
        <Image
          src={event.img}
          alt={event.title}
          fill
          className={styles.visualImg}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      )}
      {/* Overlay coloré sur la photo */}
      {event.img && (
        <div
          className={styles.visualOverlay}
          style={{ background: `linear-gradient(135deg, ${colors.accent}22 0%, rgba(8,8,8,0.55) 100%)` }}
        />
      )}
      {/* Ghost text — toujours présent */}
      <div className={styles.visualGhost} style={{ color: event.img ? colors.accent : colors.accent }}>
        {CATEGORY_LABELS[event.category].toUpperCase()}
      </div>
      <div className={styles.visualAccent} style={{ background: colors.accent }} />
    </div>
  )
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return {
    day:   d.toLocaleDateString('fr-FR', { day: '2-digit' }),
    month: d.toLocaleDateString('fr-FR', { month: 'long' }),
    year:  d.toLocaleDateString('fr-FR', { year: 'numeric' }),
    full:  d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
  }
}

export const metadata = {
  title: "Événements — Bad's Club · Afterwork, Team Building, EVG/EVJF",
  description: "Afterwork, brunchs, tournois, EVG, séminaires. Privatisation possible. Lyon 7e.",
}

export default function EvenementsPage() {
  const upcoming = EVENTS.filter(e => !e.past)
  const past     = EVENTS.filter(e => e.past).slice(0, 3)
  const [featured, ...rest] = upcoming

  return (
    <main className={styles.main}>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <p className={styles.heroLabel}>— Agenda</p>
        <h1 className={styles.heroTitle}>
          ÉVÉNE<br /><span className={styles.gold}>MENTS</span>
        </h1>
        <p className={styles.heroSub}>
          Afterworks, brunchs, tournois, EVG — le Bad&apos;s Club s&apos;anime toute l&apos;année.
        </p>
      </section>

      {/* ── À VENIR ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>À VENIR</h2>
          <span className={styles.sectionCount}>{upcoming.length} événement{upcoming.length > 1 ? 's' : ''}</span>
        </div>

        {/* Featured — premier event en grand */}
        {featured && (
          <div className={styles.featured}>
            <EventVisual event={featured} />
            <div className={styles.featuredContent}>
              <div className={styles.featuredMeta}>
                <span className={styles.tag} style={{ background: CATEGORY_COLORS[featured.category].accent }}>
                  {CATEGORY_LABELS[featured.category]}
                </span>
                <span className={styles.dateTag}>
                  {formatDate(featured.date).full}
                  {featured.time && ` · ${featured.time}${featured.endTime ? ` → ${featured.endTime}` : ''}`}
                </span>
              </div>
              <h3 className={styles.featuredTitle}>{featured.title}</h3>
              {featured.subtitle && <p className={styles.featuredSub}>{featured.subtitle}</p>}
              <p className={styles.featuredDesc}>{featured.description}</p>
              <div className={styles.featuredInfo}>
                {featured.price && (
                  <span className={styles.infoChip}>
                    <span className={styles.infoIcon}>€</span> {featured.price}
                  </span>
                )}
                {featured.capacity && (
                  <span className={styles.infoChip}>
                    <span className={styles.infoIcon}>◎</span> {featured.capacity}
                  </span>
                )}
              </div>
              <Link href="/tarifs" className={styles.btn}>
                <span>{featured.cta ?? 'Réserver'} →</span>
              </Link>
            </div>
          </div>
        )}

        {/* Grille des autres events */}
        {rest.length > 0 && (
          <div className={styles.grid}>
            {rest.map(event => {
              const d      = formatDate(event.date)
              const accent = CATEGORY_COLORS[event.category].accent
              return (
                <article key={event.id} className={styles.card}>
                  <EventVisual event={event} />
                  <div className={styles.cardContent}>
                    <div className={styles.cardMeta}>
                      <span className={styles.tag} style={{ background: accent }}>
                        {CATEGORY_LABELS[event.category]}
                      </span>
                      <span className={styles.cardDate}>
                        <strong>{d.day}</strong> {d.month} {d.year}
                        {event.time && ` · ${event.time}`}
                      </span>
                    </div>
                    <h3 className={styles.cardTitle}>{event.title}</h3>
                    {event.subtitle && <p className={styles.cardSub}>{event.subtitle}</p>}
                    <p className={styles.cardDesc}>{event.description}</p>
                    {event.price && <p className={styles.cardPrice}>{event.price}</p>}
                    <Link href="/tarifs" className={styles.cardBtn}>
                      <span>{event.cta ?? 'Réserver'} →</span>
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {/* ── ÉVÉNEMENTS PASSÉS ── */}
      {past.length > 0 && (
        <section className={styles.sectionPast}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>DERNIERS ÉVÉNEMENTS</h2>
          </div>
          <div className={styles.pastGrid}>
            {past.map(event => {
              const d      = formatDate(event.date)
              const accent = CATEGORY_COLORS[event.category].accent
              return (
                <article key={event.id} className={styles.pastCard}>
                  <div className={styles.pastVisualWrap}>
                    <EventVisual event={event} />
                    <div className={styles.pastOverlay} />
                    <span className={styles.pastBadge}>Passé</span>
                  </div>
                  <div className={styles.pastContent}>
                    <span className={styles.tag} style={{ background: accent, opacity: 0.6 }}>
                      {CATEGORY_LABELS[event.category]}
                    </span>
                    <p className={styles.pastDate}>{d.day} {d.month} {d.year}</p>
                    <h3 className={styles.pastTitle}>{event.title}</h3>
                    <p className={styles.pastDesc}>{event.description}</p>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {/* ── CTA PRIVATISATION ── */}
      <section className={styles.ctaSection}>
        <p className={styles.ctaLabel}>— Événements privés</p>
        <h2 className={styles.ctaTitle}>
          UN PROJET ?<br /><span className={styles.gold}>ON EN PARLE.</span>
        </h2>
        <p className={styles.ctaSub}>
          EVG, anniversaire, séminaire, soirée d&apos;entreprise — privatisation totale ou partielle,
          formule sur mesure. Devis rapide sous 24h.
        </p>
        <Link href="/tarifs" className={styles.ctaBtn}>
          <span>Demander un devis →</span>
        </Link>
      </section>

    </main>
  )
}
