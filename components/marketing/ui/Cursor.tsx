'use client'

import { useEffect, useRef } from 'react'
import styles from './Cursor.module.css'

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const cursor = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches
    if (isTouchDevice) return

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px'
        dotRef.current.style.top = e.clientY + 'px'
      }
    }

    document.addEventListener('mousemove', onMouseMove)

    const interactables = document.querySelectorAll('a, button, [data-cursor-expand]')
    const expand = () => cursorRef.current?.classList.add(styles.expand)
    const shrink = () => cursorRef.current?.classList.remove(styles.expand)
    interactables.forEach(el => {
      el.addEventListener('mouseenter', expand)
      el.addEventListener('mouseleave', shrink)
    })

    let raf: number
    const animate = () => {
      cursor.current.x += (mouse.current.x - cursor.current.x) * 0.12
      cursor.current.y += (mouse.current.y - cursor.current.y) * 0.12
      if (cursorRef.current) {
        cursorRef.current.style.left = cursor.current.x + 'px'
        cursorRef.current.style.top = cursor.current.y + 'px'
      }
      raf = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={cursorRef} className={styles.cursor} />
      <div ref={dotRef} className={styles.dot} />
    </>
  )
}
