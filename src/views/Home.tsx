import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PageShell from "../components/layout/PageShell";
import { contentService, SiteContent } from "../services/data";
import { useFranchiseModal } from "../components/common/FranchiseModal";
import BrandHeroVisual from "../components/common/BrandHeroVisual";
import BakeryBackgroundDecor from "../components/common/BakeryBackgroundDecor";

// Phase 3 Distinctive Modular Sections
import CakeShowcase from "../components/home/CakeShowcase";
import ScrollStorySequence from "../components/home/ScrollStorySequence";
import CustomizationExperience from "../components/home/CustomizationExperience";
import FranchisePrioritySection from "../components/home/FranchisePrioritySection";
import OutletDiscoveryPreview from "../components/home/OutletDiscoveryPreview";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const { openModal } = useFranchiseModal();
  const heroRef = useRef<HTMLDivElement>(null);
  const [siteContent, setSiteContent] = useState<SiteContent>(() => contentService.get());

  useEffect(() => {
    const onStorage = () => setSiteContent(contentService.get());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const hero = siteContent.homeHero;
  const activeStats = (hero.statistics || []).filter((s) => s.active !== false);
  const activeSupportingCards = (hero.supportingCards || []).filter((c) => c.active !== false);
  const activeFloatingBadges = (hero.floatingBadges || []).filter((b) => b.active !== false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !heroRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Cinematic Hero Entrance Animation
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      heroTl
        .fromTo(
          ".hero-eyebrow",
          { opacity: 0, y: -12 },
          { opacity: 1, y: 0, duration: 0.6, clearProps: "opacity,transform" }
        )
        .fromTo(
          ".hero-title",
          { opacity: 0, y: 22, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.85, clearProps: "opacity,transform" },
          "-=0.35"
        )
        .fromTo(
          ".hero-sub",
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.75, clearProps: "opacity,transform" },
          "-=0.55"
        )
        .fromTo(
          ".hero-cta-group",
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.75, clearProps: "opacity,transform" },
          "-=0.55"
        )
        .fromTo(
          ".hero-stat-badge",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, stagger: 0.08, duration: 0.55, clearProps: "opacity,transform" },
          "-=0.4"
        )
        .fromTo(
          ".hero-visual-stage",
          { opacity: 0, scale: 0.96, y: 15 },
          { opacity: 1, scale: 1, y: 0, duration: 0.95, clearProps: "opacity,transform" },
          "-=0.8"
        );

      // 2. Safe Staggered Section Reveals
      gsap.utils.toArray<HTMLElement>(".reveal-section").forEach((sec) => {
        gsap.fromTo(
          sec,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power2.out",
            clearProps: "opacity,transform",
            scrollTrigger: {
              trigger: sec,
              start: "top 90%",
              once: true,
            },
          }
        );
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Responsive Desktop Mouse Parallax
  const handleHeroMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(pointer: coarse)").matches || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(".hero-visual-card", {
      x: x * -10,
      y: y * -10,
      rotateY: x * 3,
      rotateX: -y * 3,
      duration: 0.75,
      ease: "power2.out",
    });
  };

  const handleHeroMouseLeave = () => {
    gsap.to(".hero-visual-card", {
      x: 0,
      y: 0,
      rotateY: 0,
      rotateX: 0,
      duration: 0.85,
      ease: "power2.out",
    });
  };

  return (
    <PageShell>
      {/* ========================================================
          1. CINEMATIC EDITORIAL HERO
      ======================================================== */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="relative min-h-[92vh] flex items-center px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-16 sm:pb-20 overflow-hidden"
      >
        <BakeryBackgroundDecor variant="hero" />

        {/* Ambient Radial Blobs */}
        <div className="blob w-[500px] h-[500px] -top-28 -left-24 bg-rose-200/40" />
        <div className="blob w-[450px] h-[450px] bottom-0 right-10 bg-blue-100/35" />
        <div className="blob w-[360px] h-[360px] top-1/3 right-0 bg-amber-100/30" />

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
          {/* Hero Copy & Conversion Core */}
          <div className="lg:col-span-7 min-w-0">
            {/* Origin & Trust Eyebrow Badge */}
            <div className="hero-eyebrow inline-flex items-center gap-2 glass-pill px-4 py-1.5 text-xs font-bold text-[#e63971] mb-5 border border-rose-100/80 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>{hero.badgeText || "Expanding Across Pune • 12 Active Outlets"}</span>
            </div>

            {/* Editorial Title with Optical Serif Scaling */}
            <h1 className="hero-title font-display text-4xl sm:text-5xl lg:text-[3.75rem] leading-[1.08] text-[#2a1d2e] font-bold tracking-tight">
              {hero.headingPrefix || "Artisanal Celebration Cakes."}{" "}
              <span className="font-editorial gradient-text italic">
                {hero.headingHighlight || "A Business Built to Grow."}
              </span>
            </h1>

            {/* Brand Pitch & Strategic Value Proposition */}
            <p className="hero-sub mt-5 sm:mt-6 text-sm sm:text-base lg:text-lg text-[#5a4a5e] max-w-xl leading-relaxed">
              {hero.description ||
                "Combining pharmaceutical-grade central kitchen production with high-margin retail franchise partnerships. 100% vegetarian handcrafted bakes delivered daily across Pune."}
            </p>

            {/* Dual Conversion CTA Group */}
            <div className="hero-cta-group flex flex-wrap items-center gap-3.5 mt-8 sm:mt-9">
              <button
                onClick={openModal}
                className="btn-primary !py-3.5 !px-8 text-sm sm:text-base !font-bold shadow-xl shadow-pink-500/25 transition-all flex items-center gap-2"
              >
                <span>{hero.primaryCta?.label || "Franchise Enquiry"}</span>
                <span aria-hidden="true">→</span>
              </button>

              <Link
                to="/cakes"
                className="btn-ghost !py-3.5 !px-7 text-sm sm:text-base !font-semibold border border-rose-100 bg-white/80 hover:bg-white shadow-xs"
              >
                Explore 24+ Cakes
              </Link>

              <Link
                to="/outlets"
                className="text-xs sm:text-sm font-bold text-[#5a4a5e] hover:text-[#e63971] px-3 py-2 transition-colors flex items-center gap-1"
              >
                <span>📍 View 12 Pune Locations</span>
              </Link>
            </div>

            {/* Credibility Statistics Bar */}
            {activeStats.length > 0 && (
              <div className="hero-cta-group mt-10 pt-7 border-t border-rose-100/70 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                {activeStats.map((stat) => (
                  <div key={stat.id} className="hero-stat-badge min-w-0">
                    <div className="font-display text-2xl sm:text-3xl font-bold text-[#2a1d2e]">
                      {stat.value}
                    </div>
                    <div className="text-[11px] font-bold text-[#e63971] uppercase tracking-wider mt-0.5">
                      {stat.label}
                    </div>
                    {stat.description && (
                      <div className="text-[10px] text-[#8c7a90] mt-0.5 truncate hidden sm:block">
                        {stat.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hero Visual Area: Authentic Portrait Cake Composition */}
          <div className="lg:col-span-5 hero-visual-stage relative w-full flex justify-center min-w-0">
            <BrandHeroVisual
              imageAsset={hero.visual?.imageAsset || "/images/hero-cake.jpg"}
              alt={hero.visual?.caption || "CakeStory Desserts Signature Artisanal Celebration Cake"}
              aspect="2/3"
              fit="cover"
              supportingCards={activeSupportingCards}
              floatingBadges={activeFloatingBadges}
            />
          </div>
        </div>
      </section>

      {/* ========================================================
          2. INTERACTIVE CAKE SHOWCASE (Requirement 4)
      ======================================================== */}
      <CakeShowcase />

      {/* ========================================================
          3. SCROLL-DRIVEN BRAND STORY (Requirement 3)
      ======================================================== */}
      <ScrollStorySequence />

      {/* ========================================================
          4. SIGNATURE CUSTOMIZATION EXPERIENCE (Preserved & Elevated)
      ======================================================== */}
      <CustomizationExperience />

      {/* ========================================================
          5. FRANCHISE PRIORITY CONVERSION (Requirement 5)
      ======================================================== */}
      <FranchisePrioritySection />

      {/* ========================================================
          6. LIGHTWEIGHT OUTLET DISCOVERY PREVIEW (Requirement 6)
      ======================================================== */}
      <OutletDiscoveryPreview />

      {/* ========================================================
          7. HIGH-IMPACT CLOSING FRANCHISE STAGE
      ======================================================== */}
      <section className="reveal-section py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <BakeryBackgroundDecor variant="cta" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="glass-dark rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-14 text-center border border-white/20 shadow-2xl relative overflow-hidden text-white">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 p-2 rounded-2xl glass-soft border border-white/30 shadow-lg flex items-center justify-center bg-white/20 backdrop-blur-md">
              <img
                src="/assets/logo/cs-logo.png"
                alt="CakeStory Desserts Logo"
                className="max-h-full max-w-full object-contain filter drop-shadow-md"
              />
            </div>

            <div className="eyebrow !text-pink-300 justify-center mb-3">
              Pune Territory Allotment 2026
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white font-bold mb-4 drop-shadow-sm">
              Ready to Launch Your CakeStory Outlet?
            </h2>

            <p className="text-sm sm:text-base text-pink-100/90 max-w-2xl mx-auto mb-8 leading-relaxed font-light">
              Join Pune's growing celebration brand. Turnkey stores, pharmaceutical-grade central production, and dedicated operations mentorship from day one.
            </p>

            <div className="flex flex-wrap justify-center items-center gap-4">
              <button
                onClick={openModal}
                className="btn-primary !py-4 !px-9 text-sm sm:text-base font-bold shadow-xl shadow-pink-500/40"
              >
                <span>Request Franchise Prospectus</span>
                <span aria-hidden="true">→</span>
              </button>

              <Link
                to="/franchise"
                className="btn-ghost !py-4 !px-8 text-sm sm:text-base font-semibold bg-white/15 text-white border-white/30 hover:bg-white/25 backdrop-blur-md"
              >
                Explore Partner Model
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
