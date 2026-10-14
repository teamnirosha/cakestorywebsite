import { useState } from "react";
import { Link } from "react-router-dom";
import franchises from "../../data/franchises.json";
import CakeImage from "../common/CakeImage";

export interface OutletItem {
  id: string;
  slug: string;
  name: string;
  outletName: string;
  zone: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  phone: string;
  openingHours: string;
  image?: string;
  active: boolean;
}

const verifiedOutlets = franchises as OutletItem[];

const ZONES = ["All Zones", "West Pune", "East Pune", "South Pune", "PCMC"];

export default function OutletDiscoveryPreview() {
  const [activeZone, setActiveZone] = useState("All Zones");

  const filtered = verifiedOutlets
    .filter((o) => o.active)
    .filter((o) => {
      if (activeZone === "All Zones") return true;
      return o.zone === activeZone || (activeZone === "South Pune" && o.zone.includes("Satara"));
    });

  return (
    <section className="reveal-section py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-transparent via-pink-50/20 to-transparent">
      {/* Background ambient accents */}
      <div className="blob w-96 h-96 top-0 right-0 bg-blue-100/30" />
      <div className="blob w-80 h-80 bottom-0 left-0 bg-pink-100/40" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div className="max-w-2xl">
            <div className="eyebrow mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              12 Operational Stores • Pune Territories
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#2a1d2e] font-bold tracking-tight">
              A Growing Presence <span className="font-editorial gradient-text">Across Pune.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#5a4a5e] mt-3 leading-relaxed">
              From West Pune's tech hubs to South Pune's heritage neighborhoods, every outlet operates on turnkey processes with daily cold-chain deliveries from our central kitchen hub.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/outlets"
              className="btn-primary !py-3 !px-6 text-xs sm:text-sm font-bold shadow-md whitespace-nowrap"
            >
              <span>Explore Interactive Map</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Zone Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {ZONES.map((zone) => {
            const isActive = activeZone === zone;
            return (
              <button
                key={zone}
                onClick={() => setActiveZone(zone)}
                className={`chip ${isActive ? "chip-active" : ""}`}
              >
                <span>{zone}</span>
                {zone === "All Zones" && (
                  <span className="text-[10px] opacity-80">({verifiedOutlets.length})</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Outlets Grid (Lightweight, 4-col responsive) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.slice(0, 8).map((outlet) => (
            <div
              key={outlet.id}
              className="glass-card rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 bg-white/90 border border-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group min-w-0"
            >
              <div>
                {/* Store Photography */}
                <div className="relative w-full aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden shadow-xs bg-slate-100 mb-3.5">
                  <CakeImage
                    src={outlet.image || "/images/outlets/baner.jpg"}
                    alt={`${outlet.name} Storefront`}
                    aspect="16/10"
                    fit="cover"
                    hoverZoom
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-bold text-[#e63971] shadow-2xs border border-rose-100">
                    {outlet.zone}
                  </div>
                </div>

                {/* Details */}
                <h3 className="font-display text-base font-bold text-[#2a1d2e] group-hover:text-[#e63971] transition-colors leading-snug mb-1">
                  {outlet.outletName}
                </h3>
                <p className="text-[11px] text-[#5a4a5e] leading-relaxed line-clamp-2 mb-3">
                  {outlet.address}
                </p>
              </div>

              {/* Footer Meta & Link */}
              <div className="pt-3 border-t border-rose-100/60 flex items-center justify-between gap-2 text-[11px]">
                <div className="text-[#8c7a90] flex items-center gap-1 truncate">
                  <span>🕒</span>
                  <span className="truncate">{outlet.openingHours}</span>
                </div>
                <Link
                  to={`/outlets/${outlet.slug || outlet.id}`}
                  className="font-bold text-[#e63971] hover:underline flex items-center gap-0.5 shrink-0"
                >
                  <span>Details</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All Outlets Bottom Link */}
        <div className="mt-10 text-center">
          <Link
            to="/outlets"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#2a1d2e] hover:text-[#e63971] transition-colors bg-white/80 px-5 py-2.5 rounded-full border border-rose-100 shadow-2xs"
          >
            <span>View All 12 Outlets Across Pune Directory</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
