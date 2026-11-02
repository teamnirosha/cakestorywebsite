import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../../context/LanguageContext";
import { prefersReducedMotion, MOTION } from "../../utils/motion";
import faqBackdropImg from "../../assets/faq/image.png";

gsap.registerPlugin(ScrollTrigger);

// 1. Storefront Icon
function StorefrontIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m2 7 3.5-4h13L22 7" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
      <path d="M2 7h20" />
      <path d="M4 7v5a2 2 0 0 0 4 0V7" />
      <path d="M8 7v5a2 2 0 0 0 4 0V7" />
      <path d="M12 7v5a2 2 0 0 0 4 0V7" />
      <path d="M16 7v5a2 2 0 0 0 4 0V7" />
    </svg>
  );
}

// 2. Chef Hat Icon
function ChefHatIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 13.8a4.5 4.5 0 1 1 2.6-8.2 5 5 0 0 1 6.8 0 4.5 4.5 0 1 1 2.6 8.2" />
      <path d="m6 14 1.5 6h9L18 14" />
      <path d="M6 17h12" />
    </svg>
  );
}

// 3. Package / Inventory Box Icon
function PackageBoxIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

// 4. Training / Operational Support Icon
function SupportTrainingIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 21a8.38 8.38 0 0 1 13 0" />
      <path d="m16 11 2 2 4-4" />
    </svg>
  );
}

// 5. Percent / Royalties Tag Icon
function RoyaltyPercentIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="9" r="1.5" fill="currentColor" />
      <circle cx="15" cy="15" r="1.5" fill="currentColor" />
      <path d="M16 8 8 16" />
      <rect width="18" height="18" x="3" y="3" rx="4" />
    </svg>
  );
}

// Center Cupcake Icon
function CupcakeEmblemIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 10h12l-1.5 9.5a1.5 1.5 0 0 1-1.5 1.3H9a1.5 1.5 0 0 1-1.5-1.3L6 10Z" />
      <path d="M6 10a3 3 0 0 1 6 0 3 3 0 0 1 6 0" />
      <path d="M12 7c-1-2 0-3.5 0-3.5s1 1.5 0 3.5Z" />
      <circle cx="12" cy="3.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

// Chevron Icon with smooth rotation
function ChevronIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

interface LuxuryFaqSectionProps {
  id?: string;
  isStandalonePage?: boolean;
}

export default function LuxuryFaqSection({
  id = "faq",
  isStandalonePage = false,
}: LuxuryFaqSectionProps) {
  const { language } = useLanguage();
  // Item 0 is open by default matching the reference screenshot
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Header elements reveal
      const headerElems = sectionRef.current?.querySelectorAll(".faq-luxury-header-elem");
      if (headerElems && headerElems.length > 0) {
        gsap.fromTo(
          headerElems,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: MOTION.duration.reveal,
            stagger: 0.08,
            ease: MOTION.ease.default,
            scrollTrigger: isStandalonePage
              ? undefined
              : {
                  trigger: sectionRef.current,
                  start: "top 85%",
                  end: "bottom top",
                  toggleActions: "play reverse play reverse",
                },
          }
        );
      }

      // 2. Accordion items staggered reveal
      const items = sectionRef.current?.querySelectorAll(".faq-luxury-item");
      if (items && items.length > 0) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: MOTION.duration.reveal,
            stagger: 0.07,
            ease: MOTION.ease.default,
            scrollTrigger: isStandalonePage
              ? undefined
              : {
                  trigger: ".faq-luxury-list",
                  start: "top 88%",
                  end: "bottom top",
                  toggleActions: "play reverse play reverse",
                },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isStandalonePage]);

  const faqs = [
    {
      icon: StorefrontIcon,
      qEn: "What is the store size required for a CakeStory Desserts outlet?",
      qMr: "केकस्टोरी डेझर्ट्स आऊटलेट सुरू करण्यासाठी किती जागेची आवश्यकता असते?",
      aEn: "CakeStory operates on a compact, highly optimized format of 300 to 400 sq.ft. on a prominent commercial street with good frontage and customer visibility.",
      aMr: "केकस्टोरीचे आऊटलेट हे ३०० ते ४०० चौरस फुटांच्या कॉम्पॅक्ट जागेत चालते. मुख्य बाजारपेठेत किंवा गर्दीच्या रस्त्यावर चांगली फ्रंट साईझ असलेले दुकान उत्तम ठरते.",
    },
    {
      icon: ChefHatIcon,
      qEn: "Do I need prior baking experience or skilled bakery chefs?",
      qMr: "मला आधीच्या बेकिंग अनुभवाची किंवा बेकर्सची गरज आहे का?",
      aEn: "No. CakeStory operates on 100% Zero In-Store Baking. All cake baking, sponge formulations, and finishing are completed at our centralized Pune cleanroom facility. Your store only handles retail display, billing, and customer service.",
      aMr: "अजिबात नाही. केकस्टोरीमध्ये दुकानात बेकिंग करण्याची शून्य गरज असते. सर्व बेकिंग व फिनिशिंग आमच्या मुख्य किचनमध्ये होते. दुकानात फक्त काउंटर विक्री आणि सेवा दिली जाते.",
    },
    {
      icon: PackageBoxIcon,
      qEn: "How does the daily stock replenishment work?",
      qMr: "दररोज ताज्या मालाचा पुरवठा कसा होतो?",
      aEn: "Our temperature-controlled refrigerated dispatch vans deliver fresh cakes and baked goods to your store every morning across Pune, minimizing stockouts and eliminating shrinkage.",
      aMr: "आमच्या रेफ्रिजरेटेड कोल्ड-चेन व्हॅन्स दररोज सकाळी पुण्यात सर्व आउटलेट्सना ताजा आणि दर्जेदार स्टॉक थेट पोहोचवतात, त्यामुळे माल खराब होण्याचा कोणताही धोका नसतो.",
    },
    {
      icon: SupportTrainingIcon,
      qEn: "What training and operational support does CakeStory provide?",
      qMr: "कंपनीकडून काय सहकार्य आणि ट्रेनिंग दिले जाते?",
      aEn: "We provide end-to-end turnkey support including architectural layouts, interior fit-out guidelines, counter POS billing software, packaging inventory, and comprehensive customer handling training.",
      aMr: "आम्ही दुकानाचे इंटिरिअर डिझाइन, बिलिंग सॉफ्टवेअर, पॅकेजिंग मटेरिअल, उद्घाटन मार्केटिंग आणि कर्मचाऱ्यांना परिपूर्ण ग्राहक सेवेचे प्रशिक्षण देतो.",
    },
    {
      icon: RoyaltyPercentIcon,
      qEn: "Are there any hidden royalties or surprise marketing charges?",
      qMr: "कोणतीही छुपी रॉयल्टी किंवा जाहिरात खर्च आहे का?",
      aEn: "No. CakeStory Desserts believes in transparent, mutually profitable partnerships with clean margins and zero hidden advertising levies.",
      aMr: "नाही. केकस्टोरी पूर्णपणे पारदर्शक पद्धतीवर काम करते. कोणतेही छुपे चार्जेस किंवा जाहिरातीचे अतिरिक्त शुल्क आकारले जात नाही.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`relative overflow-hidden w-full scroll-mt-24 sm:scroll-mt-28 ${
        isStandalonePage
          ? "pt-24 sm:pt-28 pb-16 sm:pb-20 min-h-screen flex flex-col justify-between"
          : "pt-10 sm:pt-14 pb-14 sm:pb-18"
      } bg-[#fde9d2]`}
    >
      {/* =========================================================
          1. AUTHENTIC LUXURY BACKGROUND & ATMOSPHERIC TRANSITIONS
      ========================================================= */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        <img
          src={faqBackdropImg}
          alt=""
          role="presentation"
          loading="eager"
          className="w-full h-full object-contain xl:object-cover object-bottom scale-[1.01] transition-transform duration-1000 ease-out"
        />

        {/* Delicate golden circular swirls (echoing screenshot corners) */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full border border-amber-400/20 pointer-events-none" />
        <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full border border-amber-400/25 pointer-events-none" />

        {/* Soft radial center glow for maximum text clarity while preserving flank imagery */}
        <div className="absolute inset-0 bg-radial from-[#faf6f0]/45 via-[#faf6f0]/20 to-transparent pointer-events-none" />

        {/* TOP TRANSITION EFFECT: Soft luminous champagne blend from Outlets section */}
        <div className="absolute inset-x-0 top-0 h-24 sm:h-32 bg-gradient-to-b from-[#fde9d2] via-[#fde9d2]/60 to-transparent pointer-events-none z-[2]" />

        {/* BOTTOM TRANSITION EFFECT: Rich dark plum chocolate dessert dissolve into Franchise Lead Section */}
        <div className="absolute inset-x-0 bottom-0 h-28 sm:h-36 bg-gradient-to-t from-[#181017] via-[#181017]/75 to-transparent pointer-events-none z-[2]" />
      </div>

      {/* =========================================================
          2. CENTRAL CONTENT CONTAINER
      ========================================================= */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center">

        {/* HERO HEADING MATCHING SCREENSHOT EXACTLY */}
        <div className="text-center max-w-2xl mx-auto mb-5 sm:mb-7">

          {/* Eyebrow with gold horizontal rules */}
          <div className="faq-luxury-header-elem flex items-center justify-center gap-2.5 sm:gap-3.5 mb-1.5 sm:mb-2">
            <span className="h-[1px] w-7 sm:w-12 bg-[#d8b77e]/80 inline-block" />
            <span className="text-[9.5px] sm:text-[11px] font-bold tracking-[0.24em] uppercase text-[#b28243]">
              {language === "mr" ? "तुमच्या सर्व प्रश्नांची स्पष्ट उत्तरे" : "YOUR QUESTIONS, ANSWERED."}
            </span>
            <span className="h-[1px] w-7 sm:w-12 bg-[#d8b77e]/80 inline-block" />
          </div>

          {/* Large refined burgundy editorial serif heading */}
          <h1 className="faq-luxury-header-elem font-serif-luxury font-medium text-[#460b1b] text-2xl sm:text-3xl md:text-[38px] lg:text-[42px] tracking-tight leading-[1.15] drop-shadow-xs">
            {language === "mr" ? "वारंवार विचारले जाणारे प्रश्न" : "Frequently Asked Questions"}
          </h1>

          {/* Supporting text */}
          <p className="faq-luxury-header-elem text-[#6d575f] text-xs sm:text-[13.5px] leading-relaxed font-normal mt-1.5 sm:mt-2 max-w-md mx-auto">
            {language === "mr"
              ? "केकस्टोरी डेझर्ट्स फ्रँचायझीबद्दलची संपूर्ण आणि पारदर्शक माहिती"
              : "Everything you need to know about starting your CakeStory Desserts franchise"}
          </p>

          {/* Cupcake emblem between horizontal gold rules */}
          <div className="faq-luxury-header-elem flex items-center justify-center gap-2.5 sm:gap-3.5 mt-2.5 sm:mt-3">
            <span className="h-[1px] w-7 sm:w-10 bg-[#dfbe86]/70 inline-block" />
            <div className="w-6.5 h-6.5 rounded-full border border-[#d8b77e] bg-[#fdf9f2] flex items-center justify-center text-[#9b662e] shadow-xs">
              <CupcakeEmblemIcon className="w-3.5 h-3.5" />
            </div>
            <span className="h-[1px] w-7 sm:w-10 bg-[#dfbe86]/70 inline-block" />
          </div>

        </div>

        {/* =========================================================
            3. FAQ ACCORDION CENTRAL STACK
        ========================================================= */}
        <div className="faq-luxury-list w-full max-w-[580px] sm:max-w-[620px] lg:max-w-[680px] xl:max-w-[700px] mx-auto space-y-2 sm:space-y-2.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            const IconComponent = faq.icon;
            const q = language === "mr" ? faq.qMr : faq.qEn;
            const a = language === "mr" ? faq.aMr : faq.aEn;

            return (
              <div
                key={idx}
                className={`faq-luxury-item transition-all duration-300 ease-out overflow-hidden ${
                  isOpen
                    ? "bg-gradient-to-b from-[#fffefc] via-[#fdf9f2] to-[#faf3e8] border-[1.5px] border-[#d8b77c] rounded-[20px] sm:rounded-[22px] shadow-[0_10px_28px_rgba(100,50,20,0.11)]"
                    : "bg-gradient-to-r from-[#fefbf6] via-[#faf4ea] to-[#fefbf6] border border-[#eddac2]/90 hover:border-[#d4b074] rounded-[20px] sm:rounded-[22px] shadow-[0_3px_10px_rgba(100,50,20,0.04)] hover:shadow-[0_6px_18px_rgba(100,50,20,0.08)] hover:-translate-y-0.5"
                }`}
              >
                {/* Header Row Trigger */}
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full p-2.5 sm:p-3 sm:px-4 flex items-center justify-between gap-2.5 sm:gap-3 text-left cursor-pointer focus:outline-none select-none"
                >
                  {/* Left Circular Burgundy Icon Badge */}
                  <div className="w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 rounded-full bg-[#52091c] text-white flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105">
                    <IconComponent className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </div>

                  {/* Question Typography */}
                  <div className="flex-1 min-w-0 pr-1">
                    <h3
                      className={`font-serif-luxury ${
                        isOpen
                          ? "font-bold text-[#4e091b] text-[14px] sm:text-[15.5px]"
                          : "font-semibold text-[#4e091b] text-[13.5px] sm:text-[15px]"
                      } leading-snug tracking-tight transition-colors duration-200`}
                    >
                      {q}
                    </h3>
                  </div>

                  {/* Right Circular Toggle Chevron Button */}
                  <div
                    className={`w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen
                        ? "bg-white border border-[#e2cca4] text-[#52091c] shadow-xs"
                        : "bg-white/95 border border-[#e4cc9f]/80 text-[#52091c] shadow-xs"
                    }`}
                  >
                    <ChevronIcon
                      className={`w-3.5 h-3.5 transition-transform duration-300 ${
                        isOpen ? "-rotate-180" : "rotate-0"
                      }`}
                    />
                  </div>
                </button>

                {/* Smooth Expandable Answer Body */}
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    {/* Subtle divider */}
                    <div className="mx-3.5 sm:mx-5 border-t border-[#ebd8be]/60" />

                    {/* Answer text */}
                    <div className="pt-2 pb-3.5 sm:pb-4 px-3.5 sm:px-5 pl-12 sm:pl-16 pr-3.5 sm:pr-7 text-[#52444b] text-xs sm:text-[13px] leading-relaxed font-normal">
                      <p>{a}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* =========================================================
            4. BOTTOM SIGNATURE (Harmonized with bottom dissolve)
        ========================================================= */}
        <div className="faq-luxury-header-elem mt-5 sm:mt-7 flex items-center justify-center gap-2.5 sm:gap-3.5 select-none relative z-[3]">
          <span className="h-[1px] w-10 sm:w-16 bg-[#e8cca0]/70 inline-block" />
          <span className="text-[9.5px] sm:text-[10.5px] font-bold tracking-[0.24em] text-[#fbf0dc] uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            {language === "mr"
              ? "द केकस्टोरी डेझर्ट्स एक्सपिरियन्स"
              : "THE CAKESTORY DESSERTS EXPERIENCE"}
          </span>
          <span className="h-[1px] w-10 sm:w-16 bg-[#e8cca0]/70 inline-block" />
        </div>

      </div>
    </section>
  );
}
