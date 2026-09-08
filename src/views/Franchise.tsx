import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PageShell from "../components/layout/PageShell";
import { useFranchiseModal } from "../components/common/FranchiseModal";
import { franchiseService, faqService, contentService, SiteContent } from "../services/data";
import CakeImage from "../components/common/CakeImage";

gsap.registerPlugin(ScrollTrigger);

export default function Franchise() {
  const { openModal } = useFranchiseModal();
  const [siteContent, setSiteContent] = useState<SiteContent>(() => contentService.get());
  const totalOutlets = franchiseService.countActive();
  const zones = franchiseService.zones();
  const franchiseFaqs = faqService.list().filter((f) => f.category.includes("Franchise") || f.category.includes("Onboarding"));

  useEffect(() => {
    const onStorage = () => setSiteContent(contentService.get());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".reveal-hero", { opacity: 0, y: 30, duration: 0.8, ease: "power3.out" });
      gsap.utils.toArray<HTMLElement>(".reveal-card").forEach((el) => {
        gsap.from(el, { opacity: 0, y: 30, duration: 0.6, scrollTrigger: { trigger: el, start: "top 88%" } });
      });
    });
    return () => ctx.revert();
  }, []);

  const processSteps = [
    { step: "01", title: "Enquire", desc: "Submit our simple 4-field franchise enquiry form online." },
    { step: "02", title: "Initial Discussion", desc: "Phone consultation with our Pune franchise development team." },
    { step: "03", title: "Location Evaluation", desc: "Catchment analysis, street visibility, and footfall viability audit." },
    { step: "04", title: "Business Discussion", desc: "Commercial alignment, territory allotment, and legal agreement." },
    { step: "05", title: "Setup & Training", desc: "Store architectural fit-out, branding, and comprehensive counter training." },
    { step: "06", title: "Launch", desc: "Grand opening with local marketing collaterals and social campaign." },
    { step: "07", title: "Grow With CakeStory Desserts", desc: "Daily central cold-chain supply and continuous operational mentorship." },
  ];

  return (
    <PageShell>
      {/* 1. FRANCHISE HERO */}
      <section className="px-6 relative pt-4 pb-16">
        <div className="blob" style={{ width: 400, height: 400, top: -50, left: -100, background: "radial-gradient(circle, #ffd3e2, transparent)" }} />
        <div className="blob" style={{ width: 350, height: 350, bottom: 0, right: -50, background: "radial-gradient(circle, #b9dcff, transparent)" }} />

        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6 reveal-hero">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-[#ff5c97] text-xs font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Expanding Across Pune • {totalOutlets} Operational Outlets
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2a1d2e] leading-tight">
              Your Business Journey Could Start With{" "}
              <span className="gradient-text italic">CakeStory Desserts.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#5a4a5e] max-w-xl leading-relaxed">
              Partner with a fast-growing, quality-driven bakery brand from Pune. We handle centralized baking and cold-chain supply—so you focus on running an elegant, high-footfall retail outlet with established processes.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button onClick={openModal} className="btn-primary !py-3.5 !px-8 text-base font-bold shadow-xl">
                Start Your Franchise Journey →
              </button>
              <Link to="/outlets" className="btn-ghost !py-3.5 !px-6 text-base font-semibold bg-white/70">
                View Our Outlets
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/60 text-left">
              <div>
                <div className="font-display text-2xl font-bold text-[#2a1d2e]">Zero Baking</div>
                <div className="text-xs text-[#5a4a5e] mt-0.5">Centralized Hub Production</div>
              </div>
              <div>
                <div className="font-display text-2xl font-bold text-[#2a1d2e]">Compact</div>
                <div className="text-xs text-[#5a4a5e] mt-0.5">150-350 sq.ft. Store Format</div>
              </div>
              <div>
                <div className="font-display text-2xl font-bold text-[#2a1d2e]">Turnkey</div>
                <div className="text-xs text-[#5a4a5e] mt-0.5">Training, Fit-out & Supply</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 reveal-hero w-full max-w-[500px] lg:max-w-none mx-auto">
            <div className="glass rounded-[2rem] sm:rounded-[2.5rem] p-3.5 sm:p-5 shadow-2xl bg-white/80 border border-white backdrop-blur-md">
              <div className="relative w-full aspect-[3/2] rounded-2xl sm:rounded-3xl overflow-hidden shadow-inner border border-rose-100/60 bg-[#fff5f5] flex items-center justify-center">
                <CakeImage
                  src={siteContent.franchiseHero?.imageAsset || "/images/franchise-hero.png"}
                  alt={siteContent.franchiseHero?.caption || "CakeStory Desserts Premium Packaged Treats & Festive Retail Collection"}
                  aspect="3/2"
                  fit="cover"
                  priority={true}
                  hoverZoom
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover object-center"
                />
              </div>
              <div className="text-center mt-3 pt-3 border-t border-slate-100/80">
                <div className="text-xs font-bold text-[#2a1d2e]">Standardised Quality Guarantee</div>
                <div className="text-[11px] text-[#5a4a5e]">Daily fresh delivery from central Pune kitchen to your outlet</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHY CAKESTORY */}
      <section className="reveal-card py-16 px-6 bg-gradient-to-b from-white/60 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-display text-3xl sm:text-4xl text-[#2a1d2e] font-bold">Why CakeStory Desserts?</h2>
            <p className="text-sm sm:text-base text-[#5a4a5e] mt-2">
              The bakery sector is fragmented with inconsistent quality and high kitchen wastage. CakeStory Desserts solves this through disciplined industrial standardization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass rounded-3xl p-6 bg-white/80 border border-white">
              <div className="text-3xl mb-3">📍</div>
              <h3 className="font-display text-lg font-bold text-[#2a1d2e] mb-2">Established Pune Brand</h3>
              <p className="text-xs sm:text-sm text-[#5a4a5e] leading-relaxed">
                Enjoy immediate local recognition and customer trust across Pune's key residential and IT high-growth zones.
              </p>
            </div>
            <div className="glass rounded-3xl p-6 bg-white/80 border border-white">
              <div className="text-3xl mb-3">🎂</div>
              <h3 className="font-display text-lg font-bold text-[#2a1d2e] mb-2">Proven Product Range</h3>
              <p className="text-xs sm:text-sm text-[#5a4a5e] leading-relaxed">
                A carefully curated menu of celebratory cakes, eggless pastries, and dessert jars that drive repeat customer purchases.
              </p>
            </div>
            <div className="glass rounded-3xl p-6 bg-white/80 border border-white">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="font-display text-lg font-bold text-[#2a1d2e] mb-2">Repeatable Business Model</h3>
              <p className="text-xs sm:text-sm text-[#5a4a5e] leading-relaxed">
                Run an organized retail business without the operational headache of hiring pastry chefs or handling raw flour and ovens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHY OUR MODEL & 4. WHAT YOU GET */}
      <section className="reveal-card py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              Complete Franchise Deliverables
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-[#2a1d2e] font-bold">What You Get as a Partner</h2>
            <p className="text-sm sm:text-base text-[#5a4a5e] mt-2">
              Everything needed to set up, launch, and operate an elegant CakeStory Desserts outlet with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "📐",
                title: "Store Setup Support",
                desc: "Turnkey architectural drawings, display chiller specs, warm lighting, and brand signage guidelines.",
              },
              {
                icon: "🎓",
                title: "Training & Onboarding",
                desc: "Rigorous staff training covering POS billing, hygiene SOPs, cake presentation, and customer service.",
              },
              {
                icon: "🚚",
                title: "Daily Supply Logistics",
                desc: "Fresh daily deliveries from central kitchen in temperature-controlled refrigerated transport vehicles.",
              },
              {
                icon: "📣",
                title: "Marketing Collateral",
                desc: "Digital menu boards, opening flyers, branded uniform aprons, packaging boxes, and launch social campaigns.",
              },
              {
                icon: "📊",
                title: "Operational Guidance",
                desc: "Dedicated area operations executive to review inventory turnover, waste minimization, and quality adherence.",
              },
              {
                icon: "🔬",
                title: "Quality Standards",
                desc: "100% centrally audited batches ensuring your outlet never faces recipe deviations or taste inconsistency.",
              },
              {
                icon: "💻",
                title: "Digital Ecosystem",
                desc: "Dedicated outlet webpage on CakeStory Desserts directory with local discovery, directions, and phone visibility.",
              },
              {
                icon: "🤝",
                title: "Territory Protection",
                desc: "Guaranteed geographical catchment to ensure healthy footfall and prevent intra-brand competition.",
              },
            ].map((item) => (
              <div key={item.title} className="glass rounded-3xl p-6 bg-white/80 border border-white hover:shadow-lg transition">
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="font-display text-base font-bold text-[#2a1d2e] mb-1.5">{item.title}</h3>
                <p className="text-xs text-[#5a4a5e] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. IDEAL FRANCHISE PARTNER */}
      <section className="reveal-card py-16 px-6 bg-gradient-to-b from-transparent via-pink-50/40 to-transparent">
        <div className="max-w-5xl mx-auto">
          <div className="glass rounded-[2.5rem] p-8 sm:p-12 bg-white/90 border border-white shadow-lg">
            <div className="max-w-2xl mx-auto text-center mb-10">
              <h2 className="font-display text-3xl font-bold text-[#2a1d2e] mb-3">Who Is the Ideal Franchise Partner?</h2>
              <p className="text-sm text-[#5a4a5e]">
                We value long-term partners who treat their CakeStory Desserts outlet as an extension of their personal commitment to their local community.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { t: "Community Focus", d: "Enthusiasm for building warm, friendly relationships with local neighborhood families." },
                { t: "Process Discipline", d: "Commitment to upholding hygiene SOPs, cold-storage rules, and brand visual standards." },
                { t: "Hands-on Involvement", d: "Ability to oversee daily store opening, cash handling, and customer feedback." },
                { t: "Growth Mindset", d: "Ambition to expand into multi-outlet franchise ownership across Pune territories." },
              ].map((c) => (
                <div key={c.t} className="glass-soft rounded-2xl p-4 border border-white flex items-start gap-3">
                  <span className="text-pink-500 font-bold text-lg">✓</span>
                  <div>
                    <h4 className="font-display font-bold text-sm text-[#2a1d2e] mb-1">{c.t}</h4>
                    <p className="text-xs text-[#5a4a5e] leading-relaxed">{c.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 11. FRANCHISE ONBOARDING PROCESS */}
      <section className="reveal-card py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#548bf0] text-xs font-bold uppercase tracking-wider mb-2">
              Structured Roadmap
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-[#2a1d2e] font-bold">The Franchise Journey</h2>
            <p className="text-sm sm:text-base text-[#5a4a5e] mt-2">
              A clear, transparent 7-step path from initial enquiry to your grand opening.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
            {processSteps.map((p, idx) => (
              <div key={p.step} className="glass rounded-2xl p-4 text-center bg-white/80 border border-white flex flex-col justify-between shadow-xs">
                <div>
                  <div className="text-[10px] font-bold text-[#ff5c97] uppercase tracking-wider mb-1">
                    Step {p.step}
                  </div>
                  <div className="font-display font-bold text-sm text-[#2a1d2e] mb-1">{p.title}</div>
                  <p className="text-[11px] text-[#5a4a5e] leading-tight">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* 13. FINAL ENQUIRY CTA */}
      <section className="reveal-card py-16 px-6">
        <div className="max-w-4xl mx-auto text-center glass rounded-[3rem] p-8 sm:p-14 bg-gradient-to-br from-pink-500/10 via-rose-300/15 to-amber-200/15 border border-white shadow-2xl">
          <div className="w-20 h-20 mx-auto mb-5 p-2.5 rounded-2xl glass-soft border border-white/80 shadow-md flex items-center justify-center bg-white/70">
            <img src="/assets/logo/cs-logo.png" alt="CakeStory Desserts" className="max-h-full max-w-full object-contain filter drop-shadow-xs" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#2a1d2e] mb-3">
            Ready to Take the Next Step?
          </h2>
          <p className="text-sm sm:text-base text-[#5a4a5e] max-w-lg mx-auto mb-8">
            Fill in our 4-field enquiry form and our Pune expansion manager will contact you within 24 hours.
          </p>
          <button
            onClick={openModal}
            className="btn-primary !py-3.5 !px-8 text-base font-bold shadow-lg shadow-pink-300/50"
          >
            Start Your Franchise Journey →
          </button>
        </div>
      </section>
    </PageShell>
  );
}
