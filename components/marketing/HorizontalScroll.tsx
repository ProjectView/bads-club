import styles from './HorizontalScroll.module.css'

const REVIEWS = [
  {
    text: "Meilleur afterwork de Lyon. Les terrains de badminton sont au top et le bar derrière c'est magique.",
    author: 'Thomas R.',
    stars: 5,
  },
  {
    text: "On a fait notre EVG ici — simulateur de baseball + bières + bonne bouffe. Parfait de A à Z.",
    author: 'Julien M.',
    stars: 5,
  },
  {
    text: "Ambiance incroyable, staff au top. Le brunch du dimanche vaut vraiment le détour.",
    author: 'Marie-Claire B.',
    stars: 5,
  },
  {
    text: "Unique à Lyon ce concept. Sport, bar, restau dans un même lieu de 1500m². On y revient chaque semaine.",
    author: 'Antoine D.',
    stars: 5,
  },
  {
    text: "Le simulateur de baseball c'est une folie. Expérience qu'on trouve nulle part ailleurs en région.",
    author: 'Samir K.',
    stars: 5,
  },
  {
    text: "Terrains de squash en excellent état, accueil chaleureux. Le bar après le match c'est la cerise sur le gâteau.",
    author: 'Camille P.',
    stars: 5,
  },
  {
    text: "Séminaire d'équipe organisé ici — activités variées, repas délicieux, tout le monde est reparti ravi.",
    author: 'Nathalie G.',
    stars: 5,
  },
  {
    text: "La pétanque couverte c'est une idée de génie. Même sous la pluie on profite, avec un verre à la main.",
    author: 'Pierre-Luc F.',
    stars: 5,
  },
]

export default function HorizontalScroll() {
  const doubled = [...REVIEWS, ...REVIEWS]

  return (
    <div className={styles.section}>
      <div className={styles.track}>
        {doubled.map((review, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.stars}>
              {'★★★★★'.split('').map((s, j) => (
                <span key={j} className={j < review.stars ? styles.starFilled : styles.starEmpty}>{s}</span>
              ))}
            </div>
            <p className={styles.text}>&ldquo;{review.text}&rdquo;</p>
            <span className={styles.author}>— {review.author}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
