import React from "react";
import CakeImage from "../common/CakeImage";

export default function HumanTouch() {
  return (
    <section className="reveal-story-section py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-rose-50/20 to-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-[2.5rem] p-6 sm:p-10 lg:p-12 bg-white/85 border border-white shadow-xl grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Visual Column */}
          <div className="lg:col-span-5 min-w-0 order-2 lg:order-1">
            <CakeImage
              src="5.png"
              alt="CakeStory Desserts Craftsmanship & Human Touch"
              aspect="3/4"
              fit="contain"
              priority
              badge="Human Dedication Behind Every Layer"
              badgePosition="bottom-left"
              className="rounded-3xl shadow-lg border border-white"
            />
          </div>

          {/* Editorial Content */}
          <div className="lg:col-span-7 space-y-5 order-1 lg:order-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100 text-[#ff5c97] text-xs font-bold uppercase tracking-wider">
              06 • Human Craftsmanship
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2a1d2e] leading-snug">
              Behind Technology & SOPs Are Skilled Hands That Care
            </h2>

            <p className="text-sm sm:text-base text-[#5a4a5e] leading-relaxed">
              While CakeStory relies on automated weighing and temperature sensors to guarantee batch consistency, the soul of our baking remains strictly human.
            </p>

            <p className="text-sm sm:text-base text-[#5a4a5e] leading-relaxed">
              From our head pastry chefs fine-tuning sponge elasticity to counter stewards in Baner or Kothrud welcoming families with warm hospitality, every team member takes personal ownership of your celebration.
            </p>

            {/* Human Journey Flow */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              {[
                { step: "01", label: "Master Bakers", sub: "Recipe Integrity" },
                { step: "02", label: "Piping Artists", sub: "Intricate Piping" },
                { step: "03", label: "Cold Chain Crew", sub: "Pristine Transit" },
                { step: "04", label: "Store Stewards", sub: "Warm Service" },
              ].map((h) => (
                <div key={h.step} className="glass-soft p-3 rounded-2xl border border-white/80 text-center">
                  <div className="text-[10px] font-bold text-[#ff5c97] uppercase tracking-wider">
                    {h.step}
                  </div>
                  <div className="font-display text-xs font-bold text-[#2a1d2e] mt-0.5">
                    {h.label}
                  </div>
                  <div className="text-[10px] text-[#5a4a5e]">
                    {h.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
