import Link from 'next/link'
import RevealBlock from '@/components/ui/RevealBlock'
import styles from './EventsSection.module.css'

const EVENTS = [
  {
    month: 'MAI',
    name: 'Tournoi de Badminton Open',
    detail: 'Toutes catégories · 18h00',
    tag: 'Sport',
  },
  {
    month: 'JUN',
    name: 'Afterwork XXIII',
    detail: 'Formule bière + pétanque · 19h00',
    tag: 'Bar',
  },
  {
    month: 'JUN',
    name: 'Brunch du Dimanche',
    detail: 'Buffet complet 28€ · 11h00',
    tag: 'Resto',
  },
  {
    month: 'JUL',
    name: 'Soirée Baseball Simulator',
    detail: 'Défi inter-équipes · 20h00',
    tag: 'Exclusif',
  },
]

export default function EventsSection() {
  return (
    <section className={styles.section}>
      <RevealBlock className={styles.headerReveal}>
        <div className={styles.header}>
          <div>
            <p className={styles.label}>— Agenda</p>
            <h2 className={styles.headline}>PROCHAINS<br />ÉVÉNEMENTS</h2>
          </div>
          <Link href="/evenements" className={styles.btn}>
            <span>Tout voir →</span>
          </Link>
        </div>
      </RevealBlock>

      <RevealBlock>
        <div className={styles.list}>
          {EVENTS.map((event, i) => (
            <div key={i} className={styles.row}>
              <span className={styles.date}>{event.month}</span>
              <div className={styles.name}>
                {event.name}
                <small>{event.detail}</small>
              </div>
              <span className={styles.tag}>{event.tag}</span>
              <span className={styles.arrow}>→</span>
            </div>
          ))}
        </div>
      </RevealBlock>
    </section>
  )
}
