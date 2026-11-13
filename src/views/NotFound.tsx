import { Link } from "react-router-dom";
import PageShell from "../components/layout/PageShell";
import FloatingCake from "../components/three/FloatingCake";
import { useSEO } from "../utils/seo";

export default function NotFound() {
  useSEO({
    title: "404 - Page Not Found | CakeStory Desserts",
    description: "The requested page could not be found on CakeStory Desserts.",
    robots: "noindex, follow",
  });

  return (
    <PageShell>
      <div className="max-w-md mx-auto text-center pt-20">
        <div className="w-56 h-56 mx-auto">
          <FloatingCake height={240} />
        </div>
        <h1 className="font-display text-6xl gradient-text mt-4">404</h1>
        <h2 className="font-display text-2xl text-[#2a1d2e] mt-2">Page not found</h2>
        <p className="text-sm text-[#5a4a5e] mt-2">Looks like this cake got lost in the oven.</p>
        <Link to="/" className="btn-primary mt-6">Take me home →</Link>
      </div>
    </PageShell>
  );
}
