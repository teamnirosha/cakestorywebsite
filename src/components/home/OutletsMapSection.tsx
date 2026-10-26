import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { gsap } from "gsap";
import { franchiseService, Franchise } from "../../services/data";
import { useLanguage } from "../../context/LanguageContext";
import { prefersReducedMotion, MOTION } from "../../utils/motion";
import { getOutletUrl } from "../../utils/outletRouting";
import bakeryBg from "../../assets/hero/cakestory-hero.jpg";

// Clean SVG Vector Icons
function SearchIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function MapPinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PhoneIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

const customIcon = (active: boolean) =>
  L.divIcon({
    className: "cs-marker-wrap",
    html: `<div class="cs-marker" style="${
      active ? "transform: rotate(-45deg) scale(1.2); box-shadow: 0 12px 28px -4px rgba(150,27,60,0.8);" : ""
    }"><span>🎂</span></div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  });

function FlyTo({ pos, zoom = 13 }: { pos: [number, number] | null; zoom?: number }) {
  const map = useMap();
  if (pos) map.flyTo(pos, zoom, { duration: 1.2 });
  return null;
}

export default function OutletsMapSection() {
  const { t, language } = useLanguage();
  const [activeZone, setActiveZone] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedOutlet, setSelectedOutlet] = useState<Franchise | null>(null);
  const [flyPos, setFlyPos] = useState<[number, number] | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Header elements sequential reveal
      const headerElems = sectionRef.current?.querySelectorAll(".outlets-header-elem");
      if (headerElems && headerElems.length > 0) {
        gsap.fromTo(
          headerElems,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: MOTION.duration.reveal,
            stagger: 0.1,
            ease: MOTION.ease.default,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              end: "bottom top",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }

      // 2. Zone summary cards reveal
      const zoneCards = sectionRef.current?.querySelectorAll(".zone-summary-card");
      if (zoneCards && zoneCards.length > 0) {
        gsap.fromTo(
          zoneCards,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: MOTION.duration.reveal,
            stagger: 0.06,
            ease: MOTION.ease.default,
            scrollTrigger: {
              trigger: ".zone-summary-grid",
              start: "top 88%",
              end: "bottom top",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const allOutlets = franchiseService.listActive();
  const zones = ["all", "West Pune", "South Pune", "East Pune", "PCMC", "Satara"];

  // Filtered outlets
  const filtered = useMemo(() => {
    let list = allOutlets;
    if (activeZone !== "all") {
      list = list.filter((o) => o.zone === activeZone || (activeZone === "South Pune" && (o.zone || "").includes("Satara")));
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.outletName.toLowerCase().includes(q) ||
          o.address.toLowerCase().includes(q) ||
          (o.zone && o.zone.toLowerCase().includes(q))
      );
    }
    return list;
  }, [allOutlets, activeZone, query]);

  const selectOutlet = (o: Franchise) => {
    setSelectedOutlet(o);
    setFlyPos([o.latitude, o.longitude]);
  };

  // Zone counts for summary bottom cards
  const zoneSummary = [
    { zone: "West Pune", count: allOutlets.filter((o) => o.zone === "West Pune").length, dot: "bg-amber-600" },
    { zone: "South Pune", count: allOutlets.filter((o) => o.zone === "South Pune").length, dot: "bg-rose-700" },
    { zone: "East Pune", count: allOutlets.filter((o) => o.zone === "East Pune").length, dot: "bg-rose-900" },
    { zone: "PCMC", count: allOutlets.filter((o) => o.zone === "PCMC").length, dot: "bg-stone-700" },
    { zone: "Satara", count: allOutlets.filter((o) => o.zone === "Satara" || o.city.toLowerCase().includes("satara")).length, dot: "bg-amber-700" },
  ];

  return (
    <section
      ref={sectionRef}
      id="outlets"
      aria-label="Explore Outlet Locations"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#fbf8f4] via-[#f7f0e6] to-[#f4ebe0] text-stone-800 relative overflow-hidden border-t border-amber-200/50"
    >
      {/* 1. Multi-Layered Luxury Background: Photographic Atmosphere + Ambient Glows + SVG Topography & Dot Matrix */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Authentic Storefront Atmosphere with Warm Blend */}
        <img
          src={bakeryBg}
          alt=""
          role="presentation"
          loading="lazy"
          className="w-full h-full object-cover object-[center_35%] filter blur-[1.5px] opacity-25 mix-blend-multiply scale-105"
        />

        {/* Ambient Radial Color Lighting Meshes */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_45%_at_12%_8%,rgba(245,175,45,0.22),transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_88%_15%,rgba(181,31,80,0.16),transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_95%,rgba(217,119,6,0.15),transparent_70%)]" />

        {/* Crisp Luxury Architectural Dot Matrix Grid Pattern & Topographic Map Curves */}
        <svg className="absolute inset-0 w-full h-full opacity-65" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="outlets-dot-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.1" fill="#8a1836" fillOpacity="0.09" />
              <circle cx="18" cy="18" r="0.75" fill="#d97706" fillOpacity="0.08" />
            </pattern>
            {/* Topographic Linear Gradients */}
            <linearGradient id="topoGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b51f50" stopOpacity="0.14" />
              <stop offset="50%" stopColor="#d97706" stopOpacity="0.20" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.10" />
            </linearGradient>
            <linearGradient id="topoRoseGrad" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8a1836" stopOpacity="0.16" />
              <stop offset="60%" stopColor="#b51f50" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.06" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#outlets-dot-grid)" />

          {/* Sweeping Regional Topographic Contour Curves Tracing Pune Geography */}
          <path
            d="M -120 160 C 240 60, 520 220, 880 140 C 1180 70, 1420 180, 1680 120"
            fill="none"
            stroke="url(#topoGoldGrad)"
            strokeWidth="1.75"
            strokeDasharray="4 4"
          />
          <path
            d="M -80 340 C 320 220, 680 420, 1040 300 C 1320 210, 1540 330, 1720 270"
            fill="none"
            stroke="url(#topoRoseGrad)"
            strokeWidth="2.2"
          />
          <path
            d="M -150 560 C 260 680, 620 480, 980 620 C 1280 730, 1500 580, 1750 640"
            fill="none"
            stroke="url(#topoGoldGrad)"
            strokeWidth="1.8"
            strokeDasharray="6 3"
          />
          <path
            d="M -100 780 C 380 660, 740 860, 1100 740 C 1380 650, 1580 790, 1780 720"
            fill="none"
            stroke="url(#topoRoseGrad)"
            strokeWidth="2"
          />

          {/* Luxury Cartographic Compass Rose Watermark (Top Right) */}
          <g transform="translate(1080, 75) scale(0.85)" opacity="0.20">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#b51f50" strokeWidth="1.2" strokeDasharray="3 3" />
            <circle cx="100" cy="100" r="64" fill="none" stroke="#d97706" strokeWidth="1" />
            <circle cx="100" cy="100" r="48" fill="none" stroke="#b51f50" strokeWidth="0.8" />
            <polygon points="100,20 106,94 180,100 106,106 100,180 94,106 20,100 94,94" fill="#d97706" fillOpacity="0.45" />
            <polygon points="100,20 104,96 100,100 96,96" fill="#8a1836" />
            <polygon points="180,100 104,104 100,100 104,96" fill="#8a1836" />
            <polygon points="100,180 96,104 100,100 104,104" fill="#8a1836" />
            <polygon points="20,100 96,96 100,100 96,104" fill="#8a1836" />
            <text x="100" y="13" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#8a1836" letterSpacing="1">N</text>
            <text x="192" y="104" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#8a1836">E</text>
            <text x="100" y="196" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#8a1836">S</text>
            <text x="8" y="104" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#8a1836">W</text>
          </g>

          {/* Artisanal Sparkle Stars Floating in Background */}
          <g opacity="0.25" fill="#d97706">
            <path d="M 180 220 Q 180 235 165 235 Q 180 235 180 250 Q 180 235 195 235 Q 180 235 180 220 Z" />
            <path d="M 980 260 Q 980 272 968 272 Q 980 272 980 284 Q 980 272 992 272 Q 980 272 980 260 Z" />
            <path d="M 320 720 Q 320 735 305 735 Q 320 735 320 750 Q 320 735 335 735 Q 320 735 320 720 Z" />
            <path d="M 1240 680 Q 1240 695 1225 695 Q 1240 695 1240 710 Q 1240 695 1255 695 Q 1240 695 1240 680 Z" />
          </g>
        </svg>

        {/* Soft Vignette Edge Shadow for Content Framing */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fbf8f4] via-transparent to-[#f4ebe0]/80" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* 2. Section Header: Refined Editorial Typography & Subtle Eyebrow Label */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
          <div className="outlets-header-elem inline-flex items-center gap-2.5 px-4.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-stone-200/90 shadow-[0_2px_12px_-2px_rgba(181,31,80,0.12)] text-xs sm:text-[13.5px] font-bold tracking-[0.12em] uppercase text-stone-700 hover:text-stone-900 hover:border-rose-300/80 hover:shadow-[0_4px_16px_-2px_rgba(181,31,80,0.18)] hover:-translate-y-0.5 transition-all duration-300 cursor-default select-none mb-5 group">
            <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5 shrink-0 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-[#b51f50] shadow-[0_0_8px_rgba(181,31,80,0.6)]" />
            </span>
            <span className="transition-colors">{t("outlets.tag")}</span>
          </div>

          <h2 className="outlets-header-elem font-display text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-medium text-stone-900 leading-[1.25] tracking-tight">
            {t("outlets.title")}
          </h2>

          <p className="outlets-header-elem mt-3.5 text-base sm:text-lg text-stone-600 leading-relaxed font-normal max-w-xl mx-auto">
            {t("outlets.subtitle")}
          </p>
        </div>

        {/* 3. Zone Filters & Search Bar Strip */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          {/* Zone Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {zones.map((z) => {
              const isSelected = activeZone === z;
              return (
                <button
                  key={z}
                  onClick={() => setActiveZone(z)}
                  aria-pressed={isSelected}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-[13.5px] font-medium transition-all cursor-pointer ${
                    isSelected
                      ? "bg-stone-900 text-white shadow-2xs"
                      : "bg-white/95 text-stone-700 border border-stone-200/90 hover:bg-stone-50"
                  }`}
                >
                  {z === "all" ? t("outlets.allZones") : t(`outlets.zone_${z.replace(/\s+/g, "")}`, z)}
                </button>
              );
            })}
          </div>

          {/* Search Input Box */}
          <div className="w-full md:w-72 relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400">
              <SearchIcon className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("outlets.search")}
              aria-label={t("outlets.search")}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-full bg-white/95 border border-stone-200/90 text-stone-800 placeholder-stone-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 transition shadow-2xs"
            />
          </div>
        </div>

        {/* 4. Side-by-Side Interactive Outlets Showcase Card */}
        <div className="grid lg:grid-cols-12 gap-5 sm:gap-6 bg-white/95 backdrop-blur-xl rounded-3xl border border-stone-200/90 shadow-[0_20px_50px_-15px_rgba(138,24,54,0.12),0_4px_16px_rgba(0,0,0,0.04)] ring-1 ring-amber-500/15 p-3.5 sm:p-5">
          {/* Left Column: Scrollable Outlets List */}
          <div className="lg:col-span-5 flex flex-col h-[460px] bg-stone-50/80 rounded-2xl border border-stone-200/80 overflow-hidden">
            {/* Header: Signature CakeStory Deep Berry Banner */}
            <div className="p-4 bg-[#8a1836] text-white flex items-center justify-between shrink-0 shadow-2xs">
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-4 h-4 text-rose-200" />
                <span className="font-display font-medium text-sm sm:text-base tracking-wide">
                  {t("outlets.listTitle")}
                </span>
              </div>
              <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-medium">
                {filtered.length} {t("outlets.locations")}
              </span>
            </div>

            {/* Scrollable Outlets List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 scrollbar-thin">
              {filtered.map((outlet) => {
                const isSelected = selectedOutlet?.id === outlet.id;
                return (
                  <div
                    key={outlet.id}
                    onClick={() => selectOutlet(outlet)}
                    className={`p-3.5 rounded-xl transition-all cursor-pointer border flex flex-col justify-between ${
                      isSelected
                        ? "bg-[#faf2f5] border-[#961b3c] shadow-xs translate-x-0.5"
                        : "bg-white border-stone-200/80 hover:border-stone-300 hover:bg-stone-50/60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              isSelected ? "bg-[#961b3c]" : "bg-rose-500"
                            }`}
                          />
                          <h4 className="font-display font-medium text-sm sm:text-[15px] text-stone-900 truncate">
                            {outlet.name}
                          </h4>
                        </div>
                        <p className="text-xs sm:text-[13px] text-stone-600 truncate mt-1 pl-3.5 flex items-center gap-1">
                          <PhoneIcon className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span>{outlet.phone}</span>
                        </p>
                      </div>

                      <Link
                        to={getOutletUrl(outlet)}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs font-semibold text-[#961b3c] hover:underline uppercase tracking-wider shrink-0 bg-[#faf2f5] px-2.5 py-1 rounded-md border border-[#f3d9e2]"
                      >
                        {t("outlets.viewDetails")} →
                      </Link>
                    </div>

                    <p className="text-xs sm:text-[13px] text-stone-600 truncate mt-1.5 pl-3.5">
                      {outlet.address}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Leaflet Map Container */}
          <div className="lg:col-span-7 h-[360px] sm:h-[460px] rounded-2xl overflow-hidden border border-stone-200 relative shadow-inner">
            <MapContainer
              center={[18.5204, 73.8567]}
              zoom={11}
              scrollWheelZoom={false}
              className="w-full h-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FlyTo pos={flyPos} zoom={13} />
              {filtered.map((o) => (
                <Marker
                  key={o.id}
                  position={[o.latitude, o.longitude]}
                  icon={customIcon(selectedOutlet?.id === o.id)}
                  eventHandlers={{
                    click: () => selectOutlet(o),
                  }}
                >
                  <Popup>
                    <div className="p-1 text-stone-900">
                      <h4 className="font-display font-medium text-sm text-stone-900">{o.name}</h4>
                      <p className="text-xs text-stone-600 mt-0.5">{o.address}</p>
                      <p className="text-xs text-[#961b3c] font-medium mt-0.5">📞 {o.phone}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Link
                          to={getOutletUrl(o)}
                          className="inline-block text-xs font-semibold text-white bg-[#961b3c] px-3 py-1 rounded hover:bg-[#7d1430] transition-colors"
                        >
                          {t("outlets.viewStore")} →
                        </Link>
                        <a
                          href={o.googleMapsUrl || `https://www.google.com/maps?q=${o.latitude},${o.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 px-2.5 py-1 rounded transition-colors"
                        >
                          {language === "mr" ? "दिशा-मार्ग ↗" : "Directions ↗"}
                        </a>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* 5. Regional Zone Count Summary Cards */}
        <div className="zone-summary-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mt-8">
          {zoneSummary.map((z) => (
            <div
              key={z.zone}
              onClick={() => setActiveZone(z.zone)}
              className="zone-summary-card p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-stone-200/90 shadow-[0_4px_14px_-2px_rgba(0,0,0,0.05)] hover:border-amber-300 hover:shadow-[0_8px_24px_-4px_rgba(181,31,80,0.12)] hover:-translate-y-0.5 transition-all text-center cursor-pointer group"
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className={`w-2 h-2 rounded-full ${z.dot}`} />
                <span className="font-display text-2xl font-medium text-stone-900">
                  {z.count}
                </span>
              </div>
              <div className="text-xs sm:text-sm font-medium text-stone-700">
                {t(`outlets.zone_${z.zone.replace(/\s+/g, "")}`, z.zone)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
