import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageShell from "../components/layout/PageShell";
import { cakeService, categoryService } from "../services/data";
import { useFranchiseModal } from "../components/common/FranchiseModal";
import CakeImage from "../components/common/CakeImage";

export default function Cakes() {
  const { openModal } = useFranchiseModal();
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const categories = categoryService.list();

  const cakes = useMemo(() => {
    let list = activeCategory === "all" ? cakeService.list() : cakeService.byCategory(activeCategory);
    if (query.trim()) list = cakeService.search(query);
    return list;
  }, [activeCategory, query]);

  return (
    <PageShell>
      <section className="px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100 text-[#ff5c97] text-xs font-semibold mb-3">
              ✨ BRAND CATALOG & CREATIONS
            </div>
            <h1 className="font-display text-4xl md:text-6xl text-[#2a1d2e] font-bold mb-3">
              Signature Cake Creations
            </h1>
            <p className="text-sm text-[#5a4a5e]">
              A showcase of recipe innovation, artisan decoration techniques, and central production standards.
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search creations, flavors, ingredients..."
                className="input-field pl-11"
              />
            </div>
            <button onClick={openModal} className="btn-primary text-xs whitespace-nowrap">
              Enquire for Franchise Menu +
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-8">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setActiveCategory(c.id);
                  setQuery("");
                }}
                className={`chip whitespace-nowrap ${activeCategory === c.id ? "chip-active" : ""}`}
              >
                <span>{c.icon}</span> {c.name}
              </button>
            ))}
          </div>

          {/* Cards Showcase Grid */}
          {cakes.length === 0 ? (
            <div className="glass rounded-3xl p-12 text-center max-w-md mx-auto">
              <div className="text-5xl mb-3">🔍</div>
              <h3 className="font-display text-xl text-[#2a1d2e] mb-1 font-bold">No creations found</h3>
              <p className="text-xs text-[#5a4a5e]">Try adjusting your search query or category filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {cakes.map((c) => (
                <div key={c.id} className="glass rounded-3xl p-3.5 hover:shadow-xl transition group relative bg-white/70">
                  <Link to={`/cakes/${c.id}`} className="block">
                    <CakeImage
                      src={c.image}
                      alt={c.name}
                      aspect="square"
                      fit="contain"
                      hoverZoom
                      className="rounded-2xl mb-3 border border-slate-100/80 shadow-xs"
                    />
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-amber-400 text-xs">★</span>
                      <span className="text-xs text-[#5a4a5e] font-semibold">{c.rating}</span>
                      <span className="text-[10px] text-[#5a4a5e] ml-auto bg-pink-50 px-2 py-0.5 rounded-full font-medium">
                        {c.category}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-[#2a1d2e] text-base truncate">{c.name}</h3>
                    <p className="text-xs text-[#5a4a5e] mt-0.5 line-clamp-1">{c.flavor}</p>

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
                      <span className="text-[11px] font-semibold text-[#ff5c97]">Recipe Standard</span>
                      <span className="text-[10px] btn-ghost !py-1 !px-3 font-semibold">View Creation →</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
