import React, { useState } from "react";
import CakeImage from "../common/CakeImage";

export default function CraftsmanshipSection() {
  const [activeCraft, setActiveCraft] = useState(0);

  const craftPillars = [
    {
      id: "eggless",
      title: "100% Eggless Sponge Mastery",
      badge: "Proprietary Recipe",
      desc: "Formulated after hundreds of test bakes to achieve maximum springiness, moisture retention, and zero synthetic chemical aftertaste.",
      image: "AZ_01683.JPG",
      caption: "Fresh Fruit Gateau & Delicate Sponge Layers",
      details: ["Real dairy whipped creams", "Zero egg substitutes with foul aftertaste", "Cloud-soft bite texture"],
    },
    {
      id: "cocoa",
      title: "Unadulterated Cocoa & Real Fruit",
      badge: "Pure Ingredients",
      desc: "We source premium cocoa powders, Belgian couverture melts, and natural fruit purees without artificial gel fillers.",
      image: "DSC03187.JPG",
      caption: "Mirror Glaze & Royal Chocolate Finish",
      details: ["100% Cocoa Butter Truffle", "Alphonso Mango & Strawberry Purees", "Rich dark chocolate ganache"],
    },
    {
      id: "thermal",
      title: "Micro-Calibrated Baking SOPs",
      badge: "Thermal Precision",
      desc: "Baking temperatures are tracked to the exact degree and timed by grams to prevent burnt crusts or collapsed sponges.",
      image: "14.JPG",
      caption: "Artisanal Layered Slice Presentation",
      details: ["Digital weight sensors", "Zone-controlled convection ovens", "Batch consistency audits"],
    },
    {
      id: "piping",
      title: "Artisanal Hand Decoration",
      badge: "Master Detail",
      desc: "Every celebratory tier cake is finished by skilled decorators using delicate piping techniques, fresh fruit arrangements, and chocolate flourishes.",
      image: "AZ_01460.JPG",
      caption: "Handcrafted Celebration Tier Craft",
      details: ["Custom message lettering", "Hand-shaved chocolate curls", "Elegant mirror glazes"],
    },
  ];

  const currentPillar = craftPillars[activeCraft];

  return (
    <section className="reveal-story-section py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-pink-50/20 to-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider mb-3">
            02 • Visual Storytelling
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#2a1d2e] font-bold break-words">
            The Craft Behind Every Layer
          </h2>
          <p className="text-sm sm:text-base text-[#5a4a5e] mt-3 font-medium max-w-2xl mx-auto leading-relaxed">
            Craftsmanship at CakeStory Desserts is not luck—it's an intentional blend of culinary passion and scientific precision.
          </p>
        </div>

        {/* Interactive Craft Grid */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Col: Craft Selector Buttons */}
          <div className="lg:col-span-6 space-y-3.5">
            {craftPillars.map((item, idx) => {
              const isActive = activeCraft === idx;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveCraft(idx)}
                  onMouseEnter={() => setActiveCraft(idx)}
                  className={`glass rounded-2xl p-5 cursor-pointer transition-all duration-300 ${
                    isActive
                      ? "bg-white border-pink-400 shadow-md translate-x-1"
                      : "bg-white/70 border-white hover:bg-white/90 shadow-2xs"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-xs font-bold text-[#ff5c97] uppercase tracking-wider">
                      {item.badge}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                        isActive
                          ? "bg-pink-500 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-[#2a1d2e] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#5a4a5e] leading-relaxed mb-3">
                    {item.desc}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {item.details.map((d) => (
                      <span
                        key={d}
                        className="text-[10px] font-semibold px-2.5 py-0.5 rounded-md bg-slate-100/80 text-slate-700"
                      >
                        ✓ {d}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Col: Interactive Dynamic Visual Stage */}
          <div className="lg:col-span-6 min-w-0">
            <div className="glass rounded-[2.5rem] p-4 sm:p-6 bg-white/90 border border-white shadow-xl relative overflow-hidden transition-all">
              <div className="relative w-full aspect-[4/3] sm:aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden shadow-inner bg-slate-50 flex items-center justify-center">
                <CakeImage
                  key={currentPillar.id}
                  src={currentPillar.image}
                  alt={currentPillar.title}
                  aspect="3/4"
                  fit="contain"
                  priority
                  badge={currentPillar.badge}
                  badgePosition="top-left"
                  className="w-full h-full transition-all duration-500"
                />
              </div>

              <div className="mt-4 glass-soft rounded-2xl p-4 text-center border border-white/80 bg-gradient-to-r from-pink-50/70 to-rose-50/70">
                <div className="text-xs font-bold text-[#ff5c97] uppercase tracking-wider mb-1">
                  Craft Feature Spotlight
                </div>
                <div className="font-display font-bold text-base text-[#2a1d2e] mb-1">
                  {currentPillar.title}
                </div>
                <p className="text-xs text-[#5a4a5e] leading-relaxed">
                  {currentPillar.caption}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
