import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useLanguage } from "../../context/LanguageContext";
import { prefersReducedMotion, MOTION, setupCounterAnimation } from "../../utils/motion";

// Handcrafted SVG vector icons with consistent 24x24 viewBox and 1.75 stroke-width
function StoreIcon({ className = "w-5 h-5" }: { className?: string }) {
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
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
      <path d="M2 7h20" />
      <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
    </svg>
  );
}

function CakeSliceIcon({ className = "w-5 h-5" }: { className?: string }) {
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
      <circle cx="9" cy="7" r="2" />
      <path d="M7.2 7.9 3 11v9c0 .6.4 1 1 1h16c.6 0 1-.4 1-1v-9c0-2-3-6-7-8l-3.6 2.6" />
      <path d="M16 13H3" />
      <path d="M16 17H3" />
    </svg>
  );
}

function TrendingUpIcon({ className = "w-5 h-5" }: { className?: string }) {
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
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function AwardIcon({ className = "w-5 h-5" }: { className?: string }) {
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
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}

function ShieldCheckIcon({ className = "w-5 h-5" }: { className?: string }) {
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
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function TruckIcon({ className = "w-5 h-5" }: { className?: string }) {
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
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </svg>
  );
}


interface StatItem {
  val: string;
  label: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
}

function StatCard({ stat, idx }: { stat: StatItem; idx: number }) {
  const numberRef = useRef<HTMLDivElement>(null);
  const IconComponent = stat.icon;

  useEffect(() => {
    if (!numberRef.current) return;
    const cleanup = setupCounterAnimation(numberRef.current, stat.val, {
      duration: 1.3,
      delay: idx * 0.08,
      start: "top 86%",
    });
    return cleanup;
  }, [stat.val, idx]);

  return (
    <div className="number-card-item p-4 sm:p-7 rounded-2xl bg-white border border-stone-200/90 shadow-2xs hover:border-stone-300 hover:-translate-y-0.5 transition-all text-center flex flex-col items-center justify-between">
      {/* Subtle Icon Container */}
      <div className="w-10 h-10 rounded-xl bg-stone-100/70 border border-stone-200/80 flex items-center justify-center text-rose-900 mb-4">
        <IconComponent className="w-5 h-5" />
      </div>

      {/* Primary Figure: Animated Counter */}
      <div
        ref={numberRef}
        className="font-display text-3xl sm:text-4xl lg:text-[42px] font-medium text-stone-900 leading-tight mb-1"
      >
        {stat.val}
      </div>

      {/* Metric Label & Context */}
      <div className="mt-1">
        <div className="text-sm sm:text-base font-semibold text-stone-900">
          {stat.label}
        </div>
        <div className="text-xs sm:text-[13.5px] text-stone-600 mt-1 font-normal leading-relaxed">
          {stat.sub}
        </div>
      </div>
    </div>
  );
}

export default function NumbersSection() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Header elements sequential reveal
      const headerElems = sectionRef.current?.querySelectorAll(".numbers-header-elem");
      if (headerElems && headerElems.length > 0) {
        gsap.fromTo(
          headerElems,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: MOTION.duration.reveal,
            stagger: 0.1,
            ease: MOTION.ease.default,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              end: "bottom top",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }

      // 2. Cards entrance
      const cards = sectionRef.current?.querySelectorAll(".number-card-item");
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: MOTION.duration.reveal,
            stagger: 0.08,
            ease: MOTION.ease.default,
            scrollTrigger: {
              trigger: ".numbers-grid",
              start: "top 86%",
              end: "bottom top",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }

      // 3. Supporting dark information banner reveal
      const banner = sectionRef.current?.querySelector(".numbers-banner");
      if (banner) {
        gsap.fromTo(
          banner,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: MOTION.duration.reveal,
            ease: MOTION.ease.default,
            scrollTrigger: {
              trigger: banner,
              start: "top 88%",
              end: "bottom top",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats: StatItem[] = [
    {
      val: t("numbers.stat1Val"),
      label: t("numbers.stat1Label"),
      sub: t("numbers.stat1Sub"),
      icon: StoreIcon,
    },
    {
      val: t("numbers.stat2Val"),
      label: t("numbers.stat2Label"),
      sub: t("numbers.stat2Sub"),
      icon: CakeSliceIcon,
    },
    {
      val: t("numbers.stat3Val"),
      label: t("numbers.stat3Label"),
      sub: t("numbers.stat3Sub"),
      icon: TrendingUpIcon,
    },
    {
      val: t("numbers.stat4Val"),
      label: t("numbers.stat4Label"),
      sub: t("numbers.stat4Sub"),
      icon: AwardIcon,
    },
  ];

  return (
    <section
      ref={sectionRef}
      aria-label="Key Performance Statistics"
      className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#faf7f2] text-stone-800 border-t border-stone-200/60"
    >
      <div className="max-w-6xl mx-auto">
        {/* 1. Section Header: Refined Editorial Typography */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
          <div className="numbers-header-elem inline-flex items-center gap-2.5 px-4.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-stone-200/90 shadow-[0_2px_12px_-2px_rgba(181,31,80,0.12)] text-xs sm:text-[13.5px] font-bold tracking-[0.12em] uppercase text-stone-700 hover:text-stone-900 hover:border-rose-300/80 hover:shadow-[0_4px_16px_-2px_rgba(181,31,80,0.18)] hover:-translate-y-0.5 transition-all duration-300 cursor-default select-none mb-5 group">
            <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5 shrink-0 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-[#b51f50] shadow-[0_0_8px_rgba(181,31,80,0.6)]" />
            </span>
            <span className="transition-colors">{t("numbers.tag")}</span>
          </div>

          <h2 className="numbers-header-elem font-display text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-medium text-stone-900 leading-[1.25] tracking-tight">
            {t("numbers.title")}
          </h2>

          <p className="numbers-header-elem mt-3.5 text-base sm:text-lg text-stone-600 leading-relaxed font-normal max-w-xl mx-auto">
            {t("numbers.subtitle")}
          </p>
        </div>

        {/* 2. Four Statistics Cards: Clean, Unified & Restrained */}
        <div className="numbers-grid grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {stats.map((s, idx) => (
            <StatCard key={idx} stat={s} idx={idx} />
          ))}
        </div>

        {/* 3. Dark Information Banner: Clean Sans-Serif Typography & Subtle Tonal Divider */}
        <div className="numbers-banner rounded-2xl sm:rounded-3xl bg-[#1c1318] text-white p-6 sm:p-8 border border-amber-500/25 shadow-md mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
            {/* Item 1: No Hidden Royalties */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-amber-300 shrink-0">
                <ShieldCheckIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-sans font-medium text-base sm:text-lg text-stone-100">
                  {t("numbers.banner1")}
                </h3>
                <p className="text-sm text-stone-300 font-normal mt-1 leading-relaxed">
                  {t("numbers.banner1Sub")}
                </p>
              </div>
            </div>

            {/* Item 2: Daily Cold Chain Logistics */}
            <div className="flex items-center gap-4 border-t border-white/10 pt-6 md:border-t-0 md:pt-0 md:border-l md:border-white/10 md:pl-8">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-amber-300 shrink-0">
                <TruckIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-sans font-medium text-base sm:text-lg text-stone-100">
                  {t("numbers.banner2")}
                </h3>
                <p className="text-sm text-stone-300 font-normal mt-1 leading-relaxed">
                  {t("numbers.banner2Sub")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
