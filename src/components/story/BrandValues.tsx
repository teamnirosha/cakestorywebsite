import React, { useState } from "react";

export default function BrandValues() {
  const [activeValue, setActiveValue] = useState(0);

  const values = [
    {
      id: "craftsmanship",
      title: "CRAFTSMANSHIP",
      icon: "✨",
      color: "from-pink-500 to-rose-400",
      desc: "Respecting traditional patisserie piping, mirror glaze finishes, and delicate sponge aeration.",
      quote: "Handcrafted detail in every celebration cake.",
    },
    {
      id: "quality",
      title: "QUALITY",
      icon: "🏆",
      color: "from-purple-500 to-indigo-400",
      desc: "Zero artificial chemical bulkers. Real Dutch cocoa, couverture chocolate, and pure fruit purees.",
      quote: "Honest raw materials create uncompromised taste.",
    },
    {
      id: "consistency",
      title: "CONSISTENCY",
      icon: "🎯",
      color: "from-blue-500 to-cyan-400",
      desc: "Gram-weighed batch prep ensuring Baner, Kothrud, Viman Nagar, and PCMC outlets taste identically soft.",
      quote: "Documented baking discipline across all locations.",
    },
    {
      id: "hygiene",
      title: "HYGIENE",
      icon: "🛡️",
      color: "from-emerald-500 to-[#ff5c97]",
      desc: "Pharmaceutical-grade positive-pressure cleanroom, UV sterilization, and touchless packing.",
      quote: "Sterile protocols protecting customer health.",
    },
    {
      id: "creativity",
      title: "CREATIVITY",
      icon: "💡",
      color: "from-amber-500 to-pink-500",
      desc: "Continuous R&D in eggless sponge elasticity, festive flavor releases, and signature celebration tiers.",
      quote: "Delightful innovation for every season.",
    },
    {
      id: "trust",
      title: "CUSTOMER TRUST",
      icon: "🤝",
      color: "from-rose-500 to-[#548bf0]",
      desc: "Earning repeat patronage for family birthdays, work achievements, and community milestones.",
      quote: "Trust is won slice by slice.",
    },
  ];

  const current = values[activeValue];

  return (
    <section className="reveal-story-section py-14 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider mb-3">
            05 • Brand Core Values
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#2a1d2e] font-bold break-words">
            The Principles That Guide CakeStory
          </h2>
          <p className="text-sm sm:text-base text-[#5a4a5e] mt-3 font-medium max-w-2xl mx-auto leading-relaxed">
            Our brand values are not decorative posters on a wall—they govern daily operations from central baking to retail customer service.
          </p>
        </div>

        {/* Connected Visual Node System */}
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Circular / Floating Interactive Nodes (Left 7 Cols) */}
          <div className="lg:col-span-7 relative min-h-[340px] sm:min-h-[400px] flex items-center justify-center p-4">
            {/* Background SVG Connected Paths */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-30"
              viewBox="0 0 500 400"
              fill="none"
              stroke="#ff8fb1"
              strokeWidth="2"
              strokeDasharray="6 6"
            >
              <line x1="250" y1="200" x2="100" y2="80" />
              <line x1="250" y1="200" x2="400" y2="80" />
              <line x1="250" y1="200" x2="80" y2="240" />
              <line x1="250" y1="200" x2="420" y2="240" />
              <line x1="250" y1="200" x2="150" y2="350" />
              <line x1="250" y1="200" x2="350" y2="350" />
              <circle cx="250" cy="200" r="45" fill="#fff" stroke="#ff5c97" strokeWidth="3" />
            </svg>

            {/* Central Node Badge */}
            <div className="relative z-10 w-28 h-28 rounded-full glass p-2 shadow-xl flex flex-col items-center justify-center text-center border-2 border-pink-400 bg-white/95">
              <span className="text-2xl">🍰</span>
              <span className="font-display text-[10px] font-bold uppercase tracking-wider text-[#2a1d2e] mt-1">
                CakeStory Mindset
              </span>
            </div>

            {/* 6 Peripheral Interactive Floating Value Nodes */}
            <div className="absolute inset-0 grid grid-cols-2 sm:grid-cols-3 gap-3 p-2 sm:p-4 content-between items-center z-20 pointer-events-auto">
              {values.map((v, idx) => {
                const isActive = activeValue === idx;
                return (
                  <button
                    key={v.id}
                    onClick={() => setActiveValue(idx)}
                    onMouseEnter={() => setActiveValue(idx)}
                    className={`glass rounded-2xl p-3 text-left transition-all duration-300 transform ${
                      isActive
                        ? "scale-105 bg-white border-pink-400 shadow-xl ring-4 ring-pink-100/80"
                        : "bg-white/75 border-white hover:bg-white hover:scale-102 shadow-2xs"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{v.icon}</span>
                      <span className="font-display text-xs font-bold text-[#2a1d2e] truncate">
                        {v.title}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#5a4a5e] line-clamp-1">
                      {v.quote}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Value Deep-Dive Stage (Right 5 Cols) */}
          <div className="lg:col-span-5 min-w-0">
            <div className="glass rounded-[2.5rem] p-6 sm:p-8 bg-white/90 border border-white shadow-xl space-y-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-3xl">{current.icon}</span>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-pink-100 text-[#ff5c97]">
                  Value 0{activeValue + 1} of 06
                </span>
              </div>

              <h3 className="font-display text-2xl font-bold text-[#2a1d2e]">
                {current.title}
              </h3>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-200/60">
                <p className="font-display italic text-sm font-semibold text-[#2a1d2e]">
                  "{current.quote}"
                </p>
              </div>

              <p className="text-xs sm:text-sm text-[#5a4a5e] leading-relaxed">
                {current.desc}
              </p>

              <div className="pt-2 flex justify-between items-center">
                <button
                  disabled={activeValue === 0}
                  onClick={() => setActiveValue((prev) => Math.max(0, prev - 1))}
                  className="btn-ghost !py-2 !px-4 text-xs font-bold disabled:opacity-40"
                >
                  ← Prev
                </button>
                <button
                  disabled={activeValue === values.length - 1}
                  onClick={() => setActiveValue((prev) => Math.min(values.length - 1, prev + 1))}
                  className="btn-primary !py-2 !px-4 text-xs font-bold disabled:opacity-40"
                >
                  Next Value →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
