'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Marquee from '@/components/marketing/ui/Marquee'
import styles from './Hero.module.css'

export default function Hero() {
  const counterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      if (counterRef.current) {
        counterRef.current.style.transform = `translateY(calc(-50% + ${window.scrollY * 0.3}px))`
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className={styles.hero}>
      <div className={styles.bg}>
        <Image
          src="/Fond-Hero.jpg"
          alt="Bad's Club ambiance"
          fill
          priority
          className={styles.bgImg}
          sizes="100vw"
        />
      </div>
      <div className={styles.orb} />
      <div className={styles.grid} />
      <div ref={counterRef} className={styles.counter}>1999</div>
      <div className={styles.content}>
        <div className={styles.tag}>Lyon 7e · Ouvert 7j/7</div>
        <h1 className={styles.title}>
          <span className={styles.line}>SPORT.</span>
          <span className={styles.line}><span className={styles.gold}>BIÈRE.</span></span>
          <span className={styles.line}><span className={styles.yellow}>LYON.</span></span>
        </h1>
        <div className={styles.meta}>
          <span>1500m² de terrain</span>
          <span>Bar &amp; Restaurant</span>
          <span>Depuis 1999</span>
        </div>
      </div>
      <div className={styles.scrollCue}>
        <span>Scroll</span>
        <div className={styles.scrollLine} />
      </div>
      <div className={styles.marqueeWrap}>
        <Marquee />
      </div>
    </section>
  )
}
