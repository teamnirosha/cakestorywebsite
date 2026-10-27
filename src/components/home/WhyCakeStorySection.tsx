import React, { useState, useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { useLanguage } from "../../context/LanguageContext";
import { prefersReducedMotion, MOTION } from "../../utils/motion";

import customCakesImg from "../../assets/why-cakestory/custom-cakes.jpg";
import iceCreamImg from "../../assets/why-cakestory/ice-cream.jpg";
import coldCoffeeImg from "../../assets/why-cakestory/cold-coffee.jpg";
import chocolateBouquetsImg from "../../assets/why-cakestory/chocolate-bouquets.jpg";
import dessertsImg from "../../assets/why-cakestory/desserts.jpg";

// Handcrafted SVG vector icons matching the reference mockup and design tokens
function CakeIcon({ className = "w-5 h-5" }: { className?: string }) {
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
      <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
      <path d="M4 16s1.5-1 4-1 4 2 8 0 4-1 4-1" />
      <path d="M2 21h20" />
      <path d="M7 11V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4" />
      <line x1="12" y1="2" x2="12" y2="5" />
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
    </svg>
  );
}

function ColdCoffeeIcon({ className = "w-5 h-5" }: { className?: string }) {
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
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M5 8h12v9a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8Z" />
      <line x1="6" y1="2" x2="6" y2="4" />
      <line x1="10" y1="2" x2="10" y2="4" />
      <line x1="14" y1="2" x2="14" y2="4" />
    </svg>
  );
}

function BouquetIcon({ className = "w-5 h-5" }: { className?: string }) {
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
      <path d="M12 2a4 4 0 0 0-4 4c0 1.6 1 3 2.4 3.6L6 22h12l-4.4-12.4A4 4 0 0 0 12 2Z" />
      <circle cx="12" cy="6" r="1.5" />
      <circle cx="8" cy="8" r="1.5" />
      <circle cx="16" cy="8" r="1.5" />
      <path d="M10 14h4" />
      <path d="M9 18h6" />
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
      <path d="M18 10h-1.26A5 5 0 0 0 7.26 10H6a3 3 0 0 0-3 3v1a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-1a3 3 0 0 0-3-3Z" />
      <path d="M5 16l1.5 6h11L19 16" />
      <circle cx="12" cy="4" r="1.5" />
      <path d="M12 5.5V7" />
    </svg>
  );
}

// Brand value icons
function LeafIcon({ className = "w-6 h-6" }: { className?: string }) {
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
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

function ShieldCheckIcon({ className = "w-6 h-6" }: { className?: string }) {
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function HeartIcon({ className = "w-6 h-6" }: { className?: string }) {
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
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function SmileIcon({ className = "w-6 h-6" }: { className?: string }) {
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
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5" />
      <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5" />
    </svg>
  );
}

export interface ProductCardData {
  id: string;
  titleKey: string;
  descKey: string;
  tagKey: string;
  badgeKey: string;
  image: string;
  alt: string;
  icon: React.ComponentType<{ className?: string }>;
  accentGlow: string;
}

export default function WhyCakeStorySection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement | null>(null);

  // Authoritative continuous autoplay sequence index (starts at 2: Cold Coffee)
  const [autoplayIndex, setAutoplayIndex] = useState<number>(2);

  // Temporary hover override index (null when not hovering any card)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Interaction flag: pauses autoplay during active hover, touch, or manual click
  const [isInteracting, setIsInteracting] = useState<boolean>(false);

  // Viewport visibility tracked via IntersectionObserver
  const [isInViewport, setIsInViewport] = useState<boolean>(true);

  // Pill and dynamic ambient aura display the hovered card if hovering, or the center card if not
  const pillDisplayIndex = hoveredIndex !== null ? hoveredIndex : autoplayIndex;

  // Refs for bulletproof timer lifecycle management (prevents competing intervals/leaks)
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const recoveryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Touch swipe support for mobile
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const productCards: ProductCardData[] = [
    {
      id: "custom-cakes",
      titleKey: "why.card1Title",
      descKey: "why.card1Desc",
      tagKey: "why.card1Tag",
      badgeKey: "why.card1Badge",
      image: customCakesImg,
      alt: "CakeStory Custom Celebration Cake",
      icon: CakeIcon,
      accentGlow: "rgba(230, 160, 180, 0.22)",
    },
    {
      id: "ice-cream",
      titleKey: "why.card2Title",
      descKey: "why.card2Desc",
      tagKey: "why.card2Tag",
      badgeKey: "why.card2Badge",
      image: iceCreamImg,
      alt: "CakeStory Artisan Ice Cream Scoops",
      icon: IceCreamIcon,
      accentGlow: "rgba(245, 180, 195, 0.22)",
    },
    {
      id: "cold-coffee",
      titleKey: "why.card3Title",
      descKey: "why.card3Desc",
      tagKey: "why.card3Tag",
      badgeKey: "why.card3Badge",
      image: coldCoffeeImg,
      alt: "CakeStory Chilled Frappe Cold Coffee",
      icon: ColdCoffeeIcon,
      accentGlow: "rgba(216, 166, 78, 0.24)",
    },
    {
      id: "chocolate-bouquets",
      titleKey: "why.card4Title",
      descKey: "why.card4Desc",
      tagKey: "why.card4Tag",
      badgeKey: "why.card4Badge",
      image: chocolateBouquetsImg,
      alt: "CakeStory Luxury Chocolate Bouquet",
      icon: BouquetIcon,
      accentGlow: "rgba(134, 27, 67, 0.22)",
    },
    {
      id: "desserts",
      titleKey: "why.card5Title",
      descKey: "why.card5Desc",
      tagKey: "why.card5Tag",
      badgeKey: "why.card5Badge",
      image: dessertsImg,
      alt: "CakeStory Handcrafted Gourmet Desserts",
      icon: DessertsIcon,
      accentGlow: "rgba(235, 175, 95, 0.22)",
    },
  ];

  const brandValues = [
    {
      id: "vegetarian",
      labelKey: "why.value1Label",
      descKey: "why.value1Desc",
      icon: LeafIcon,
    },
    {
      id: "hygienic",
      labelKey: "why.value2Label",
      descKey: "why.value2Desc",
      icon: ShieldCheckIcon,
    },
    {
      id: "quality",
      labelKey: "why.value3Label",
      descKey: "why.value3Desc",
      icon: HeartIcon,
    },
    {
      id: "variety",
      labelKey: "why.value4Label",
      descKey: "why.value4Desc",
      icon: SmileIcon,
    },
  ];

  // 1. IntersectionObserver: Suspends autoplay when outside viewport and resumes seamlessly on entry
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

  // 2. Continuous Autoplay: Cycles through all 5 categories every 3.5 seconds
  useEffect(() => {
    // If reduced motion, or section is outside viewport, or user is currently hovering/interacting, pause timer
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
      setAutoplayIndex((prev) => (prev + 1) % productCards.length);
    }, 3800);

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
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
      if (recoveryTimeoutRef.current) clearTimeout(recoveryTimeoutRef.current);
    };
  }, []);

  // 3. Hover Interaction Handlers with automatic smooth recovery
  const handleCardMouseEnter = useCallback((idx: number) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    if (recoveryTimeoutRef.current) {
      clearTimeout(recoveryTimeoutRef.current);
      recoveryTimeoutRef.current = null;
    }
    setHoveredIndex(idx);
    setIsInteracting(true);
  }, []);

  const handleCardMouseLeave = useCallback(() => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
    }
    // 80ms debounce prevents flickering when moving pointer between adjacent cards
    leaveTimeoutRef.current = setTimeout(() => {
      setHoveredIndex(null);
      // Intentional 800ms recovery delay before resuming continuous autoplay
      if (recoveryTimeoutRef.current) {
        clearTimeout(recoveryTimeoutRef.current);
      }
      recoveryTimeoutRef.current = setTimeout(() => {
        setIsInteracting(false);
      }, 800);
    }, 80);
  }, []);

  // 4. Card Click Handler: sets authoritative sequence to target card and resumes autoplay from there
  const handleCardClick = useCallback((idx: number) => {
    setAutoplayIndex(idx);
    setHoveredIndex(null);
    setIsInteracting(true);
    if (recoveryTimeoutRef.current) {
      clearTimeout(recoveryTimeoutRef.current);
    }
    recoveryTimeoutRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 800);
  }, []);

  const handlePrev = useCallback(() => {
    setAutoplayIndex((prev) => (prev - 1 + productCards.length) % productCards.length);
    setHoveredIndex(null);
    setIsInteracting(true);
    if (recoveryTimeoutRef.current) clearTimeout(recoveryTimeoutRef.current);
    recoveryTimeoutRef.current = setTimeout(() => setIsInteracting(false), 800);
  }, [productCards.length]);

  const handleNext = useCallback(() => {
    setAutoplayIndex((prev) => (prev + 1) % productCards.length);
    setHoveredIndex(null);
    setIsInteracting(true);
    if (recoveryTimeoutRef.current) clearTimeout(recoveryTimeoutRef.current);
    recoveryTimeoutRef.current = setTimeout(() => setIsInteracting(false), 800);
  }, [productCards.length]);

  // Keyboard navigation for accessibility
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
      const isLeftSwipe = distance > 40;
      const isRightSwipe = distance < -40;

      if (isLeftSwipe) {
        handleNext();
      } else if (isRightSwipe) {
        handlePrev();
      }
    }

    setTouchStartX(null);
    setTouchEndX(null);

    // Resume autoplay gracefully after touch interaction settles
    if (recoveryTimeoutRef.current) clearTimeout(recoveryTimeoutRef.current);
    recoveryTimeoutRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 800);
  };

  // GSAP Entrance Animations
  useEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Header reveal
      const headerElements = sectionRef.current?.querySelectorAll(".why-header-anim");
      if (headerElements && headerElements.length > 0) {
        gsap.fromTo(
          headerElements,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: MOTION.duration.reveal,
            stagger: 0.1,
            ease: MOTION.ease.default,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 2. Stage track reveal
      const cardsTrack = sectionRef.current?.querySelector(".why-stage-track");
      if (cardsTrack) {
        gsap.fromTo(
          cardsTrack,
          { opacity: 0, y: 22 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: MOTION.ease.editorial,
            scrollTrigger: {
              trigger: cardsTrack,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // 3. Values row reveal
      const valueElements = sectionRef.current?.querySelectorAll(".why-value-item");
      if (valueElements && valueElements.length > 0) {
        gsap.fromTo(
          valueElements,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: MOTION.ease.default,
            scrollTrigger: {
              trigger: ".why-values-track",
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Compute circular spatial offset for card index relative to autoplayIndex (the center card)
  // Returns normalized offset in range: [-2, -1, 0, 1, 2]
  const getCardOffset = (index: number) => {
    const raw = (index - autoplayIndex + 5) % 5;
    if (raw === 3) return -2;
    if (raw === 4) return -1;
    return raw; // 0, 1, 2
  };

  const activePillCard = productCards[pillDisplayIndex];

  return (
    <section
      ref={sectionRef}
      id="why-cakestory"
      aria-label="Why CakeStory: More Than Just Cakes"
      className="relative scroll-mt-28 sm:scroll-mt-32 pt-32 sm:pt-36 md:pt-40 pb-0 bg-[#FFF9F2] text-[#351522] overflow-hidden select-none transition-colors duration-700"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
    >
      {/* 1. Dynamic Ambient Light Aura that shifts tone with active product */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700 ease-out"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% 25%, ${activePillCard.accentGlow} 0%, rgba(255, 249, 242, 0.96) 65%, #FFF9F2 100%)`,
        }}
      />

      {/* Decorative top-right circle watermark outline */}
      <div
        className="absolute -top-32 -right-32 w-88 sm:w-104 h-88 sm:h-104 rounded-full border border-[#D8A64E]/25 pointer-events-none transition-transform duration-1000 ease-out"
        style={{ transform: `scale(${1 + pillDisplayIndex * 0.015}) rotate(${pillDisplayIndex * 12}deg)` }}
        aria-hidden="true"
      />
      {/* Subtle warm glow in top-left */}
      <div
        className="absolute top-12 left-10 w-72 h-72 rounded-full bg-[#F5DDD4]/40 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* 2. Editorial Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          {/* Eyebrow flanked by delicate horizontal lines */}
          <div className="why-header-anim inline-flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-3.5">
            <span className="w-8 sm:w-12 h-px bg-[#D8A64E]/60 inline-block" />
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.22em] uppercase text-[#861B43]">
              {t("why.eyebrow")}
            </span>
            <span className="w-8 sm:w-12 h-px bg-[#D8A64E]/60 inline-block" />
          </div>

          {/* Main Display Heading */}
          <h2 className="why-header-anim font-display text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-medium text-[#6D1234] leading-[1.18] tracking-tight">
            {t("why.title")}
          </h2>

          {/* Supporting Description */}
          <p className="why-header-anim mt-3 sm:mt-3.5 text-sm sm:text-base text-[#55464A] leading-relaxed font-normal max-w-xl mx-auto">
            {t("why.desc")}
          </p>
        </div>

        {/* 3. PERMANENT LUXURY TOP PILL (Stable container — only internal content transitions) */}
        <div className="why-header-anim flex items-center justify-center mb-8 sm:mb-12">
          <div
            role="status"
            aria-live="polite"
            aria-label={`${t(activePillCard.titleKey)}: ${t(activePillCard.tagKey)}`}
            onClick={handleNext}
            className="relative inline-flex items-center gap-2.5 sm:gap-3.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#861B43] via-[#9B204E] to-[#701336] text-white shadow-[0_8px_24px_rgba(134,27,67,0.32),0_0_0_1px_rgba(216,166,78,0.5)] border border-[#D8A64E]/60 select-none cursor-pointer hover:scale-102 hover:shadow-[0_10px_28px_rgba(216,166,78,0.3)] active:scale-98 transition-all duration-300 min-h-[46px] sm:min-h-[50px] max-w-[94vw] sm:max-w-none"
          >
            {/* Fixed-Size Icon Container: Internal Crossfade & Scale */}
            <div className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-full bg-white/15 backdrop-blur-xs flex items-center justify-center text-amber-200 border border-white/20 shrink-0 overflow-hidden relative">
              {productCards.map((c, i) => {
                const IconComp = c.icon;
                const isActive = pillDisplayIndex === i;
                return (
                  <div
                    key={`pill-icon-${c.id}`}
                    className="absolute inset-0 flex items-center justify-center transition-all duration-350 ease-out"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? "scale(1) rotate(0deg)" : "scale(0.65) rotate(-15deg)",
                      pointerEvents: "none",
                    }}
                    aria-hidden={!isActive}
                  >
                    <IconComp className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-200" />
                  </div>
                );
              })}
            </div>

            {/* Stable Category Name & Tag Container: Smooth Vertical Slide-Fade */}
            <div className="relative min-w-[160px] sm:min-w-[300px] md:min-w-[340px] h-5 sm:h-6 overflow-hidden flex items-center">
              {productCards.map((c, i) => {
                const isActive = pillDisplayIndex === i;
                return (
                  <div
                    key={`pill-text-${c.id}`}
                    className="absolute inset-0 flex items-center gap-1.5 sm:gap-2 transition-all duration-350 ease-out whitespace-nowrap"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive
                        ? "translateY(0)"
                        : i < pillDisplayIndex
                        ? "translateY(-14px)"
                        : "translateY(14px)",
                      pointerEvents: "none",
                    }}
                    aria-hidden={!isActive}
                  >
                    <span className="text-xs sm:text-[13.5px] font-semibold tracking-wide text-white shrink-0">
                      {t(c.titleKey)}
                    </span>
                    <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-[#D8A64E]/80 shrink-0" />
                    <span className="hidden sm:inline-block text-[10px] sm:text-[11px] font-medium text-amber-200/90 tracking-wider uppercase truncate">
                      {t(c.tagKey)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Subtle Progress Indicators: Expanding Gold Capsule */}
            <div className="flex items-center gap-1.5 pl-2 sm:pl-3 border-l border-white/20 shrink-0">
              {productCards.map((c, i) => {
                const isActive = pillDisplayIndex === i;
                return (
                  <button
                    key={`pill-dot-${c.id}`}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(i);
                    }}
                    aria-label={t(c.titleKey)}
                    className={`h-1.5 rounded-full transition-all duration-350 cursor-pointer ${
                      isActive
                        ? "w-4 sm:w-5 bg-[#D8A64E] shadow-[0_0_8px_rgba(216,166,78,0.7)]"
                        : "w-1.5 bg-white/30 hover:bg-white/60"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* 4. Cinematic 3D Product Stage (Continuous Transitions & Interactive Hover Focus) */}
        <div className="relative why-stage-track py-4 sm:py-6">
          {/* DESKTOP 3D CINEMATIC STAGE: 5 Persistent Cards on Coordinated Spatial Coordinates */}
          <div className="hidden lg:block relative h-[500px] xl:h-[530px] w-full max-w-[1280px] mx-auto overflow-visible [perspective:1400px]">
            {productCards.map((card, idx) => {
              const offset = getCardOffset(idx);
              const isCenter = offset === 0;
              const isCardHovered = hoveredIndex === idx;
              const IconComp = card.icon;

              // Spatial 3D Stage parameters with Depth-of-Field Blur
              let translateX = "0%";
              let translateY = "0px";
              let scale = 1;
              let rotateY = 0;
              let zIndex = 10;
              let opacity = 0.55;
              let filter = "none";

              if (offset === 0) {
                // Center Active Card: Razor Sharp & Elevated
                translateX = "0%";
                translateY = isCardHovered ? "-18px" : "-14px";
                scale = isCardHovered ? 1.09 : 1.08;
                rotateY = 0;
                zIndex = 35;
                opacity = 1;
                filter = "blur(0px) brightness(1.0)";
              } else if (offset === -1) {
                // Immediate Left Flank: Soft Depth Blur, lifts & sharpens on hover
                translateX = "-106%";
                translateY = isCardHovered ? "-2px" : "10px";
                scale = isCardHovered ? 0.97 : 0.92;
                rotateY = isCardHovered ? 3 : 8;
                zIndex = isCardHovered ? 32 : 20;
                opacity = isCardHovered ? 1 : 0.82;
                filter = isCardHovered ? "blur(0px) brightness(1.0)" : "blur(3px) brightness(0.90)";
              } else if (offset === 1) {
                // Immediate Right Flank: Soft Depth Blur, lifts & sharpens on hover
                translateX = "106%";
                translateY = isCardHovered ? "-2px" : "10px";
                scale = isCardHovered ? 0.97 : 0.92;
                rotateY = isCardHovered ? -3 : -8;
                zIndex = isCardHovered ? 32 : 20;
                opacity = isCardHovered ? 1 : 0.82;
                filter = isCardHovered ? "blur(0px) brightness(1.0)" : "blur(3px) brightness(0.90)";
              } else if (offset === -2) {
                // Outer Left Flank: Atmospheric Blur, lifts & sharpens on hover
                translateX = "-212%";
                translateY = isCardHovered ? "6px" : "24px";
                scale = isCardHovered ? 0.88 : 0.80;
                rotateY = isCardHovered ? 6 : 15;
                zIndex = isCardHovered ? 30 : 10;
                opacity = isCardHovered ? 0.95 : 0.48;
                filter = isCardHovered ? "blur(0px) brightness(1.0)" : "blur(5.5px) brightness(0.80)";
              } else if (offset === 2) {
                // Outer Right Flank: Atmospheric Blur, lifts & sharpens on hover
                translateX = "212%";
                translateY = isCardHovered ? "6px" : "24px";
                scale = isCardHovered ? 0.88 : 0.80;
                rotateY = isCardHovered ? -6 : -15;
                zIndex = isCardHovered ? 30 : 10;
                opacity = isCardHovered ? 0.95 : 0.48;
                filter = isCardHovered ? "blur(0px) brightness(1.0)" : "blur(5.5px) brightness(0.80)";
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
                    filter,
                    transition:
                      "transform 720ms cubic-bezier(0.25, 1, 0.4, 1), opacity 550ms ease, filter 550ms ease, box-shadow 550ms ease",
                  }}
                  className={`absolute top-4 left-1/2 -ml-[120px] xl:-ml-[130px] w-[240px] xl:w-[260px] group rounded-2xl sm:rounded-3xl cursor-pointer flex flex-col overflow-hidden bg-white ${
                    isCenter
                      ? isCardHovered
                        ? "border-2 border-[#E5B55D] shadow-[0_28px_60px_-8px_rgba(216,166,78,0.52),0_14px_32px_rgba(134,27,67,0.2),0_0_20px_rgba(216,166,78,0.25)]"
                        : "border-2 border-[#D8A64E] shadow-[0_24px_55px_-10px_rgba(216,166,78,0.4),0_12px_28px_rgba(134,27,67,0.15)]"
                      : isCardHovered
                      ? "border-2 border-[#E5B55D] shadow-[0_20px_45px_-6px_rgba(216,166,78,0.42),0_8px_20px_rgba(134,27,67,0.12)]"
                      : "border border-[#F2E5D9] shadow-[0_8px_25px_-5px_rgba(134,27,67,0.06)] hover:border-[#D8A64E]/60 hover:shadow-[0_16px_32px_-6px_rgba(216,166,78,0.22)]"
                  }`}
                >
                  {/* Top Product Image Container */}
                  <div className="relative w-full aspect-[4/4.1] overflow-hidden bg-[#FBF4EE]">
                    <img
                      src={card.image}
                      alt={card.alt}
                      loading="eager"
                      decoding="async"
                      className="w-full h-full object-cover object-center group-hover:scale-104 transition-transform duration-700 ease-out"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity duration-300" />

                    {/* Floating Tactical Badge on Active Card */}
                    {isCenter && (
                      <div className="absolute top-3 right-3 z-20 animate-fadeIn">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#180f1b]/80 backdrop-blur-md text-[10px] font-semibold text-amber-200 border border-amber-300/40 shadow-sm tracking-wide">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>{t(card.badgeKey)}</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Overlapping Circular Category Badge */}
                  <div className="relative flex justify-center -mt-6 sm:-mt-7 z-20">
                    <div
                      className={`w-12 h-12 sm:w-13 sm:h-13 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                        isCenter || isCardHovered
                          ? "bg-[#FFF9F2] text-[#861B43] border-2 border-[#D8A64E] shadow-[0_4px_16px_rgba(216,166,78,0.4)] scale-105"
                          : "bg-white text-[#861B43] border border-[#F0D5C7] group-hover:border-[#D8A64E] group-hover:text-[#6D1234]"
                      }`}
                    >
                      <IconComp className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                  </div>

                  {/* Bottom Text Content */}
                  <div className="p-4 sm:p-5 pt-3 sm:pt-3 text-center flex flex-col items-center flex-grow">
                    <h3
                      className={`font-display text-base sm:text-lg xl:text-[19px] font-semibold transition-colors duration-300 line-clamp-1 ${
                        isCenter || isCardHovered ? "text-[#6D1234]" : "text-[#7B1B3C] group-hover:text-[#6D1234]"
                      }`}
                    >
                      {t(card.titleKey)}
                    </h3>

                    <p className="mt-2 text-xs sm:text-[12.5px] text-[#55464A] leading-relaxed line-clamp-3 font-normal max-w-[220px]">
                      {t(card.descKey)}
                    </p>

                    {/* Active or Hovered Card Bottom Micro-Indicator */}
                    {(isCenter || isCardHovered) && (
                      <span className="mt-3 text-[11px] font-semibold tracking-wider uppercase text-[#D8A64E] inline-flex items-center gap-1 group-hover:text-[#861B43] transition-colors">
                        <span>{t(card.tagKey)}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* TABLET VIEW: 3 Visible Cards with Center Prominence & Depth Blur */}
          <div className="hidden sm:grid lg:hidden grid-cols-3 gap-4 sm:gap-6 items-center px-4 sm:px-6">
            {[-1, 0, 1].map((offset) => {
              const rawIdx = (autoplayIndex + offset + productCards.length) % productCards.length;
              const card = productCards[rawIdx];
              const isCenter = offset === 0;
              const isCardHovered = hoveredIndex === rawIdx;
              const IconComp = card.icon;

              return (
                <div
                  key={`tablet-${card.id}`}
                  onClick={() => handleCardClick(rawIdx)}
                  onMouseEnter={() => handleCardMouseEnter(rawIdx)}
                  onMouseLeave={handleCardMouseLeave}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isCenter}
                  aria-label={`${t(card.titleKey)}: ${t(card.descKey)}`}
                  style={{
                    filter: isCenter || isCardHovered ? "none" : "blur(2px) brightness(0.92)",
                    transform: isCenter
                      ? isCardHovered
                        ? "translateY(-12px) scale(1.05)"
                        : "translateY(-8px) scale(1.03)"
                      : isCardHovered
                      ? "translateY(-4px) scale(0.99)"
                      : "translateY(0) scale(0.96)",
                    opacity: isCenter || isCardHovered ? 1 : 0.82,
                    zIndex: isCenter ? 20 : isCardHovered ? 15 : 10,
                    transition: "all 720ms cubic-bezier(0.25, 1, 0.4, 1)",
                  }}
                  className={`rounded-3xl cursor-pointer flex flex-col overflow-hidden ${
                    isCenter
                      ? "bg-white border-2 border-[#D8A64E] shadow-[0_20px_45px_-6px_rgba(216,166,78,0.35)]"
                      : isCardHovered
                      ? "bg-white border-2 border-[#D8A64E] shadow-[0_16px_36px_-6px_rgba(216,166,78,0.3)]"
                      : "bg-[#FFFDFB] border border-[#F2E5D9] shadow-md hover:border-[#D8A64E]/60"
                  }`}
                >
                  <div className="relative w-full aspect-[4/4.2] overflow-hidden bg-[#FBF4EE]">
                    <img
                      src={card.image}
                      alt={card.alt}
                      loading="eager"
                      decoding="async"
                      className="w-full h-full object-cover object-center"
                    />
                    {isCenter && (
                      <div className="absolute top-2.5 right-2.5 z-20">
                        <span className="px-2 py-0.5 rounded-full bg-black/75 text-[10px] text-amber-200 font-semibold border border-amber-300/40">
                          {t(card.badgeKey)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="relative flex justify-center -mt-6 z-20">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 ${
                        isCenter || isCardHovered
                          ? "bg-[#FFF9F2] text-[#861B43] border-2 border-[#D8A64E]"
                          : "bg-white text-[#861B43] border border-[#F0D5C7]"
                      }`}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="p-4 pt-3 text-center flex flex-col items-center">
                    <h3 className="font-display text-base font-semibold text-[#6D1234]">
                      {t(card.titleKey)}
                    </h3>
                    <p className="mt-2 text-xs text-[#55464A] leading-relaxed line-clamp-3">
                      {t(card.descKey)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* MOBILE VIEW: Luxury 3D Coverflow Carousel (Tight Gap, Visible Adjacent Flanks, Fluid 3D Motion) */}
          <div
            className="sm:hidden relative w-full overflow-hidden py-3 select-none [perspective:1200px]"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* 3D Curved Carousel Track */}
            <div className="relative h-[485px] w-full mx-auto overflow-visible [transform-style:preserve-3d]">
              {productCards.map((card, idx) => {
                const offset = getCardOffset(idx);
                const isCenter = offset === 0;
                const IconComp = card.icon;

                // Luxury 3D Coverflow spatial parameters:
                // Geometry provides ~54px recognizable silhouette on narrow mobile screens (375px)
                // with balanced 10px deliberate spacing and zero horizontal waste
                let translateX = "-50%";
                let translateY = "0px";
                let scale = 1;
                let rotateY = 0;
                let opacity = 1;
                let filter = "none";
                let zIndex = 10;
                let pointerEvents: "auto" | "none" = "auto";

                if (offset === 0) {
                  // Active Center Spotlight Card: razor-sharp, elevated, champagne gold border
                  translateX = "-50%";
                  translateY = "0px";
                  scale = 1;
                  rotateY = 0;
                  opacity = 1;
                  filter = "blur(0px) brightness(1.0)";
                  zIndex = 25;
                } else if (offset === -1) {
                  // Immediate Left Flank: substantially visible (~54px on 375px screen), 10px deliberate spacing, soft depth blur
                  translateX = "calc(-145.3% - 10px)";
                  translateY = "6px";
                  scale = 0.92;
                  rotateY = 10;
                  opacity = 0.85;
                  filter = "blur(1.5px) brightness(0.95)";
                  zIndex = 15;
                } else if (offset === 1) {
                  // Immediate Right Flank: substantially visible (~54px on 375px screen), 10px deliberate spacing, soft depth blur
                  translateX = "calc(45.3% + 10px)";
                  translateY = "6px";
                  scale = 0.92;
                  rotateY = -10;
                  opacity = 0.85;
                  filter = "blur(1.5px) brightness(0.95)";
                  zIndex = 15;
                } else if (offset === -2) {
                  // Farther Left: subdued, smoothly fades in as it rotates towards flank
                  translateX = "calc(-240% - 20px)";
                  translateY = "14px";
                  scale = 0.82;
                  rotateY = 18;
                  opacity = 0;
                  filter = "blur(4px)";
                  zIndex = 5;
                  pointerEvents = "none";
                } else if (offset === 2) {
                  // Farther Right: subdued, smoothly fades in as it rotates towards flank
                  translateX = "calc(140% + 20px)";
                  translateY = "14px";
                  scale = 0.82;
                  rotateY = -18;
                  opacity = 0;
                  filter = "blur(4px)";
                  zIndex = 5;
                  pointerEvents = "none";
                }

                return (
                  <div
                    key={`mobile-${card.id}`}
                    onClick={() => handleCardClick(idx)}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isCenter}
                    aria-label={`${t(card.titleKey)}: ${t(card.descKey)}`}
                    style={{
                      position: "absolute",
                      top: "6px",
                      left: "50%",
                      width: "min(66vw, 275px)",
                      transformOrigin: "center center",
                      transform: `translate3d(${translateX}, ${translateY}, 0) scale(${scale}) rotateY(${rotateY}deg)`,
                      zIndex,
                      opacity,
                      filter,
                      pointerEvents,
                      transition:
                        "transform 720ms cubic-bezier(0.25, 1, 0.4, 1), opacity 550ms ease, filter 550ms ease, box-shadow 550ms ease",
                    }}
                    className={`rounded-2xl cursor-pointer flex flex-col overflow-hidden bg-white ${
                      isCenter
                        ? "border-2 border-[#D8A64E] shadow-[0_22px_48px_-6px_rgba(216,166,78,0.45),0_12px_24px_rgba(134,27,67,0.18)]"
                        : "border border-[#F2E5D9] shadow-md hover:border-[#D8A64E]/60"
                    }`}
                  >
                    {/* Top Product Image Container */}
                    <div className="relative w-full aspect-[4/3.8] overflow-hidden bg-[#FBF4EE]">
                      <img
                        src={card.image}
                        alt={card.alt}
                        loading="eager"
                        decoding="async"
                        className="w-full h-full object-cover object-center"
                      />
                      {isCenter && (
                        <div className="absolute top-2.5 right-2.5 z-20 animate-fadeIn">
                          <span className="px-2.5 py-1 rounded-full bg-black/80 text-[10px] font-semibold text-amber-200 border border-amber-300/40 shadow-sm inline-flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>{t(card.badgeKey)}</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Overlapping Circular Category Badge */}
                    <div className="relative flex justify-center -mt-6 z-20">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 ${
                          isCenter
                            ? "bg-[#FFF9F2] text-[#861B43] border-2 border-[#D8A64E]"
                            : "bg-white text-[#861B43] border border-[#F0D5C7]"
                        }`}
                      >
                        <IconComp className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Bottom Text Content */}
                    <div className="p-4 pt-2.5 text-center flex flex-col items-center">
                      <h3 className="font-display text-base font-semibold text-[#6D1234]">
                        {t(card.titleKey)}
                      </h3>
                      <p className="mt-1.5 text-xs text-[#55464A] leading-relaxed line-clamp-3">
                        {t(card.descKey)}
                      </p>
                      {isCenter && (
                        <span className="mt-2 text-[10.5px] font-semibold tracking-wider uppercase text-[#D8A64E]">
                          {t(card.tagKey)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile Dots Indicator */}
            <div className="flex items-center justify-center gap-2 mt-4">
              {productCards.map((c, idx) => (
                <button
                  key={`mobile-dot-${c.id}`}
                  type="button"
                  onClick={() => handleCardClick(idx)}
                  aria-label={`Jump to ${t(c.titleKey)}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    autoplayIndex === idx
                      ? "w-6 bg-[#861B43] shadow-[0_0_8px_rgba(134,27,67,0.5)]"
                      : "w-2 bg-[#D8A64E]/40 hover:bg-[#D8A64E]/80"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 5. Four Brand-Value Indicators (Elevated Cards with Minimalist Icons) */}
        <div className="why-values-track mt-14 sm:mt-18 md:mt-20 pt-8 sm:pt-10 border-t border-[#E8D4C8]/60">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-5 items-stretch">
            {brandValues.map((val) => {
              const IconComp = val.icon;
              return (
                <div
                  key={val.id}
                  className="why-value-item flex flex-col items-center text-center p-3.5 sm:p-5 rounded-2xl bg-white/75 backdrop-blur-sm border border-[#F2E5D9] hover:border-[#D8A64E]/60 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  {/* Minimalist Berry Icon with Warm Ivory Circle */}
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#FFF9F2] border border-[#F0D5C7] group-hover:border-[#D8A64E] flex items-center justify-center text-[#861B43] group-hover:scale-108 transition-all duration-300 mb-2.5 sm:mb-3 shadow-xs">
                    <IconComp className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>

                  {/* Uppercase Category Label */}
                  <h4 className="font-sans font-semibold text-[10.5px] sm:text-xs tracking-[0.14em] uppercase text-[#861B43]">
                    {t(val.labelKey)}
                  </h4>

                  {/* Supporting Muted Description */}
                  <p className="mt-1 text-[11px] sm:text-xs text-[#55464A] leading-relaxed font-normal">
                    {t(val.descKey)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 6. Bottom Decorative Sweeping Waves (Matching Reference Image) */}
      <div className="relative w-full mt-14 sm:mt-18 leading-none" aria-hidden="true">
        <svg
          viewBox="0 0 1440 90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-12 sm:h-16 md:h-20 block"
        >
          {/* Subtle blush transitional wave */}
          <path
            d="M0 90C280 88 440 45 740 45C1040 45 1240 78 1440 68V90H0Z"
            fill="#F5DDD4"
            fillOpacity="0.85"
          />
          {/* Deep berry / burgundy bottom sweep transitioning smoothly into next dark section */}
          <path
            d="M0 90C140 90 260 22 480 40C680 58 760 76 960 88L1040 90H0Z"
            fill="#741334"
          />
        </svg>
      </div>
    </section>
  );
}
