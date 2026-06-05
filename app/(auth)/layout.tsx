import { Bebas_Neue, Space_Mono } from 'next/font/google'

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

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${bebasNeue.variable} ${spaceMono.variable}`}>
      {children}
    </div>
  )
}
