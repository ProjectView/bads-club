import { Bebas_Neue, Space_Mono } from 'next/font/google'
import { SiteNav } from '@/components/SiteNav'
import Footer from '@/components/marketing/layout/Footer'
import Cursor from '@/components/marketing/ui/Cursor'
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

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${bebasNeue.variable} ${spaceMono.variable}`} style={{ fontFamily: 'var(--font-space-mono), monospace' }}>
      <Background />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Cursor />
        <SiteNav />
        {children}
        <Footer />
      </div>
    </div>
  )
}
