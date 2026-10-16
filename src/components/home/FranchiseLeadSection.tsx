import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { enquiryService } from "../../services/data";
import { sendLeadToWebhook } from "../../services/webhook";
import { useToast } from "../common/Toast";
import { useLanguage } from "../../context/LanguageContext";
import { prefersReducedMotion, MOTION } from "../../utils/motion";

function LockIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
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
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
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

function GlobeIcon({ className = "w-4 h-4" }: { className?: string }) {
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
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

function ArrowRightIcon({ className = "w-4 h-4" }: { className?: string }) {
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
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function CheckIcon({ className = "w-6 h-6" }: { className?: string }) {
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

function SpinnerIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export default function FranchiseLeadSection() {
  const { language, t } = useLanguage();
  const { show } = useToast();

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [cityArea, setCityArea] = useState("");
  const [investmentReadiness, setInvestmentReadiness] = useState<
    "Ready to invest immediately" | "Within 3 months" | "Within 6 months" | "Just exploring"
  >("Ready to invest immediately");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Header elements reveal
      const headerElems = sectionRef.current?.querySelectorAll(".lead-header-elem");
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

      // 2. Application card reveal
      const card = sectionRef.current?.querySelector(".lead-form-card");
      if (card) {
        gsap.fromTo(
          card,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: MOTION.ease.default,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "bottom top",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !mobile.trim() || !cityArea.trim()) {
      show("Please fill out all fields", "warning");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Store in runtime enquiries database
      enquiryService.create({
        fullName: fullName.trim(),
        mobile: mobile.trim(),
        cityArea: cityArea.trim(),
        investmentReadiness,
      });

      // 2. Send lead data asynchronously to n8n webhook
      sendLeadToWebhook({
        fullName: fullName.trim(),
        mobile: mobile.trim(),
        cityArea: cityArea.trim(),
        investmentReadiness,
        source: "CakeStory Website — On-Page Franchise Application",
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      show("Application submitted successfully!", "success");
    } catch {
      setIsSubmitting(false);
      show("Failed to submit. Please try again.", "error");
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#181017] via-[#140c13] to-[#120a10] text-white relative overflow-hidden border-t border-stone-800/80"
    >
      {/* Restrained warm ambient lighting */}
      <div
        className="absolute top-0 right-1/4 w-96 h-96 bg-[#c9a46a]/5 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#961b3c]/8 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header: Refined Editorial Typography & Champagne-Gold Eyebrow */}
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-14">
          <div className="lead-header-elem inline-flex items-center gap-2.5 px-4.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#2a1d26]/95 backdrop-blur-md border border-[#c9a46a]/40 shadow-[0_4px_18px_-2px_rgba(201,164,106,0.18)] text-xs sm:text-[13.5px] font-bold tracking-[0.14em] uppercase text-[#f5dfb8] hover:text-white hover:border-[#c9a46a]/75 hover:shadow-[0_6px_22px_-2px_rgba(201,164,106,0.28)] hover:-translate-y-0.5 transition-all duration-300 cursor-default select-none mb-6 group">
            <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5 shrink-0 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c9a46a] opacity-80" />
              <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-[#c9a46a] shadow-[0_0_10px_rgba(201,164,106,0.7)]" />
            </span>
            <span className="transition-colors">{t("contact.tag")}</span>
          </div>

          <h2 className="lead-header-elem font-display text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-medium text-white leading-[1.25] tracking-tight">
            {t("contact.title")}
          </h2>

          <p className="lead-header-elem mt-3.5 text-base sm:text-lg text-stone-300/90 leading-relaxed font-normal max-w-lg mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>

        {/* Application Card: Dark Plum Surface with Champagne Accent Border */}
        <div className="lead-form-card rounded-3xl bg-[#1e141c]/95 border border-[#c9a46a]/25 p-6 sm:p-8 md:p-10 shadow-xl backdrop-blur-sm">
          {isSuccess ? (
            <div className="text-center py-8 sm:py-10">
              <div className="w-14 h-14 rounded-full bg-[#1b3323] text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                <CheckIcon className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl font-medium text-white mb-2">
                {t("contact.successTitle")}
              </h3>
              <p className="text-base text-stone-300 max-w-md mx-auto leading-relaxed mb-6 font-normal">
                {t("contact.successDesc")}
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsSuccess(false);
                  setFullName("");
                  setMobile("");
                  setCityArea("");
                }}
                className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-stone-200 hover:text-white text-xs sm:text-sm font-medium border border-white/15 transition-all cursor-pointer"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 text-sm sm:text-base">
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="contact-full-name" className="block text-sm sm:text-[14.5px] font-medium text-stone-200 mb-1.5">
                    {t("contact.name")} <span className="text-rose-400 font-normal">*</span>
                  </label>
                  <input
                    id="contact-full-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Patil"
                    className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-[#130b11] border border-stone-700/80 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#c9a46a] focus:ring-1 focus:ring-[#c9a46a]/30 hover:border-stone-600 transition-all text-sm sm:text-[15px]"
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label htmlFor="contact-mobile" className="block text-sm sm:text-[14.5px] font-medium text-stone-200 mb-1.5">
                    {t("contact.phone")} <span className="text-rose-400 font-normal">*</span>
                  </label>
                  <input
                    id="contact-mobile"
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="e.g. 98230XXXXX"
                    className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-[#130b11] border border-stone-700/80 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#c9a46a] focus:ring-1 focus:ring-[#c9a46a]/30 hover:border-stone-600 transition-all text-sm sm:text-[15px]"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Preferred Location */}
                <div>
                  <label htmlFor="contact-city-area" className="block text-sm sm:text-[14.5px] font-medium text-stone-200 mb-1.5">
                    {t("contact.city")} <span className="text-rose-400 font-normal">*</span>
                  </label>
                  <input
                    id="contact-city-area"
                    type="text"
                    required
                    value={cityArea}
                    onChange={(e) => setCityArea(e.target.value)}
                    placeholder="e.g. Baner / Kothrud / PCMC / Hadapsar"
                    className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-[#130b11] border border-stone-700/80 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#c9a46a] focus:ring-1 focus:ring-[#c9a46a]/30 hover:border-stone-600 transition-all text-sm sm:text-[15px]"
                  />
                </div>

                {/* Investment Readiness */}
                <div>
                  <label htmlFor="contact-readiness" className="block text-sm sm:text-[14.5px] font-medium text-stone-200 mb-1.5">
                    {t("contact.readiness")}
                  </label>
                  <select
                    id="contact-readiness"
                    value={investmentReadiness}
                    onChange={(e) => setInvestmentReadiness(e.target.value as any)}
                    className="w-full px-4 py-3 sm:py-3.5 rounded-xl bg-[#130b11] border border-stone-700/80 text-stone-100 focus:outline-none focus:border-[#c9a46a] focus:ring-1 focus:ring-[#c9a46a]/30 hover:border-stone-600 transition-all text-sm sm:text-[15px] cursor-pointer"
                  >
                    <option value="Ready to invest immediately">{t("contact.readiness1")}</option>
                    <option value="Within 3 months">{t("contact.readiness2")}</option>
                    <option value="Within 6 months">{t("contact.readiness3")}</option>
                    <option value="Just exploring">{t("contact.readiness4")}</option>
                  </select>
                </div>
              </div>

              {/* Submit Button: Restrained Berry Brand Gradient */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 sm:py-4 px-6 rounded-xl bg-gradient-to-r from-[#961b3c] to-[#b32b50] hover:from-[#851835] hover:to-[#a02445] text-white font-medium text-sm sm:text-base shadow-sm hover:shadow-md transition-all mt-4 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed border border-rose-400/20 group"
              >
                {isSubmitting ? (
                  <>
                    <SpinnerIcon className="w-4 h-4 text-white" />
                    <span>{t("contact.submitting")}</span>
                  </>
                ) : (
                  <>
                    <span>{t("contact.submit")}</span>
                    <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>

              {/* Privacy Message with Clean Vector Lock Icon */}
              <div className="flex items-center justify-center gap-1.5 text-xs sm:text-[13px] text-stone-400 text-center pt-2">
                <LockIcon className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>{t("contact.confidential")}</span>
              </div>
            </form>
          )}

          {/* Direct Contact Bar with Verified Number & Domain */}
          <div className="mt-8 pt-6 border-t border-stone-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-left">
            {/* Direct Franchise Desk */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#140b11]/80 border border-stone-800/90 hover:border-[#c9a46a]/30 transition-all flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#2a1d26] text-[#e6ca9c] border border-[#c9a46a]/20 flex items-center justify-center shrink-0">
                <PhoneIcon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-stone-400 tracking-wide uppercase">
                  {language === "mr" ? "थेट फ्रँचायझी डेस्क" : "Direct Franchise Desk"}
                </div>
                <a
                  href="tel:+918623940744"
                  className="text-sm sm:text-[15px] font-medium text-stone-100 hover:text-[#e6ca9c] transition-colors truncate block"
                >
                  +91 86239 40744
                </a>
              </div>
            </div>

            {/* Official Portal */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#140b11]/80 border border-stone-800/90 hover:border-rose-400/30 transition-all flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#2a141e] text-[#f2a8bd] border border-rose-500/20 flex items-center justify-center shrink-0">
                <GlobeIcon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-stone-400 tracking-wide uppercase">
                  {t("footer.portalLabel", "Official Portal").replace(/:$/, "")}
                </div>
                <a
                  href="https://cakestorydesserts.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm sm:text-[15px] font-medium text-stone-100 hover:text-rose-300 transition-colors truncate block"
                >
                  cakestorydesserts.in
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
