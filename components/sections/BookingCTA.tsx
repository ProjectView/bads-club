import Link from 'next/link'
import RevealBlock from '@/components/ui/RevealBlock'
import styles from './BookingCTA.module.css'

export default function BookingCTA() {
  return (
    <section className={styles.section}>
      <div className={styles.bgText}>BAD&apos;S</div>
      <RevealBlock>
        <h2 className={styles.title}>
          RÉSERVEZ<br /><span className={styles.gold}>MAINTENANT</span>
        </h2>
      </RevealBlock>
      <RevealBlock>
        <p className={styles.subtitle}>44 rue Victor Lagrange · Lyon 7e · 5 min de Jean Macé</p>
      </RevealBlock>
      <Link href="/tarifs" className={styles.btn}>
        <span>Choisir un terrain →</span>
      </Link>
    </section>
  )
}
