import React from "react";

export default function StoryVision() {
  return (
    <section className="reveal-story-section py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-purple-50/20 to-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-[2.5rem] p-6 sm:p-12 bg-white/85 border border-white shadow-xl text-center">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider mb-4">
            10 • Vision For The Future
          </div>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#2a1d2e] font-bold max-w-3xl mx-auto break-words">
            Building The Next Chapter Together
          </h2>

          <p className="text-sm sm:text-base text-[#5a4a5e] mt-4 font-medium max-w-2xl mx-auto leading-relaxed">
            Our vision is to become Western Maharashtra's undisputed neighborhood bakery benchmark—growing an integrated network of 50+ high-performing franchise outlets.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {[
              {
                num: "50+",
                title: "Planned Territorial Outlets",
                desc: "High-density retail catchments across Pune & regional gateways.",
              },
              {
                num: "100%",
                title: "Vegetarian Integrity",
                desc: "Continued leadership in proprietary eggless sponge formulations.",
              },
              {
                num: "Daily",
                title: "Cold-Chain Supply",
                desc: "Guaranteed fresh product dispatch from central kitchens.",
              },
              {
                num: "Turnkey",
                title: "Franchise Store SOPs",
                desc: "Zero in-store baking complexity for local store owners.",
              },
            ].map((v) => (
              <div
                key={v.title}
                className="glass-soft rounded-2xl p-5 border border-white/80 text-center hover:bg-white transition-all shadow-2xs"
              >
                <div className="font-display text-3xl font-bold text-[#ff5c97] mb-1">
                  {v.num}
                </div>
                <div className="font-display text-base font-bold text-[#2a1d2e] mb-1">
                  {v.title}
                </div>
                <p className="text-xs text-[#5a4a5e] leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
