import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PageShell from "../components/layout/PageShell";
import { franchiseService, contentService, SiteContent } from "../services/data";
import { useFranchiseModal } from "../components/common/FranchiseModal";
import BrandHeroVisual from "../components/common/BrandHeroVisual";
import OutletCard from "../components/common/OutletCard";
import BakeryBackgroundDecor from "../components/common/BakeryBackgroundDecor";
import ImageReveal from "../components/common/ImageReveal";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const { openModal } = useFranchiseModal();
  const heroRef = useRef<HTMLDivElement>(null);
  const [siteContent, setSiteContent] = useState<SiteContent>(() => contentService.get());
  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState(0);

  const allOutlets = franchiseService.list();

  useEffect(() => {
    // Sync with storage changes
    const onStorage = () => setSiteContent(contentService.get());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const hero = siteContent.homeHero;
  const coreStrengths = siteContent.coreStrengths;

  const activeStats = (hero.statistics || []).filter((s) => s.active !== false);
  const activeSupportingCards = (hero.supportingCards || []).filter((c) => c.active !== false);
  const activeFloatingBadges = (hero.floatingBadges || []).filter((b) => b.active !== false);
  const activeCoreStrengths = (coreStrengths.cards || []).filter((c) => c.active !== false);

  const milestoneData = [
    {
      step: "01",
      year: "Founded in Pune",
      title: "Where It All Started",
      desc: "Started with a clear vision: bring genuine bakery craft and consistent cake quality to Pune celebrations.",
      image: "1.jpg",
      aspect: "3/4" as const,
      badge: "Heritage Sponge Craft",
      caption: "Belgian Truffle & Signature Sponge Recipe Perfection"
    },
    {
      step: "02",
      year: "Built Product Trust",
      title: "Obsession With Quality & Taste",
      desc: "Refined our signature sponge recipes, perfected vegetarian eggless bakes, and earned loyal repeat customers.",
      image: "AZ_01460.JPG",
      aspect: "3/4" as const,
      badge: "Artisanal Tier Piping",
      caption: "Handcrafted Visual Presentation & Eggless Batch Consistency"
    },
    {
      step: "03",
      year: "Established Operations",
      title: "Central Production & Hygiene SOPs",
      desc: "Shifted from dispersed kitchen prep to a state-of-the-art centralized Pune facility with sterile packaging.",
      image: "DSC03187.JPG",
      aspect: "3/4" as const,
      badge: "Central Kitchen SOPs",
      caption: "Pharmaceutical-Grade Hygiene & Daily Cold-Chain Dispatch"
    },
    {
      step: "04",
      year: "Expanded Across Pune",
      title: "Territorial Network Expansion",
      desc: "Opened thriving locations in West Pune, East Pune, South Pune, and PCMC, establishing territorial dominance.",
      image: "DSC08617.JPG",
      aspect: "3/4" as const,
      badge: "Pune Network Growth",
      caption: "Presence Across Pune's Top Residential & Tech Catchments"
    },
    {
      step: "05",
      year: "Franchise Ecosystem",
      title: "Scalable Partner Model",
      desc: "Created turnkey store formats with zero in-store baking complexity, daily supply, and dedicated training.",
      image: "/images/franchise-hero.png",
      aspect: "16/9" as const,
      badge: "Turnkey Store System",
      caption: "Zero In-Store Baking Complexity & Full Operational Guidance"
    },
    {
      step: "06",
      year: "Next Chapter: You",
      title: "Partnering With Motivated Entrepreneurs",
      desc: "We are actively awarding franchise territories to partners who share our commitment to quality and growth.",
      image: "5.png",
      aspect: "3/4" as const,
      badge: "Territories Open",
      caption: "Join Pune's Fast-Growing Bakery Franchise Ecosystem"
    }
  ];

  useEffect(() => {
    // Respect reduced motion accessibility
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Hero Entrance Animation
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      heroTl
        .fromTo(".hero-badge", { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.6, clearProps: "opacity,transform" })
        .fromTo(".hero-title", { opacity: 0, y: 25, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.85, clearProps: "opacity,transform" }, "-=0.4")
        .fromTo(".hero-sub", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.75, clearProps: "opacity,transform" }, "-=0.6")
        .fromTo(".hero-cta", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.75, clearProps: "opacity,transform" }, "-=0.6")
        .fromTo(".hero-stat-item", { opacity: 0, y: 12 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, clearProps: "opacity,transform" }, "-=0.4")
        .fromTo(".hero-visual", { opacity: 0, scale: 0.96, y: 15 }, { opacity: 1, scale: 1, y: 0, duration: 1, clearProps: "opacity,transform" }, "-=0.9");

      // 2. Safe Staggered Section Reveals (Elements remain 100% visible by default)
      gsap.utils.toArray<HTMLElement>(".reveal-section").forEach((sec) => {
        const cards = sec.querySelectorAll(".reveal-card");
        if (cards.length > 0) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 25, scale: 0.98 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.75,
              stagger: 0.08,
              ease: "power2.out",
              clearProps: "opacity,transform",
              scrollTrigger: {
                trigger: sec,
                start: "top 88%",
                once: true,
              },
            }
          );
        } else {
          gsap.fromTo(
            sec,
            { opacity: 0, y: 25 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              ease: "power2.out",
              clearProps: "opacity,transform",
              scrollTrigger: {
                trigger: sec,
                start: "top 92%",
                once: true,
              },
            }
          );
        }
      });

      // 3. Subtle Parallax for Background Image Layers
      gsap.utils.toArray<HTMLElement>(".parallax-bg").forEach((bg) => {
        gsap.to(bg, {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: bg.parentElement || bg,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  // Subtle Mouse Parallax on Hero Section
  const handleHeroMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(pointer: coarse)").matches || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(".hero-visual-card", {
      x: x * -10,
      y: y * -10,
      rotateY: x * 3.5,
      rotateX: -y * 3.5,
      duration: 0.7,
      ease: "power2.out",
    });
    gsap.to(".hero-floating-badge-1", {
      x: x * 12,
      y: y * 12,
      duration: 0.8,
      ease: "power2.out",
    });
    gsap.to(".hero-floating-badge-2", {
      x: x * 16,
      y: y * 16,
      duration: 0.9,
      ease: "power2.out",
    });
  };

  const handleHeroMouseLeave = () => {
    gsap.to([".hero-visual-card", ".hero-floating-badge-1", ".hero-floating-badge-2"], {
      x: 0,
      y: 0,
      rotateY: 0,
      rotateX: 0,
      duration: 0.9,
      ease: "power2.out",
    });
  };

  const currentMilestone = milestoneData[activeMilestoneIndex] || milestoneData[0];

  return (
    <PageShell>
      {/* SECTION 1 — HERO */}
      <section
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="relative min-h-[90vh] flex items-center px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-14 sm:pb-16 overflow-hidden"
      >
        <BakeryBackgroundDecor variant="hero" />

        {/* Ambient Radial Blobs */}
        <div className="blob pointer-events-none select-none" style={{ width: 480, height: 480, top: -120, left: -100, background: "radial-gradient(circle, #ffd4e5 0%, transparent 70%)" }} />
        <div className="blob pointer-events-none select-none" style={{ width: 420, height: 420, bottom: 10, right: 40, background: "radial-gradient(circle, #bde0fe 0%, transparent 70%)" }} />
        <div className="blob pointer-events-none select-none" style={{ width: 340, height: 340, top: 140, right: -60, background: "radial-gradient(circle, #ffeedb 0%, transparent 70%)" }} />

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          <div className="lg:col-span-7 min-w-0">
            {/* Dynamic Top Badge */}
            <div className="hero-badge inline-flex items-center gap-2 glass-soft px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold text-[#5a4a5e] mb-5 sm:mb-6 border border-white/80 shadow-xs max-w-full">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="font-bold text-[#2a1d2e] truncate">{hero.badgeText}</span>
            </div>

            {/* Dynamic Main Heading */}
            <h1 className="hero-title font-display text-3xl sm:text-5xl lg:text-[3.5rem] leading-[1.1] text-[#2a1d2e] font-bold tracking-tight break-words">
              {hero.headingPrefix}{" "}
              <span className="gradient-text italic">{hero.headingHighlight}</span>
            </h1>

            {/* Dynamic Pitch Description */}
            <p className="hero-sub mt-5 sm:mt-6 text-sm sm:text-base lg:text-lg text-[#5a4a5e] max-w-xl leading-relaxed">
              {hero.description}
            </p>

            {/* Dynamic Call to Actions */}
            <div className="hero-cta flex flex-wrap items-center gap-3.5 mt-7 sm:mt-8">
              {hero.primaryCta?.action === "modal" ? (
                <button
                  onClick={openModal}
                  className="btn-primary glass-shine !py-3.5 !px-8 text-sm sm:text-base font-bold shadow-lg shadow-pink-300/40 hover:shadow-pink-300/60 transition flex items-center gap-2"
                >
                  <span>{hero.primaryCta.label}</span>
                  <span>→</span>
                </button>
              ) : (
                <Link
                  to={hero.primaryCta?.link || "/franchise"}
                  className="btn-primary glass-shine !py-3.5 !px-8 text-sm sm:text-base font-bold shadow-lg shadow-pink-300/40 hover:shadow-pink-300/60 transition flex items-center gap-2"
                >
                  <span>{hero.primaryCta?.label}</span>
                  <span>→</span>
                </Link>
              )}

              <Link
                to={hero.secondaryCta?.link || "/outlets"}
                className="btn-ghost !py-3.5 !px-7 text-sm sm:text-base font-semibold border border-white/80 bg-white/70 hover:bg-white/90 shadow-xs"
              >
                {hero.secondaryCta?.label}
              </Link>
            </div>

            {/* Dynamic Credibility Statistics */}
            {activeStats.length > 0 && (
              <div className="hero-cta mt-10 pt-6 sm:pt-8 border-t border-slate-200/60 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                {activeStats.map((stat) => (
                  <div key={stat.id} className="hero-stat-item">
                    <div className="font-display text-2xl sm:text-3xl font-bold text-[#2a1d2e]">{stat.value}</div>
                    <div className="text-[11px] sm:text-xs font-semibold text-[#ff5c97] uppercase tracking-wider mt-0.5">
                      {stat.label}
                    </div>
                    {stat.description && (
                      <div className="text-[10px] text-[#5a4a5e] mt-0.5 hidden sm:block truncate">
                        {stat.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hero Visual Area & Dynamic Supporting Cards */}
          <div className="lg:col-span-5 hero-visual relative w-full mt-8 lg:mt-0 flex justify-center min-w-0">
            <BrandHeroVisual
              imageAsset={hero.visual?.imageAsset || "/images/hero-cake.jpg"}
              alt={hero.visual?.caption || "Signature Handcrafted CakeStory Desserts Celebration Cake"}
              aspect="2/3"
              fit="cover"
              supportingCards={activeSupportingCards}
              floatingBadges={activeFloatingBadges}
            />
          </div>
        </div>
      </section>

      {/* SECTION 2 — "CAKESTORY DESSERTS" / BRAND & CORE STRENGTHS */}
      <section className="reveal-section py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-white/60 to-transparent relative overflow-hidden">
        <BakeryBackgroundDecor variant="strengths" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100/80 text-[#ff5c97] text-xs font-bold uppercase tracking-wider mb-3">
              {coreStrengths.badge || "Core Strengths"}
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#2a1d2e] font-bold break-words">
              {coreStrengths.title || "Why Build Your Business With CakeStory Desserts?"}
            </h2>
            <p className="text-sm sm:text-base text-[#5a4a5e] mt-3 font-medium max-w-2xl mx-auto leading-relaxed">
              {coreStrengths.subtitle}
            </p>
          </div>

          {/* Core Strengths Grid (Renders ALL 8 Strengths Cards reliably) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {activeCoreStrengths.map((item) => (
              <div
                key={item.id}
                className="reveal-card glass rounded-3xl p-5 sm:p-6 bg-white/85 border border-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group min-w-0"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-100 via-rose-50 to-amber-100 border border-white flex items-center justify-center text-2xl mb-4 shadow-xs group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-[#2a1d2e] mb-2 group-hover:text-[#ff5c97] transition-colors">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-[#5a4a5e] leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — OUR GROWTH STORY (OPTION C: INTERACTIVE DYNAMIC VISUAL STAGE & COMPACT MILESTONES) */}
      <section className="reveal-section py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <BakeryBackgroundDecor variant="timeline" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100/80 text-[#548bf0] text-xs font-bold uppercase tracking-wider mb-3">
              Journey & Milestones
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#2a1d2e] font-bold break-words">
              From One Story to a Growing Pune Network
            </h2>
            <p className="text-sm sm:text-base text-[#5a4a5e] mt-3">
              Our journey from a single kitchen to Pune's fast-expanding bakery network.
            </p>
          </div>

          {/* Interactive Dynamic Milestone Grid (Option C) */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left 7 Cols: Interactive Compact Milestone Items */}
            <div className="lg:col-span-7 relative border-l-2 border-pink-200 ml-4 md:ml-6 space-y-4 sm:space-y-5">
              {milestoneData.map((node, idx) => {
                const isActive = activeMilestoneIndex === idx;
                return (
                  <div
                    key={node.step}
                    onClick={() => setActiveMilestoneIndex(idx)}
                    onMouseEnter={() => setActiveMilestoneIndex(idx)}
                    className="reveal-card relative pl-7 md:pl-10 cursor-pointer group"
                  >
                    <div
                      className={`absolute -left-[15px] top-2 w-7 h-7 rounded-full border-4 border-white flex items-center justify-center text-[11px] font-bold transition-all duration-300 ${isActive
                        ? "bg-pink-500 text-white shadow-md shadow-pink-300 ring-4 ring-pink-100 scale-110"
                        : "bg-slate-800 text-white shadow-xs group-hover:bg-pink-400"
                        }`}
                    >
                      {node.step}
                    </div>

                    <div
                      className={`glass rounded-2xl p-4 sm:p-5 transition-all duration-300 ${isActive
                        ? "bg-gradient-to-r from-pink-500/15 via-rose-300/10 to-amber-200/10 border-pink-400 shadow-md translate-x-1"
                        : "bg-white/80 border-white shadow-2xs hover:bg-white/95"
                        }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff5c97]">
                          {node.year}
                        </span>
                        {isActive && (
                          <span className="text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-pink-500 text-white animate-pulse">
                            Active Milestone
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-base sm:text-lg font-bold text-[#2a1d2e] mb-1 group-hover:text-[#ff5c97] transition-colors">
                        {node.title}
                      </h3>
                      <p className="text-xs text-[#5a4a5e] leading-relaxed">{node.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right 5 Cols: Option C Dynamic Interactive Visual Stage */}
            <div className="lg:col-span-5 min-w-0">
              <div className="glass rounded-3xl p-4 sm:p-5 bg-white/90 border border-white shadow-xl flex flex-col justify-between relative overflow-hidden transition-all duration-500">
                <div className="relative w-full aspect-[3/4] sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-inner bg-slate-50 mb-4 flex items-center justify-center">
                  <ImageReveal
                    key={currentMilestone.step}
                    src={currentMilestone.image}
                    alt={currentMilestone.title}
                    aspect={currentMilestone.aspect}
                    fit="contain"
                    revealVariant="fade-scale"
                    badge={currentMilestone.badge}
                    badgePosition="top-left"
                    priority
                    className="w-full h-full"
                    imgClassName="w-full h-full object-contain"
                  />
                </div>

                <div className="glass-soft rounded-2xl p-4 text-center border border-white/80 bg-gradient-to-r from-pink-50/70 to-rose-50/70">
                  <div className="text-xs font-bold text-[#ff5c97] uppercase tracking-wider mb-1">
                    Milestone {currentMilestone.step} • {currentMilestone.year}
                  </div>
                  <div className="font-display font-bold text-base text-[#2a1d2e] mb-1">
                    {currentMilestone.title}
                  </div>
                  <p className="text-xs text-[#5a4a5e] leading-relaxed">
                    {currentMilestone.caption}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={openModal}
              className="btn-primary glass-shine !py-3.5 !px-8 text-sm sm:text-base font-bold shadow-lg"
            >
              Be Part of Our Next Chapter →
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 4 — "FRANCHISE ADVANTAGE" ("More Than a Bakery. A Business Built to Grow.") */}
      <section className="reveal-section py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white/60 via-pink-50/30 to-white/60 relative overflow-hidden">
        <BakeryBackgroundDecor variant="franchise" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
              Franchise Advantage
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#2a1d2e] font-bold break-words">
              More Than a Bakery. A Business Built to Grow.
            </h2>
            <p className="text-sm sm:text-base text-[#5a4a5e] mt-3">
              The CakeStory Desserts franchise opportunity is structured to give store owners operational clarity and scalable retail economics.
            </p>
          </div>

          {/* Guaranteed 6-Card Responsive Grid (3 Cols Desktop, 2 Cols Tablet, 1 Col Mobile) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: "🏪",
                title: "Recognisable Local Brand",
                desc: "Strong word-of-mouth and visual presence across Pune give your store immediate customer credibility on opening day.",
              },
              {
                icon: "📐",
                title: "Store Setup & Fit-out Guidance",
                desc: "Complete architectural plans, lighting specs, display counter design, and signage standards provided turnkey.",
              },
              {
                icon: "🎓",
                title: "Staff & Counter Training",
                desc: "Comprehensive onboarding for your counter team covering POS software, hygiene maintenance, and customer service.",
              },
              {
                icon: "📣",
                title: "Marketing & Launch Support",
                desc: "Local social media visibility, inaugural promotional collateral, and regional festive marketing campaigns.",
              },
              {
                icon: "🏬",
                title: "Scalable Compact Footprint",
                desc: "Designed for efficient commercial spaces (150 - 350 sq.ft.), optimizing rental overheads and staffing requirements.",
              },
              {
                icon: "💡",
                title: "Continuous Brand Innovation",
                desc: "Our master baking team continuously creates seasonal specialties, driving repeated footfall throughout the year.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="reveal-card glass rounded-3xl p-5 sm:p-6 bg-white/85 border border-white shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col group min-w-0"
              >
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 border border-white flex items-center justify-center text-xl mb-4 shadow-2xs group-hover:scale-110 transition-transform duration-300">
                  {card.icon}
                </div>
                <h3 className="font-display text-base sm:text-lg font-bold text-[#2a1d2e] mb-2 group-hover:text-[#ff5c97] transition-colors">{card.title}</h3>
                <p className="text-xs sm:text-sm text-[#5a4a5e] leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — QUALITY + HYGIENE */}
      <section className="reveal-section py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <BakeryBackgroundDecor variant="hygiene" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">
              Process Discipline
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#2a1d2e] font-bold break-words">
              Great Taste Starts With Great Discipline.
            </h2>
            <p className="text-sm sm:text-base text-[#5a4a5e] mt-3">
              How does CakeStory Desserts offer premium bakes at accessible pricing while guaranteeing supreme hygiene? Through disciplined, repeatable manufacturing.
            </p>
          </div>

          {/* 7-Step Process Flow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-12">
            {[
              { step: "01", name: "Ingredients", desc: "Certified pure dairy & cocoa" },
              { step: "02", name: "Preparation", desc: "Automated batch weighing" },
              { step: "03", name: "Baking", desc: "Strict oven heat curves" },
              { step: "04", name: "Decoration", desc: "Artisanal detail & piping" },
              { step: "05", name: "Quality Check", desc: "Visual & weight audits" },
              { step: "06", name: "Packaging", desc: "Tamper-evident cold seal" },
              { step: "07", name: "Customer", desc: "Served fresh at Pune outlets" },
            ].map((p, idx) => (
              <div
                key={p.step}
                className="reveal-card glass rounded-2xl p-4 text-center bg-white/80 border border-white flex flex-col justify-between shadow-xs relative transition-all duration-300 hover:-translate-y-1 hover:shadow-md min-w-0"
              >
                <div>
                  <div className="text-[10px] font-bold text-[#ff5c97] uppercase tracking-wider mb-1">
                    Step {p.step}
                  </div>
                  <div className="font-display font-bold text-sm text-[#2a1d2e] mb-1">{p.name}</div>
                  <p className="text-[11px] text-[#5a4a5e] leading-tight">{p.desc}</p>
                </div>
                {idx < 6 && (
                  <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 text-pink-300 font-bold text-xs z-10">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Trust Narrative Box with Real CakeStory Craft Imagery Composition */}
          <div className="glass rounded-3xl p-6 sm:p-10 bg-white/90 border border-white/80 shadow-md grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 min-w-0">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#2a1d2e] mb-3">
                Building Trust for Customers & Franchise Partners
              </h3>
              <p className="text-xs sm:text-sm text-[#5a4a5e] leading-relaxed mb-4">
                We believe brand reputation is won or lost on consistency. When a family celebrates a first birthday or an anniversary, there is zero room for error.
              </p>
              <p className="text-xs sm:text-sm text-[#5a4a5e] leading-relaxed mb-6">
                By removing in-store baking variables and enforcing pharmaceutical-grade hygiene in our central kitchen, we safeguard both our brand and your franchise investment.
              </p>

              <div className="space-y-3">
                {[
                  "100% Stainless-steel sanitised work surfaces",
                  "Daily temperature-controlled cold chain dispatch",
                  "Zero artificial chemical bulkers or shortcuts",
                  "Dedicated vegetarian and eggless preparation protocols",
                ].map((point) => (
                  <div key={point} className="flex items-center gap-3 glass-soft rounded-2xl p-3 text-xs font-semibold text-[#2a1d2e]">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs flex-shrink-0">
                      ✓
                    </span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 min-w-0">
              <ImageReveal
                src="DSC03187.JPG"
                alt="CakeStory Desserts Mirror Glaze Precision Bake"
                aspect="3/4"
                fit="contain"
                glassFrame
                revealVariant="clip-up"
                badge="Central Kitchen Excellence"
                badgePosition="bottom-right"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — OUR OUTLETS (PUNE EXPANSION NETWORK) */}
      <section className="reveal-section py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-pink-50/30 to-transparent relative overflow-hidden">
        <BakeryBackgroundDecor variant="outlets" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100 text-[#ff5c97] text-xs font-bold uppercase tracking-wider mb-3">
                Pune Expansion
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#2a1d2e] font-bold break-words">
                Growing Across Pune
              </h2>
              <p className="text-sm sm:text-base text-[#5a4a5e] mt-2 max-w-xl">
                "Every outlet is another chapter in the CakeStory Desserts journey." Explore our active locations across 5 Pune zones.
              </p>
            </div>
            <Link to="/outlets" className="btn-primary glass-shine !py-3 !px-6 text-sm font-bold shadow-md self-start md:self-auto">
              Explore Our Outlets →
            </Link>
          </div>

          {/* Outlets Zone Cards Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {allOutlets.slice(0, 4).map((outlet, idx) => (
              <div key={outlet.id} className="reveal-card min-w-0">
                <OutletCard
                  outlet={outlet}
                  priority={idx < 2}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — FRANCHISE CTA (FIXED DARK GLASS CARD WITH HIGH-CONTRAST TEXT & OVERLAY) */}
      <section className="reveal-section py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <BakeryBackgroundDecor variant="cta" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="glass-dark rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-14 text-center border border-white/30 shadow-2xl relative overflow-hidden text-white">
            {/* Parallax Background Real Asset Overlay */}
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
              <img
                src="/images/franchise-hero.png"
                alt="CakeStory Franchise Store"
                className="w-full h-full object-cover scale-105 parallax-bg"
                style={{ imageOrientation: "from-image" }}
              />
              {/* Dedicated Dark Gradient Overlay for Maximum Readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-purple-950/70 to-slate-950/90" />
            </div>

            <div className="relative z-20">
              <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-6 p-2.5 rounded-2xl glass-soft border border-white/40 shadow-lg flex items-center justify-center bg-white/20 backdrop-blur-md">
                <img src="/assets/logo/cs-logo.png" alt="CakeStory Desserts" className="max-h-full max-w-full object-contain filter drop-shadow-md" />
              </div>

              <h2 className="font-display text-2.5xl sm:text-4xl lg:text-5xl text-white font-bold mb-4 break-words drop-shadow-sm">
                Ready to Build Your Business With CakeStory Desserts?
              </h2>
              <p className="text-sm sm:text-lg text-pink-100/95 max-w-2xl mx-auto mb-8 leading-relaxed font-light drop-shadow-xs">
                We're looking for motivated partners who want to grow with a brand that understands products, people and process.
              </p>

              <div className="flex flex-wrap justify-center items-center gap-4">
                <button
                  onClick={openModal}
                  className="btn-primary glass-shine !py-3.5 sm:!py-4 !px-7 sm:!px-9 text-sm sm:text-base font-bold shadow-xl shadow-pink-500/50"
                >
                  <span>Start Your Franchise Journey</span>
                  <span>→</span>
                </button>
                <Link
                  to="/franchise"
                  className="btn-ghost !py-3.5 sm:!py-4 !px-7 sm:!px-8 text-sm sm:text-base font-semibold bg-white/20 text-white border-white/40 hover:bg-white/35 backdrop-blur-md"
                >
                  Learn About Franchise
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
