import React from "react";
import BakeryBackgroundDecor from "../common/BakeryBackgroundDecor";
import CakeImage from "../common/CakeImage";
import { useFranchiseModal } from "../common/FranchiseModal";

export default function StoryHero() {
  const { openModal } = useFranchiseModal();

  return (
    <section className="relative min-h-[85vh] lg:min-h-[88vh] flex items-center px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-12 sm:pb-16 overflow-hidden">
      <BakeryBackgroundDecor variant="hero" />

      {/* Ambient Radial Blobs */}
      <div
        className="blob pointer-events-none select-none"
        style={{
          width: 500,
          height: 500,
          top: -100,
          left: -80,
          background: "radial-gradient(circle, #ffd4e5 0%, transparent 70%)",
        }}
      />
      <div
        className="blob pointer-events-none select-none"
        style={{
          width: 450,
          height: 450,
          bottom: -40,
          right: -50,
          background: "radial-gradient(circle, #bde0fe 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        {/* Left Col: Cinematic Story Hero Text */}
        <div className="lg:col-span-7 min-w-0">
          <div className="story-hero-badge inline-flex items-center gap-2 glass-soft px-4 py-1.5 rounded-full text-xs font-bold text-[#5a4a5e] mb-5 border border-white/80 shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5c97] animate-pulse shrink-0" />
            <span className="text-[#2a1d2e] tracking-wider uppercase">
              Our Story • Pune Heritage
            </span>
          </div>

          <h1 className="story-hero-title font-display text-3.5xl sm:text-5xl lg:text-[3.6rem] leading-[1.1] text-[#2a1d2e] font-bold tracking-tight break-words">
            Behind Every Creation <br className="hidden sm:block" />
            Is A <span className="gradient-text italic">Story Of Purpose</span>
          </h1>

          <p className="story-hero-sub mt-5 sm:mt-6 text-sm sm:text-base lg:text-lg text-[#5a4a5e] max-w-xl leading-relaxed">
            CakeStory Desserts was born from a simple belief: every family celebration deserves artisanal cake craftsmanship, uncompromised hygiene, and dependable quality—without exorbitant price tags.
          </p>

          {/* Quick Pillars */}
          <div className="story-hero-pillars mt-7 flex flex-wrap gap-2.5">
            {[
              "🍰 100% Eggless Master Recipes",
              "✨ Centralized Pune Kitchen SOPs",
              "🛡️ Sterile Cleanroom Protocols",
              "🚀 Fast-Growing Pune Network",
            ].map((pillar) => (
              <span
                key={pillar}
                className="glass-soft text-xs font-semibold px-3 py-1.5 rounded-full border border-white/70 text-[#2a1d2e] shadow-2xs"
              >
                {pillar}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="story-hero-cta flex flex-wrap items-center gap-4 mt-8">
            <button
              onClick={openModal}
              className="btn-primary glass-shine !py-3.5 !px-8 text-sm sm:text-base font-bold shadow-lg shadow-pink-300/40 hover:shadow-pink-300/60 transition"
            >
              <span>Partner With Us</span>
              <span>→</span>
            </button>
            <a
              href="#story-intro"
              className="btn-ghost !py-3.5 !px-7 text-sm sm:text-base font-semibold border border-white/80 bg-white/70 hover:bg-white/90 shadow-xs"
            >
              Explore Our Journey ↓
            </a>
          </div>
        </div>

        {/* Right Col: Hero Visual Frame */}
        <div className="lg:col-span-5 story-hero-visual relative w-full flex justify-center min-w-0">
          <div className="relative w-full max-w-md lg:max-w-none">
            {/* Main Glass Frame Image */}
            <div className="glass rounded-[2.5rem] p-4 bg-white/80 border border-white shadow-2xl relative overflow-hidden group">
              <div className="relative w-full aspect-[4/3] sm:aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden shadow-inner bg-slate-50">
                <CakeImage
                  src="AZ_01460.JPG"
                  alt="CakeStory Desserts Handcrafted Celebration Cake"
                  aspect="3/4"
                  fit="contain"
                  priority
                  hoverZoom
                  badge="Artisanal Central Facility Standard"
                  badgePosition="bottom-left"
                  className="w-full h-full"
                />
              </div>

              {/* Floating Glass Badge 1 */}
              <div className="absolute top-8 -right-3 sm:-right-5 glass rounded-2xl p-3.5 bg-white/90 border border-white shadow-lg backdrop-blur-md hidden sm:flex items-center gap-3 animate-floatY">
                <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-xl shrink-0">
                  🎂
                </div>
                <div>
                  <div className="text-xs font-bold text-[#2a1d2e]">Pure Quality</div>
                  <div className="text-[10px] text-[#ff5c97] font-semibold">100% Real Cocoa & Cream</div>
                </div>
              </div>

              {/* Floating Glass Badge 2 */}
              <div className="absolute -bottom-4 left-6 glass rounded-2xl p-3 sm:p-3.5 bg-white/90 border border-white shadow-lg backdrop-blur-md flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-lg shrink-0">
                  📍
                </div>
                <div>
                  <div className="text-xs font-bold text-[#2a1d2e]">Pune Built</div>
                  <div className="text-[10px] text-emerald-700 font-semibold">5 Active Zones & Growing</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
