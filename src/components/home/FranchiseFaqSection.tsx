import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useLanguage } from "../../context/LanguageContext";
import { prefersReducedMotion, MOTION } from "../../utils/motion";
import faqBg from "../../assets/faq/patisserie-counter.jpg";

function ChevronDownIcon({ className = "w-4 h-4" }: { className?: string }) {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function FranchiseFaqSection() {
  const { language, t } = useLanguage();
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Header elements sequential reveal
      const headerElems = sectionRef.current?.querySelectorAll(".faq-header-elem");
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

      // 2. Accordion items staggered reveal
      const items = sectionRef.current?.querySelectorAll(".faq-accordion-item");
      if (items && items.length > 0) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: MOTION.duration.reveal,
            stagger: 0.08,
            ease: MOTION.ease.default,
            scrollTrigger: {
              trigger: ".faq-accordion-list",
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

  const faqs = [
    {
      qEn: "What is the store size required for a CakeStory Desserts outlet?",
      qMr: "केकस्टोरी डेझर्ट्स आऊटलेट सुरू करण्यासाठी किती जागेची आवश्यकता असते?",
      aEn: "CakeStory operates on a compact, highly optimized format of 300 to 400 sq.ft. on a prominent commercial street with good frontage and customer visibility.",
      aMr: "केकस्टोरीचे आऊटलेट हे ३०० ते ४०० चौरस फुटांच्या कॉम्पॅक्ट जागेत चालते. मुख्य बाजारपेठेत किंवा गर्दीच्या रस्त्यावर चांगली फ्रंट साईझ असलेले दुकान उत्तम ठरते.",
    },
    {
      qEn: "Do I need prior baking experience or skilled bakery chefs?",
      qMr: "मला आधीच्या बेकिंग अनुभवाची किंवा बेकर्सची गरज आहे का?",
      aEn: "No. CakeStory operates on 100% Zero In-Store Baking. All cake baking, sponge formulations, and finishing are completed at our centralized Pune cleanroom facility. Your store only handles retail display, billing, and customer service.",
      aMr: "अजिबात नाही. केकस्टोरीमध्ये दुकानात बेकिंग करण्याची शून्य गरज असते. सर्व बेकिंग व फिनिशिंग आमच्या मुख्य किचनमध्ये होते. दुकानात फक्त काउंटर विक्री आणि सेवा दिली जाते.",
    },
    {
      qEn: "How does the daily stock replenishment work?",
      qMr: "दररोज ताज्या मालाचा पुरवठा कसा होतो?",
      aEn: "Our temperature-controlled refrigerated dispatch vans deliver fresh cakes and baked goods to your store every morning across Pune, minimizing stockouts and eliminating shrinkage.",
      aMr: "आमच्या रेफ्रिजरेटेड कोल्ड-चेन व्हॅन्स दररोज सकाळी पुण्यात सर्व आउटलेट्सना ताजा आणि दर्जेदार स्टॉक थेट पोहोचवतात, त्यामुळे माल खराब होण्याचा कोणताही धोका नसतो.",
    },
    {
      qEn: "What training and operational support does CakeStory provide?",
      qMr: "कंपनीकडून काय सहकार्य आणि ट्रेनिंग दिले जाते?",
      aEn: "We provide end-to-end turnkey support including architectural layouts, interior fit-out guidelines, counter POS billing software, packaging inventory, and comprehensive customer handling training.",
      aMr: "आम्ही दुकानाचे इंटिरिअर डिझाइन, बिलिंग सॉफ्टवेअर, पॅकेजिंग मटेरिअल, उद्घाटन मार्केटिंग आणि कर्मचाऱ्यांना परिपूर्ण ग्राहक सेवेचे प्रशिक्षण देतो.",
    },
    {
      qEn: "Are there any hidden royalties or surprise marketing charges?",
      qMr: "कोणतीही छुपी रॉयल्टी किंवा जाहिरात खर्च आहे का?",
      aEn: "No. CakeStory Desserts believes in transparent, mutually profitable partnerships with clean margins and zero hidden advertising levies.",
      aMr: "नाही. केकस्टोरी पूर्णपणे पारदर्शक पद्धतीवर काम करते. कोणतेही छुपे चार्जेस किंवा जाहिरातीचे अतिरिक्त शुल्क आकारले जात नाही.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#faf7f2] overflow-hidden"
    >
      {/* 1. Dedicated Patisserie Counter Background Layer with Soft Seamless Top Transition */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Soft Top Inward Blend from Outlets Wave */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#faf7f2] via-[#faf7f2]/90 to-transparent z-1" />

        <img
          src={faqBg}
          alt=""
          role="presentation"
          loading="lazy"
          className="w-full h-full object-cover object-center"
        />
        {/* Single controlled warm-ivory gradient overlay allowing the cake display counter to be visibly perceptible while keeping all text easily readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#faf7f2]/90 via-[#faf7f2]/78 to-[#faf7f2]/90" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* 2. Section Header: Refined Editorial Typography & Subtle Eyebrow Label */}
        <div className="text-center mb-12 sm:mb-14">
          <div className="faq-header-elem inline-flex items-center gap-2.5 px-4.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-stone-200/90 shadow-[0_2px_12px_-2px_rgba(181,31,80,0.12)] text-xs sm:text-[13.5px] font-bold tracking-[0.12em] uppercase text-stone-700 hover:text-stone-900 hover:border-rose-300/80 hover:shadow-[0_4px_16px_-2px_rgba(181,31,80,0.18)] hover:-translate-y-0.5 transition-all duration-300 cursor-default select-none mb-5 group">
            <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5 shrink-0 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-[#b51f50] shadow-[0_0_8px_rgba(181,31,80,0.6)]" />
            </span>
            <span className="transition-colors">{t("faq.tag")}</span>
          </div>

          <h2 className="faq-header-elem font-display text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-medium text-stone-900 leading-[1.25] tracking-tight">
            {t("faq.title")}
          </h2>

          <p className="faq-header-elem mt-3.5 text-base sm:text-lg text-stone-600 leading-relaxed font-normal max-w-xl mx-auto">
            {t("faq.subtitle")}
          </p>
        </div>

        {/* 3. Accordion List with High-Contrast Readable Cards */}
        <div className="faq-accordion-list space-y-3.5 sm:space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            const q = language === "mr" ? faq.qMr : faq.qEn;
            const a = language === "mr" ? faq.aMr : faq.aEn;

            return (
              <div
                key={idx}
                className={`faq-accordion-item rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "bg-white border-stone-300 shadow-sm"
                    : "bg-white/95 backdrop-blur-xs border-stone-200/90 shadow-2xs hover:border-stone-300 hover:bg-white"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  id={`faq-question-${idx}`}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-display font-medium text-[15px] sm:text-base md:text-[17px] text-stone-900 group cursor-pointer"
                >
                  <span
                    className={`transition-colors duration-150 break-words flex-1 ${
                      isOpen ? "text-[#961b3c]" : "group-hover:text-[#961b3c]"
                    }`}
                  >
                    {q}
                  </span>
                  <span
                    className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-transform duration-200 motion-reduce:transition-none ${
                      isOpen
                        ? "rotate-180 bg-[#faf2f5] text-[#961b3c] border-[#f3d9e2]"
                        : "bg-stone-50 text-stone-500 border-stone-200 group-hover:bg-stone-100 group-hover:text-stone-800"
                    }`}
                  >
                    <ChevronDownIcon className="w-4 h-4" />
                  </span>
                </button>

                {/* Smooth CSS Grid Transition for Answer Body */}
                <div
                  id={`faq-answer-${idx}`}
                  role="region"
                  aria-labelledby={`faq-question-${idx}`}
                  className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 sm:px-6 pb-6 pt-0 text-sm sm:text-base text-stone-700 leading-relaxed font-normal border-t border-stone-100/90 bg-white">
                      <p className="pt-3.5 break-words">{a}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
