import React, { useState } from "react";
import { franchiseService } from "../../services/data";

export default function PuneConnectionMap() {
  const [activeZone, setActiveZone] = useState<string>("west");

  const outlets = franchiseService.list();

  const zones = [
    {
      id: "west",
      name: "West Pune Catchment",
      hubs: "Baner • Balewadi • Wakad • Aundh • Bavdhan",
      desc: "High-density IT corridors and affluent residential townships with soaring demand for celebratory bakes.",
      stats: "Primary Hub",
      outlets: outlets.filter((o) => o.area === "West Pune" || o.city.includes("Baner") || o.city.includes("Wakad")),
      x: "30%",
      y: "40%",
    },
    {
      id: "east",
      name: "East Pune Catchment",
      hubs: "Viman Nagar • Kharadi • Kalyani Nagar • Magarpatta",
      desc: "Tech parks, corporate hubs, and cosmopolitan residential clusters seeking consistent daily cake delivery.",
      stats: "Corporate Hub",
      outlets: outlets.filter((o) => o.area === "East Pune" || o.city.includes("Viman") || o.city.includes("Kharadi")),
      x: "70%",
      y: "35%",
    },
    {
      id: "central",
      name: "Central & South Pune",
      hubs: "Kothrud • Deccan • Swargate • Camp • Bibwewadi",
      desc: "Established residential heartland with deep family traditions and word-of-mouth brand loyalty.",
      stats: "Heritage Hub",
      outlets: outlets.filter((o) => o.area === "South Pune" || o.city.includes("Kothrud") || o.city.includes("Camp")),
      x: "45%",
      y: "65%",
    },
    {
      id: "pcmc",
      name: "PCMC Industrial Corridor",
      hubs: "Pimple Saudagar • Chinchwad • Nigdi • Ravet",
      desc: "Rapidly expanding residential belt with high young-family demographics and celebration frequency.",
      stats: "Growth Belt",
      outlets: outlets.filter((o) => o.area === "PCMC" || o.city.includes("Pimple") || o.city.includes("Chinchwad")),
      x: "35%",
      y: "20%",
    },
    {
      id: "gateway",
      name: "Regional Gateway",
      hubs: "Satara Road • Shirwal Corridor • Highway Hubs",
      desc: "Strategic retail gateways connecting Pune to tier-2 cities across Western Maharashtra.",
      stats: "Expansion Corridor",
      outlets: outlets.filter((o) => o.area === "Satara" || o.city.includes("Satara")),
      x: "55%",
      y: "85%",
    },
  ];

  const currentZone = zones.find((z) => z.id === activeZone) || zones[0];

  return (
    <section className="reveal-story-section py-14 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100 text-[#ff5c97] text-xs font-bold uppercase tracking-wider mb-3">
            09 • Pune Roots & Territorial Growth
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#2a1d2e] font-bold break-words">
            Deeply Rooted In Pune's Neighborhoods
          </h2>
          <p className="text-sm sm:text-base text-[#5a4a5e] mt-3 font-medium max-w-2xl mx-auto leading-relaxed">
            Our central kitchen dispatch network covers 5 designated catchment zones across Pune, providing exclusive territorial pockets for franchise partners.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left 7 Cols: Stylized Pune Network Visual Canvas */}
          <div className="lg:col-span-7 relative min-h-[360px] sm:min-h-[440px] glass rounded-[2.5rem] p-6 bg-white/90 border border-white shadow-xl flex flex-col justify-between overflow-hidden">
            {/* Background Vector Map Graphic */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
              viewBox="0 0 600 450"
              fill="none"
            >
              <path
                d="M 120 80 Q 200 150 280 180 T 450 160 T 520 280"
                stroke="#ff5c97"
                strokeWidth="3"
                strokeDasharray="8 6"
              />
              <path
                d="M 280 180 Q 320 280 340 380"
                stroke="#6fa8f5"
                strokeWidth="3"
                strokeDasharray="8 6"
              />
              <circle cx="280" cy="180" r="140" fill="#ffd4e5" fillOpacity="0.15" />
            </svg>

            {/* Title overlay */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-[#ff5c97]">
                📍 Pune Network Catchment Map
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-pink-100 text-pink-800">
                Centralized Daily Supply
              </span>
            </div>

            {/* Interactive Network Node Buttons */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-3 my-6">
              {zones.map((z) => {
                const isActive = activeZone === z.id;
                return (
                  <button
                    key={z.id}
                    onClick={() => setActiveZone(z.id)}
                    onMouseEnter={() => setActiveZone(z.id)}
                    className={`glass rounded-2xl p-3.5 text-left transition-all duration-300 ${
                      isActive
                        ? "bg-white border-pink-400 shadow-md scale-105"
                        : "bg-white/70 border-white hover:bg-white shadow-2xs"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`w-2.5 h-2.5 rounded-full ${isActive ? "bg-pink-500 animate-ping" : "bg-slate-300"}`} />
                      <span className="font-display text-xs font-bold text-[#2a1d2e] truncate">
                        {z.name.replace(" Catchment", "").replace(" Industrial Corridor", "")}
                      </span>
                    </div>
                    <div className="text-[10px] font-semibold text-[#5a4a5e] truncate">
                      {z.stats}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Interactive Map Footer note */}
            <div className="relative z-10 glass-soft rounded-2xl p-3 text-center border border-white/80 text-xs text-[#5a4a5e]">
              ✨ Central production facility in Pune guarantees daily temperature-controlled delivery across all 5 catchment corridors.
            </div>
          </div>

          {/* Right 5 Cols: Selected Zone Spotlight */}
          <div className="lg:col-span-5 min-w-0">
            <div className="glass rounded-[2.5rem] p-6 sm:p-8 bg-white/90 border border-white shadow-xl space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-pink-100 text-[#ff5c97]">
                  {currentZone.stats}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {currentZone.outlets.length} Active Outlets
                </span>
              </div>

              <h3 className="font-display text-2xl font-bold text-[#2a1d2e]">
                {currentZone.name}
              </h3>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-[#2a1d2e]">
                <div className="text-[10px] text-[#ff5c97] font-bold uppercase mb-0.5">
                  Key Territorial Hubs
                </div>
                {currentZone.hubs}
              </div>

              <p className="text-xs sm:text-sm text-[#5a4a5e] leading-relaxed">
                {currentZone.desc}
              </p>

              {currentZone.outlets.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-200/60">
                  <div className="text-xs font-bold text-[#2a1d2e]">
                    Featured Outlet Presence:
                  </div>
                  {currentZone.outlets.slice(0, 2).map((o) => (
                    <div key={o.id} className="glass-soft rounded-xl p-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-[#2a1d2e]">{o.name}</span>
                        <span className="text-[10px] text-[#5a4a5e] block">{o.address}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
