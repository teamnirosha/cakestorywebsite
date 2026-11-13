import PageShell from "../components/layout/PageShell";
import StorefrontHero from "../components/home/StorefrontHero";
import BrandStorySection from "../components/home/BrandStorySection";
import NumbersSection from "../components/home/NumbersSection";
import WhyCakeStorySection from "../components/home/WhyCakeStorySection";
import FranchiseModelSection from "../components/home/FranchiseModelSection";
import InstagramGallerySection from "../components/home/InstagramGallerySection";
import OutletsMapSection from "../components/home/OutletsMapSection";
import FranchiseFaqSection from "../components/home/FranchiseFaqSection";
import FranchiseLeadSection from "../components/home/FranchiseLeadSection";
import { useSEO, PRIMARY_DOMAIN } from "../utils/seo";

export default function Home() {
  useSEO(
    {
      title: "CakeStory Desserts | Franchise Opportunity in Pune",
      description:
        "CakeStory Desserts is a growing Pune bakery brand offering scalable franchise opportunities. Centralized production, standard hygiene, and turnkey operational support.",
      canonical: `${PRIMARY_DOMAIN}/`,
      robots: "index, follow",
      ogType: "website",
      jsonLdId: "cakestory-org-schema",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "Bakery",
        name: "CakeStory Desserts",
        url: `${PRIMARY_DOMAIN}/`,
        logo: `${PRIMARY_DOMAIN}/assets/logo/cs-final-logo.png`,
        image: `${PRIMARY_DOMAIN}/assets/logo/cs-final-logo.png`,
        telephone: "+919881914444",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Saswad, Pune",
          addressRegion: "Maharashtra",
          postalCode: "412301",
          addressCountry: "IN",
        },
        servesCuisine: "Pure Vegetarian Bakery, Cakes, Pastries, Desserts",
        priceRange: "₹₹",
      },
    },
    []
  );

  return (
    <PageShell noTopPadding>
      {/* 1. Storefront Hero with 3D render & high-converting low-clutter copy */}
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
