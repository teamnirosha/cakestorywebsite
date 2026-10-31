import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { prefersReducedMotion } from "../../utils/motion";

import themeCakesImg from "../../assets/why-cakestory/theme-cakes.jpg";
import cupcakesBrowniesImg from "../../assets/why-cakestory/cupcakes-brownies.jpg";
import iceCreamImg from "../../assets/why-cakestory/ice-cream.jpg";
import dessertsImg from "../../assets/why-cakestory/desserts.jpg";
import snacksImg from "../../assets/why-cakestory/snacks.jpg";

// Handcrafted SVG vector icons matching the reference mockup and design tokens
function ThemeCakeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="14" width="18" height="7" rx="1.5" />
      <rect x="6" y="9" width="12" height="5" rx="1" />
      <path d="M12 4v2" />
      <path d="M12 2a1 1 0 0 1 1 1c0 .5-.5 1-1 1s-1-.5-1-1a1 1 0 0 1 1-1z" fill="currentColor" />
      <line x1="3" y1="18" x2="21" y2="18" strokeDasharray="1 2" />
      <line x1="6" y1="12" x2="18" y2="12" strokeDasharray="1 2" />
    </svg>
  );
}

function CupcakeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 10h-1.26A5 5 0 0 0 7.26 10H6a3 3 0 0 0-3 3v1a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1a3 3 0 0 0-3-3Z" />
      <path d="M5 16l1.5 6h11L19 16" />
      <circle cx="12" cy="4" r="1.5" />
      <path d="M12 5.5V7" />
      <path d="M9 16l-.8 6" />
      <path d="M15 16l.8 6" />
    </svg>
  );
}

function IceCreamIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m7 11 5 11 5-11" />
      <path d="M12 2a5 5 0 0 0-4.9 6.02A3.5 3.5 0 0 0 7 11h10a3.5 3.5 0 0 0-.1-2.98A5 5 0 0 0 12 2Z" />
      <path d="M9 14.5l6-3.5" />
      <path d="M9.5 17.5l4-2.5" />
    </svg>
  );
}

function DessertsIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 8h16l-2 8a3 3 0 0 1-3 2H9a3 3 0 0 1-3-2L4 8Z" />
      <path d="M6 8c0-2.2 2.7-4 6-4s6 1.8 6 4" />
      <circle cx="12" cy="3" r="1.5" fill="currentColor" />
      <path d="M12 18v3" />
      <path d="M9 21h6" />
    </svg>
  );
}

function SnacksIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 14c2-4 7-8 12-7 3 .6 5 3 4 6-1 3-5 5-9 5-3 0-6-1.5-7-4Z" />
      <path d="M8 9.5c1.5 2 3.5 4 6.5 4.5" />
      <path d="M11 7c1 2 2.5 3.5 5 4" />
      <path d="M3 13.5c-.8.5-1.5 1.5-1 2.5s2 1.5 3.5 1" />
    </svg>
  );
}

function ChevronLeftIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export interface ProductCardData {
  id: string;
  titleKey: string;
  descKey: string;
  accentKey: string;
  image: string;
  alt: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function WhyCakeStorySection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement | null>(null);

  // Authoritative active card index (starts at 2: Ice Cream, matching reference screenshot)
  const [activeIndex, setActiveIndex] = useState<number>(2);

  // Hover preview state
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Interaction flag: pauses autoplay during active hover, touch, or manual interaction
  const [isInteracting, setIsInteracting] = useState<boolean>(false);

  // Viewport visibility tracked via IntersectionObserver
  const [isInViewport, setIsInViewport] = useState<boolean>(true);

  // Timer lifecycle management
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recoveryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Touch swipe support for mobile
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const productCards: ProductCardData[] = [
    {
      id: "theme-cakes",
      titleKey: "why.card1Title",
      descKey: "why.card1Desc",
      accentKey: "why.card1Accent",
      image: themeCakesImg,
      alt: "CakeStory Theme Celebration Cakes",
      icon: ThemeCakeIcon,
    },
    {
      id: "cupcakes-brownies",
      titleKey: "why.card2Title",
      descKey: "why.card2Desc",
      accentKey: "why.card2Accent",
      image: cupcakesBrowniesImg,
      alt: "CakeStory Gourmet Cupcakes and Brownies Box",
      icon: CupcakeIcon,
    },
    {
      id: "ice-cream",
      titleKey: "why.card3Title",
      descKey: "why.card3Desc",
      accentKey: "why.card3Accent",
      image: iceCreamImg,
      alt: "CakeStory Pure Dairy Artisan Ice Cream Scoops",
      icon: IceCreamIcon,
    },
    {
      id: "desserts",
      titleKey: "why.card4Title",
      descKey: "why.card4Desc",
      accentKey: "why.card4Accent",
      image: dessertsImg,
      alt: "CakeStory Layered Gourmet Sundae Desserts",
      icon: DessertsIcon,
    },
    {
      id: "snacks",
      titleKey: "why.card5Title",
      descKey: "why.card5Desc",
      accentKey: "why.card5Accent",
      image: snacksImg,
      alt: "CakeStory Fresh Bakery Snacks and Croissants",
      icon: SnacksIcon,
    },
  ];

  // Helper for modular wrapping distance in range [-2, 2]
  const getModularOffset = useCallback((index: number, active: number, total: number) => {
    let diff = index - active;
    while (diff > total / 2) diff -= total;
    while (diff < -total / 2) diff += total;
    return diff;
  }, []);

  // 1. IntersectionObserver: Suspends autoplay when outside viewport
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting && entry.intersectionRatio > 0.08);
      },
      {
        threshold: [0, 0.08, 0.3],
        rootMargin: "0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 2. Smooth Autoplay (Cycles every 4.2 seconds when not interacting)
  useEffect(() => {
    if (prefersReducedMotion() || !isInViewport || hoveredIndex !== null || isInteracting) {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
      return;
    }

    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }

    autoplayTimerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % productCards.length);
    }, 4200);

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
    };
  }, [isInViewport, hoveredIndex, isInteracting, productCards.length]);

  // Clean up all timers on unmount
  useEffect(() => {
    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
      if (recoveryTimeoutRef.current) clearTimeout(recoveryTimeoutRef.current);
    };
  }, []);

  // Interaction Handlers
  const handleCardMouseEnter = useCallback((idx: number) => {
    if (recoveryTimeoutRef.current) {
      clearTimeout(recoveryTimeoutRef.current);
      recoveryTimeoutRef.current = null;
    }
    setHoveredIndex(idx);
    setIsInteracting(true);
  }, []);

  const handleCardMouseLeave = useCallback(() => {
    setHoveredIndex(null);
    if (recoveryTimeoutRef.current) clearTimeout(recoveryTimeoutRef.current);
    recoveryTimeoutRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 800);
  }, []);

  const handleCardClick = useCallback((idx: number) => {
    setActiveIndex(idx);
    setHoveredIndex(null);
    setIsInteracting(true);
    if (recoveryTimeoutRef.current) clearTimeout(recoveryTimeoutRef.current);
    recoveryTimeoutRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 1000);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + productCards.length) % productCards.length);
    setHoveredIndex(null);
    setIsInteracting(true);
    if (recoveryTimeoutRef.current) clearTimeout(recoveryTimeoutRef.current);
    recoveryTimeoutRef.current = setTimeout(() => setIsInteracting(false), 800);
  }, [productCards.length]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % productCards.length);
    setHoveredIndex(null);
    setIsInteracting(true);
    if (recoveryTimeoutRef.current) clearTimeout(recoveryTimeoutRef.current);
    recoveryTimeoutRef.current = setTimeout(() => setIsInteracting(false), 800);
  }, [productCards.length]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    }
  };

  // Touch swipe handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsInteracting(true);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX !== null && touchEndX !== null) {
      const distance = touchStartX - touchEndX;
      const isLeftSwipe = distance > 35;
      const isRightSwipe = distance < -35;

      if (isLeftSwipe) {
        handleNext();
      } else if (isRightSwipe) {
        handlePrev();
      }
    }

    setTouchStartX(null);
    setTouchEndX(null);

    if (recoveryTimeoutRef.current) clearTimeout(recoveryTimeoutRef.current);
    recoveryTimeoutRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 800);
  };

  return (
    <section
      ref={sectionRef}
      id="why-cakestory"
      aria-label="CakeStory Specialties: More Than Just Cakes"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="relative w-full overflow-hidden focus:outline-hidden scroll-mt-24 sm:scroll-mt-28"
      style={{
        background:
          "radial-gradient(ellipse 75% 65% at 50% 40%, #FFFDF8 0%, #FFF5E8 52%, #F8EADA 100%)",
      }}
    >
      {/* 1. Top Wave Divider (Inverted to smoothly transition from previous section) */}
      <div className="relative w-full -mt-1 leading-none z-10" aria-hidden="true">
        <svg
          viewBox="0 0 1440 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-10 sm:h-14 md:h-18 block"
          style={{ transform: "scaleY(-1)" }}
        >
          <path
            d="M0 90C280 88 440 45 740 45C1040 45 1240 78 1440 68V90H0Z"
            fill="#F5DDD4"
            fillOpacity="0.85"
          />
          <path
            d="M0 90C140 90 260 22 480 40C680 58 760 76 960 88L1040 90H0Z"
            fill="#741334"
          />
        </svg>
      </div>

      {/* Decorative Atmosphere Elements */}
      {/* Top-Right Delicate Champagne Gold Arcs (matching reference screenshot) */}
      <div className="absolute top-8 sm:top-12 right-0 w-64 sm:w-96 h-64 sm:h-96 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <svg viewBox="0 0 400 400" fill="none" className="w-full h-full text-[#D9A044]">
          <path
            d="M400 30 C 260 40, 150 140, 130 380"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeOpacity="0.45"
            fill="none"
          />
          <path
            d="M400 80 C 290 90, 190 180, 170 380"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeOpacity="0.25"
            fill="none"
          />
        </svg>
      </div>

      {/* Subtle soft blur lighting orbs in corners */}
      <div
        className="absolute top-1/4 -left-20 w-80 h-80 rounded-full pointer-events-none opacity-40 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(255, 230, 215, 0.6) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full pointer-events-none opacity-40 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(217, 160, 68, 0.25) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-12 sm:pt-16 md:pt-20 pb-10 sm:pb-14">
        {/* 2. Editorial Section Header (Precision recreation of reference hierarchy) */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          {/* Eyebrow flanked by fine horizontal gold rules */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-3.5 select-none">
            <span className="h-[1px] w-8 sm:w-14 bg-gradient-to-r from-transparent via-[#D9A044]/70 to-[#D9A044]" />
            <span className="text-[11px] sm:text-[12px] font-semibold tracking-[0.24em] uppercase text-[#D9A044] px-1">
              {t("why.eyebrow")}
            </span>
            <span className="h-[1px] w-8 sm:w-14 bg-gradient-to-l from-transparent via-[#D9A044]/70 to-[#D9A044]" />
          </div>

          {/* Main Display Heading in Deep Burgundy Editorial Serif */}
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-medium text-[#780D32] leading-[1.16] tracking-tight">
            {t("why.title")}
          </h2>

          {/* Supporting Description in Muted Warm Taupe */}
          <p className="mt-3 sm:mt-3.5 text-sm sm:text-base text-[#82716E] leading-relaxed max-w-xl mx-auto font-normal">
            {t("why.desc")}
          </p>
        </div>

        {/* 3. Luxury 5-Card Product Showcase Stage */}
        <div className="relative py-4 sm:py-6">
          {/* DESKTOP 3D PERSPECTIVE STAGE: All 5 Cards Visible Together in Precision Curved Geometry */}
          <div className="hidden lg:block relative h-[505px] xl:h-[530px] w-full max-w-[1260px] mx-auto overflow-visible [perspective:1400px]">
            {productCards.map((card, idx) => {
              const offset = getModularOffset(idx, activeIndex, productCards.length);
              const isCenter = offset === 0;
              const isHovered = hoveredIndex === idx;
              const IconComp = card.icon;

              let translateX = "0%";
              let translateY = "0px";
              let scale = 1;
              let rotateY = 0;
              let zIndex = 10;
              let opacity = 1;

              if (offset === 0) {
                // Center active card: elevated, radiant champagne gold border, fully sharp
                translateX = "0%";
                translateY = isHovered ? "-16px" : "-12px";
                scale = 1.05;
                rotateY = 0;
                zIndex = 30;
                opacity = 1;
              } else if (offset === -1) {
                // Immediate Left (Cupcakes & Brownies): subtle inward angle, fully readable
                translateX = "-106%";
                translateY = isHovered ? "0px" : "6px";
                scale = 0.95;
                rotateY = isHovered ? 2 : 6;
                zIndex = isHovered ? 25 : 20;
                opacity = 1;
              } else if (offset === 1) {
                // Immediate Right (Desserts): subtle inward angle, fully readable
                translateX = "106%";
                translateY = isHovered ? "0px" : "6px";
                scale = 0.95;
                rotateY = isHovered ? -2 : -6;
                zIndex = isHovered ? 25 : 20;
                opacity = 1;
              } else if (offset === -2) {
                // Outer Left (Theme Cakes): visible edge card with controlled perspective
                translateX = "-212%";
                translateY = isHovered ? "6px" : "14px";
                scale = 0.90;
                rotateY = isHovered ? 5 : 11;
                zIndex = isHovered ? 22 : 10;
                opacity = 0.96;
              } else if (offset === 2) {
                // Outer Right (Snacks): visible edge card with controlled perspective
                translateX = "212%";
                translateY = isHovered ? "6px" : "14px";
                scale = 0.90;
                rotateY = isHovered ? -5 : -11;
                zIndex = isHovered ? 22 : 10;
                opacity = 0.96;
              }

              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(idx)}
                  onMouseEnter={() => handleCardMouseEnter(idx)}
                  onMouseLeave={handleCardMouseLeave}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isCenter}
                  aria-label={`${t(card.titleKey)}: ${t(card.descKey)}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleCardClick(idx);
                    }
                  }}
                  style={{
                    transform: `translate3d(${translateX}, ${translateY}, 0) scale(${scale}) rotateY(${rotateY}deg)`,
                    zIndex,
                    opacity,
                    transition:
                      "transform 680ms cubic-bezier(0.25, 1, 0.4, 1), opacity 500ms ease, box-shadow 500ms ease, border-color 400ms ease",
                  }}
                  className={`absolute top-4 left-1/2 -ml-[120px] xl:-ml-[130px] w-[240px] xl:w-[260px] group rounded-[24px] xl:rounded-[26px] cursor-pointer flex flex-col overflow-hidden bg-[#FFF9F0] select-none ${
                    isCenter
                      ? "border-2 border-[#D9A044] shadow-[0_24px_50px_-12px_rgba(120,13,50,0.16),0_10px_24px_-5px_rgba(217,160,68,0.28),0_0_0_1px_rgba(217,160,68,0.4)]"
                      : isHovered
                      ? "border border-[#D9A044] shadow-[0_18px_40px_-8px_rgba(120,13,50,0.14),0_6px_16px_rgba(217,160,68,0.2)]"
                      : "border border-[#D9A044]/45 shadow-[0_10px_28px_-6px_rgba(120,13,50,0.08)] hover:border-[#D9A044]/80"
                  }`}
                >
                  {/* Top Food Photography Container (Edge to edge, ~56% height) */}
                  <div className="relative w-full aspect-[4/3.8] overflow-hidden bg-[#FFF5E8]">
                    <img
                      src={card.image}
                      alt={card.alt}
                      loading="eager"
                      decoding="async"
                      className="w-full h-full object-cover object-center scale-102 group-hover:scale-106 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-25 group-hover:opacity-10 transition-opacity duration-300" />

                    {/* Subtle Arched Cream Boundary between Image and Panel */}
                    <div className="absolute bottom-0 inset-x-0 h-6 overflow-hidden pointer-events-none">
                      <svg
                        viewBox="0 0 260 24"
                        preserveAspectRatio="none"
                        className="w-full h-full text-[#FFF9F0] fill-current"
                      >
                        <path d="M0 24 C75 24 95 6 130 6 C165 6 185 24 260 24 Z" />
                      </svg>
                    </div>
                  </div>

                  {/* Overlapping Circular Category Icon Badge at Curve Peak */}
                  <div className="relative flex justify-center -mt-5.5 z-20">
                    <div
                      className={`w-11 h-11 xl:w-12 xl:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCenter
                          ? "bg-[#FFF9F0] text-[#780D32] border-2 border-[#D9A044] shadow-[0_4px_12px_rgba(217,160,68,0.35)] scale-105"
                          : "bg-[#FFF9F0] text-[#780D32] border border-[#D9A044]/60 group-hover:border-[#D9A044] group-hover:scale-105 shadow-[0_2px_8px_rgba(120,13,50,0.08)]"
                      }`}
                    >
                      <IconComp className="w-5 h-5 xl:w-5.5 xl:h-5.5" />
                    </div>
                  </div>

                  {/* Information Panel */}
                  <div className="p-4 xl:p-5 pt-2 xl:pt-2.5 text-center flex flex-col items-center flex-grow justify-between">
                    <div>
                      <h3
                        className={`font-display text-[17px] xl:text-[18.5px] font-semibold transition-colors duration-300 line-clamp-1 ${
                          isCenter ? "text-[#780D32]" : "text-[#780D32] group-hover:text-[#90133E]"
                        }`}
                      >
                        {t(card.titleKey)}
                      </h3>

                      <p className="mt-1.5 xl:mt-2 text-xs xl:text-[12.5px] text-[#82716E] leading-relaxed line-clamp-3 font-normal max-w-[215px] mx-auto">
                        {t(card.descKey)}
                      </p>
                    </div>

                    {/* Bottom Affordance: Accent Label on Active Hero, Minimal Arrow on Side Cards */}
                    <div className="pt-2 xl:pt-3 w-full flex items-center justify-center min-h-[28px]">
                      {isCenter ? (
                        <span className="text-[10px] xl:text-[10.5px] font-semibold tracking-[0.2em] uppercase text-[#D9A044] select-none">
                          {t(card.accentKey)}
                        </span>
                      ) : (
                        <span className="text-sm xl:text-base text-[#780D32]/75 group-hover:text-[#780D32] group-hover:translate-x-1 transition-all duration-300 select-none">
                          →
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* TABLET VIEW (640px to 1023px): 3 Prominently Visible Cards with Center Hero */}
          <div className="hidden sm:block lg:hidden relative h-[480px] w-full max-w-[720px] mx-auto overflow-hidden [perspective:1200px]">
            {productCards.map((card, idx) => {
              const offset = getModularOffset(idx, activeIndex, productCards.length);
              const isCenter = offset === 0;
              const isHovered = hoveredIndex === idx;
              const IconComp = card.icon;

              let translateX = "0%";
              let translateY = "0px";
              let scale = 1;
              let rotateY = 0;
              let zIndex = 10;
              let opacity = 1;
              let pointerEvents: "auto" | "none" = "auto";

              if (offset === 0) {
                translateX = "0%";
                translateY = isHovered ? "-12px" : "-8px";
                scale = isHovered ? 1.06 : 1.04;
                rotateY = 0;
                zIndex = isHovered ? 28 : 25;
                opacity = 1;
              } else if (offset === -1) {
                translateX = "-105%";
                translateY = isHovered ? "0px" : "4px";
                scale = isHovered ? 0.96 : 0.94;
                rotateY = isHovered ? 2 : 5;
                zIndex = isHovered ? 20 : 15;
                opacity = 0.96;
              } else if (offset === 1) {
                translateX = "105%";
                translateY = isHovered ? "0px" : "4px";
                scale = isHovered ? 0.96 : 0.94;
                rotateY = isHovered ? -2 : -5;
                zIndex = isHovered ? 20 : 15;
                opacity = 0.96;
              } else {
                translateX = offset < 0 ? "-210%" : "210%";
                translateY = "12px";
                scale = 0.85;
                rotateY = offset < 0 ? 12 : -12;
                zIndex = 5;
                opacity = 0;
                pointerEvents = "none";
              }

              return (
                <div
                  key={`tab-${card.id}`}
                  onClick={() => handleCardClick(idx)}
                  onMouseEnter={() => handleCardMouseEnter(idx)}
                  onMouseLeave={handleCardMouseLeave}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isCenter}
                  aria-label={`${t(card.titleKey)}: ${t(card.descKey)}`}
                  style={{
                    transform: `translate3d(${translateX}, ${translateY}, 0) scale(${scale}) rotateY(${rotateY}deg)`,
                    zIndex,
                    opacity,
                    pointerEvents,
                    transition:
                      "transform 680ms cubic-bezier(0.25, 1, 0.4, 1), opacity 500ms ease, box-shadow 500ms ease",
                  }}
                  className={`absolute top-4 left-1/2 -ml-[115px] w-[230px] rounded-[24px] cursor-pointer flex flex-col overflow-hidden bg-[#FFF9F0] select-none ${
                    isCenter
                      ? "border-2 border-[#D9A044] shadow-[0_20px_45px_-10px_rgba(120,13,50,0.15),0_8px_20px_-4px_rgba(217,160,68,0.25)]"
                      : "border border-[#D9A044]/45 shadow-md hover:border-[#D9A044]/80"
                  }`}
                >
                  <div className="relative w-full aspect-[4/3.8] overflow-hidden bg-[#FFF5E8]">
                    <img
                      src={card.image}
                      alt={card.alt}
                      loading="eager"
                      decoding="async"
                      className="w-full h-full object-cover object-center scale-102"
                    />
                    <div className="absolute bottom-0 inset-x-0 h-6 overflow-hidden pointer-events-none">
                      <svg
                        viewBox="0 0 260 24"
                        preserveAspectRatio="none"
                        className="w-full h-full text-[#FFF9F0] fill-current"
                      >
                        <path d="M0 24 C75 24 95 6 130 6 C165 6 185 24 260 24 Z" />
                      </svg>
                    </div>
                  </div>

                  <div className="relative flex justify-center -mt-5 z-20">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCenter
                          ? "bg-[#FFF9F0] text-[#780D32] border-2 border-[#D9A044] shadow-sm scale-105"
                          : "bg-[#FFF9F0] text-[#780D32] border border-[#D9A044]/60"
                      }`}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="p-4 pt-2 text-center flex flex-col items-center flex-grow justify-between">
                    <div>
                      <h3 className="font-display text-[17px] font-semibold text-[#780D32] line-clamp-1">
                        {t(card.titleKey)}
                      </h3>
                      <p className="mt-1.5 text-xs text-[#82716E] leading-relaxed line-clamp-3">
                        {t(card.descKey)}
                      </p>
                    </div>
                    <div className="pt-2 w-full flex items-center justify-center min-h-[26px]">
                      {isCenter ? (
                        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#D9A044]">
                          {t(card.accentKey)}
                        </span>
                      ) : (
                        <span className="text-sm text-[#780D32]/75">→</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* MOBILE COVERFLOW (Below 640px): 1 Dominant Active Card + Peeking Flanks + Natural Touch Swipe */}
          <div
            className="sm:hidden relative w-full overflow-hidden py-2 select-none [perspective:1200px]"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative h-[450px] w-full mx-auto overflow-visible [transform-style:preserve-3d]">
              {productCards.map((card, idx) => {
                const offset = getModularOffset(idx, activeIndex, productCards.length);
                const isCenter = offset === 0;
                const IconComp = card.icon;

                let translateX = "-50%";
                let translateY = "0px";
                let scale = 1;
                let rotateY = 0;
                let opacity = 1;
                let zIndex = 10;
                let pointerEvents: "auto" | "none" = "auto";

                if (offset === 0) {
                  translateX = "-50%";
                  translateY = "0px";
                  scale = 1;
                  rotateY = 0;
                  opacity = 1;
                  zIndex = 25;
                } else if (offset === -1) {
                  // Left flanking card visibly peeking from left edge
                  translateX = "calc(-142% - 8px)";
                  translateY = "4px";
                  scale = 0.90;
                  rotateY = 8;
                  opacity = 0.88;
                  zIndex = 15;
                } else if (offset === 1) {
                  // Right flanking card visibly peeking from right edge
                  translateX = "calc(42% + 8px)";
                  translateY = "4px";
                  scale = 0.90;
                  rotateY = -8;
                  opacity = 0.88;
                  zIndex = 15;
                } else {
                  translateX = offset < 0 ? "calc(-230% - 15px)" : "calc(130% + 15px)";
                  translateY = "10px";
                  scale = 0.80;
                  rotateY = offset < 0 ? 15 : -15;
                  opacity = 0;
                  zIndex = 5;
                  pointerEvents = "none";
                }

                return (
                  <div
                    key={`mob-${card.id}`}
                    onClick={() => handleCardClick(idx)}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isCenter}
                    aria-label={`${t(card.titleKey)}: ${t(card.descKey)}`}
                    style={{
                      position: "absolute",
                      top: "4px",
                      left: "50%",
                      width: "min(68vw, 260px)",
                      transformOrigin: "center center",
                      transform: `translate3d(${translateX}, ${translateY}, 0) scale(${scale}) rotateY(${rotateY}deg)`,
                      zIndex,
                      opacity,
                      pointerEvents,
                      transition:
                        "transform 680ms cubic-bezier(0.25, 1, 0.4, 1), opacity 500ms ease, box-shadow 500ms ease",
                    }}
                    className={`rounded-[22px] cursor-pointer flex flex-col overflow-hidden bg-[#FFF9F0] ${
                      isCenter
                        ? "border-2 border-[#D9A044] shadow-[0_20px_45px_-8px_rgba(120,13,50,0.18),0_8px_20px_-4px_rgba(217,160,68,0.28)]"
                        : "border border-[#D9A044]/45 shadow-md"
                    }`}
                  >
                    <div className="relative w-full aspect-[4/3.8] overflow-hidden bg-[#FFF5E8]">
                      <img
                        src={card.image}
                        alt={card.alt}
                        loading="eager"
                        decoding="async"
                        className="w-full h-full object-cover object-center scale-102"
                      />
                      <div className="absolute bottom-0 inset-x-0 h-5 overflow-hidden pointer-events-none">
                        <svg
                          viewBox="0 0 260 24"
                          preserveAspectRatio="none"
                          className="w-full h-full text-[#FFF9F0] fill-current"
                        >
                          <path d="M0 24 C75 24 95 6 130 6 C165 6 185 24 260 24 Z" />
                        </svg>
                      </div>
                    </div>

                    <div className="relative flex justify-center -mt-5 z-20">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isCenter
                            ? "bg-[#FFF9F0] text-[#780D32] border-2 border-[#D9A044] shadow-sm scale-105"
                            : "bg-[#FFF9F0] text-[#780D32] border border-[#D9A044]/60"
                        }`}
                      >
                        <IconComp className="w-4.5 h-4.5" />
                      </div>
                    </div>

                    <div className="p-3.5 pt-1.5 text-center flex flex-col items-center flex-grow justify-between">
                      <div>
                        <h3 className="font-display text-base font-semibold text-[#780D32] line-clamp-1">
                          {t(card.titleKey)}
                        </h3>
                        <p className="mt-1 text-xs text-[#82716E] leading-relaxed line-clamp-2">
                          {t(card.descKey)}
                        </p>
                      </div>
                      <div className="pt-1.5 w-full flex items-center justify-center min-h-[24px]">
                        {isCenter ? (
                          <span className="text-[9.5px] font-semibold tracking-[0.18em] uppercase text-[#D9A044]">
                            {t(card.accentKey)}
                          </span>
                        ) : (
                          <span className="text-xs text-[#780D32]/75">→</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Elegant Carousel Navigation Controls: Left Arrow, 5 Pagination Dots, Right Arrow */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 select-none">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous specialty"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#D9A044]/60 bg-[#FFF9F0]/80 hover:bg-[#FFF9F0] hover:border-[#D9A044] text-[#780D32] flex items-center justify-center transition-all duration-300 shadow-xs cursor-pointer hover:scale-105 active:scale-95"
            >
              <ChevronLeftIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>

            <div className="flex items-center gap-2 sm:gap-2.5">
              {productCards.map((c, i) => (
                <button
                  key={`dot-${c.id}`}
                  type="button"
                  onClick={() => handleCardClick(i)}
                  aria-label={`Go to ${t(c.titleKey)}`}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    activeIndex === i
                      ? "w-2.5 h-2.5 bg-[#780D32] shadow-xs scale-110"
                      : "w-2 h-2 bg-[#D9A044]/60 hover:bg-[#D9A044]"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next specialty"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#D9A044]/60 bg-[#FFF9F0]/80 hover:bg-[#FFF9F0] hover:border-[#D9A044] text-[#780D32] flex items-center justify-center transition-all duration-300 shadow-xs cursor-pointer hover:scale-105 active:scale-95"
            >
              <ChevronRightIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>
          </div>

          {/* 5. Footer Caption Flanked by Champagne Gold Rules */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10 select-none">
            <span className="h-[1px] w-8 sm:w-14 bg-gradient-to-r from-transparent via-[#D9A044]/70 to-[#D9A044]" />
            <span className="text-[10px] sm:text-[11.5px] font-semibold tracking-[0.24em] uppercase text-[#780D32]">
              {t("why.footerCaption")}
            </span>
            <span className="h-[1px] w-8 sm:w-14 bg-gradient-to-l from-transparent via-[#D9A044]/70 to-[#D9A044]" />
          </div>
        </div>
      </div>

      {/* 6. Bottom Decorative Waves (smoothly transitioning into FranchiseModelSection) */}
      <div className="relative w-full mt-10 sm:mt-14 leading-none" aria-hidden="true">
        <svg
          viewBox="0 0 1440 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-10 sm:h-14 md:h-18 block"
        >
          <path
            d="M0 90C280 88 440 45 740 45C1040 45 1240 78 1440 68V90H0Z"
            fill="#F5DDD4"
            fillOpacity="0.85"
          />
          <path
            d="M0 90C140 90 260 22 480 40C680 58 760 76 960 88L1040 90H0Z"
            fill="#741334"
          />
        </svg>
      </div>
    </section>
  );
}
