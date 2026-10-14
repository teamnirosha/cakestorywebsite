import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { franchiseService, Franchise } from "../../services/data";
import { useLanguage } from "../../context/LanguageContext";

const customIcon = (active: boolean) =>
  L.divIcon({
    className: "cs-marker-wrap",
    html: `<div class="cs-marker" style="${
      active ? "transform: rotate(-45deg) scale(1.2); box-shadow: 0 12px 28px -4px rgba(230,57,113,0.8);" : ""
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
  const { t } = useLanguage();
  const [activeZone, setActiveZone] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedOutlet, setSelectedOutlet] = useState<Franchise | null>(null);
  const [flyPos, setFlyPos] = useState<[number, number] | null>(null);

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

  // Zone counts for summary bottom cards (like Screenshot 5)
  const zoneSummary = [
    { zone: "West Pune", count: allOutlets.filter((o) => o.zone === "West Pune").length, color: "text-amber-500", dot: "bg-amber-500" },
    { zone: "South Pune", count: allOutlets.filter((o) => o.zone === "South Pune").length, color: "text-purple-500", dot: "bg-purple-500" },
    { zone: "East Pune", count: allOutlets.filter((o) => o.zone === "East Pune").length, color: "text-rose-500", dot: "bg-rose-500" },
    { zone: "PCMC", count: allOutlets.filter((o) => o.zone === "PCMC").length, color: "text-blue-500", dot: "bg-blue-500" },
    { zone: "Satara", count: allOutlets.filter((o) => o.zone === "Satara" || o.city.toLowerCase().includes("satara")).length, color: "text-red-500", dot: "bg-red-500" },
  ];

  return (
    <section id="outlets" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/60 border-t border-slate-100">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-3 border border-blue-100">
            {t("outlets.tag")}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
            {t("outlets.title")}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-500">
            {t("outlets.subtitle")}
          </p>
        </div>

        {/* Zone Filters & Search Bar Strip (Screenshot 5) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          {/* Zone Chips */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {zones.map((z) => {
              const isSelected = activeZone === z;
              return (
                <button
                  key={z}
                  onClick={() => setActiveZone(z)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {z === "all" ? t("outlets.allZones") : z}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="w-full md:w-72 relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">🔍</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("outlets.search")}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-full bg-white border border-slate-200 focus:outline-none focus:border-pink-500 transition shadow-2xs"
            />
          </div>
        </div>

        {/* Side-by-Side Interactive Experience (Screenshot 5) */}
        <div className="grid lg:grid-cols-12 gap-6 bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden p-3.5 sm:p-5">
          {/* Left: Scrollable Outlets List Card */}
          <div className="lg:col-span-5 flex flex-col h-[460px] bg-slate-50/60 rounded-2xl border border-slate-100 overflow-hidden">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white flex items-center justify-between shrink-0 shadow-xs">
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span className="font-display font-bold text-sm tracking-wide">{t("outlets.listTitle")}</span>
              </div>
              <span className="text-[11px] bg-white/20 px-2.5 py-0.5 rounded-full font-semibold">
                {filtered.length} Locations
              </span>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 scrollbar-thin">
              {filtered.map((outlet) => {
                const isSelected = selectedOutlet?.id === outlet.id;
                return (
                  <div
                    key={outlet.id}
                    onClick={() => selectOutlet(outlet)}
                    className={`p-3 rounded-xl transition-all cursor-pointer border flex flex-col justify-between ${
                      isSelected
                        ? "bg-white border-pink-500 shadow-md translate-x-1"
                        : "bg-white/90 border-slate-200/80 hover:border-pink-300 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-pink-500 shrink-0" />
                          <h4 className="font-display font-bold text-xs sm:text-sm text-slate-900 truncate">
                            {outlet.name}
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5 pl-3.5">
                          📞 {outlet.phone}
                        </p>
                      </div>

                      <Link
                        to={`/outlets/${outlet.slug || outlet.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-[10px] font-bold text-pink-600 hover:underline uppercase tracking-wider shrink-0 bg-pink-50 px-2 py-1 rounded-md border border-pink-100"
                      >
                        {t("outlets.viewDetails")} →
                      </Link>
                    </div>

                    <p className="text-[10px] text-slate-400 truncate mt-1.5 pl-3.5">
                      {outlet.address}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Leaflet Map Container */}
          <div className="lg:col-span-7 h-[360px] sm:h-[460px] rounded-2xl overflow-hidden border border-slate-200 relative shadow-inner">
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
                    <div className="p-1 text-slate-900">
                      <h4 className="font-bold text-xs">{o.name}</h4>
                      <p className="text-[10px] text-slate-600 mt-0.5">{o.address}</p>
                      <p className="text-[10px] text-pink-600 font-semibold mt-0.5">📞 {o.phone}</p>
                      <Link
                        to={`/outlets/${o.slug || o.id}`}
                        className="inline-block text-[10px] font-bold text-white bg-pink-600 px-2 py-0.5 rounded mt-1.5"
                      >
                        View Store Page →
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Zone Count Summary Cards (Screenshot 5) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mt-8">
          {zoneSummary.map((z) => (
            <div
              key={z.zone}
              onClick={() => setActiveZone(z.zone)}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition text-center cursor-pointer hover:border-pink-300"
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className={`w-2 h-2 rounded-full ${z.dot}`} />
                <span className={`font-display text-2xl font-bold ${z.color}`}>{z.count}</span>
              </div>
              <div className="text-xs font-semibold text-slate-700">{z.zone}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
