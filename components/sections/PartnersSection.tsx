import styles from './PartnersSection.module.css'

const PARTNERS = [
  { name: 'Les Assembleurs',         sub: 'Réseau business' },
  { name: 'Babolat',                 sub: 'Équipementier' },
  { name: 'BML',                     sub: 'Partenaire' },
  { name: 'Carbao',                  sub: 'Business · Échange · Éthique' },
  { name: 'em lyon',                 sub: 'Business school' },
  { name: 'France Bières',           sub: 'Brasserie' },
  { name: 'IAD',                     sub: 'Immobilier' },
  { name: 'Imaginarium Quiz',        sub: 'Animation & quiz' },
  { name: 'Karakal',                 sub: 'Équipementier' },
  { name: 'La Rouget',               sub: 'Brasserie artisanale' },
  { name: "L'Hachez-Vous",           sub: 'Partenaire' },
  { name: 'Obut',                    sub: 'Pétanque' },
]

export default function PartnersSection() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <p className={styles.label}>— Ils nous font confiance</p>
        <h2 className={styles.title}>NOS PARTENAIRES</h2>
      </div>
      <div className={styles.grid}>
        {PARTNERS.map((p) => (
          <div key={p.name} className={styles.partner}>
            <span className={styles.partnerName}>{p.name}</span>
            <span className={styles.partnerSub}>{p.sub}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
