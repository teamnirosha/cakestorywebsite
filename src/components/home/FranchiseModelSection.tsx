import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useFranchiseModal } from "../common/FranchiseModal";
import { useLanguage } from "../../context/LanguageContext";
import { prefersReducedMotion, MOTION } from "../../utils/motion";
import kitchenBg from "../../assets/business/kitchen-production.jpg";

// Handcrafted SVG vector icons with consistent 24x24 viewBox
function FactoryIcon({ className = "w-5 h-5" }: { className?: string }) {
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
      <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M17 18h1" />
      <path d="M12 18h1" />
      <path d="M7 18h1" />
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

function StoreFrontIcon({ className = "w-5 h-5" }: { className?: string }) {
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

function RulerToolsIcon({ className = "w-5 h-5" }: { className?: string }) {
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
      <path d="M21.3 8.7 8.7 21.3a1 1 0 0 1-1.4 0l-4.6-4.6a1 1 0 0 1 0-1.4L15.3 2.7a1 1 0 0 1 1.4 0l4.6 4.6a1 1 0 0 1 0 1.4Z" />
      <path d="m7.5 10.5 2 2" />
      <path d="m10.5 7.5 2 2" />
      <path d="m13.5 4.5 2 2" />
      <path d="m4.5 13.5 2 2" />
    </svg>
  );
}

function UserCheckIcon({ className = "w-5 h-5" }: { className?: string }) {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <polyline points="16 11 18 13 22 9" />
    </svg>
  );
}

function ShieldHandshakeIcon({ className = "w-5 h-5" }: { className?: string }) {
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

function CheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function PhoneIcon({ className = "w-4 h-4" }: { className?: string }) {
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

// 8-Step Roadmap Outline Icons (Ref: part_4)
function FileTextIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function ChatBubbleIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function MapPinIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function EditDocIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function WrenchIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function AcademicCapIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function RocketOutlineIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

function HandshakeHeartIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

export default function FranchiseModelSection() {
  const { openModal } = useFranchiseModal();
  const { t } = useLanguage();
  const [activeMilestone, setActiveMilestone] = useState<number>(0);

  const sectionRef = useRef<HTMLElement | null>(null);
  const bgLayerRef = useRef<HTMLDivElement | null>(null);

  // GSAP Entrance & Scroll Storytelling
  useEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Cinematic Background Scale-Settling
      if (bgLayerRef.current) {
        gsap.fromTo(
          bgLayerRef.current,
          { scale: 1.04, opacity: 0.8 },
          {
            scale: 1.0,
            opacity: 1,
            duration: 1.0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              end: "bottom top",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }

      // 2. Editorial Header Sequenced Reveal
      const headerElems = sectionRef.current?.querySelectorAll(".model-header-elem");
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
              start: "top 82%",
              end: "bottom top",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }

      // 3. Featured Flagship Cards Reveal
      const flagships = sectionRef.current?.querySelectorAll(".model-flagship-card");
      if (flagships && flagships.length > 0) {
        gsap.fromTo(
          flagships,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: MOTION.ease.default,
            scrollTrigger: {
              trigger: ".model-flagship-grid",
              start: "top 82%",
              end: "bottom top",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }

      // 4. Supporting Operational Cards Stagger
      const supportCards = sectionRef.current?.querySelectorAll(".model-support-card");
      if (supportCards && supportCards.length > 0) {
        gsap.fromTo(
          supportCards,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: MOTION.ease.default,
            scrollTrigger: {
              trigger: ".model-support-grid",
              start: "top 84%",
              end: "bottom top",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }

      // 5. Partnership Journey Panel Entrance & Progressive Timeline Draw
      const journeyPanel = sectionRef.current?.querySelector(".journey-panel-card");
      if (journeyPanel) {
        const journeyTL = gsap.timeline({
          scrollTrigger: {
            trigger: journeyPanel,
            start: "top 82%",
            end: "bottom top",
            toggleActions: "play reverse play reverse",
          },
        });

        // Eyebrow, Title, Subtitle reveal
        journeyTL.fromTo(
          journeyPanel.querySelectorAll(".journey-header-item"),
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: MOTION.ease.default,
          }
        );

        // Desktop connecting track lines draw via scaleX
        const trackLine1 = journeyPanel.querySelector(".desktop-track-line-1");
        if (trackLine1) {
          journeyTL.fromTo(
            trackLine1,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.7, ease: "power2.inOut", transformOrigin: "left center" },
            "-=0.2"
          );
        }

        const trackLine2 = journeyPanel.querySelector(".desktop-track-line-2");
        if (trackLine2) {
          journeyTL.fromTo(
            trackLine2,
            { scaleX: 0 },
            { scaleX: 1, duration: 0.7, ease: "power2.inOut", transformOrigin: "left center" },
            "-=0.4"
          );
        }

        // Mobile vertical timeline connecting line draw via scaleY
        const mobileLine = journeyPanel.querySelector(".mobile-timeline-line");
        if (mobileLine) {
          journeyTL.fromTo(
            mobileLine,
            { scaleY: 0 },
            {
              scaleY: 1,
              duration: 0.95,
              ease: "power2.inOut",
              transformOrigin: "top center",
            },
            "<"
          );
        }

        // Staggered reveal of Markers
        const milestoneMarkers = journeyPanel.querySelectorAll(".journey-marker-node");
        if (milestoneMarkers.length > 0) {
          journeyTL.fromTo(
            milestoneMarkers,
            { scale: 0.9, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              stagger: 0.08,
              ease: "power2.out",
            },
            "-=0.6"
          );
        }

        // Staggered reveal of Cards
        const milestoneCards = journeyPanel.querySelectorAll(".journey-card-node");
        if (milestoneCards.length > 0) {
          journeyTL.fromTo(
            milestoneCards,
            { opacity: 0, y: 14 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.08,
              ease: MOTION.ease.default,
            },
            "<"
          );
        }

        // Active Spotlight Card Reveal
        const detailCard = journeyPanel.querySelector(".journey-detail-card");
        if (detailCard) {
          journeyTL.fromTo(
            detailCard,
            { opacity: 0, y: 14 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: MOTION.ease.default,
            },
            "-=0.2"
          );
        }

        // Conversion CTA Area Reveal
        const ctaArea = journeyPanel.querySelector(".journey-cta-area");
        if (ctaArea) {
          journeyTL.fromTo(
            ctaArea,
            { opacity: 0, y: 14 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: MOTION.ease.default,
            },
            "-=0.2"
          );
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // 8 Canonical Partnership Steps (Exact Order 01 to 08)
  const partnershipSteps = [
    {
      num: "01",
      title: t("roadmap.step1Title", "Enquiry"),
      desc: t("roadmap.step1Desc", "Share your details and preferred location."),
      icon: FileTextIcon,
    },
    {
      num: "02",
      title: t("roadmap.step2Title", "Discussion"),
      desc: t("roadmap.step2Desc", "Discuss your goals and the franchise opportunity with the CakeStory team."),
      icon: ChatBubbleIcon,
    },
    {
      num: "03",
      title: t("roadmap.step3Title", "Location"),
      desc: t("roadmap.step3Desc", "Review the proposed store location and its suitability."),
      icon: MapPinIcon,
    },
    {
      num: "04",
      title: t("roadmap.step4Title", "Agreement"),
      desc: t("roadmap.step4Desc", "Review and sign the franchise agreement."),
      icon: EditDocIcon,
    },
    {
      num: "05",
      title: t("roadmap.step5Title", "Setup"),
      desc: t("roadmap.step5Desc", "Prepare your store with the team's guidance."),
      icon: WrenchIcon,
    },
    {
      num: "06",
      title: t("roadmap.step6Title", "Training"),
      desc: t("roadmap.step6Desc", "Learn the required store operations and service standards."),
      icon: AcademicCapIcon,
    },
    {
      num: "07",
      title: t("roadmap.step7Title", "Launch"),
      desc: t("roadmap.step7Desc", "Prepare for the opening of your CakeStory outlet."),
      icon: RocketOutlineIcon,
    },
    {
      num: "08",
      title: t("roadmap.step8Title", "Support"),
      desc: t("roadmap.step8Desc", "Continue with operational guidance and assistance."),
      icon: HandshakeHeartIcon,
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="franchise"
      aria-label="The CakeStory Business Model"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#150d14] text-stone-100 overflow-hidden border-t border-[#c9a46a]/20 border-b border-[#c9a46a]/20"
    >
      {/* 1. Dedicated Authentic Bakery Production Kitchen Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <div ref={bgLayerRef} className="w-full h-full will-change-transform">
          <img
            src={kitchenBg}
            alt="CakeStory Desserts Central Production Kitchen"
            loading="lazy"
            className="w-full h-full object-cover object-[center_35%] filter brightness-[0.72] contrast-[1.08]"
          />
        </div>

        {/* Cinematic Deep Plum & Charcoal Gradient Overlays for Maximum Legibility & Warm Depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#160d15]/95 via-[#110811]/90 to-[#160d15]/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#140b13]/95 via-[#140b13]/60 to-[#140b13]/95" />
        <div className="absolute inset-0 bg-radial-[circle_at_center] from-transparent via-[#100710]/50 to-[#100710]/90" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* 2. Editorial Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="model-header-elem inline-flex items-center gap-2.5 px-4.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#2a1d26]/95 backdrop-blur-md border border-[#c9a46a]/40 shadow-[0_4px_18px_-2px_rgba(201,164,106,0.18)] text-xs sm:text-[13.5px] font-bold tracking-[0.14em] uppercase text-[#f5dfb8] hover:text-white hover:border-[#c9a46a]/75 hover:shadow-[0_6px_22px_-2px_rgba(201,164,106,0.28)] hover:-translate-y-0.5 transition-all duration-300 cursor-default select-none mb-6 group">
            <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5 shrink-0 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c9a46a] opacity-80" />
              <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-[#c9a46a] shadow-[0_0_10px_rgba(201,164,106,0.7)]" />
            </span>
            <span className="transition-colors">{t("franchise.tag")}</span>
          </div>

          <h2 className="model-header-elem font-display text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-medium text-[#fffaf4] leading-[1.18] tracking-tight drop-shadow-md">
            {t("franchise.title")}
          </h2>

          <p className="model-header-elem mt-4 text-base sm:text-lg text-stone-300/90 leading-relaxed font-normal max-w-2xl mx-auto">
            {t("franchise.subtitle")}
          </p>
        </div>

        {/* 3. Primary Flagship Operating Pillars (2 Balanced Hero Cards) */}
        <div className="model-flagship-grid grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 mb-8 sm:mb-10">

          {/* Flagship Card 1: Centralized Cleanroom Production */}
          <div className="model-flagship-card rounded-3xl p-6 sm:p-8 bg-[#1d131b]/90 border border-[#c9a46a]/30 hover:border-[#c9a46a]/55 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group">
            <div>
              {/* Header Badge & Icon */}
              <div className="flex items-center justify-between gap-3 mb-5">
                <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#e6cb9f] bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{t("franchise.heroTag")}</span>
                </span>
                <div className="w-10 h-10 rounded-xl bg-[#2a1823] border border-[#c9a46a]/30 text-[#e6cb9f] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <FactoryIcon className="w-5 h-5 text-amber-300" />
                </div>
              </div>

              {/* Title & Concise Narrative */}
              <h3 className="font-display text-xl sm:text-2xl font-medium text-white mb-2.5 leading-snug">
                {t("franchise.heroTitle")}
              </h3>

              <p className="text-sm sm:text-[15px] text-stone-300/90 leading-relaxed font-normal mb-5">
                {t("franchise.heroDesc")}
              </p>
            </div>

            {/* Operational Truths Checklist */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <div className="flex items-center gap-2.5 text-xs sm:text-[13.5px] text-stone-200">
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckIcon className="w-3 h-3" />
                </span>
                <span>{t("franchise.heroBullet1")}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-[13.5px] text-stone-200">
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckIcon className="w-3 h-3" />
                </span>
                <span>{t("franchise.heroBullet2")}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-[13.5px] text-stone-200">
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckIcon className="w-3 h-3" />
                </span>
                <span>{t("franchise.heroBullet3")}</span>
              </div>
            </div>
          </div>

          {/* Flagship Card 2: Daily Cold-Chain Supply */}
          <div className="model-flagship-card rounded-3xl p-6 sm:p-8 bg-[#1d131b]/90 border border-[#c9a46a]/30 hover:border-[#c9a46a]/55 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group">
            <div>
              {/* Header Badge & Icon */}
              <div className="flex items-center justify-between gap-3 mb-5">
                <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#f2a8bd] bg-rose-950/40 px-3 py-1 rounded-full border border-rose-500/25">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  <span>{t("franchise.feat2Tag")}</span>
                </span>
                <div className="w-10 h-10 rounded-xl bg-[#2a1420] border border-rose-500/30 text-rose-300 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <TruckIcon className="w-5 h-5 text-rose-300" />
                </div>
              </div>

              {/* Title & Concise Narrative */}
              <h3 className="font-display text-xl sm:text-2xl font-medium text-white mb-2.5 leading-snug">
                {t("franchise.feat2Title")}
              </h3>

              <p className="text-sm sm:text-[15px] text-stone-300/90 leading-relaxed font-normal mb-5">
                {t("franchise.feat2Desc")}
              </p>
            </div>

            {/* Operational Truths Checklist */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <div className="flex items-center gap-2.5 text-xs sm:text-[13.5px] text-stone-200">
                <span className="w-4 h-4 rounded-full bg-[#961b3c]/30 text-rose-300 flex items-center justify-center shrink-0">
                  <CheckIcon className="w-3 h-3" />
                </span>
                <span>{t("franchise.feat2Bullet1")}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-[13.5px] text-stone-200">
                <span className="w-4 h-4 rounded-full bg-[#961b3c]/30 text-rose-300 flex items-center justify-center shrink-0">
                  <CheckIcon className="w-3 h-3" />
                </span>
                <span>{t("franchise.feat2Bullet2")}</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs sm:text-[13.5px] text-stone-200">
                <span className="w-4 h-4 rounded-full bg-[#961b3c]/30 text-rose-300 flex items-center justify-center shrink-0">
                  <CheckIcon className="w-3 h-3" />
                </span>
                <span>{t("franchise.feat2Bullet3")}</span>
              </div>
            </div>
          </div>

        </div>

        {/* 4. Four Supporting Operational Advantage Cards */}
        <div className="model-support-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-14 sm:mb-16">

          {/* Card 3: Compact 300-400 Sq.Ft Format */}
          <div className="model-support-card p-5 sm:p-6 rounded-2xl bg-[#1b1219]/80 border border-stone-800/90 hover:border-[#c9a46a]/40 hover:bg-[#20141e]/90 shadow-sm transition-all duration-200 flex flex-col justify-between hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-[11px] font-semibold tracking-wider uppercase text-stone-400">
                  {t("franchise.card3Tag")}
                </span>
                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-[#e6cb9f] flex items-center justify-center shrink-0">
                  <StoreFrontIcon className="w-4 h-4" />
                </div>
              </div>
              <h4 className="font-display text-base font-medium text-white mb-1.5 leading-snug">
                {t("franchise.card3Title")}
              </h4>
              <p className="text-xs sm:text-[13px] text-stone-300/80 leading-relaxed font-normal">
                {t("franchise.card3Desc")}
              </p>
            </div>
          </div>

          {/* Card 4: Turnkey Store Fit-Out & Setup */}
          <div className="model-support-card p-5 sm:p-6 rounded-2xl bg-[#1b1219]/80 border border-stone-800/90 hover:border-[#c9a46a]/40 hover:bg-[#20141e]/90 shadow-sm transition-all duration-200 flex flex-col justify-between hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-[11px] font-semibold tracking-wider uppercase text-stone-400">
                  {t("franchise.card4Tag")}
                </span>
                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-[#e6cb9f] flex items-center justify-center shrink-0">
                  <RulerToolsIcon className="w-4 h-4" />
                </div>
              </div>
              <h4 className="font-display text-base font-medium text-white mb-1.5 leading-snug">
                {t("franchise.card4Title")}
              </h4>
              <p className="text-xs sm:text-[13px] text-stone-300/80 leading-relaxed font-normal">
                {t("franchise.card4Desc")}
              </p>
            </div>
          </div>

          {/* Card 5: Front-Counter & Hospitality SOPs */}
          <div className="model-support-card p-5 sm:p-6 rounded-2xl bg-[#1b1219]/80 border border-stone-800/90 hover:border-[#c9a46a]/40 hover:bg-[#20141e]/90 shadow-sm transition-all duration-200 flex flex-col justify-between hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-[11px] font-semibold tracking-wider uppercase text-stone-400">
                  {t("franchise.card5Tag")}
                </span>
                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-[#e6cb9f] flex items-center justify-center shrink-0">
                  <UserCheckIcon className="w-4 h-4" />
                </div>
              </div>
              <h4 className="font-display text-base font-medium text-white mb-1.5 leading-snug">
                {t("franchise.card5Title")}
              </h4>
              <p className="text-xs sm:text-[13px] text-stone-300/80 leading-relaxed font-normal">
                {t("franchise.card5Desc")}
              </p>
            </div>
          </div>

          {/* Card 6: Dedicated Operational Partnership */}
          <div className="model-support-card p-5 sm:p-6 rounded-2xl bg-[#1b1219]/80 border border-stone-800/90 hover:border-[#c9a46a]/40 hover:bg-[#20141e]/90 shadow-sm transition-all duration-200 flex flex-col justify-between hover:-translate-y-1">
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-[11px] font-semibold tracking-wider uppercase text-stone-400">
                  {t("franchise.card6Tag")}
                </span>
                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-[#e6cb9f] flex items-center justify-center shrink-0">
                  <ShieldHandshakeIcon className="w-4 h-4" />
                </div>
              </div>
              <h4 className="font-display text-base font-medium text-white mb-1.5 leading-snug">
                {t("franchise.card6Title")}
              </h4>
              <p className="text-xs sm:text-[13px] text-stone-300/80 leading-relaxed font-normal">
                {t("franchise.card6Desc")}
              </p>
            </div>
          </div>

        </div>

        {/* 5. Luxury Partnership Timeline: The Connected 8-Step Journey */}
        {(() => {
          const currentMilestone = partnershipSteps[activeMilestone] || partnershipSteps[0];
          const ActiveMilestoneIcon = currentMilestone.icon;

          return (
            <div className="journey-panel-card rounded-3xl p-6 sm:p-9 lg:p-12 bg-gradient-to-b from-[#180e16] via-[#140b12] to-[#180e16] border border-[#c9a46a]/30 text-white shadow-2xl relative overflow-hidden backdrop-blur-md">
              {/* Subtle Plum & Champagne Ambient Depth Lighting */}
              <div className="absolute -top-24 right-1/4 w-96 h-96 bg-[#c9a46a]/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-[#961b3c]/10 rounded-full blur-3xl pointer-events-none" />

              {/* Editorial Heading Arrangement */}
              <div className="relative z-10 text-center max-w-2xl mx-auto pb-8 sm:pb-10 border-b border-white/10">
                <div className="journey-header-item inline-flex items-center gap-2.5 px-4.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/5 backdrop-blur-md border border-[#c9a46a]/35 shadow-[0_4px_18px_-2px_rgba(201,164,106,0.15)] text-xs sm:text-[13.5px] font-bold tracking-[0.14em] uppercase text-[#f5dfb8] hover:text-white hover:border-[#c9a46a]/70 hover:shadow-[0_6px_22px_-2px_rgba(201,164,106,0.25)] hover:-translate-y-0.5 transition-all duration-300 cursor-default select-none mb-4 group">
                  <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5 shrink-0 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c9a46a] opacity-80" />
                    <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-[#c9a46a] shadow-[0_0_10px_rgba(201,164,106,0.7)]" />
                  </span>
                  <span className="transition-colors">{t("steps.tag", "THE PARTNERSHIP JOURNEY")}</span>
                </div>

                <h3 className="journey-header-item font-display text-2xl sm:text-3xl lg:text-4xl font-medium text-[#fffaf4] leading-tight tracking-tight">
                  {t("steps.title", "From First Enquiry to Grand Opening.")}
                </h3>

                <p className="journey-header-item mt-3 text-sm sm:text-base text-stone-300/85 leading-relaxed font-normal">
                  {t("steps.desc", "Eight milestones. One guided journey.")}
                </p>
              </div>

              {/* Desktop Connected 2-Row Timeline (Clean Non-Overlapping Architecture) */}
              <div className="hidden lg:block relative z-10 pt-6">
                {/* ROW 1: Milestones 01 to 04 */}
                <div className="relative mb-8">
                  {/* Dedicated Horizontal Track Line connecting Markers 01 to 04 */}
                  <div className="absolute top-6 left-[12.5%] right-[12.5%] h-[2px] pointer-events-none" aria-hidden="true">
                    <div className="desktop-track-line-1 w-full h-full bg-gradient-to-r from-[#c9a46a]/30 via-[#f5dfb8] to-[#c9a46a]/30 origin-left" />
                  </div>

                  {/* 4 Columns for Row 1 */}
                  <div className="grid grid-cols-4 gap-6 relative z-10">
                    {partnershipSteps.slice(0, 4).map((step, idx) => {
                      const IconComp = step.icon;
                      const isSelected = activeMilestone === idx;
                      return (
                        <div key={step.num} className="flex flex-col items-center">
                          {/* Numbered Circular Marker (Sitting directly on the track line) */}
                          <button
                            type="button"
                            onClick={() => setActiveMilestone(idx)}
                            aria-pressed={isSelected}
                            className={`journey-marker-node w-12 h-12 rounded-full flex items-center justify-center font-mono text-sm font-bold transition-all duration-300 shadow-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a46a] relative z-20 ${isSelected
                                ? "bg-gradient-to-br from-[#c9a46a] to-[#b38947] text-[#150d14] ring-4 ring-[#180e16] shadow-[#c9a46a]/50 scale-110"
                                : "bg-[#180e16] border-2 border-[#c9a46a]/50 text-[#f5dfb8] hover:border-[#c9a46a] hover:text-white hover:scale-105"
                              }`}
                          >
                            <span>{step.num}</span>
                          </button>

                          {/* Vertical Connector Stem dropping into the Card */}
                          <div
                            className={`w-[2px] h-3.5 transition-colors duration-300 ${isSelected ? "bg-[#c9a46a]" : "bg-[#c9a46a]/30"
                              }`}
                            aria-hidden="true"
                          />

                          {/* Milestone Card - completely free of line overlap */}
                          <button
                            type="button"
                            onClick={() => setActiveMilestone(idx)}
                            aria-pressed={isSelected}
                            className={`journey-card-node w-full text-left p-5 rounded-2xl transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a46a] flex flex-col justify-between flex-1 ${isSelected
                                ? "bg-[#251523]/95 border border-[#c9a46a]/65 shadow-xl shadow-black/50 ring-1 ring-[#c9a46a]/30 -translate-y-0.5"
                                : "bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-[#c9a46a]/35"
                              }`}
                          >
                            <div>
                              {/* Card Header: Icon & Milestone tag */}
                              <div className="flex items-center justify-between mb-3.5">
                                <span className="text-[11px] font-mono text-stone-400 tracking-wider uppercase">
                                  Step {step.num}
                                </span>
                                <div
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${isSelected
                                      ? "bg-[#c9a46a]/20 text-amber-200 border border-[#c9a46a]/40"
                                      : "bg-white/5 text-[#e6cb9f]"
                                    }`}
                                >
                                  <IconComp className="w-4 h-4" />
                                </div>
                              </div>

                              {/* Title */}
                              <h4
                                className={`font-display text-base font-medium transition-colors mb-2 leading-snug ${isSelected ? "text-amber-100 font-semibold" : "text-[#fffaf4]"
                                  }`}
                              >
                                {step.title}
                              </h4>

                              {/* Description */}
                              <p
                                className={`text-xs sm:text-[13px] leading-relaxed transition-colors ${isSelected ? "text-stone-200 font-normal" : "text-stone-400"
                                  }`}
                              >
                                {step.desc}
                              </p>
                            </div>


                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>



                {/* ROW 2: Milestones 05 to 08 */}
                <div className="relative mb-6">
                  {/* Dedicated Horizontal Track Line connecting Markers 05 to 08 */}
                  <div className="absolute top-6 left-[12.5%] right-[12.5%] h-[2px] pointer-events-none" aria-hidden="true">
                    <div className="desktop-track-line-2 w-full h-full bg-gradient-to-r from-[#c9a46a]/30 via-[#f5dfb8] to-[#c9a46a]/30 origin-left" />
                  </div>

                  {/* 4 Columns for Row 2 */}
                  <div className="grid grid-cols-4 gap-6 relative z-10">
                    {partnershipSteps.slice(4, 8).map((step, r2Idx) => {
                      const idx = r2Idx + 4;
                      const IconComp = step.icon;
                      const isSelected = activeMilestone === idx;
                      return (
                        <div key={step.num} className="flex flex-col items-center">
                          {/* Numbered Circular Marker (Sitting directly on the track line) */}
                          <button
                            type="button"
                            onClick={() => setActiveMilestone(idx)}
                            aria-pressed={isSelected}
                            className={`journey-marker-node w-12 h-12 rounded-full flex items-center justify-center font-mono text-sm font-bold transition-all duration-300 shadow-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a46a] relative z-20 ${isSelected
                                ? "bg-gradient-to-br from-[#c9a46a] to-[#b38947] text-[#150d14] ring-4 ring-[#180e16] shadow-[#c9a46a]/50 scale-110"
                                : "bg-[#180e16] border-2 border-[#c9a46a]/50 text-[#f5dfb8] hover:border-[#c9a46a] hover:text-white hover:scale-105"
                              }`}
                          >
                            <span>{step.num}</span>
                          </button>

                          {/* Vertical Connector Stem dropping into the Card */}
                          <div
                            className={`w-[2px] h-3.5 transition-colors duration-300 ${isSelected ? "bg-[#c9a46a]" : "bg-[#c9a46a]/30"
                              }`}
                            aria-hidden="true"
                          />

                          {/* Milestone Card - completely free of line overlap */}
                          <button
                            type="button"
                            onClick={() => setActiveMilestone(idx)}
                            aria-pressed={isSelected}
                            className={`journey-card-node w-full text-left p-5 rounded-2xl transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a46a] flex flex-col justify-between flex-1 ${isSelected
                                ? "bg-[#251523]/95 border border-[#c9a46a]/65 shadow-xl shadow-black/50 ring-1 ring-[#c9a46a]/30 -translate-y-0.5"
                                : "bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-[#c9a46a]/35"
                              }`}
                          >
                            <div>
                              {/* Card Header: Icon & Milestone tag */}
                              <div className="flex items-center justify-between mb-3.5">
                                <span className="text-[11px] font-mono text-stone-400 tracking-wider uppercase">
                                  Step {step.num}
                                </span>
                                <div
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${isSelected
                                      ? "bg-[#c9a46a]/20 text-amber-200 border border-[#c9a46a]/40"
                                      : "bg-white/5 text-[#e6cb9f]"
                                    }`}
                                >
                                  <IconComp className="w-4 h-4" />
                                </div>
                              </div>

                              {/* Title */}
                              <h4
                                className={`font-display text-base font-medium transition-colors mb-2 leading-snug ${isSelected ? "text-amber-100 font-semibold" : "text-[#fffaf4]"
                                  }`}
                              >
                                {step.title}
                              </h4>

                              {/* Description */}
                              <p
                                className={`text-xs sm:text-[13px] leading-relaxed transition-colors ${isSelected ? "text-stone-200 font-normal" : "text-stone-400"
                                  }`}
                              >
                                {step.desc}
                              </p>
                            </div>



                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Mobile Continuous Vertical Timeline (01 to 08) */}
              <div className="lg:hidden relative z-10 pt-8 pl-14 sm:pl-16 space-y-5">
                {/* Continuous Vertical Line */}
                <div
                  className="mobile-timeline-line absolute left-5 sm:left-6 top-10 bottom-10 w-0.5 bg-gradient-to-b from-[#c9a46a] via-[#f5dfb8] to-[#c9a46a] rounded-full"
                  aria-hidden="true"
                />

                {partnershipSteps.map((step, idx) => {
                  const IconComp = step.icon;
                  const isSelected = activeMilestone === idx;
                  return (
                    <button
                      key={step.num}
                      type="button"
                      onClick={() => setActiveMilestone(idx)}
                      aria-pressed={isSelected}
                      className={`journey-milestone-node group text-left w-full relative p-4 sm:p-5 rounded-2xl transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a46a] ${isSelected
                          ? "bg-[#251523]/95 border border-[#c9a46a]/60 shadow-lg ring-1 ring-[#c9a46a]/30"
                          : "bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-[#c9a46a]/30"
                        }`}
                    >
                      {/* Milestone Number Marker aligned with vertical line */}
                      <div
                        className={`absolute -left-14 sm:-left-16 top-4 sm:top-5 w-10 sm:w-11 h-10 sm:h-11 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-200 shadow-md ${isSelected
                            ? "bg-[#c9a46a] text-[#150d14] ring-2 ring-[#f5dfb8] shadow-[#c9a46a]/40 scale-105"
                            : "bg-[#1d111b] border border-[#c9a46a]/40 text-[#f5dfb8] group-hover:border-[#c9a46a]"
                          }`}
                      >
                        <span>{step.num}</span>
                      </div>

                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <h4
                          className={`font-display text-base font-medium transition-colors ${isSelected ? "text-amber-100 font-semibold" : "text-[#fffaf4]"
                            }`}
                        >
                          {step.title}
                        </h4>
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? "bg-[#c9a46a]/20 text-amber-200" : "bg-white/5 text-[#e6cb9f]"
                            }`}
                        >
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      <p className="text-xs sm:text-[13px] text-stone-300/80 leading-relaxed font-normal">
                        {step.desc}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Interactive Active Milestone Detail Spotlight */}
              <div className="journey-detail-card relative z-10 mt-8 sm:mt-10 p-5 sm:p-6 rounded-2xl bg-[#1d121c]/90 border border-[#c9a46a]/30 shadow-xl relative overflow-hidden backdrop-blur-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#c9a46a]/15 border border-[#c9a46a]/40 text-[#f5dfb8] flex items-center justify-center shrink-0 shadow-inner">
                      <ActiveMilestoneIcon className="w-6 h-6 text-amber-300" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        
                        
                        <h4 className="font-display text-base sm:text-lg font-medium text-white">
                          {currentMilestone.title}
                        </h4>
                      </div>
                    
                    </div>
                  </div>

                  {/* Stepper progress dots */}
                  <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-center">
                    {partnershipSteps.map((s, idx) => (
                      <button
                        key={s.num}
                        type="button"
                        onClick={() => setActiveMilestone(idx)}
                        aria-label={`Select Milestone ${s.num}: ${s.title}`}
                        className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${activeMilestone === idx
                            ? "w-7 bg-[#c9a46a] ring-1 ring-amber-300"
                            : "w-2.5 bg-white/20 hover:bg-white/40"
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Refined Conversion Area */}
              <div className="journey-cta-area relative z-10 mt-10 sm:mt-12 pt-8 sm:pt-10 border-t border-white/10 text-center flex flex-col items-center">
                <h4 className="font-display text-2xl sm:text-3xl lg:text-[32px] font-medium text-[#fffaf4] mb-2 tracking-tight">
                  {t("steps.readyPrompt", "Ready to Start Your Journey?")}
                </h4>
                <p className="text-sm sm:text-base text-stone-300/85 max-w-xl mx-auto mb-7 font-normal">
                  {t("steps.readySubtitle", "Take the first step towards exploring a CakeStory franchise partnership.")}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={openModal}
                    className="w-full sm:w-auto px-9 py-3.5 rounded-full bg-[#b51f50] hover:bg-[#c7265b] text-white font-semibold text-base shadow-lg shadow-rose-950/50 hover:shadow-rose-900/70 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 cursor-pointer border border-rose-400/30"
                    aria-label="Open Franchise Application Form"
                  >
                    <span>{t("steps.cta", "Apply Now")}</span>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </button>

                  <a
                    href="tel:+918623940744"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-stone-200 hover:text-white font-medium text-sm border border-white/15 hover:border-white/25 transition-all flex items-center justify-center gap-2.5"
                    title="Direct Helpline"
                  >
                    <PhoneIcon className="w-4 h-4 text-[#e6cb9f]" />
                    <span>+91 86239 40744</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })()}

      </div>
    </section>
  );
}
