import React from "react";
import CakeImage from "../common/CakeImage";

export default function StoryIntro() {
  return (
    <section id="story-intro" className="reveal-story-section py-14 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100/80 text-[#ff5c97] text-xs font-bold uppercase tracking-wider mb-3">
            01 • The Beginning
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#2a1d2e] font-bold break-words">
            Bridging Craft, Quality & Everyday Accessibility
          </h2>
          <p className="text-sm sm:text-base text-[#5a4a5e] mt-3 font-medium max-w-2xl mx-auto leading-relaxed">
            How a simple observation in Pune sparked a commitment to redefine everyday celebration cakes.
          </p>
        </div>

        {/* Editorial Layout */}
        <div className="glass rounded-[2.5rem] p-6 sm:p-10 lg:p-12 bg-white/85 border border-white shadow-xl grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text Content Column */}
          <div className="lg:col-span-7 space-y-5 text-[#5a4a5e] leading-relaxed text-sm sm:text-base">
            <div className="inline-block text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full bg-amber-100 text-amber-900">
              The Founding Problem We Solved
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#2a1d2e] leading-snug">
              "Why Should Quality Celebration Cakes Be A Rare Luxury?"
            </h3>
            <p>
              When we audited the bakery landscape in Pune, we discovered a stark divide: customers were forced to choose between mass-market retail outlets using artificial flavor premixes, or high-end boutique patisseries charging premium rates.
            </p>
            <p>
              CakeStory Desserts was founded to eliminate that trade-off. We built a brand grounded in real dairy creams, unadulterated cocoa powders, natural fruit preserves, and 100% vegetarian eggless sponge formulations that retain cloud-like lightness.
            </p>
            <p className="font-medium text-[#2a1d2e]">
              By centralizing heavy baking prep into a sterile Pune central kitchen, we ensure every outlet delivers identical moisture, freshness, and artistic finish—at a price families feel good about.
            </p>

            {/* Key Takeaways Grid */}
            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              <div className="glass-soft p-3.5 rounded-2xl border border-white/80">
                <div className="text-xs font-bold text-[#ff5c97] mb-1">✓ Honest Ingredients</div>
                <div className="text-xs text-[#5a4a5e]">No synthetic chemical bulkers or artificial shortcuts.</div>
              </div>
              <div className="glass-soft p-3.5 rounded-2xl border border-white/80">
                <div className="text-xs font-bold text-[#ff5c97] mb-1">✓ Repeatable Delight</div>
                <div className="text-xs text-[#5a4a5e]">Baner, Kothrud & Viman Nagar taste identically pristine.</div>
              </div>
            </div>
          </div>

          {/* Visual Column */}
          <div className="lg:col-span-5 min-w-0">
            <div className="relative">
              <div className="glass rounded-3xl p-3 sm:p-4 bg-white/90 border border-white shadow-lg">
                <CakeImage
                  src="1.jpg"
                  alt="Belgian Truffle & Signature Sponge Craftsmanship"
                  aspect="3/4"
                  fit="contain"
                  hoverZoom
                  badge="Signature Belgian Truffle Craft"
                  badgePosition="top-left"
                  className="rounded-2xl"
                />
              </div>

              {/* Quote Glass Callout */}
              <div className="mt-4 glass-soft rounded-2xl p-4 border border-white/80 text-center bg-gradient-to-r from-pink-50/80 to-rose-50/80 shadow-xs">
                <p className="font-display italic text-xs sm:text-sm font-semibold text-[#2a1d2e]">
                  "Every cake carries the story of someone's milestone. We take that responsibility seriously."
                </p>
                <div className="text-[11px] font-bold text-[#ff5c97] mt-1.5 uppercase tracking-wider">
                  — CakeStory Philosophy
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
