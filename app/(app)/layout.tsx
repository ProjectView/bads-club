import { Bebas_Neue, Space_Mono } from 'next/font/google'
import { SiteNav } from "@/components/SiteNav";
import { DemoBanner } from "@/components/demo-banner";

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

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`min-h-screen ${bebasNeue.variable} ${spaceMono.variable}`} style={{ background: 'var(--black)', color: 'var(--white)', fontFamily: 'var(--font-space-mono), monospace' }}>
      <DemoBanner />
      <SiteNav />
      <main>{children}</main>
    </div>
  );
}
