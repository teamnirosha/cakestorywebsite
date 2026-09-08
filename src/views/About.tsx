import { Link } from "react-router-dom";
import PageShell from "../components/layout/PageShell";
import { useFranchiseModal } from "../components/common/FranchiseModal";

export default function About() {
  const { openModal } = useFranchiseModal();

  return (
    <PageShell>
      <section className="px-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100 text-[#ff5c97] text-xs font-semibold mb-3">
              🏛️ BRAND OVERVIEW
            </div>
            <h1 className="font-display text-4xl md:text-6xl text-[#2a1d2e] font-bold mb-3">About CakeStory</h1>
            <p className="text-sm text-[#5a4a5e]">A premier cake manufacturing brand and growing franchise network.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass rounded-3xl p-6 bg-white/80">
              <h2 className="font-display text-2xl font-bold text-[#2a1d2e] mb-3">Our Mission</h2>
              <p className="text-sm text-[#5a4a5e] leading-relaxed">
                To build India's most trusted cake bakery brand by delivering automated manufacturing consistency, fresh high-grade ingredients, and empowering franchise partners with end-to-end operational support.
              </p>
            </div>
            <div className="glass rounded-3xl p-6 bg-white/80">
              <h2 className="font-display text-2xl font-bold text-[#2a1d2e] mb-3">Our Vision</h2>
              <p className="text-sm text-[#5a4a5e] leading-relaxed">
                To establish 100+ franchise outlets nationwide, blending centralized precision production with localized customer experience and interactive 3D digital branding.
              </p>
            </div>
          </div>

          <div className="mt-8 glass rounded-3xl p-6 bg-white/80">
            <h2 className="font-display text-2xl font-bold text-[#2a1d2e] mb-4">Core Brand Pillars</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { i: "🌱", t: "Freshness & Hygiene", d: "Zero preservatives and 100% temperature-controlled supply chain." },
                { i: "🤝", t: "Franchise Support", d: "Dedicated operational, marketing, and staff training for every partner." },
                { i: "✨", t: "Consistent Craft", d: "Central kitchen recipe formulation guaranteeing identical taste in every city." },
              ].map((v) => (
                <div key={v.t} className="glass-soft rounded-2xl p-4 text-center">
                  <div className="text-3xl mb-2">{v.i}</div>
                  <h3 className="font-display text-base font-bold text-[#2a1d2e]">{v.t}</h3>
                  <p className="text-xs text-[#5a4a5e] mt-1">{v.d}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 glass rounded-3xl p-8 text-center bg-white/90 shadow-xl border border-white">
            <h2 className="font-display text-2xl font-bold text-[#2a1d2e]">Interested in Brand Partnerships?</h2>
            <p className="text-sm text-[#5a4a5e] mt-2 mb-6">
              Connect with our franchise expansion team at <a href="mailto:franchise@cakestory.com" className="text-[#ff5c97] font-semibold">franchise@cakestory.com</a>
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/outlets" className="btn-ghost text-xs">Explore Outlets Directory</Link>
              <button onClick={openModal} className="btn-primary text-xs">Start Franchise Enquiry →</button>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
