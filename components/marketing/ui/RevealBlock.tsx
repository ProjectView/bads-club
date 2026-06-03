'use client'

import { useEffect, useRef, ReactNode } from 'react'
import styles from './RevealBlock.module.css'

interface Props {
  children: ReactNode
  delay?: number
  className?: string
}

export default function RevealBlock({ children, delay = 0, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let revealed = false

    const reveal = () => {
      if (revealed) return
      revealed = true
      el.style.transitionDelay = `${delay}s`
      el.classList.add(styles.visible)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal()
          observer.unobserve(el)
        }
      },
      { threshold: 0, rootMargin: '0px 0px 100px 0px' }
    )
    observer.observe(el)

    // iOS Safari fallback: force visible if observer doesn't fire within 600ms
    const fallback = setTimeout(reveal, 600)

    return () => {
      observer.disconnect()
      clearTimeout(fallback)
    }
  }, [delay])

  return (
    <div ref={ref} className={`${styles.reveal} ${className}`}>
      {children}
    </div>
  )
}
