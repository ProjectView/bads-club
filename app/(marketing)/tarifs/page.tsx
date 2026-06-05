import Link from 'next/link'
import styles from './page.module.css'

export const metadata = {
  title: "Tarifs & Réservation — Bad's Club · Lyon 7e",
  description: 'Tarifs badminton, squash, pétanque, baseball. Abonnements et location de matériel. Lyon 7e.',
}

export default function TarifsPage() {
  return (
    <main className={styles.main}>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <p className={styles.heroLabel}>— Tarifs & Réservation</p>
          <h1 className={styles.heroTitle}>
            TARIFS &amp;<br /><span className={styles.gold}>RÉSA</span>
          </h1>
          <p className={styles.heroSub}>
            Réservation uniquement en ligne<br />
            Annulation la veille au minimum<br />
            Chaussures non-marquantes obligatoires
          </p>
        </div>
        <div className={styles.heroRight}>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>9</span>
              <span className={styles.heroStatLabel}>Terrains disponibles</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>7j/7</span>
              <span className={styles.heroStatLabel}>Ouvert sans relâche</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatNum}>1999</span>
              <span className={styles.heroStatLabel}>Depuis toujours</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── ZONES ── */}
      <section className={styles.zonesExplain}>
        <div className={styles.zonesTop}>
          <div>
            <p className={styles.sectionLabel}>— Tarifs terrains</p>
            <h2 className={styles.sectionTitle}>BADMINTON &amp; SQUASH</h2>
            <p className={styles.zonesSub}>
              Le prix varie selon le créneau — trois zones horaires, un seul principe&nbsp;: plus c&apos;est calme, moins c&apos;est cher.
            </p>
          </div>
          <div className={styles.zonesTopRight}>
            <div className={styles.sportPills}>
              <span className={styles.sportPill}>
                <span className={styles.sportPillIcon}>🏸</span> 4 terrains de Badminton
              </span>
              <span className={styles.sportPill}>
                <span className={styles.sportPillIcon}>🎾</span> 5 terrains de Squash
              </span>
            </div>
            <span className={styles.zonesTopNote}>Prix par terrain · 1 heure</span>
          </div>
        </div>
        <div className={styles.zonesGrid}>
          <div className={`${styles.zone} ${styles.zoneRouge}`}>
            <div>
              <div className={styles.zoneTop}>
                <span className={styles.zoneDot} />
                <p className={styles.zoneName}>Zone Rouge</p>
              </div>
              <p className={styles.zoneHours}>
                Lun–Ven · 12h15–13h45 / 18h15–22h
              </p>
            </div>
            <p className={styles.zonePrice}>22<span>€</span></p>
          </div>
          <div className={`${styles.zone} ${styles.zoneBlue}`}>
            <div>
              <div className={styles.zoneTop}>
                <span className={styles.zoneDot} />
                <p className={styles.zoneName}>Zone Bleue</p>
              </div>
              <p className={styles.zoneHours}>
                Lun–Ven · 10h–12h15 / 16h–18h15<br />
                Week-end · 9h–19h30
              </p>
            </div>
            <p className={styles.zonePrice}>18<span>€</span></p>
          </div>
          <div className={`${styles.zone} ${styles.zoneVerte}`}>
            <div>
              <div className={styles.zoneTop}>
                <span className={styles.zoneDot} />
                <p className={styles.zoneName}>Zone Verte</p>
              </div>
              <p className={styles.zoneHours}>
                Lun–Ven · 13h45–16h
              </p>
            </div>
            <p className={styles.zonePrice}>15<span>€</span></p>
          </div>
        </div>
        <div className={styles.zonesCta}>
          <a href="/reservation" className={styles.ctaInline}>
            <span>Réserver un terrain →</span>
          </a>
          <span className={styles.ctaInlineNote}>Badminton · Squash · Disponible 7j/7</span>
        </div>
      </section>

      {/* ── ABONNEMENTS ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionLabel}>— Économisez</p>
          <h2 className={styles.sectionTitle}>ABONNEMENTS</h2>
        </div>
        <div className={styles.abonCards}>
          {[
            {
              cls: styles.abonCardRouge, name: 'Zone Rouge',
              lines: [
                { label: '5 séances',  price: '90€' },
                { label: '10 séances', price: '170€' },
                { label: '25 séances', price: '400€' },
              ],
            },
            {
              cls: styles.abonCardBlue, name: 'Zone Bleue',
              lines: [
                { label: '5 séances',  price: '80€' },
                { label: '10 séances', price: '150€' },
                { label: '25 séances', price: '350€' },
              ],
            },
            {
              cls: styles.abonCardVert, name: 'Zone Verte',
              lines: [
                { label: '5 séances',  price: null },
                { label: '10 séances', price: '140€' },
                { label: '25 séances', price: '325€' },
              ],
            },
          ].map(card => (
            <div key={card.name} className={`${styles.abonCard} ${card.cls}`}>
              <div className={styles.abonCardHead}>
                <span className={styles.abonCardDot} />
                <span className={styles.abonCardName}>{card.name}</span>
              </div>
              <div className={styles.abonLines}>
                {card.lines.map(l => (
                  <div key={l.label} className={styles.abonLine}>
                    <span className={styles.abonLineLabel}>{l.label}</span>
                    {l.price
                      ? <span className={styles.abonLinePrice}>{l.price}</span>
                      : <span className={styles.abonLineEmpty}>—</span>
                    }
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.abonCta}>
          <p className={styles.abonCtaText}>Valables sur tous nos terrains · Sans date d&apos;expiration</p>
          <a href="/reservation" className={styles.ctaInline}>
            <span>Prendre un abonnement →</span>
          </a>
        </div>
      </section>

      {/* ── AUTRES ACTIVITÉS ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionLabel}>— Autres activités</p>
          <h2 className={styles.sectionTitle}>PÉTANQUE, BASEBALL &amp; BRUNCH</h2>
        </div>
        <div className={styles.activitiesGrid}>
          <div className={styles.activityCard}>
            <p className={styles.activityName}>Pétanque</p>
            <div className={styles.activityPrices}>
              <div className={styles.activityPrice}>
                <span className={styles.activityDuration}>30 minutes</span>
                <span className={styles.activityAmount}>10€</span>
              </div>
              <div className={styles.activityPrice}>
                <span className={styles.activityDuration}>1 heure</span>
                <span className={styles.activityAmount}>20€</span>
              </div>
            </div>
            <p className={styles.activityNote}>4 terrains couverts · Boules fournies</p>
            <a href="/reservation" className={styles.activityCta}>Réserver un terrain →</a>
          </div>
          <div className={`${styles.activityCard} ${styles.activityCardFeatured}`}>
            <div className={styles.activityBadge}>Exclusivité régionale</div>
            <p className={styles.activityName}>Baseball Simulator</p>
            <div className={styles.activityPrices}>
              <div className={styles.activityPrice}>
                <span className={styles.activityDuration}>Sur réservation</span>
                <span className={styles.activityAmount} style={{ fontSize: '1.2rem' }}>Nous contacter</span>
              </div>
            </div>
            <p className={styles.activityNote}>Motion capture 3D · Seul simulateur de la région</p>
            <a href="/reservation" className={`${styles.activityCta} ${styles.activityCtaGold}`}>Réserver une session →</a>
          </div>
          <div className={styles.activityCard}>
            <p className={styles.activityName}>Brunch Dimanche</p>
            <div className={styles.activityPrices}>
              <div className={styles.activityPrice}>
                <span className={styles.activityDuration}>Buffet complet</span>
                <span className={styles.activityAmount}>28€</span>
              </div>
            </div>
            <p className={styles.activityNote}>Boissons incluses · Dernier dimanche du mois</p>
            <a href="/reservation" className={styles.activityCta}>Réserver une table →</a>
          </div>
        </div>
      </section>

      {/* ── LOCATION MATÉRIEL ── */}
      <section className={styles.sectionSmall}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionLabel}>— Équipement</p>
          <h2 className={styles.sectionTitle}>LOCATION MATÉRIEL</h2>
        </div>
        <div className={styles.materielRow}>
          <div className={styles.materielItem}>
            <span className={styles.materielName}>Raquettes bad / squash</span>
            <span className={styles.materielDash} />
            <span className={styles.materielPrice}>2€</span>
          </div>
          <div className={styles.materielItem}>
            <span className={styles.materielName}>Chaussures</span>
            <span className={styles.materielDash} />
            <span className={styles.materielPrice}>2€</span>
          </div>
        </div>
        <p className={styles.materielNote}>Chaussures non-marquantes obligatoires sur les terrains</p>
      </section>

      {/* ── RÉSERVATION ── */}
      <section id="reservation" className={styles.reservationSection}>
        <div className={styles.reservationLeft}>
          <p className={styles.sectionLabel}>— Réservation en ligne</p>
          <h2 className={styles.reservationTitle}>
            PRÊT À<br /><span className={styles.gold}>JOUER ?</span>
          </h2>
          <p className={styles.reservationSub}>
            Notre système de réservation en ligne arrive bientôt. En attendant, réservez directement par téléphone ou par e-mail — on répond vite.
          </p>
          <div className={styles.reservationActions}>
            <a href="tel:+33472000000" className={styles.btnPrimary}>
              <span>Appeler le bar →</span>
            </a>
            <a href="mailto:contact@badsclub.fr" className={styles.btnSecondary}>
              <span>Envoyer un e-mail →</span>
            </a>
          </div>
        </div>
        <div className={styles.reservationRight}>
          <div className={styles.reservationInfo}>
            <div className={styles.infoItem}>
              <span className={styles.infoKey}>Annulation</span>
              <span className={styles.infoVal}>La veille au minimum</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoKey}>Horaires</span>
              <span className={styles.infoVal}>7j/7 · 9h–23h</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoKey}>Adresse</span>
              <span className={styles.infoVal}>Lyon 7e · 5 min Jean Macé</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoKey}>Paiement</span>
              <span className={styles.infoVal}>CB, espèces · sur place</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoKey}>Équipement</span>
              <span className={styles.infoVal}>Chaussures non-marquantes obligatoires</span>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}
