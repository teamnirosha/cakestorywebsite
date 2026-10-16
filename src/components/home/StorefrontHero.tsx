import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import heroBg from "../../assets/hero/cakestory-hero.jpg";
import { useFranchiseModal } from "../common/FranchiseModal";
import { useLanguage } from "../../context/LanguageContext";
import { prefersReducedMotion, MOTION } from "../../utils/motion";

export default function StorefrontHero() {
  const { openModal } = useFranchiseModal();
  const { t } = useLanguage();

  const sectionRef = useRef<HTMLElement | null>(null);
  const parallaxLayerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const titlePrefixRef = useRef<HTMLSpanElement | null>(null);
  const titleHighlightRef = useRef<HTMLSpanElement | null>(null);
  const trustRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement | null>(null);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const navHeight = 78;
      const targetY =
        id === "home" ? 0 : Math.max(0, el.getBoundingClientRect().top + window.scrollY - navHeight);
      window.scrollTo({
        top: targetY,
        behavior: prefersReducedMotion() ? "instant" : "smooth",
      });
    }
  };

  useEffect(() => {
    if (prefersReducedMotion()) {
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Entrance timeline (target duration ~1.0 - 1.15s)
      const tl = gsap.timeline({
        defaults: { ease: MOTION.ease.default },
      });

      // 1.1 Hero background image subtle reveal and settling scale from 1.04 down to 1.0
      if (imgRef.current) {
        tl.fromTo(
          imgRef.current,
          { opacity: 0.88, scale: 1.04 },
          {
            opacity: 1,
            scale: 1,
            duration: MOTION.duration.hero,
            ease: MOTION.ease.editorial,
            transformOrigin: "80% top",
            clearProps: "opacity,transform",
          },
          0
        );
      }

      // 1.2 Status pill badge with small upward movement and fade
      if (badgeRef.current) {
        tl.fromTo(
          badgeRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: MOTION.duration.reveal, ease: MOTION.ease.default, clearProps: "opacity,transform" },
          0.12
        );
      }

      // 1.3 Headline lines with restrained stagger, preserving correct text wrapping
      const titleParts = [titlePrefixRef.current, titleHighlightRef.current].filter(Boolean);
      if (titleParts.length > 0) {
        tl.fromTo(
          titleParts,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: MOTION.duration.reveal,
            stagger: 0.1,
            ease: MOTION.ease.default,
            clearProps: "opacity,transform",
          },
          0.22
        );
      }

      // 1.4 Supporting trust points with short stagger
      if (trustRef.current) {
        const trustItems = trustRef.current.querySelectorAll(".hero-trust-item");
        tl.fromTo(
          trustItems.length > 0 ? trustItems : trustRef.current,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.08,
            ease: MOTION.ease.default,
            clearProps: "opacity,transform",
          },
          0.42
        );
      }

      // 1.5 CTA Buttons reveal
      if (ctaRef.current) {
        tl.fromTo(
          ctaRef.current,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: MOTION.ease.default,
            clearProps: "opacity,transform",
          },
          0.58
        );
      }

      // 1.6 Scroll indicator reveal
      if (scrollIndicatorRef.current) {
        tl.fromTo(
          scrollIndicatorRef.current,
          { opacity: 0 },
          { opacity: 0.75, duration: 0.45, ease: MOTION.ease.default },
          0.72
        );
      }

      // 2. Fade out scroll indicator on initial scroll
      if (scrollIndicatorRef.current && sectionRef.current) {
        gsap.to(scrollIndicatorRef.current, {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "20% top",
            scrub: true,
          },
        });
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      aria-label="Hero Section"
      className="relative w-full min-h-screen flex items-center overflow-hidden bg-stone-950 pt-24 sm:pt-28 pb-16"
    >
      {/* 1. Full-Bleed Authentic CakeStory Storefront Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div ref={parallaxLayerRef} className="w-full h-full">
          <img
            ref={imgRef}
            src={heroBg}
            alt="CakeStory Desserts Pune Storefront with Handcrafted Celebration Cakes"
            className="w-full h-full object-cover object-[78%_top] md:object-[82%_top] lg:object-[86%_top] will-change-transform"
          />
        </div>

        {/* Directional Dark Gradient Overlay for Maximum Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/30 md:via-black/65 md:to-transparent md:via-55% pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
      </div>

      {/* 2. Left-Aligned Content Overlay (Directly Over Background Image) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-auto py-8 sm:py-12">
        <div className="max-w-xl lg:max-w-2xl text-left flex flex-col items-start space-y-5 sm:space-y-6">
          
          {/* Status Pill Badge */}
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-white shadow-lg"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse motion-reduce:animate-none" />
            <span className="tracking-wide">{t("hero.badge")}</span>
          </div>

          {/* Punchy Headline Directly Over Image with Refined Editorial Typography */}
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[50px] xl:text-[56px] tracking-tight leading-[1.18] sm:leading-[1.16] drop-shadow-xl flex flex-col gap-2 sm:gap-2.5">
            <span
              ref={titlePrefixRef}
              className="font-normal text-white drop-shadow-md tracking-tight"
            >
              {t("hero.titlePrefix")}
            </span>
            <span
              ref={titleHighlightRef}
              className="font-medium text-[#f3ca85] drop-shadow-md tracking-tight"
            >
              {t("hero.titleHighlight")}
            </span>
          </h1>

          {/* 3 Core Trust Dots */}
          <div
            ref={trustRef}
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm sm:text-base font-medium text-stone-200/95 drop-shadow-md"
          >
            <span className="hero-trust-item inline-flex items-center gap-2">
              <span className="text-amber-400 text-sm">●</span>
              <span>{t("hero.trust1")}</span>
            </span>
            <span className="hero-trust-item inline-flex items-center gap-2">
              <span className="text-amber-400 text-sm">●</span>
              <span>{t("hero.trust2")}</span>
            </span>
            <span className="hero-trust-item inline-flex items-center gap-2">
              <span className="text-amber-400 text-sm">●</span>
              <span>{t("hero.trust3")}</span>
            </span>
          </div>

          {/* High-Converting CTA Buttons */}
          <div ref={ctaRef} className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => scrollToSection("story")}
              className="px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-stone-950 font-semibold text-sm sm:text-base shadow-xl shadow-amber-500/25 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 cursor-pointer border border-amber-300"
            >
              <span>▷</span>
              <span>{t("hero.ctaSecondary")}</span>
            </button>

            <button
              onClick={openModal}
              className="px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white font-semibold text-sm sm:text-base border border-white/40 hover:border-white transition-all flex items-center gap-2 cursor-pointer hover:-translate-y-0.5 shadow-lg"
            >
              <span>{t("hero.ctaPrimary")}</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Bottom Center Animated Mouse Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
      >
        <button
          onClick={() => scrollToSection("story")}
          className="cursor-pointer focus:outline-none"
          aria-label="Scroll to story section"
        >
          <div className="w-5 h-8 rounded-full border-2 border-white/60 flex items-start justify-center p-1 shadow-md">
            <div className="w-1.5 h-2 bg-amber-400 rounded-full animate-bounce motion-reduce:animate-none" />
          </div>
        </button>
      </div>
    </section>
  );
}
