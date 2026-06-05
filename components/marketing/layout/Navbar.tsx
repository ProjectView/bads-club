import Link from 'next/link'
import Image from 'next/image'
import styles from './Navbar.module.css'

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        <Image
          src="/logo-bads.png"
          alt="Bad's Club"
          height={40}
          width={43}
          className={styles.logoImg}
          priority
        />
        <span className={styles.logoText}>
          Bad&apos;s <span className={styles.logoSub}>Urban Sport &amp; Lounge</span>
        </span>
      </Link>
      <ul className={styles.links}>
        <li><Link href="/sport">Sport</Link></li>
        <li><Link href="/bar">Bar</Link></li>
        <li><Link href="/evenements">Événements</Link></li>
        <li><Link href="/tarifs">Tarifs</Link></li>
      </ul>
      <div className={styles.actions}>
        <Link href="/bar#menu" className={styles.ctaSecondary}>Commander</Link>
        <Link href="/tarifs" className={styles.cta}>Réserver</Link>
      </div>
    </nav>
  )
}
