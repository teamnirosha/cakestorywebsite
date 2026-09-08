import { useParams, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import PageShell from "../components/layout/PageShell";
import { franchiseService } from "../services/data";
import { useFranchiseModal } from "../components/common/FranchiseModal";

const customIcon = L.divIcon({
  className: "cs-marker-wrap",
  html: '<div class="cs-marker"><span>🎂</span></div>',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
});

export default function OutletDetail() {
  const { id } = useParams();
  const { openModal } = useFranchiseModal();
  const outlet = id ? franchiseService.get(id) : undefined;

  if (!outlet) {
    return (
      <PageShell>
        <div className="max-w-md mx-auto glass rounded-3xl p-10 text-center my-20">
          <div className="text-5xl mb-3">📍</div>
          <h2 className="font-display text-2xl text-[#2a1d2e] mb-2 font-bold">Outlet Not Found</h2>
          <p className="text-xs text-[#5a4a5e] mb-6">
            The requested CakeStory Desserts franchise outlet page does not exist or has been updated.
          </p>
          <Link to="/outlets" className="btn-primary">
            View All Pune Outlets
          </Link>
        </div>
      </PageShell>
    );
  }

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${outlet.latitude},${outlet.longitude}`;

  return (
    <PageShell>
      {/* OUTLET INDIVIDUAL WEBSITE HERO */}
      <section className="px-6 pt-4 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <Link
              to="/outlets"
              className="text-xs font-semibold text-[#ff5c97] hover:underline flex items-center gap-1.5"
            >
              <span>←</span>
              <span>Back to Pune Outlets Directory</span>
            </Link>
            <div className="text-[11px] font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              Official Outlet Page • Zone: <strong className="text-pink-600">{outlet.zone || outlet.city}</strong>
            </div>
          </div>

          {/* Main Outlet Card */}
          <div className="glass rounded-[2.5rem] p-6 lg:p-10 shadow-2xl bg-white/85 border border-white">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 w-full">
                <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border border-slate-100 bg-slate-100">
                  {outlet.image ? (
                    <img
                      src={outlet.image}
                      alt={`${outlet.name} Location`}
                      className="w-full h-full object-cover"
                      loading="eager"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-pink-50 via-slate-50 to-rose-50 text-center">
                      <div className="w-12 h-12 rounded-full bg-white shadow-xs border border-pink-100 flex items-center justify-center text-2xl mb-2 text-[#ff5c97]">
                        📍
                      </div>
                      <div className="text-sm font-bold text-[#2a1d2e]">{outlet.name}</div>
                      <div className="text-xs text-slate-500 font-medium">{outlet.zone || outlet.city} Physical Outlet</div>
                    </div>
                  )}
                  <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md shadow-xs bg-slate-900/80 text-white">
                    📍 {outlet.zone || outlet.city} Outlet
                  </span>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                      outlet.active ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {outlet.active ? "● Operational Franchise" : "○ Temporarily Closed"}
                  </span>
                  <span className="text-xs text-[#5a4a5e]">Established {outlet.established || "2021"}</span>
                </div>

                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2a1d2e] leading-tight">
                  {outlet.name}
                </h1>
                <div className="text-xs font-bold text-[#ff5c97] uppercase tracking-wider">
                  {outlet.outletName} • {outlet.zone}
                </div>

                <p className="text-xs sm:text-sm text-[#5a4a5e] leading-relaxed">{outlet.description}</p>

                <div className="glass-soft rounded-2xl p-4 space-y-2 text-xs text-[#2a1d2e] border border-white/80">
                  <div className="flex items-start gap-2.5">
                    <span className="text-base flex-shrink-0">📍</span>
                    <div>
                      <span className="font-bold">Address:</span> {outlet.address}, {outlet.city}, {outlet.state}
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-base flex-shrink-0">🕐</span>
                    <div>
                      <span className="font-bold">Opening Hours:</span> {outlet.openingHours}
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-base flex-shrink-0">📞</span>
                    <div>
                      <span className="font-bold">Store Contact:</span>{" "}
                      <a href={`tel:${outlet.phone}`} className="text-[#ff5c97] font-bold hover:underline">
                        {outlet.phone}
                      </a>
                    </div>
                  </div>
                  {outlet.manager && (
                    <div className="flex items-center gap-2.5">
                      <span className="text-base flex-shrink-0">👤</span>
                      <div>
                        <span className="font-bold">Franchise Lead:</span> {outlet.manager}
                      </div>
                    </div>
                  )}
                </div>

                {outlet.services && outlet.services.length > 0 && (
                  <div>
                    <div className="text-xs font-bold text-[#2a1d2e] uppercase tracking-wider mb-2">
                      Store Capabilities
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {outlet.services.map((s) => (
                        <span key={s} className="chip text-[11px] font-medium">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 flex flex-wrap gap-3">
                  <a
                    href={`tel:${outlet.phone}`}
                    className="btn-primary text-xs !py-3 !px-5 font-bold shadow-md"
                  >
                    📞 Call Outlet
                  </a>
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost text-xs !py-3 !px-5 font-semibold bg-white/70"
                  >
                    Get Directions 🗺️
                  </a>
                  <button
                    onClick={openModal}
                    className="btn-ghost text-xs !py-3 !px-5 font-semibold text-[#ff5c97]"
                  >
                    Enquire for Franchise in {outlet.zone || "Pune"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* OUTLET LOCATION MAP (Free Leaflet + OpenStreetMap) */}
          <div className="mt-8 glass rounded-3xl overflow-hidden h-72 sm:h-80 shadow-lg border border-white">
            <MapContainer
              center={[outlet.latitude, outlet.longitude]}
              zoom={14}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[outlet.latitude, outlet.longitude]} icon={customIcon} />
            </MapContainer>
          </div>

          {/* Business Quality Assurance Banner */}
          <div className="mt-12 glass rounded-3xl p-8 bg-white/80 border border-white grid sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl mb-1.5">🏭</div>
              <h4 className="font-display font-bold text-sm text-[#2a1d2e]">Centralized Production</h4>
              <p className="text-xs text-[#5a4a5e] mt-0.5">Basked fresh daily in our sterile Pune hub</p>
            </div>
            <div>
              <div className="text-2xl mb-1.5">❄️</div>
              <h4 className="font-display font-bold text-sm text-[#2a1d2e]">Cold-Chain Logistics</h4>
              <p className="text-xs text-[#5a4a5e] mt-0.5">Refrigerated delivery preserving texture & taste</p>
            </div>
            <div>
              <div className="text-2xl mb-1.5">🤝</div>
              <h4 className="font-display font-bold text-sm text-[#2a1d2e]">Franchise Operated</h4>
              <p className="text-xs text-[#5a4a5e] mt-0.5">Locally owned and proudly serving Pune</p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
