import Link from 'next/link'
import Image from 'next/image'
import RevealBlock from '@/components/ui/RevealBlock'
import styles from './BarSection.module.css'

export default function BarSection() {
  return (
    <section className={styles.section}>
      <RevealBlock className={styles.visualReveal}>
        <div className={styles.visual}>
          <Image
            src="/Bar.jpg"
            alt="Bar Bad's Club — tireuse à bière"
            fill
            className={styles.visualImg}
            sizes="(max-width: 900px) 100vw, 50vw"
          />
          <div className={styles.badge}>BRUNCH<br />CHAQUE<br />DIMANCHE</div>
        </div>
      </RevealBlock>

      <div className={styles.text}>
        <p className={styles.label}>— Le bar</p>
        <RevealBlock>
          <h2 className={styles.headline}>
            LE MEILLEUR<br />VERRE<br />C&apos;EST CELUI<br />
            <span className={styles.yellow}>QU&apos;ON MÉRITE</span>
          </h2>
        </RevealBlock>
        <RevealBlock>
          <p className={styles.body}>
            Après votre séance, le bar vous attend. Bières en pression, cocktails,
            formules restauration — une carte pensée pour recharger après l&apos;effort.
          </p>
        </RevealBlock>
        <RevealBlock>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statNum}>25+</div>
              <div className={styles.statLabel}>Années d&apos;existence</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNum}>1500</div>
              <div className={styles.statLabel}>m² de plaisir</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNum}>7j/7</div>
              <div className={styles.statLabel}>Ouvert sans relâche</div>
            </div>
          </div>
        </RevealBlock>
        <Link href="/bar" className={styles.btn}>
          <span>Voir la carte →</span>
        </Link>
      </div>
    </section>
  )
}
