import { useParams, Link } from "react-router-dom";
import PageShell from "../components/layout/PageShell";
import Cake3D from "../components/three/Cake3D";
import { cakeService } from "../services/data";
import { useFranchiseModal } from "../components/common/FranchiseModal";
import CakeImage from "../components/common/CakeImage";

export default function CakeDetail() {
  const { id } = useParams();
  const { openModal } = useFranchiseModal();
  const cake = id ? cakeService.get(id) : undefined;

  if (!cake) {
    return (
      <PageShell>
        <div className="max-w-md mx-auto glass rounded-3xl p-10 text-center my-12">
          <div className="text-5xl mb-3">🎂</div>
          <h2 className="font-display text-2xl text-[#2a1d2e] mb-2 font-bold">Creation Not Found</h2>
          <p className="text-xs text-[#5a4a5e] mb-6">The requested cake creation details could not be loaded.</p>
          <Link to="/cakes" className="btn-primary">View All Creations</Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="px-6">
        <div className="max-w-6xl mx-auto">
          <Link to="/cakes" className="text-xs font-semibold text-[#ff5c97] hover:underline mb-6 inline-block">
            ← Back to Signature Creations Catalog
          </Link>

          <div className="glass rounded-[2.5rem] p-6 lg:p-8 shadow-2xl bg-white/80 border border-white">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Image / 3D Canvas */}
              <div className="space-y-4">
                <CakeImage
                  src={cake.image}
                  alt={cake.name}
                  aspect="square"
                  fit="contain"
                  priority={true}
                  className="rounded-3xl shadow-lg border border-slate-100"
                />
                <div className="glass-soft rounded-2xl p-3 text-center">
                  <div className="text-xs font-semibold text-[#2a1d2e]">3D Design Preview Available</div>
                  <div className="text-[10px] text-[#5a4a5e]">Interactive 3D model renderings in production factory</div>
                </div>
              </div>

              {/* Information */}
              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-pink-100 text-[#ff5c97] uppercase">
                      {cake.category}
                    </span>
                    <span className="text-xs text-amber-500 font-bold">★ {cake.rating} / 5 Rating</span>
                  </div>
                  <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#2a1d2e]">
                    {cake.name}
                  </h1>
                  <div className="text-xs text-[#5a4a5e] mt-1 font-semibold">Flavor Profile: {cake.flavor}</div>
                </div>

                <p className="text-sm text-[#5a4a5e] leading-relaxed">
                  {cake.description}
                </p>

                {/* Craftsmanship & Ingredients */}
                <div className="glass-soft rounded-2xl p-4 space-y-3">
                  <div className="text-xs font-bold text-[#2a1d2e] uppercase tracking-wider">Key Ingredients</div>
                  <div className="flex flex-wrap gap-1.5">
                    {cake.ingredients.map((ing) => (
                      <span key={ing} className="chip text-[11px] font-medium">{ing}</span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="glass-soft rounded-2xl p-3">
                    <div className="font-semibold text-[#5a4a5e]">Available Sizes</div>
                    <div className="font-bold text-[#2a1d2e] text-sm mt-0.5">{cake.size}</div>
                  </div>
                  <div className="glass-soft rounded-2xl p-3">
                    <div className="font-semibold text-[#5a4a5e]">Production Facility</div>
                    <div className="font-bold text-[#2a1d2e] text-sm mt-0.5">Central Kitchen</div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="pt-3 flex flex-wrap gap-3">
                  <Link to="/outlets" className="btn-primary text-xs !py-3 !px-6 font-bold shadow-md">
                    Find Outlets Serving This Creation 📍
                  </Link>
                  <button onClick={openModal} className="btn-ghost text-xs !py-3 !px-6 font-semibold">
                    Enquire for Franchise Franchise Opportunity
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3D Visual Section */}
          <div className="mt-12 glass rounded-3xl p-6 text-center">
            <h3 className="font-display text-xl font-bold text-[#2a1d2e] mb-2">3D Structural Assembly</h3>
            <p className="text-xs text-[#5a4a5e] mb-4">Centralized recipe standard produced with high-precision temperature control.</p>
            <div className="max-w-md mx-auto">
              <Cake3D height={280} />
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
