import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useLanguage } from "../../context/LanguageContext";
import { prefersReducedMotion, MOTION } from "../../utils/motion";

// Handcrafted SVG vector icons with consistent 24x24 viewBox and 1.75 stroke-width
function SproutIcon({ className = "w-5 h-5" }: { className?: string }) {
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
      <path d="M7 20h10" />
      <path d="M10 20c5.5-2.5.8-6.4 3-10" />
      <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4.1 5.5.8z" />
      <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.4 1.7-4.6-2.7.1-4.2 1-4.9 2z" />
    </svg>
  );
}

function HeartIcon({ className = "w-5 h-5" }: { className?: string }) {
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
      <path d="M22 7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2" />
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

function RocketIcon({ className = "w-5 h-5" }: { className?: string }) {
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
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

export default function BrandStorySection() {
  const { t } = useLanguage();
  const [activePhase, setActivePhase] = useState<number>(4); // Default to current phase (2026)

  const sectionRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Entrance reveals with GSAP context
  useEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Header elements sequential reveal
      const headerElems = sectionRef.current?.querySelectorAll(".story-header-elem");
      if (headerElems && headerElems.length > 0) {
        gsap.fromTo(
          headerElems,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: MOTION.duration.reveal,
            stagger: 0.12,
            ease: MOTION.ease.default,
            clearProps: "opacity,transform",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 82%",
              once: true,
            },
          }
        );
      }

      // 2. Timeline nodes reveal with gentle stagger
      const nodes = sectionRef.current?.querySelectorAll(".story-node-item");
      if (nodes && nodes.length > 0) {
        gsap.fromTo(
          nodes,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: MOTION.duration.reveal,
            stagger: 0.08,
            ease: MOTION.ease.default,
            clearProps: "opacity,transform",
            scrollTrigger: {
              trigger: ".story-timeline-container",
              start: "top 85%",
              once: true,
            },
          }
        );
      }

      // 3. Metric cards reveal
      const statCards = sectionRef.current?.querySelectorAll(".story-stat-card");
      if (statCards && statCards.length > 0) {
        gsap.fromTo(
          statCards,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: MOTION.duration.reveal,
            stagger: 0.08,
            ease: MOTION.ease.default,
            clearProps: "opacity,transform",
            scrollTrigger: {
              trigger: ".story-stats-grid",
              start: "top 88%",
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Subtle transition when active milestone phase is clicked
  useEffect(() => {
    if (prefersReducedMotion() || !panelRef.current) return;

    gsap.fromTo(
      panelRef.current,
      { opacity: 0.82, y: 5 },
      {
        opacity: 1,
        y: 0,
        duration: MOTION.duration.interaction,
        ease: MOTION.ease.default,
        clearProps: "opacity,transform",
      }
    );
  }, [activePhase]);

  const milestones = [
    {
      year: t("story.t1Year"),
      tag: t("story.t1Tag"),
      title: t("story.t1Title"),
      desc: t("story.t1Desc"),
      stat: t("story.t1Stat"),
      icon: SproutIcon,
    },
    {
      year: t("story.t2Year"),
      tag: t("story.t2Tag"),
      title: t("story.t2Title"),
      desc: t("story.t2Desc"),
      stat: t("story.t2Stat"),
      icon: HeartIcon,
    },
    {
      year: t("story.t3Year"),
      tag: t("story.t3Tag"),
      title: t("story.t3Title"),
      desc: t("story.t3Desc"),
      stat: t("story.t3Stat"),
      icon: StoreIcon,
    },
    {
      year: t("story.t4Year"),
      tag: t("story.t4Tag"),
      title: t("story.t4Title"),
      desc: t("story.t4Desc"),
      stat: t("story.t4Stat"),
      icon: TruckIcon,
    },
    {
      year: t("story.t5Year"),
      tag: t("story.t5Tag"),
      title: t("story.t5Title"),
      desc: t("story.t5Desc"),
      stat: t("story.t5Stat"),
      icon: RocketIcon,
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="story"
      aria-label="Our Story and Milestones"
      className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#faf8f5] text-stone-800 relative overflow-hidden border-t border-stone-200/60"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        {/* 1. Section Header: Refined Editorial Typography */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
          <div className="story-header-elem inline-flex items-center gap-2.5 px-4.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-stone-200/90 shadow-[0_2px_12px_-2px_rgba(181,31,80,0.12)] text-xs sm:text-[13.5px] font-bold tracking-[0.12em] uppercase text-stone-700 hover:text-stone-900 hover:border-rose-300/80 hover:shadow-[0_4px_16px_-2px_rgba(181,31,80,0.18)] hover:-translate-y-0.5 transition-all duration-300 cursor-default select-none mb-5 group">
            <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5 shrink-0 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-[#b51f50] shadow-[0_0_8px_rgba(181,31,80,0.6)]" />
            </span>
            <span className="transition-colors">{t("story.tag")}</span>
          </div>

          <h2 className="story-header-elem font-display text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-medium text-stone-900 leading-[1.25] tracking-tight">
            {t("story.title")}
          </h2>

          <p className="story-header-elem mt-3.5 text-base sm:text-lg text-stone-600 leading-relaxed font-normal max-w-xl mx-auto">
            {t("story.subtitle")}
          </p>
        </div>

        {/* 2. Interactive Milestone Timeline Container */}
        <div className="story-timeline-container rounded-3xl bg-white border border-stone-200/90 p-5 sm:p-8 lg:p-10 shadow-xs mb-12">
          {/* Timeline Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 pb-5 border-b border-stone-100">
            <div>
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-rose-900">
                {t("story.graphTitle")}
              </span>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 font-normal">
                {t("story.graphSubtitle")}
              </p>
            </div>

            {/* Operational Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50/80 border border-emerald-200 text-xs sm:text-[13px] font-medium text-emerald-800 self-start sm:self-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t("story.trackRecord")}</span>
            </div>
          </div>

          {/* Timeline Nodes Grid */}
          <div className="relative pt-2 pb-2">
            {/* Connecting Visual Line for Desktop */}
            <div
              className="hidden md:block absolute top-7 left-8 right-8 h-px bg-stone-200 z-0"
              aria-hidden="true"
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 relative z-10">
              {milestones.map((item, idx) => {
                const isActive = activePhase === idx;
                const isLastOnMobile = idx === 4;
                const IconComponent = item.icon;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActivePhase(idx)}
                    aria-pressed={isActive}
                    aria-label={`Milestone ${item.year}: ${item.title}`}
                    className={`story-node-item text-left p-4 sm:p-5 rounded-2xl transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[185px] sm:min-h-[195px] border focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${
                      isLastOnMobile ? "col-span-2 sm:col-span-1" : ""
                    } ${
                      isActive
                        ? "bg-[#8a1836] text-white border-[#75142e] shadow-md -translate-y-0.5"
                        : "bg-white hover:bg-stone-50 text-stone-800 border-stone-200/90 shadow-2xs hover:border-stone-300"
                    }`}
                  >
                    <div>
                      {/* Top Year & Icon */}
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-stone-100 text-stone-700"
                          }`}
                        >
                          {item.year}
                        </span>
                        <span className={`p-1 rounded-lg ${isActive ? "text-rose-200" : "text-rose-800"}`}>
                          <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                        </span>
                      </div>

                      {/* Phase Tag */}
                      <div
                        className={`text-xs sm:text-[13px] font-semibold mb-1 line-clamp-2 leading-snug ${
                          isActive ? "text-rose-200" : "text-rose-800"
                        }`}
                      >
                        {item.tag}
                      </div>

                      {/* Title */}
                      <div
                        className={`text-sm sm:text-base font-semibold line-clamp-2 leading-snug ${
                          isActive ? "text-white" : "text-stone-900"
                        }`}
                      >
                        {item.title}
                      </div>
                    </div>

                    {/* Benchmark Footer */}
                    <div
                      className={`mt-4 pt-3 border-t text-xs sm:text-[13px] font-medium flex items-center justify-between ${
                        isActive
                          ? "border-white/20 text-rose-200"
                          : "border-stone-100 text-stone-500"
                      }`}
                    >
                      <span className="truncate pr-1">{item.stat}</span>
                      <span aria-hidden="true" className="shrink-0 text-xs">
                        →
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Refined Selected Milestone Detail Panel */}
          <div
            ref={panelRef}
            className="mt-8 p-6 sm:p-8 rounded-2xl bg-stone-900 text-white border border-stone-800 shadow-md transition-all duration-300"
          >
            <div className="grid md:grid-cols-12 gap-6 items-center">
              {/* Left Column: Heading & Description */}
              <div className="md:col-span-8 space-y-3">
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-rose-300">
                  <span className="font-semibold text-white px-2 py-0.5 rounded bg-white/10">
                    {milestones[activePhase].year}
                  </span>
                  <span>{milestones[activePhase].tag}</span>
                </div>

                <h3 className="font-display text-xl sm:text-2xl lg:text-[28px] font-medium text-white leading-snug">
                  {milestones[activePhase].title}
                </h3>

                <p className="text-base sm:text-[17px] text-stone-200 leading-relaxed font-normal pt-1">
                  {milestones[activePhase].desc}
                </p>
              </div>

              {/* Right Column: Refined Operational Benchmark */}
              <div className="md:col-span-4 flex md:justify-end">
                <div className="w-full md:w-64 p-5 rounded-xl bg-stone-800/80 border border-stone-700/60 text-left md:text-right flex flex-col justify-center">
                  <span className="text-xs font-medium uppercase tracking-wider text-stone-400">
                    {t("story.benchmark")}
                  </span>
                  <span className="font-display text-2xl sm:text-3xl font-medium text-amber-300 mt-1">
                    {milestones[activePhase].stat}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Statistics Row: 4 Clean, Balanced Metric Cards */}
        <div className="story-stats-grid grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          <div className="story-stat-card p-5 sm:p-6 rounded-2xl bg-white border border-stone-200/90 shadow-2xs hover:border-stone-300 hover:-translate-y-0.5 transition-all text-center flex flex-col justify-between">
            <div>
              <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium text-stone-900 mb-1">
                {t("story.statOutlets")}
              </div>
              <div className="text-sm sm:text-base font-semibold text-stone-800">
                {t("story.statOutletsLabel")}
              </div>
            </div>
            <div className="text-xs sm:text-sm text-stone-500 mt-2 font-normal">
              {t("story.statOutletsSub")}
            </div>
          </div>

          <div className="story-stat-card p-5 sm:p-6 rounded-2xl bg-white border border-stone-200/90 shadow-2xs hover:border-stone-300 hover:-translate-y-0.5 transition-all text-center flex flex-col justify-between">
            <div>
              <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium text-rose-900 mb-1">
                {t("story.statCelebrations")}
              </div>
              <div className="text-sm sm:text-base font-semibold text-stone-800">
                {t("story.statCelebrationsLabel")}
              </div>
            </div>
            <div className="text-xs sm:text-sm text-stone-500 mt-2 font-normal">
              {t("story.statCelebrationsSub")}
            </div>
          </div>

          <div className="story-stat-card p-5 sm:p-6 rounded-2xl bg-white border border-stone-200/90 shadow-2xs hover:border-stone-300 hover:-translate-y-0.5 transition-all text-center flex flex-col justify-between">
            <div>
              <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium text-emerald-800 mb-1">
                {t("story.statVeg")}
              </div>
              <div className="text-sm sm:text-base font-semibold text-stone-800">
                {t("story.statVegLabel")}
              </div>
            </div>
            <div className="text-xs sm:text-sm text-stone-500 mt-2 font-normal">
              {t("story.statVegSub")}
            </div>
          </div>

          <div className="story-stat-card p-5 sm:p-6 rounded-2xl bg-white border border-stone-200/90 shadow-2xs hover:border-stone-300 hover:-translate-y-0.5 transition-all text-center flex flex-col justify-between">
            <div>
              <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-medium text-stone-800 mb-1">
                {t("story.statSuccess")}
              </div>
              <div className="text-sm sm:text-base font-semibold text-stone-800">
                {t("story.statSuccessLabel")}
              </div>
            </div>
            <div className="text-xs sm:text-sm text-stone-500 mt-2 font-normal">
              {t("story.statSuccessSub")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
