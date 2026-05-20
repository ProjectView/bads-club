import Hero from '@/components/sections/Hero'
import AmbianceSection from '@/components/sections/AmbianceSection'
import HorizontalScroll from '@/components/sections/HorizontalScroll'
import BarSection from '@/components/sections/BarSection'
import EventsSection from '@/components/sections/EventsSection'
import BookingCTA from '@/components/sections/BookingCTA'
import PartnersSection from '@/components/sections/PartnersSection'

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
