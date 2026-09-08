import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useFranchiseModal } from "../common/FranchiseModal";
import CakeImage from "../common/CakeImage";

gsap.registerPlugin(ScrollTrigger);

export default function CustomizationExperience() {
  const { openModal } = useFranchiseModal();
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const [activeTab, setActiveTab] = useState<number>(0);

  const customizationPillars = [
    {
      step: "01",
      tag: "THE CONCEPT",
      title: "Themes, Characters & Milestone Stories",
      desc: "Whether a child's favorite superhero, a romantic rose-water wedding tier, or a corporate milestone logo, we build from your raw idea.",
      image: "AZ_01460.JPG",
      caption: "Handcrafted Multi-Tier Celebration Craft",
      annotation: "Customized Theme Piping & Sculpted Finish",
    },
    {
      step: "02",
      tag: "THE FLAVOR & SPONGE",
      title: "100% Eggless Artisanal Formulations",
      desc: "Cloud-soft sponge formulation engineered for springiness and moisture, infused with Dutch cocoa, Belgian truffle ganache, or natural fruit purees.",
      image: "DSC03187.JPG",
      caption: "Belgian Chocolate Truffle & High-Gloss Glaze",
      annotation: "Gram-Calibrated Cocoa & Mirror Glaze Precision",
    },
    {
      step: "03",
      tag: "THE ARTISANAL FINISH",
      title: "Precision Piping & Fresh Details",
      desc: "Finished manually by master patissiers using Belgian chocolate curls, hand-drawn buttercream borders, and fresh Mahabaleshwar berries.",
      image: "AZ_01683.JPG",
      caption: "Fresh Fruit Gateau & Delicate Layer Crumb",
      annotation: "Hand-Positioned Fresh Fruit & Preserves",
    },
  ];

  const currentPillar = customizationPillars[activeTab];

  // Mouse Parallax Effect for Desktop
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(pointer: coarse)").matches || !imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(".editorial-cake-image", {
      x: x * 10,
      y: y * 10,
      duration: 0.8,
      ease: "power2.out",
    });
    gsap.to(".editorial-tag-node", {
      x: x * -8,
      y: y * -8,
      duration: 0.9,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to([".editorial-cake-image", ".editorial-tag-node"], {
      x: 0,
      y: 0,
      duration: 0.9,
      ease: "power2.out",
    });
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Coordinated ScrollTrigger timeline for editorial reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 82%",
          end: "bottom 85%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        ".editorial-eyebrow",
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", clearProps: "opacity,transform" }
      )
        .fromTo(
          headlineRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", clearProps: "opacity,transform" },
          "-=0.4"
        )
        .fromTo(
          subRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", clearProps: "opacity,transform" },
          "-=0.4"
        )
        .fromTo(
          maskRef.current,
          { clipPath: "circle(20% at 50% 50%)", opacity: 0.6 },
          { clipPath: "circle(75% at 50% 50%)", opacity: 1, duration: 1.1, ease: "power3.inOut", clearProps: "opacity" },
          "-=0.5"
        )
        .fromTo(
          ".editorial-tag-node",
          { opacity: 0, y: 15, scale: 0.95 },
          { opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.6, ease: "power2.out", clearProps: "opacity,transform" },
          "-=0.6"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="reveal-section py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-white via-pink-50/25 to-white"
    >
      {/* Delicate Ambient Pastel Blobs */}
      <div
        className="blob pointer-events-none select-none"
        style={{
          width: 520,
          height: 520,
          top: -80,
          right: -100,
          background: "radial-gradient(circle, #ffd4e5 0%, transparent 70%)",
        }}
      />
      <div
        className="blob pointer-events-none select-none"
        style={{
          width: 440,
          height: 440,
          bottom: -60,
          left: -80,
          background: "radial-gradient(circle, #bde0fe 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Editorial Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="editorial-eyebrow inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-100 text-[#ff5c97] text-xs font-bold uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-[#ff5c97] animate-pulse" />
            <span>The Art of Custom Creation</span>
          </div>

          <h2
            ref={headlineRef}
            className="font-display text-3.5xl sm:text-5xl lg:text-6xl text-[#2a1d2e] font-bold leading-tight tracking-tight break-words"
          >
            IF YOU CAN IMAGINE IT, <span className="gradient-text italic">WE WILL CREATE IT.</span>
          </h2>

          <p
            ref={subRef}
            className="text-sm sm:text-base lg:text-lg text-[#5a4a5e] mt-4 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Some customers know exactly what they want. Others bring us nothing more than a memory, a theme, or a color. That is where CakeStory begins.
          </p>
        </div>

        {/* Editorial Interactive Campaign Stage */}
        <div className="glass rounded-[2.5rem] p-6 sm:p-10 lg:p-12 bg-white/85 border border-white shadow-xl grid lg:grid-cols-12 gap-8 lg:gap-12 items-center relative overflow-hidden">
          {/* Left 6 Cols: Editorial Copy & Interactive Tab Selector */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-block text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full bg-amber-100 text-amber-900">
              Customization Capability
            </div>

            <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2a1d2e] leading-snug">
              "YOU THINK WE CAN'T ?
<br />THINK AGAIN."
            </h3>

            <p className="text-xs sm:text-sm text-[#5a4a5e] leading-relaxed">
              Every custom cake at CakeStory Desserts is crafted around your unique moment—combining 100% vegetarian eggless sponge formulations, real cocoa butter truffle, and hand-piped artisanal details.
            </p>

            {/* Interactive Concept Pillars Tabs */}
            <div className="space-y-3 pt-2">
              {customizationPillars.map((p, idx) => {
                const isActive = activeTab === idx;
                return (
                  <div
                    key={p.step}
                    onClick={() => setActiveTab(idx)}
                    onMouseEnter={() => setActiveTab(idx)}
                    className={`glass rounded-2xl p-4 cursor-pointer transition-all duration-300 ${
                      isActive
                        ? "bg-white border-pink-400 shadow-md translate-x-1.5"
                        : "bg-white/70 border-white hover:bg-white shadow-2xs"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-[#ff5c97] uppercase tracking-wider">
                        {p.step} • {p.tag}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive ? "bg-pink-500 text-white" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        Active Focus
                      </span>
                    </div>
                    <div className="font-display font-bold text-base text-[#2a1d2e] mb-1">
                      {p.title}
                    </div>
                    <p className="text-xs text-[#5a4a5e] leading-relaxed">{p.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 6 Cols: High-Resolution Real Cake Story Visual with Editorial Blueprint Annotations */}
          <div ref={imageContainerRef} className="lg:col-span-6 min-w-0 relative">
            <div
              ref={maskRef}
              className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-white bg-slate-50 group"
            >
              {/* High-Resolution Real CakeStory Asset */}
              <div className="editorial-cake-image w-full aspect-[4/3] sm:aspect-[3/4] overflow-hidden relative">
                <CakeImage
                  key={currentPillar.image}
                  src={currentPillar.image}
                  alt={currentPillar.title}
                  aspect="3/4"
                  fit="contain"
                  priority
                  hoverZoom
                  badge={currentPillar.caption}
                  badgePosition="bottom-left"
                  className="w-full h-full transition-transform duration-700"
                />
              </div>

              {/* Floating Editorial Annotation Badge 1 */}
              <div className="editorial-tag-node absolute top-5 right-5 glass rounded-2xl px-3.5 py-2 bg-white/95 border border-white shadow-lg text-left backdrop-blur-md hidden sm:block">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#ff5c97]">
                  {currentPillar.tag}
                </div>
                <div className="text-xs font-bold text-[#2a1d2e] mt-0.5">
                  {currentPillar.annotation}
                </div>
              </div>

              {/* Floating Editorial Annotation Badge 2 */}
              <div className="editorial-tag-node absolute bottom-5 right-5 glass rounded-2xl px-3.5 py-2 bg-slate-900/90 text-white border border-white/20 shadow-lg text-left backdrop-blur-md">
                <div className="text-[9px] font-bold uppercase tracking-wider text-pink-300">
                  Quality Standard
                </div>
                <div className="text-xs font-semibold text-white mt-0.5">
                  100% Eggless • Central Kitchen SOPs
                </div>
              </div>
            </div>

            {/* Subtle Editorial Line Accent */}
            <svg
              className="absolute -bottom-6 -left-6 w-32 h-32 pointer-events-none opacity-40 text-pink-300"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            >
              <circle cx="50" cy="50" r="40" />
              <line x1="10" y1="50" x2="90" y2="50" />
            </svg>
          </div>
        </div>

        {/* Business & Franchise Connection Footer */}
        <div className="mt-12 glass rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-pink-500/10 via-rose-300/15 to-amber-200/15 border border-white shadow-md text-center flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left max-w-2xl">
            <div className="text-xs font-bold text-[#ff5c97] uppercase tracking-wider mb-1">
              Franchise Partner Advantage
            </div>
            <h4 className="font-display font-bold text-lg sm:text-xl text-[#2a1d2e] mb-1">
              "A Bakery Brand That Adapts To Every Local Celebration."
            </h4>
            <p className="text-xs sm:text-sm text-[#5a4a5e] leading-relaxed">
              That creative agility is built into the CakeStory Desserts business model—allowing franchise outlets to satisfy neighborhood customer demand with zero in-store baking complexity.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <button
              onClick={openModal}
              className="btn-primary glass-shine !py-3.5 !px-7 text-xs sm:text-sm font-bold shadow-lg shadow-pink-300/50"
            >
              EXPLORE FRANCHISE →
            </button>
            <Link
              to="/franchise"
              className="btn-ghost !py-3.5 !px-6 text-xs sm:text-sm font-semibold border border-pink-200"
            >
              Learn Partner System
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
