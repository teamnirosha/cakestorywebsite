import { Link } from "react-router-dom";
import PageShell from "../components/layout/PageShell";
import FloatingCake from "../components/three/FloatingCake";

export default function NotFound() {
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
