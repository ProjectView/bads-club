import type { Metadata } from 'next'
import { Bebas_Neue, Space_Mono } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Cursor from '@/components/ui/Cursor'
import Background from '@/components/ui/Background'
import './globals.css'

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

export const metadata: Metadata = {
  title: "Bad's Club — Urban Sport & Lounge · Lyon 7e",
  description:
    "Bar sportif lyonnais depuis 1999. Badminton, squash, pétanque, simulateur baseball, bar & restaurant. 44 rue Victor Lagrange, Lyon 7e.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${bebasNeue.variable} ${spaceMono.variable}`}>
      <body>
        <Background />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Cursor />
          <Navbar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  )
}
