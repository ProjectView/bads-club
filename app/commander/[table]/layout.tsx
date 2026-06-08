import { Bebas_Neue, Space_Mono } from 'next/font/google'
import Background from '@/components/marketing/ui/Background'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
})

// Flux "kiosque" : pas de nav ni de footer, optimisé mobile pour un scan QR à table
export default function CommanderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${bebasNeue.variable} ${spaceMono.variable}`} style={{ fontFamily: 'var(--font-space-mono), monospace', minHeight: '100dvh' }}>
      <Background />
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100dvh' }}>
        {children}
      </div>
    </div>
  )
}
