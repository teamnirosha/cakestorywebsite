import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useFranchiseModal } from "../common/FranchiseModal";
import CakeImage from "../common/CakeImage";

gsap.registerPlugin(ScrollTrigger);

export interface StoryChapter {
  step: string;
  tag: string;
  title: string;
  desc: string;
  image: string;
  aspect: "2/3" | "3/4" | "16/9" | "4/3";
  badge: string;
  metric: string;
  metricLabel: string;
}

const chapters: StoryChapter[] = [
  {
    step: "01",
    tag: "HERITAGE & CRAFT",
    title: "Pune Roots & Signature Eggless Formulations",
    desc: "CakeStory began with a clear purpose: deliver genuine bakery craft and cloud-soft sponge consistency to Pune families without compromising on vegetarian values.",
    image: "1.jpg",
    aspect: "3/4",
    badge: "100% Pure Vegetarian",
    metric: "24+",
    metricLabel: "Refined Recipes",
  },
  {
    step: "02",
    tag: "CENTRAL PRODUCTION",
    title: "Pharmaceutical-Grade Kitchen Hygiene SOPs",
    desc: "Discipline scales quality. Our centralized Pune manufacturing facility operates with strict positive-pressure airflow, stainless-steel sanitization, and gram-calibrated batch weighing.",
    image: "DSC03187.JPG",
    aspect: "3/4",
    badge: "Sterile Cleanroom SOPs",
    metric: "100%",
    metricLabel: "Batch Traceability",
  },
  {
    step: "03",
    tag: "ARTISANAL FINISH",
    title: "Handcrafted Visual Presentation & Fresh Fruit",
    desc: "Every celebration cake is finished manually by master patissiers using Belgian cocoa curls, hand-drawn rosettes, and fresh Mahabaleshwar berries.",
    image: "AZ_01683.JPG",
    aspect: "3/4",
    badge: "Hand-Piped Detail",
    metric: "500+",
    metricLabel: "Daily Celebrations",
  },
  {
    step: "04",
    tag: "FRANCHISE ECOSYSTEM",
    title: "Zero In-Store Baking. Daily Cold-Chain Supply.",
    desc: "We removed retail kitchen complexity. Franchise partners receive daily temperature-controlled shipments, turning prime commercial spaces into high-margin cake destinations.",
    image: "5.png",
    aspect: "3/4",
    badge: "Turnkey Model",
    metric: "12",
    metricLabel: "Pune Outlets",
  },
];

export default function ScrollStorySequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const { openModal } = useFranchiseModal();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Animate chapter items smoothly as they come into view
      const chapterCards = containerRef.current?.querySelectorAll(".story-chapter-card");
      if (chapterCards && chapterCards.length > 0) {
        chapterCards.forEach((card, idx) => {
          ScrollTrigger.create({
            trigger: card,
            start: "top 70%",
            end: "bottom 30%",
            onEnter: () => setActiveChapter(idx),
            onEnterBack: () => setActiveChapter(idx),
          });
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const current = chapters[activeChapter] || chapters[0];

  return (
    <section
      ref={containerRef}
      className="reveal-section py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-b from-white/60 via-rose-50/20 to-white/60"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="eyebrow mb-3">
            <span className="w-2 h-2 rounded-full bg-[#e63971]" />
            The CakeStory Narrative
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-[#2a1d2e] font-bold tracking-tight">
            From Bakery Craft to <span className="font-editorial gradient-text">Scalable Business.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#5a4a5e] mt-3 leading-relaxed">
            How disciplined central manufacturing and daily cold-chain logistics protect customer celebrations and power our retail franchise partners.
          </p>
        </div>

        {/* Narrative Grid */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Chapters Narrative Stream (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {chapters.map((ch, idx) => {
              const isSelected = activeChapter === idx;
              return (
                <div
                  key={ch.step}
                  onClick={() => setActiveChapter(idx)}
                  className={`story-chapter-card glass-card p-6 sm:p-8 transition-all duration-300 cursor-pointer border ${
                    isSelected
                      ? "border-[#e63971] bg-white shadow-xl translate-x-1"
                      : "border-white/80 bg-white/70 hover:bg-white hover:border-rose-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-rose-100 text-[#e63971] text-xs font-bold flex items-center justify-center">
                        {ch.step}
                      </span>
                      <span className="text-[10px] font-bold tracking-widest text-[#e63971] uppercase">
                        {ch.tag}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-display text-lg font-bold text-[#2a1d2e]">
                        {ch.metric}
                      </span>
                      <span className="text-[10px] text-[#8c7a90] ml-1 uppercase font-semibold">
                        {ch.metricLabel}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#2a1d2e] mb-2 leading-snug">
                    {ch.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#5a4a5e] leading-relaxed">
                    {ch.desc}
                  </p>

                  {/* Mobile image preview (when on narrow devices where sticky right col is below) */}
                  <div className="mt-4 lg:hidden rounded-xl overflow-hidden aspect-[16/10] bg-rose-50 border border-rose-100">
                    <CakeImage
                      src={ch.image}
                      alt={ch.title}
                      aspect="16/10"
                      fit="cover"
                      className="w-full h-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Sticky Visual Stage for Desktop (5 Cols) */}
          <div className="hidden lg:block lg:col-span-5 sticky top-28">
            <div className="glass-card p-6 bg-white/95 border border-white shadow-2xl relative overflow-hidden transition-all duration-500">
              <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-inner bg-rose-50 flex items-center justify-center border border-rose-100">
                <CakeImage
                  key={current.step}
                  src={current.image}
                  alt={current.title}
                  aspect={current.aspect}
                  fit="cover"
                  priority
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover"
                />

                {/* Floating Chapter Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-xs border border-rose-100">
                  <span className="text-[11px] font-bold text-[#e63971] uppercase tracking-wider">
                    {current.badge}
                  </span>
                </div>

                {/* Step indicator */}
                <div className="absolute bottom-4 right-4 px-3.5 py-1.5 rounded-full bg-[#1c121e]/85 backdrop-blur-md text-white text-xs font-bold shadow-md">
                  Chapter {current.step} / 04
                </div>
              </div>

              <div className="mt-5 p-4 rounded-2xl bg-rose-50/60 border border-rose-100 text-center">
                <div className="font-display font-bold text-base text-[#2a1d2e]">
                  {current.title}
                </div>
                <div className="text-xs text-[#5a4a5e] mt-1 line-clamp-2">
                  {current.desc}
                </div>
              </div>
            </div>

            {/* Franchise Conversion Quick Hook */}
            <div className="mt-5 text-center">
              <button
                onClick={openModal}
                className="btn-primary w-full !py-3 !text-xs !font-bold shadow-md"
              >
                <span>Partner With Our Pune Network</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Narrative Footer Link */}
        <div className="mt-14 text-center">
          <Link
            to="/our-story"
            className="btn-ghost !py-3 !px-7 text-xs sm:text-sm font-bold shadow-xs inline-flex items-center gap-2"
          >
            <span>Read Our Full Story &amp; Kitchen Protocols</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
