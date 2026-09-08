import { useEffect, useState } from "react";
import PageShell from "../components/layout/PageShell";
import Factory3D from "../components/three/Factory3D";
import Cake3D from "../components/three/Cake3D";
import { useFranchiseModal } from "../components/common/FranchiseModal";

const MANUFACTURING_STATIONS = [
  {
    id: 1,
    name: "1. Premium Ingredient QC",
    desc: "100% organic flour, cocoa, dairy, and natural vanilla arrive daily and undergo laboratory quality check.",
    x: 12,
    y: 70,
    icon: "🥣",
    detail: "Zero preservatives • Temperature controlled storage",
  },
  {
    id: 2,
    name: "2. Precision Mixing & Automated Baking",
    desc: "Industrial computerized planetary mixers blend batter to exact density before continuous multi-zone ovens bake sponges.",
    x: 30,
    y: 55,
    icon: "🌀",
    detail: "Uniform sponge fluffiness • Zero batch variation",
  },
  {
    id: 3,
    name: "3. Layering & Artisanal Decoration",
    desc: "Slices pass to our decoration wing where master pastry chefs apply signature frosting, chocolate work, and fruit layering.",
    x: 50,
    y: 35,
    icon: "🎨",
    detail: "Handcrafted finish • Precision temperature room",
  },
  {
    id: 4,
    name: "4. Automated Quality Control",
    desc: "Every finished cake is weighed, optically scanned for visual standards, and approved before packaging.",
    x: 70,
    y: 50,
    icon: "✅",
    detail: "Barcode tracking • Weight & visual verification",
  },
  {
    id: 5,
    name: "5. Cold Chain Logistics Hub",
    desc: "GPS-monitored refrigerated vans transport fresh cakes daily to all franchise outlets across the network.",
    x: 88,
    y: 30,
    icon: "🚚",
    detail: "Maintained at 4°C • Same-day outlet delivery",
  },
];

export default function Factory() {
  const { openModal } = useFranchiseModal();
  const [active, setActive] = useState(1);
  const current = MANUFACTURING_STATIONS[active - 1];

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a % MANUFACTURING_STATIONS.length) + 1), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <PageShell>
      <section className="px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-[#6fa8f5] text-xs font-semibold mb-3">
              🏭 MANUFACTURING PROCESS & SCALE
            </div>
            <h1 className="font-display text-4xl md:text-6xl text-[#2a1d2e] font-bold mb-3">
              How Our Cakes Are Made
            </h1>
            <p className="text-sm md:text-base text-[#5a4a5e]">
              Step inside CakeStory Desserts' automated central production facility. Discover how quality, process, consistency, and scale power our expanding franchise network.
            </p>
          </div>

          {/* 3D Visual + Interactive Station List */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass rounded-[2.5rem] p-4 relative shadow-xl bg-white/40 border border-white">
              <Factory3D height={520} />
              <div className="absolute top-6 right-6 glass-soft rounded-2xl px-3.5 py-1.5 text-xs font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Factory Simulation
              </div>
            </div>

            <div className="space-y-2.5">
              {MANUFACTURING_STATIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={`w-full text-left glass rounded-2xl p-4 transition-all duration-200 ${
                    active === s.id
                      ? "ring-2 ring-[#ff5c97] bg-white/95 scale-[1.02] shadow-lg"
                      : "bg-white/60 hover:bg-white/80"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-200 to-rose-200 flex items-center justify-center text-xl flex-shrink-0">
                      {s.icon}
                    </div>
                    <div>
                      <div className="font-display text-sm font-bold text-[#2a1d2e]">{s.name}</div>
                      <div className="text-xs text-[#5a4a5e] mt-0.5">{s.desc}</div>
                      <div className="text-[10px] text-[#ff5c97] font-semibold mt-1">✓ {s.detail}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Station Banner */}
          <div className="mt-8 glass rounded-3xl p-6 flex items-center gap-5 bg-white/80 shadow-lg border border-white">
            <div className="text-4xl p-3 rounded-2xl bg-pink-100/80">{current.icon}</div>
            <div className="flex-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#ff5c97]">Currently Viewing Process</div>
              <h3 className="font-display text-2xl text-[#2a1d2e] font-bold">{current.name}</h3>
              <p className="text-xs sm:text-sm text-[#5a4a5e] mt-1 leading-relaxed">{current.desc}</p>
            </div>
            <div className="hidden md:block">
              <button onClick={openModal} className="btn-primary text-xs !py-3 !px-5 font-semibold">
                Franchise Enquiry →
              </button>
            </div>
          </div>

          {/* 3D Masterpiece Renderings */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-xs font-semibold text-[#ff5c97] uppercase tracking-wider">Product Uniformity</div>
                <h2 className="font-display text-2xl font-bold text-[#2a1d2e]">Consistent Masterpiece Production</h2>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="glass rounded-3xl p-4 bg-white/60 shadow-md">
                  <Cake3D height={300} autoRotate={false} />
                  <div className="text-center mt-2 text-xs font-bold text-[#2a1d2e]">
                    Precision 3D Recipe Standard #{i}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
