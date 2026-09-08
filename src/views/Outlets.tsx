import { useMemo, useState, useRef } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import PageShell from "../components/layout/PageShell";
import { franchiseService, Franchise } from "../services/data";
import { EmptyState } from "../components/common/Loading";
import { useFranchiseModal } from "../components/common/FranchiseModal";
import OutletCard from "../components/common/OutletCard";

const customIcon = (active: boolean) =>
  L.divIcon({
    className: "cs-marker-wrap",
    html: `<div class="cs-marker" style="${
      active ? "transform: rotate(-45deg) scale(1.2); box-shadow: 0 12px 28px -4px rgba(255,92,151,0.8);" : ""
    }"><span>🎂</span></div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
  });

function FlyTo({ pos, zoom = 13 }: { pos: [number, number] | null; zoom?: number }) {
  const map = useMap();
  if (pos) map.flyTo(pos, zoom, { duration: 1.2 });
  return null;
}

export default function Outlets() {
  const { openModal } = useFranchiseModal();
  const [query, setQuery] = useState("");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [activeOnly, setActiveOnly] = useState(false);
  const [selected, setSelected] = useState<Franchise | null>(null);
  const [flyPos, setFlyPos] = useState<[number, number] | null>(null);
  const [showMapMobile, setShowMapMobile] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  const all = franchiseService.list();
  const zones = useMemo(() => ["all", ...franchiseService.zones()], [all]);

  const filtered = useMemo(() => {
    let list = all;
    if (activeOnly) list = list.filter((f) => f.active);
    if (zoneFilter !== "all") list = list.filter((f) => f.zone === zoneFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.outletName.toLowerCase().includes(q) ||
          f.address.toLowerCase().includes(q) ||
          f.city.toLowerCase().includes(q) ||
          (f.zone && f.zone.toLowerCase().includes(q))
      );
    }
    return list;
  }, [all, activeOnly, zoneFilter, query]);

  const focusOutlet = (f: Franchise) => {
    setSelected(f);
    setFlyPos([f.latitude, f.longitude]);
  };

  const focusNearest = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not available in your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const myLat = pos.coords.latitude;
        const myLng = pos.coords.longitude;
        let nearest: Franchise | null = null;
        let bestD = Infinity;
        all.forEach((f) => {
          if (!f.active) return;
          const d = Math.hypot(f.latitude - myLat, f.longitude - myLng);
          if (d < bestD) {
            bestD = d;
            nearest = f;
          }
        });
        if (nearest) focusOutlet(nearest);
      },
      () => alert("Unable to retrieve your location.")
    );
  };

  return (
    <PageShell>
      <section className="px-6 pt-4 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100 text-[#ff5c97] text-xs font-bold uppercase tracking-wider mb-3">
                📍 PUNE OUTLET DIRECTORY
              </div>
              <h1 className="font-display text-4xl md:text-5xl text-[#2a1d2e] font-bold">
                Growing Across Pune
              </h1>
              <p className="text-sm text-[#5a4a5e] mt-1">
                "Every outlet is another chapter in the CakeStory Desserts journey." {all.length} franchise locations across Pune & regional corridors.
              </p>
            </div>
            <div>
              <button
                onClick={openModal}
                className="btn-primary text-xs sm:text-sm whitespace-nowrap shadow-lg shadow-pink-300/40"
              >
                Start Your Franchise Journey +
              </button>
            </div>
          </div>

          {/* Search & Pune Zone Filter Bar */}
          <div className="glass rounded-3xl p-4 mb-6 flex flex-col md:flex-row gap-3 items-stretch shadow-md bg-white/80 border border-white">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by outlet name, area, or locality..."
                className="input-field pl-11"
              />
            </div>
            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="input-field md:w-56 cursor-pointer font-semibold text-slate-700"
            >
              <option value="all">All Pune Zones ({all.length})</option>
              {zones.filter((z) => z !== "all").map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
            <button
              onClick={() => setActiveOnly(!activeOnly)}
              className={`chip whitespace-nowrap px-4 py-2 text-xs font-semibold ${activeOnly ? "chip-active" : ""}`}
            >
              {activeOnly ? "✓ Operational Only" : "Show All Status"}
            </button>
            <button onClick={focusNearest} className="btn-ghost text-xs whitespace-nowrap font-semibold">
              📍 Nearest Outlet
            </button>
            <button
              onClick={() => setShowMapMobile(!showMapMobile)}
              className="lg:hidden btn-ghost text-xs whitespace-nowrap"
            >
              {showMapMobile ? "📋 View List" : "🗺️ View Map"}
            </button>
          </div>

          {/* Main Grid: Left Scrollable List + Right Large Contained Map */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Scrollable Outlet List (5 Columns on Desktop, fixed viewport height) */}
            <div
              className={`lg:col-span-5 flex flex-col ${
                showMapMobile ? "hidden lg:flex" : "flex"
              } h-auto lg:h-[720px] lg:max-h-[calc(100vh-210px)] min-h-0`}
            >
              <div className="flex items-center justify-between text-xs font-semibold text-[#5a4a5e] px-1 pb-2 mb-1 flex-shrink-0">
                <span>{filtered.length} Outlets Found</span>
                {zoneFilter !== "all" && <span className="font-bold text-[#ff5c97]">Zone: {zoneFilter}</span>}
              </div>

              {filtered.length === 0 ? (
                <EmptyState
                  icon="📍"
                  title="No outlets found"
                  description="Try adjusting your zone filter or search term."
                />
              ) : (
                <div
                  ref={listRef}
                  className="flex-1 overflow-y-auto pr-2 space-y-4 rounded-3xl"
                  style={{ scrollbarWidth: "thin", scrollbarColor: "#ff7eb3 transparent" }}
                >
                  {filtered.map((f, idx) => (
                    <OutletCard
                      key={f.id}
                      outlet={f}
                      priority={idx < 2}
                      onClick={() => focusOutlet(f)}
                      isSelected={selected?.id === f.id}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Free Leaflet + OpenStreetMap (7 Columns on Desktop, contained responsive height) */}
            <div
              className={`lg:col-span-7 w-full ${
                showMapMobile ? "block" : "hidden lg:block"
              } h-[380px] sm:h-[460px] lg:h-[720px] lg:max-h-[calc(100vh-210px)] sticky top-24`}
            >
              <div className="glass rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden w-full h-full shadow-2xl border border-white relative">
                <MapContainer
                  center={[18.5304, 73.8567]}
                  zoom={11}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {filtered.map((f) => (
                    <Marker
                      key={f.id}
                      position={[f.latitude, f.longitude]}
                      icon={customIcon(selected?.id === f.id)}
                      eventHandlers={{ click: () => setSelected(f) }}
                    >
                      <Popup>
                        <div style={{ minWidth: 220, fontFamily: "sans-serif" }}>
                          <div style={{ fontWeight: 800, fontSize: 14, color: "#2a1d2e" }}>{f.name}</div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "#ff5c97", textTransform: "uppercase", marginTop: 2 }}>
                            {f.zone} • {f.city}
                          </div>
                          <div style={{ fontSize: 11, color: "#5a4a5e", marginTop: 4 }}>
                            📍 {f.address}
                          </div>
                          <div style={{ fontSize: 11, color: "#5a4a5e", marginTop: 2 }}>📞 {f.phone}</div>
                          <div style={{ fontSize: 11, color: "#5a4a5e" }}>🕐 {f.openingHours}</div>
                          <div style={{ marginTop: 8 }}>
                            <a
                              href={`/outlets/${f.slug || f.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: "inline-block",
                                background: "linear-gradient(135deg, #ff7eb3, #ff5c97)",
                                color: "#ffffff",
                                padding: "5px 12px",
                                borderRadius: "10px",
                                fontSize: "11px",
                                fontWeight: 700,
                                textDecoration: "none",
                              }}
                            >
                              View Outlet Page ↗
                            </a>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                  <FlyTo pos={flyPos} />
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
