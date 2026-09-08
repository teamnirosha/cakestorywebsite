import React from "react";
import { useFranchiseModal } from "../common/FranchiseModal";

export default function BakeryToBusiness() {
  const { openModal } = useFranchiseModal();

  const flow = [
    { step: "01", label: "CRAFT", desc: "Artisanal 100% Eggless Formulations" },
    { step: "02", label: "QUALITY", desc: "Pharmaceutical Cleanroom SOPs" },
    { step: "03", label: "CONSISTENCY", desc: "Gram-Weighed Central Batching" },
    { step: "04", label: "SYSTEM", desc: "Turnkey Store With Zero In-Store Baking" },
    { step: "05", label: "GROWTH", desc: "Territorial Pune Expansion Network" },
  ];

  return (
    <section className="reveal-story-section py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-pink-50/30 via-rose-100/20 to-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-[2.5rem] p-6 sm:p-12 bg-white/90 border border-white shadow-xl">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3">
              08 • The Strategic Bridge
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#2a1d2e] font-bold break-words">
              From Bakery Craft to Repeatable Business System
            </h2>
            <p className="text-sm sm:text-base text-[#5a4a5e] mt-3 font-medium max-w-2xl mx-auto leading-relaxed">
              A great bakery brand is not just about making beautiful cakes—it is about designing a reliable, high-trust system that empowers local entrepreneurs.
            </p>
          </div>

          {/* Connected System Progression */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
            {flow.map((f, idx) => (
              <div
                key={f.step}
                className="glass-soft rounded-2xl p-4 text-center border border-white/80 flex flex-col justify-between hover:bg-white transition-all shadow-2xs group"
              >
                <div>
                  <div className="text-[10px] font-bold text-[#ff5c97] uppercase tracking-wider mb-1">
                    Step {f.step}
                  </div>
                  <div className="font-display text-lg font-bold text-[#2a1d2e] mb-1 group-hover:text-[#ff5c97] transition-colors">
                    {f.label}
                  </div>
                  <p className="text-xs text-[#5a4a5e] leading-relaxed">
                    {f.desc}
                  </p>
                </div>
                {idx < 4 && (
                  <div className="hidden lg:block text-pink-300 font-bold text-sm mt-3">
                    ↓
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Narrative Grid */}
          <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-slate-200/60 items-center">
            <div className="space-y-3">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#2a1d2e]">
                Why Franchise Partners Choose CakeStory
              </h3>
              <p className="text-xs sm:text-sm text-[#5a4a5e] leading-relaxed">
                By taking care of 100% of the baking complexity, central supply chain logistics, and daily cold-chain delivery, CakeStory allows franchise owners to focus purely on store hospitality, customer relations, and local neighborhood growth.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                onClick={openModal}
                className="btn-primary glass-shine w-full sm:w-auto !py-3.5 !px-8 text-sm font-bold shadow-lg shadow-pink-300/40"
              >
                Explore Franchise Ecosystem →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
