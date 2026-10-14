import { Link } from "react-router-dom";
import { useFranchiseModal } from "../common/FranchiseModal";

export default function FranchisePrioritySection() {
  const { openModal } = useFranchiseModal();

  const franchisePillars = [
    {
      icon: "🏭",
      title: "Zero In-Store Baking",
      desc: "All baking, sponge aeration, and piping are completed at our central Pune hub. Store owners focus purely on retail sales and customer delight.",
    },
    {
      icon: "📐",
      title: "Compact 300–400 sq.ft. Format",
      desc: "Designed for commercial streets and high-footfall township catchments, optimizing rental overheads and staff efficiency.",
    },
    {
      icon: "❄️",
      title: "Daily Cold-Chain Delivery",
      desc: "Temperature-controlled refrigerated dispatch vans deliver fresh stock every morning, minimizing retail inventory holding.",
    },
    {
      icon: "🎓",
      title: "Turnkey Setup & Training",
      desc: "Complete architectural fit-out designs, display counter specifications, counter POS software, and staff onboarding provided.",
    },
  ];

  return (
    <section className="reveal-section py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-white/70 via-rose-50/40 to-white/70">
      {/* Background accents */}
      <div className="blob w-96 h-96 top-1/2 left-0 -translate-y-1/2 bg-pink-200/30" />
      <div className="blob w-96 h-96 top-10 right-10 bg-amber-100/40" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="eyebrow mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Pune Franchise Expansion • Active Territories
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#2a1d2e] font-bold tracking-tight">
            Build a Resilient Retail Business With <span className="font-editorial gradient-text">CakeStory Desserts.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#5a4a5e] mt-3 leading-relaxed">
            We handle the manufacturing, quality consistency, and supply chain so you can operate an elegant, high-margin retail outlet backed by a trusted brand.
          </p>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-14">
          {franchisePillars.map((pillar) => (
            <div
              key={pillar.title}
              className="glass-card p-6 sm:p-7 bg-white/90 border border-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 border border-white flex items-center justify-center text-2xl mb-4 shadow-2xs group-hover:scale-110 transition-transform duration-300">
                  {pillar.icon}
                </div>
                <h3 className="font-display text-base sm:text-lg font-bold text-[#2a1d2e] mb-2 group-hover:text-[#e63971] transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5a4a5e] leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Highlight Conversion Hero Card */}
        <div className="glass-card rounded-[2.5rem] p-6 sm:p-10 lg:p-12 bg-white/95 border border-white shadow-2xl relative overflow-hidden">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#e63971] bg-rose-50 px-3 py-1 rounded-full border border-rose-100 inline-block">
                Simple 4-Step Partnership Journey
              </span>
              <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2a1d2e] leading-snug">
                Ready to Explore a Territory in Your Neighborhood?
              </h3>
              <p className="text-xs sm:text-sm text-[#5a4a5e] leading-relaxed">
                We are actively evaluating franchise partners across West Pune, East Pune, South Pune, and PCMC corridors. Our 4-field application takes under 60 seconds to complete.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                {[
                  { num: "01", label: "Enquire Online" },
                  { num: "02", label: "Location Audit" },
                  { num: "03", label: "Store Fit-Out" },
                  { num: "04", label: "Grand Opening" },
                ].map((s) => (
                  <div key={s.num} className="p-3 rounded-2xl bg-rose-50/60 border border-rose-100 text-center">
                    <div className="text-xs font-bold text-[#e63971]">{s.num}</div>
                    <div className="text-[11px] font-semibold text-[#2a1d2e] mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 text-center lg:text-right space-y-3">
              <button
                onClick={openModal}
                className="btn-primary w-full sm:w-auto !py-4 !px-9 !text-sm sm:!text-base !font-bold shadow-xl shadow-pink-500/30"
              >
                <span>Request Franchise Prospectus</span>
                <span aria-hidden="true">→</span>
              </button>

              <div>
                <Link
                  to="/franchise"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5a4a5e] hover:text-[#e63971] transition-colors underline underline-offset-4"
                >
                  <span>Learn More About Store Formats &amp; Support</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
