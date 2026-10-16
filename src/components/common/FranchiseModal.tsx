import React, { useState, createContext, useContext, useEffect, useRef } from "react";
import { enquiryService, FranchiseEnquiry } from "../../services/data";
import { sendLeadToWebhook } from "../../services/webhook";
import { useToast } from "./Toast";
import { useLanguage } from "../../context/LanguageContext";

type InvestmentOption = FranchiseEnquiry["investmentReadiness"];

const INVESTMENT_OPTIONS: { val: InvestmentOption; labelEn: string; labelMr: string }[] = [
  { val: "Ready to invest immediately", labelEn: "Ready to invest immediately", labelMr: "त्वरित गुंतवणूक करण्यास तयार" },
  { val: "Within 3 months", labelEn: "Within 3 months", labelMr: "३ महिन्यांच्या आत" },
  { val: "Within 6 months", labelEn: "Within 6 months", labelMr: "६ महिन्यांच्या आत" },
  { val: "Just exploring", labelEn: "Just exploring", labelMr: "फक्त प्राथमिक माहिती हवी आहे" },
];

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

function CloseIcon({ className = "w-4 h-4" }: { className?: string }) {
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
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function CheckCircleIcon({ className = "w-6 h-6" }: { className?: string }) {
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
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
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

interface FranchiseModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const FranchiseModalContext = createContext<FranchiseModalContextType>({
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
});

export function FranchiseModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <FranchiseModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      <FranchiseModal isOpen={isOpen} onClose={closeModal} />
    </FranchiseModalContext.Provider>
  );
}

export function useFranchiseModal() {
  return useContext(FranchiseModalContext);
}

export function FranchiseModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { show } = useToast();
  const { language, t } = useLanguage();

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [cityArea, setCityArea] = useState("");
  const [investmentReadiness, setInvestmentReadiness] = useState<InvestmentOption>("Ready to invest immediately");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const firstInputRef = useRef<HTMLInputElement | null>(null);

  // Reset form and errors when modal opens or closes
  useEffect(() => {
    if (!isOpen) {
      setErrors({});
      setIsSuccess(false);
    }
  }, [isOpen]);

  // Keyboard Escape, Scroll Lock & Initial Focus
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleResetAndClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    // Autofocus first input for keyboard accessibility
    const timer = setTimeout(() => {
      if (firstInputRef.current) {
        firstInputRef.current.focus();
      }
    }, 150);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) {
      errs.fullName = "modal.errName";
    }
    if (!mobile.trim()) {
      errs.mobile = "modal.errPhone";
    } else if (!/^[6-9]\d{9}$/.test(mobile.trim())) {
      errs.mobile = "modal.errPhone";
    }
    if (!cityArea.trim()) {
      errs.cityArea = "modal.errCity";
    }
    if (!investmentReadiness) {
      errs.investmentReadiness = "modal.errReadiness";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // 1. Store in runtime enquiries database
      enquiryService.create({
        fullName: fullName.trim(),
        mobile: mobile.trim(),
        cityArea: cityArea.trim(),
        investmentReadiness,
      });

      // 2. Dispatch to n8n webhook asynchronously
      sendLeadToWebhook({
        fullName: fullName.trim(),
        mobile: mobile.trim(),
        cityArea: cityArea.trim(),
        investmentReadiness,
        source: "CakeStory Website — Franchise Enquiry Modal",
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      show(language === "mr" ? "चौकशी अर्ज यशस्वीरित्या मिळाला!" : "Franchise enquiry submitted successfully!", "success");
    } catch {
      setIsSubmitting(false);
      show(language === "mr" ? "कृपया पुन्हा प्रयत्न करा." : "Failed to submit enquiry. Please try again.", "error");
    }
  };

  const handleResetAndClose = () => {
    setFullName("");
    setMobile("");
    setCityArea("");
    setInvestmentReadiness("Ready to invest immediately");
    setErrors({});
    setIsSuccess(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto bg-[#140c13]/75 backdrop-blur-xs modal-backdrop-anim"
      onClick={handleResetAndClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="franchise-modal-title"
    >
      {/* Modal Card: Warm Ivory Surface (#FFFAF4) with Fine Border (#E8DED4) & Dark Plum Text (#21161D) */}
      <div
        className="relative w-full max-w-2xl lg:max-w-[760px] bg-[#FFFAF4] rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-9 shadow-2xl border border-[#E8DED4] my-auto modal-card-anim max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button: Subtle & Accessible with Visible Berry Focus State */}
        <button
          onClick={handleResetAndClose}
          type="button"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-[#21161D] flex items-center justify-center transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#B51F50]"
          aria-label="Close modal"
        >
          <CloseIcon className="w-4 h-4" />
        </button>

        {isSuccess ? (
          /* Success Screen */
          <div className="text-center py-6 sm:py-8">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="w-7 h-7" />
            </div>
            <h3 className="font-display text-2xl sm:text-3xl text-[#21161D] mb-2 font-medium">
              {t("modal.successTitle")}
            </h3>
            <p className="text-sm sm:text-base text-stone-600 mb-6 max-w-md mx-auto leading-relaxed font-normal">
              {t("modal.successDesc")}
            </p>
            <button
              type="button"
              onClick={handleResetAndClose}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#B51F50] to-[#9E1642] hover:from-[#A01744] hover:to-[#881237] text-white font-medium text-sm sm:text-base shadow-sm transition-all cursor-pointer"
            >
              {t("modal.done")}
            </button>
          </div>
        ) : (
          /* Form Content */
          <>
            {/* Header: Refined Editorial Eyebrow & Brand Heading */}
            <div className="pr-8 mb-5 sm:mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF2F5] border border-[#F3D9E2] text-xs font-semibold tracking-wider uppercase text-[#B51F50] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B51F50]" />
                <span>{t("modal.tag")}</span>
              </div>

              <h2
                id="franchise-modal-title"
                className="font-display text-2xl sm:text-3xl lg:text-[32px] font-medium text-[#21161D] leading-tight tracking-tight"
              >
                {t("modal.title")}
              </h2>

              <p className="text-sm sm:text-base text-stone-600 mt-2 font-normal leading-relaxed max-w-xl">
                {t("modal.subtitle")}
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Desktop: 2-Column Grid / Mobile: Single Column */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                {/* 1. Full Name */}
                <div>
                  <label htmlFor="modal-full-name" className="block text-sm font-medium text-[#21161D] mb-1.5">
                    {t("modal.name")} <span className="text-[#B51F50] font-normal">*</span>
                  </label>
                  <input
                    ref={firstInputRef}
                    id="modal-full-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: "" }));
                    }}
                    placeholder={t("modal.namePlaceholder")}
                    className={`w-full h-12 sm:h-[50px] px-4 rounded-xl bg-white border text-sm sm:text-base text-[#21161D] placeholder:text-stone-400 focus:outline-none focus:border-[#B51F50] focus:ring-1 focus:ring-[#B51F50]/25 transition-all ${
                      errors.fullName ? "border-rose-400 bg-rose-50/20" : "border-[#E8DED4] hover:border-stone-400"
                    }`}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-rose-600 mt-1 font-medium" role="alert">{t(errors.fullName)}</p>
                  )}
                </div>

                {/* 2. Mobile Number (WhatsApp) */}
                <div>
                  <label htmlFor="modal-mobile" className="block text-sm font-medium text-[#21161D] mb-1.5">
                    {t("modal.phone")} <span className="text-[#B51F50] font-normal">*</span>
                  </label>
                  <input
                    id="modal-mobile"
                    type="tel"
                    required
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setMobile(val);
                      if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: "" }));
                    }}
                    placeholder={t("modal.phonePlaceholder")}
                    className={`w-full h-12 sm:h-[50px] px-4 rounded-xl bg-white border text-sm sm:text-base text-[#21161D] placeholder:text-stone-400 focus:outline-none focus:border-[#B51F50] focus:ring-1 focus:ring-[#B51F50]/25 transition-all ${
                      errors.mobile ? "border-rose-400 bg-rose-50/20" : "border-[#E8DED4] hover:border-stone-400"
                    }`}
                  />
                  {errors.mobile && (
                    <p className="text-xs text-rose-600 mt-1 font-medium" role="alert">{t(errors.mobile)}</p>
                  )}
                </div>

                {/* 3. Preferred Location */}
                <div>
                  <label htmlFor="modal-city-area" className="block text-sm font-medium text-[#21161D] mb-1.5">
                    {t("modal.city")} <span className="text-[#B51F50] font-normal">*</span>
                  </label>
                  <input
                    id="modal-city-area"
                    type="text"
                    required
                    value={cityArea}
                    onChange={(e) => {
                      setCityArea(e.target.value);
                      if (errors.cityArea) setErrors((prev) => ({ ...prev, cityArea: "" }));
                    }}
                    placeholder={t("modal.cityPlaceholder")}
                    className={`w-full h-12 sm:h-[50px] px-4 rounded-xl bg-white border text-sm sm:text-base text-[#21161D] placeholder:text-stone-400 focus:outline-none focus:border-[#B51F50] focus:ring-1 focus:ring-[#B51F50]/25 transition-all ${
                      errors.cityArea ? "border-rose-400 bg-rose-50/20" : "border-[#E8DED4] hover:border-stone-400"
                    }`}
                  />
                  {errors.cityArea && (
                    <p className="text-xs text-rose-600 mt-1 font-medium" role="alert">{t(errors.cityArea)}</p>
                  )}
                </div>

                {/* 4. Investment Readiness */}
                <div>
                  <label htmlFor="modal-investment" className="block text-sm font-medium text-[#21161D] mb-1.5">
                    {t("modal.readiness")} <span className="text-[#B51F50] font-normal">*</span>
                  </label>
                  <select
                    id="modal-investment"
                    value={investmentReadiness}
                    onChange={(e) => setInvestmentReadiness(e.target.value as InvestmentOption)}
                    className="w-full h-12 sm:h-[50px] px-4 rounded-xl bg-white border border-[#E8DED4] text-sm sm:text-base text-[#21161D] focus:outline-none focus:border-[#B51F50] focus:ring-1 focus:ring-[#B51F50]/25 transition-all cursor-pointer hover:border-stone-400"
                  >
                    {INVESTMENT_OPTIONS.map((opt) => (
                      <option key={opt.val} value={opt.val}>
                        {language === "mr" ? opt.labelMr : opt.labelEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Button: Solid Berry / Restrained Brand Gradient */}
              <div className="pt-2 sm:pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 sm:h-[52px] rounded-xl bg-gradient-to-r from-[#B51F50] to-[#9E1642] hover:from-[#A01744] hover:to-[#881237] text-white font-medium text-sm sm:text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? (
                    <>
                      <SpinnerIcon className="w-4 h-4 text-white" />
                      <span>{t("modal.submitting")}</span>
                    </>
                  ) : (
                    <>
                      <span>{t("modal.submit")}</span>
                      <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </div>

              {/* Privacy Statement with Vector Lock Icon */}
              <div className="flex items-center justify-center gap-2 text-xs sm:text-[13px] text-stone-500 pt-1 text-center">
                <LockIcon className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>{t("modal.privacy")}</span>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// Inline version of the form for embedding on the Franchise page
export function FranchiseInlineForm() {
  const { show } = useToast();
  const { language, t } = useLanguage();

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [cityArea, setCityArea] = useState("");
  const [investmentReadiness, setInvestmentReadiness] = useState<InvestmentOption>("Ready to invest immediately");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = "modal.errName";
    if (!mobile.trim()) errs.mobile = "modal.errPhone";
    else if (!/^[6-9]\d{9}$/.test(mobile.trim())) errs.mobile = "modal.errPhone";
    if (!cityArea.trim()) errs.cityArea = "modal.errCity";
    if (!investmentReadiness) errs.investmentReadiness = "modal.errReadiness";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      enquiryService.create({
        fullName: fullName.trim(),
        mobile: mobile.trim(),
        cityArea: cityArea.trim(),
        investmentReadiness,
      });

      sendLeadToWebhook({
        fullName: fullName.trim(),
        mobile: mobile.trim(),
        cityArea: cityArea.trim(),
        investmentReadiness,
        source: "CakeStory Website — Franchise Inline Form",
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      show(language === "mr" ? "चौकशी अर्ज यशस्वीरित्या मिळाला!" : "Franchise enquiry submitted successfully!", "success");
    } catch {
      setIsSubmitting(false);
      show(language === "mr" ? "कृपया पुन्हा प्रयत्न करा." : "Failed to submit enquiry. Please try again.", "error");
    }
  };

  if (isSuccess) {
    return (
      <div className="rounded-3xl p-8 text-center bg-[#FFFAF4] shadow-xl border border-[#E8DED4]">
        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
          <CheckCircleIcon className="w-7 h-7" />
        </div>
        <h3 className="font-display text-2xl font-medium text-[#21161D] mb-2">{t("modal.successTitle")}</h3>
        <p className="text-sm sm:text-base text-stone-600 mb-6 font-normal">
          {t("modal.successDesc")}
        </p>
        <button
          onClick={() => {
            setFullName("");
            setMobile("");
            setCityArea("");
            setIsSuccess(false);
          }}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#B51F50] to-[#9E1642] hover:from-[#A01744] hover:to-[#881237] text-white font-medium text-sm transition-all cursor-pointer"
        >
          {language === "mr" ? "दुसरा अर्ज पाठवा" : "Submit Another Enquiry"}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-[#FFFAF4] shadow-xl border border-[#E8DED4]">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF2F5] border border-[#F3D9E2] text-xs font-semibold tracking-wider uppercase text-[#B51F50] mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-[#B51F50]" />
        <span>{t("modal.tag")}</span>
      </div>
      <h3 className="font-display text-2xl sm:text-3xl font-medium text-[#21161D] mb-1">{t("modal.title")}</h3>
      <p className="text-sm sm:text-base text-stone-600 mb-6 font-normal">{t("modal.subtitle")}</p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#21161D] mb-1.5">
              {t("modal.name")} <span className="text-[#B51F50]">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t("modal.namePlaceholder")}
              className={`w-full h-12 px-4 rounded-xl bg-white border text-sm sm:text-base text-[#21161D] focus:outline-none focus:border-[#B51F50] focus:ring-1 focus:ring-[#B51F50]/25 transition-all ${
                errors.fullName ? "border-rose-400 bg-rose-50/20" : "border-[#E8DED4]"
              }`}
            />
            {errors.fullName && <p className="text-xs text-rose-600 mt-1 font-medium" role="alert">{t(errors.fullName)}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#21161D] mb-1.5">
              {t("modal.phone")} <span className="text-[#B51F50]">*</span>
            </label>
            <input
              type="tel"
              maxLength={10}
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
              placeholder={t("modal.phonePlaceholder")}
              className={`w-full h-12 px-4 rounded-xl bg-white border text-sm sm:text-base text-[#21161D] focus:outline-none focus:border-[#B51F50] focus:ring-1 focus:ring-[#B51F50]/25 transition-all ${
                errors.mobile ? "border-rose-400 bg-rose-50/20" : "border-[#E8DED4]"
              }`}
            />
            {errors.mobile && <p className="text-xs text-rose-600 mt-1 font-medium" role="alert">{t(errors.mobile)}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#21161D] mb-1.5">
              {t("modal.city")} <span className="text-[#B51F50]">*</span>
            </label>
            <input
              type="text"
              value={cityArea}
              onChange={(e) => setCityArea(e.target.value)}
              placeholder={t("modal.cityPlaceholder")}
              className={`w-full h-12 px-4 rounded-xl bg-white border text-sm sm:text-base text-[#21161D] focus:outline-none focus:border-[#B51F50] focus:ring-1 focus:ring-[#B51F50]/25 transition-all ${
                errors.cityArea ? "border-rose-400 bg-rose-50/20" : "border-[#E8DED4]"
              }`}
            />
            {errors.cityArea && <p className="text-xs text-rose-600 mt-1 font-medium" role="alert">{t(errors.cityArea)}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#21161D] mb-1.5">
              {t("modal.readiness")} <span className="text-[#B51F50]">*</span>
            </label>
            <select
              value={investmentReadiness}
              onChange={(e) => setInvestmentReadiness(e.target.value as InvestmentOption)}
              className="w-full h-12 px-4 rounded-xl bg-white border border-[#E8DED4] text-sm sm:text-base text-[#21161D] focus:outline-none focus:border-[#B51F50] focus:ring-1 focus:ring-[#B51F50]/25 transition-all cursor-pointer"
            >
              {INVESTMENT_OPTIONS.map((opt) => (
                <option key={opt.val} value={opt.val}>
                  {language === "mr" ? opt.labelMr : opt.labelEn}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-[#B51F50] to-[#9E1642] hover:from-[#A01744] hover:to-[#881237] text-white font-medium text-sm sm:text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          {isSubmitting ? (
            <>
              <SpinnerIcon className="w-4 h-4 text-white" />
              <span>{t("modal.submitting")}</span>
            </>
          ) : (
            <>
              <span>{t("modal.submit")}</span>
              <ArrowRightIcon className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 text-xs sm:text-[13px] text-stone-500 pt-1 text-center">
          <LockIcon className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span>{t("modal.privacy")}</span>
        </div>
      </form>
    </div>
  );
}
