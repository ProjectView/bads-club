import MenuSection from '@/components/sections/MenuSection'
import styles from './page.module.css'

export const metadata = {
  title: "Bar & Restaurant — Bad's Club · Lyon 7e",
  description: 'Bar lounge post-sport, formules repas, brunch le dernier dimanche du mois. 44 rue Victor Lagrange, Lyon 7e.',
}

export default function BarPage() {
  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.label}>— Bar &amp; Lounge</p>
          <h1 className={styles.title}>
            LE MEILLEUR<br />VERRE C&apos;EST<br />
            <span className={styles.gold}>CELUI QU&apos;ON<br />MÉRITE</span>
          </h1>
          <p className={styles.body}>
            Après votre séance, le bar vous attend. Bières en pression,
            cocktails, planches, pinsas — une carte pensée pour recharger après l&apos;effort.
          </p>
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
        </div>

      </section>

      {/* ── BRUNCH BAND ── */}
      <section className={styles.brunch}>
        <div className={styles.brunchLeft}>
          <p className={styles.brunchEyebrow}>— Le rendez-vous du dimanche</p>
          <h2 className={styles.brunchTitle}>BRUNCH</h2>
        </div>
        <div className={styles.brunchCenter}>
          <p className={styles.brunchWhen}>Chaque dernier<br />dimanche du mois</p>
          <p className={styles.brunchSub}>Buffet complet · boisson chaude + froide incluses</p>
        </div>
        <div className={styles.brunchRight}>
          <span className={styles.brunchPrice}>28<sup>€</sup></span>
          <span className={styles.brunchPriceSub}>par personne</span>
        </div>
      </section>

      <MenuSection />
    </main>
  )
}
