import styles from './Marquee.module.css'

const ITEMS = [
  'Badminton', 'Squash', 'Pétanque', 'Baseball',
  'Bar Lounge', 'Afterwork', 'EVG / EVJF', 'Team Building',
]

export default function Marquee() {
  const doubled = [...ITEMS, ...ITEMS]

  return (
    <div className={styles.wrap}>
      <div className={styles.track}>
        {doubled.map((item, i) => (
          <span key={i} className={styles.item}>{item}</span>
        ))}
      </div>
    </div>
  )
}
