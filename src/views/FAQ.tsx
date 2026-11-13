import LuxuryFaqSection from "../components/faq/LuxuryFaqSection";
import { useSEO, PRIMARY_DOMAIN } from "../utils/seo";

export default function FAQ() {
  useSEO({
    title: "Frequently Asked Questions | CakeStory Desserts Franchise",
    description:
      "Got questions about CakeStory Desserts franchise investment, operations, profit margins, cold-chain delivery, and setup? Read our comprehensive FAQ.",
    canonical: `${PRIMARY_DOMAIN}/`,
    robots: "index, follow",
    ogType: "website",
  });

  return (
    <main className="w-full min-h-screen bg-[#faf6f0]">
      <LuxuryFaqSection isStandalonePage={true} />
    </main>
  );
}
