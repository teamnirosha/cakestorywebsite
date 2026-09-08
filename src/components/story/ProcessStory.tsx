import React, { useState, useEffect } from "react";
import CakeImage from "../common/CakeImage";

export default function ProcessStory() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: "01",
      title: "Raw Ingredient Sourcing",
      badge: "Pure Inputs",
      desc: "Certified Dutch cocoa, pure dairy butter, fresh whipped cream, and Grade-A Alphonso fruit purees arrive daily at our central kitchen.",
      image: "1.jpg",
      icon: "🌾",
      detail: "Zero synthetic bulkers or low-grade palm oils used.",
    },
    {
      num: "02",
      title: "Gram-Weighed Batch Prep",
      badge: "Zero Guesswork",
      desc: "Every dry ingredient and liquid puree is weighed to exact gram precision, ensuring identical sponge density in every bake.",
      image: "DSC08534.JPG",
      icon: "⚖️",
      detail: "Automated digital scale calibration across all shifts.",
    },
    {
      num: "03",
      title: "Master Sponge Formulation",
      badge: "Eggless Mastery",
      desc: "Sponge batches undergo gentle aeration and temperature-controlled baking to maintain cloud-soft elasticity without egg reliance.",
      image: "5.png",
      icon: "🔥",
      detail: "Controlled oven temperature curves prevent dry edges.",
    },
    {
      num: "04",
      title: "Artisanal Glaze & Decoration",
      badge: "Handcrafted Finish",
      desc: "Master decorators manually pipe intricate borders, apply Belgian truffle ganache, and position fresh fruit accents.",
      image: "AZ_01460.JPG",
      icon: "🎨",
      detail: "Individual hand inspection for every celebratory cake.",
    },
    {
      num: "05",
      title: "Pharmaceutical Quality Audit",
      badge: "Double Verification",
      desc: "Before packaging, each cake is audited for exact weight, height compliance, visual aesthetics, and temperature integrity.",
      image: "DSC03187.JPG",
      icon: "🔍",
      detail: "Batch logging for 100% operational traceability.",
    },
    {
      num: "06",
      title: "Cold-Chain Pune Dispatch",
      badge: "Fresh Delivery",
      desc: "Cakes are packaged in tamper-evident sterile boxes and transported via temperature-controlled vans directly to Pune franchise outlets.",
      image: "AZ_01692.JPG",
      icon: "🚚",
      detail: "Refrigerated transport maintains pristine structure.",
    },
  ];

  const current = steps[activeStep];

  return (
    <section className="reveal-story-section py-14 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100 text-[#548bf0] text-xs font-bold uppercase tracking-wider mb-3">
            03 • Process Story
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#2a1d2e] font-bold break-words">
            From Ingredient to Final Creation
          </h2>
          <p className="text-sm sm:text-base text-[#5a4a5e] mt-3 font-medium max-w-2xl mx-auto leading-relaxed">
            Follow the 6-stage journey of how raw luxury ingredients transform into your favorite celebration cake.
          </p>
        </div>

        {/* 6 Step Horizontal Indicator Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {steps.map((s, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={s.num}
                onClick={() => setActiveStep(idx)}
                className={`glass rounded-2xl p-3.5 text-left transition-all duration-300 relative ${
                  isActive
                    ? "bg-white border-pink-400 shadow-md translate-y-[-2px]"
                    : "bg-white/70 border-white hover:bg-white/90 shadow-2xs"
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span
                    className={`font-display text-lg font-bold ${
                      isActive ? "text-[#ff5c97]" : "text-slate-400"
                    }`}
                  >
                    {s.num}
                  </span>
                  <span className="text-base">{s.icon}</span>
                </div>
                <div className="text-xs font-bold text-[#2a1d2e] truncate mb-0.5">
                  {s.title}
                </div>
                <div className="text-[10px] text-[#5a4a5e] truncate font-semibold">
                  {s.badge}
                </div>
                {isActive && (
                  <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-pink-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Detailed Step Showcase */}
        <div className="glass rounded-[2.5rem] p-6 sm:p-10 bg-white/90 border border-white shadow-xl grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-[#ff5c97] text-xs font-bold uppercase tracking-wider">
              <span>Stage {current.num} of 06</span>
              <span>•</span>
              <span>{current.badge}</span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#2a1d2e]">
              {current.title}
            </h3>

            <p className="text-sm sm:text-base text-[#5a4a5e] leading-relaxed">
              {current.desc}
            </p>

            <div className="glass-soft rounded-2xl p-4 border border-white/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-100/80 flex items-center justify-center text-xl shrink-0">
                {current.icon}
              </div>
              <div className="text-xs font-semibold text-[#2a1d2e]">
                <div className="text-[10px] uppercase font-bold text-[#ff5c97]">
                  Operational Discipline Standard
                </div>
                {current.detail}
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                disabled={activeStep === 0}
                onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                className="btn-ghost !py-2 !px-4 text-xs font-bold disabled:opacity-40"
              >
                ← Previous Stage
              </button>
              <button
                disabled={activeStep === steps.length - 1}
                onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
                className="btn-primary !py-2 !px-4 text-xs font-bold disabled:opacity-40"
              >
                Next Stage →
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 min-w-0">
            <div className="relative w-full aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-inner bg-slate-50">
              <CakeImage
                key={current.num}
                src={current.image}
                alt={current.title}
                aspect="4/3"
                fit="contain"
                priority
                badge={`Step ${current.num}: ${current.title}`}
                badgePosition="bottom-right"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
