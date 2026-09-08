import React from "react";
import CakeImage from "../common/CakeImage";

export default function QualitySection() {
  return (
    <section className="reveal-story-section py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50/50 via-pink-50/20 to-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            04 • Quality & Hygiene Discipline
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#2a1d2e] font-bold break-words">
            Consistency You Can Taste. Care At Every Step.
          </h2>
          <p className="text-sm sm:text-base text-[#5a4a5e] mt-3 font-medium max-w-2xl mx-auto leading-relaxed">
            Protecting customer trust and brand reputation through pharmaceutical-grade cleanroom protocols and strict central kitchen SOPs.
          </p>
        </div>

        {/* 3 Core Pillar Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: "🛡️",
              title: "Sterile Cleanroom Hygiene",
              subtitle: "Care At Every Step",
              desc: "Positive-pressure air filtration, touchless packaging lines, UV sanitation chambers, and mandatory protective gear across all production floors.",
              tag: "Hygiene Discipline",
            },
            {
              icon: "🎯",
              title: "Gram-Level Batch Consistency",
              subtitle: "Consistency You Can Taste",
              desc: "By weighing raw ingredients down to grams and adhering to automated oven heat curves, every outlet in Pune serves identical flavor and moisture.",
              tag: "Recipe Standardisation",
            },
            {
              icon: "🧊",
              title: "Cold-Chain Logistics",
              subtitle: "Freshness Guaranteed",
              desc: "Refrigerated daily transit vans ensure products reach Baner, Kothrud, Viman Nagar, and PCMC outlets at optimal serving temperatures.",
              tag: "Logistics Excellence",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="glass rounded-3xl p-6 sm:p-7 bg-white/85 border border-white shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 via-teal-50 to-pink-100 border border-white flex items-center justify-center text-2xl shadow-2xs group-hover:scale-110 transition-transform">
                    {card.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {card.tag}
                  </span>
                </div>
                <div className="text-xs font-bold text-[#ff5c97] uppercase tracking-wider mb-1">
                  {card.subtitle}
                </div>
                <h3 className="font-display text-xl font-bold text-[#2a1d2e] mb-2 group-hover:text-emerald-700 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5a4a5e] leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* High-Trust Narrative Box */}
        <div className="glass rounded-[2.5rem] p-6 sm:p-10 bg-white/90 border border-white shadow-xl grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-block text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
              Operational Trust Architecture
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#2a1d2e]">
              Safeguarding Celebrations & Partner Capital
            </h3>
            <p className="text-xs sm:text-sm text-[#5a4a5e] leading-relaxed">
              When a family orders a cake for a milestone birthday or an anniversary, there is zero tolerance for compromised hygiene or dry sponge.
            </p>
            <p className="text-xs sm:text-sm text-[#5a4a5e] leading-relaxed">
              By removing raw in-store baking complexity and enforcing central kitchen discipline, CakeStory protects both the consumer's celebration and the franchise partner's investment.
            </p>

            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              {[
                "100% Food-grade stainless steel surfaces",
                "Daily bacterial swab quality testing",
                "Tamper-evident protective packaging",
                "100% Vegetarian & eggless segregation",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 glass-soft p-3 rounded-xl border border-white/80 text-xs font-semibold text-[#2a1d2e]">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                    ✓
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 min-w-0">
            <CakeImage
              src="DSC03187.JPG"
              alt="CakeStory Desserts Mirror Glaze Cleanroom Finish"
              aspect="4/3"
              fit="contain"
              priority
              badge="Sterile Central Kitchen Standard"
              badgePosition="bottom-right"
              className="rounded-3xl shadow-lg border border-white"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
