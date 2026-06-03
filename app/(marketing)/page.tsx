import Hero from '@/components/marketing/Hero'
import AmbianceSection from '@/components/marketing/AmbianceSection'
import HorizontalScroll from '@/components/marketing/HorizontalScroll'
import BarSection from '@/components/marketing/BarSection'
import EventsSection from '@/components/marketing/EventsSection'
import BookingCTA from '@/components/marketing/BookingCTA'
import PartnersSection from '@/components/marketing/PartnersSection'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <AmbianceSection />
      <HorizontalScroll />
      <BarSection />
      <EventsSection />
      <PartnersSection />
      <BookingCTA />
    </main>
  )
}
