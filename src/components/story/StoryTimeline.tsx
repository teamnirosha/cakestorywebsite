import React from "react";
import CakeImage from "../common/CakeImage";

export default function StoryTimeline() {
  const milestones = [
    {
      badge: "THE IDEA",
      title: "Pune Roots & Recipe Ambition",
      desc: "Identified the gap in Pune's cake market. Set out to create 100% vegetarian eggless sponge cakes with cloud-soft moisture.",
      image: "1.jpg",
      caption: "Belgian Truffle & Signature Sponge Perfection",
    },
    {
      badge: "THE CRAFT",
      title: "Obsession With Pure Ingredients",
      desc: "Eliminated synthetic chemical flavorings. Formulated recipes using Dutch cocoa, Belgian couverture chocolate, and natural fruit purees.",
      image: "AZ_01460.JPG",
      caption: "Handcrafted Visual Presentation & Tier Craft",
    },
    {
      badge: "THE STANDARD",
      title: "Central Production & Sterile SOPs",
      desc: "Built a centralized Pune kitchen facility with positive-pressure air filtration and gram-calibrated automated batch weighing.",
      image: "DSC03187.JPG",
      caption: "Pharmaceutical Cleanroom & Quality Audits",
    },
    {
      badge: "THE NETWORK",
      title: "Catchment Dominance Across Pune",
      desc: "Expanded across West Pune, East Pune, South Pune, and PCMC, establishing strong customer trust in high-footfall neighborhoods.",
      image: "DSC08617.JPG",
      caption: "Presence Across Top Pune Residential Zones",
    },
    {
      badge: "THE FUTURE",
      title: "50+ Scalable Franchise Ecosystem",
      desc: "Awading territorial franchises to motivated entrepreneurs backed by turnkey store formats and zero in-store baking complexity.",
      image: "5.png",
      caption: "Join Pune's Premier Bakery Franchise Ecosystem",
    },
  ];

  return (
    <section className="reveal-story-section py-14 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-3">
            07 • Story Journey
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#2a1d2e] font-bold break-words">
            From A Single Vision To Pune's Benchmark
          </h2>
          <p className="text-sm sm:text-base text-[#5a4a5e] mt-3 font-medium max-w-2xl mx-auto leading-relaxed">
            The strategic milestones that shaped CakeStory Desserts into a high-trust bakery platform.
          </p>
        </div>

        {/* Compact Purposeful Timeline (Zero Empty Space) */}
        <div className="relative border-l-2 border-pink-200 ml-4 md:ml-8 space-y-6 sm:space-y-8">
          {milestones.map((m, idx) => (
            <div key={m.badge} className="relative pl-6 md:pl-10 group">
              {/* Timeline Indicator Dot */}
              <div className="absolute -left-[17px] top-4 w-8 h-8 rounded-full border-4 border-white bg-pink-500 text-white font-bold text-xs flex items-center justify-center shadow-md ring-4 ring-pink-100">
                0{idx + 1}
              </div>

              <div className="glass rounded-3xl p-5 sm:p-7 bg-white/85 border border-white shadow-xs hover:shadow-xl transition-all duration-300 grid lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 space-y-2">
                  <div className="inline-block text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-pink-100 text-[#ff5c97]">
                    {m.badge}
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#2a1d2e]">
                    {m.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5a4a5e] leading-relaxed">
                    {m.desc}
                  </p>
                </div>

                <div className="lg:col-span-5 min-w-0">
                  <CakeImage
                    src={m.image}
                    alt={m.title}
                    aspect="4/3"
                    fit="contain"
                    badge={m.caption}
                    badgePosition="bottom-right"
                    className="rounded-2xl shadow-xs"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
