import PageShell from "../components/layout/PageShell";
import Preloader from "../components/common/Preloader";
import StorefrontHero from "../components/home/StorefrontHero";
import BrandStorySection from "../components/home/BrandStorySection";
import NumbersSection from "../components/home/NumbersSection";
import WhyCakeStorySection from "../components/home/WhyCakeStorySection";
import FranchiseModelSection from "../components/home/FranchiseModelSection";
import InstagramGallerySection from "../components/home/InstagramGallerySection";
import OutletsMapSection from "../components/home/OutletsMapSection";
import FranchiseFaqSection from "../components/home/FranchiseFaqSection";
import FranchiseLeadSection from "../components/home/FranchiseLeadSection";

export default function Home() {
  return (
    <PageShell noTopPadding>
      {/* 1. Animated Preloader inspired by reference screenshot */}
      <Preloader />

      {/* 2. Storefront Hero with 3D render & high-converting low-clutter copy */}
      <StorefrontHero />

      {/* 3. The Story: Timeline Milestones + Founder Leadership Card */}
      <BrandStorySection />

      {/* 4. Numbers Speak Volumes: 4 Stat Cards + Red Trust Banner */}
      <NumbersSection />

      {/* 5. Why CakeStory: More Than Just Cakes (Product Showcase & Brand Values) */}
      <WhyCakeStorySection />

      {/* 6. Franchise Business Model: Zero Baking, Compact Store & 4 Steps */}
      <FranchiseModelSection />

      {/* 6. Instagram Reel Gallery: Perspective 3D Carousel & Highlights */}
      <InstagramGallerySection />

      {/* 7. Outlets Discovery: Zone Filters, Leaflet Map, Outlet Directory List */}
      <OutletsMapSection />

      {/* 7. Franchise FAQs: Accordion answers */}
      <FranchiseFaqSection />

      {/* 8. On-Page Fast Franchise Application */}
      <FranchiseLeadSection />
    </PageShell>
  );
}
