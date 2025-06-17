import Hero from "./Hero"
import FeaturedEpisodes from "./FeaturedEpisodes"
import MeetTheHosts from "./MeetTheHosts"
import NewsUpdates from "./NewsUpdates"
import FanTestimonials from "./FanTestimonials"
import SponsorUs from "./SponsorUs"

export default function HomePage() {
  return (
    <div className="">
      <Hero />
      <FeaturedEpisodes />
      <MeetTheHosts />
      <NewsUpdates />
      <FanTestimonials />
      <SponsorUs />
    </div>
  )
}
