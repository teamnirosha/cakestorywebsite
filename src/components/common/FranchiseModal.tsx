import React, { useState, createContext, useContext, useEffect } from "react";
import { enquiryService, FranchiseEnquiry } from "../../services/data";
import { useToast } from "./Toast";

type InvestmentOption = FranchiseEnquiry["investmentReadiness"];

const INVESTMENT_OPTIONS: InvestmentOption[] = [
  "Ready to invest immediately",
  "Within 3 months",
  "Within 6 months",
  "Just exploring",
];

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
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [cityArea, setCityArea] = useState("");
  const [investmentReadiness, setInvestmentReadiness] = useState<InvestmentOption>("Ready to invest immediately");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Keyboard Escape & Scroll Lock
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) {
      errs.fullName = "Full name is required";
    }
    if (!mobile.trim()) {
      errs.mobile = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(mobile.trim())) {
      errs.mobile = "Please enter a valid 10-digit mobile number";
    }
    if (!cityArea.trim()) {
      errs.cityArea = "City / Area is required";
    }
    if (!investmentReadiness) {
      errs.investmentReadiness = "Please select investment readiness";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    setTimeout(() => {
      try {
        enquiryService.create({
          fullName: fullName.trim(),
          mobile: mobile.trim(),
          cityArea: cityArea.trim(),
          investmentReadiness,
        });
        setIsSubmitting(false);
        setIsSuccess(true);
        show("Franchise enquiry submitted successfully!", "success");
      } catch (err) {
        setIsSubmitting(false);
        show("Failed to submit enquiry. Please try again.", "error");
      }
    }, 600);
  };

  const handleReset = () => {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-md transition-opacity animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/60 bg-white/90 my-auto transform transition-all duration-300 max-h-[90vh] overflow-y-auto scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center transition"
          aria-label="Close"
        >
          ✕
        </button>

        {isSuccess ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce">
              ✓
            </div>
            <h3 className="font-display text-2xl text-[#2a1d2e] mb-2 font-bold">
              Enquiry Received!
            </h3>
            <p className="text-sm text-[#5a4a5e] mb-6 max-w-md mx-auto leading-relaxed">
              Thank you for your interest in growing with CakeStory Desserts. Our franchise expansion team will reach out to you within 24 hours.
            </p>
            <button onClick={handleReset} className="btn-primary w-full py-3">
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-[#ff5c97] text-xs font-semibold mb-2">
                💼 FRANCHISE OPPORTUNITY
              </div>
              <h2 className="font-display text-2xl sm:text-3xl text-[#2a1d2e] font-bold">
                Start Your Franchise Journey
              </h2>
              <p className="text-xs sm:text-sm text-[#5a4a5e] mt-1">
                Fill in your details and we'll get back to you within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 1. Full Name */}
              <div>
                <label className="block text-xs font-semibold text-[#2a1d2e] mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: "" }));
                  }}
                  placeholder="Enter your full name"
                  className={`input-field ${errors.fullName ? "border-rose-400 bg-rose-50/50" : ""}`}
                />
                {errors.fullName && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.fullName}</p>
                )}
              </div>

              {/* 2. Mobile Number */}
              <div>
                <label className="block text-xs font-semibold text-[#2a1d2e] mb-1">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setMobile(val);
                    if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: "" }));
                  }}
                  placeholder="Enter your 10-digit mobile number"
                  className={`input-field ${errors.mobile ? "border-rose-400 bg-rose-50/50" : ""}`}
                />
                {errors.mobile && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.mobile}</p>
                )}
              </div>

              {/* 3. City / Area */}
              <div>
                <label className="block text-xs font-semibold text-[#2a1d2e] mb-1">
                  City / Area <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={cityArea}
                  onChange={(e) => {
                    setCityArea(e.target.value);
                    if (errors.cityArea) setErrors((prev) => ({ ...prev, cityArea: "" }));
                  }}
                  placeholder="e.g., Pune - Kothrud"
                  className={`input-field ${errors.cityArea ? "border-rose-400 bg-rose-50/50" : ""}`}
                />
                {errors.cityArea && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.cityArea}</p>
                )}
              </div>

              {/* 4. Investment Readiness */}
              <div>
                <label className="block text-xs font-semibold text-[#2a1d2e] mb-1">
                  Investment Readiness <span className="text-rose-500">*</span>
                </label>
                <select
                  value={investmentReadiness}
                  onChange={(e) => setInvestmentReadiness(e.target.value as InvestmentOption)}
                  className="input-field cursor-pointer"
                >
                  {INVESTMENT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {errors.investmentReadiness && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.investmentReadiness}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full !py-3.5 text-base font-semibold transition-all disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting Enquiry...
                    </span>
                  ) : (
                    "Submit Enquiry"
                  )}
                </button>
              </div>

              {/* Required Footer Note */}
              <p className="text-center text-[11px] text-[#5a4a5e] mt-3">
                By submitting, you agree to be contacted by our franchise team
              </p>
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
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [cityArea, setCityArea] = useState("");
  const [investmentReadiness, setInvestmentReadiness] = useState<InvestmentOption>("Ready to invest immediately");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = "Full name is required";
    if (!mobile.trim()) errs.mobile = "Mobile number is required";
    else if (!/^[6-9]\d{9}$/.test(mobile.trim())) errs.mobile = "Please enter a valid 10-digit mobile number";
    if (!cityArea.trim()) errs.cityArea = "City / Area is required";
    if (!investmentReadiness) errs.investmentReadiness = "Please select investment readiness";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    setTimeout(() => {
      try {
        enquiryService.create({
          fullName: fullName.trim(),
          mobile: mobile.trim(),
          cityArea: cityArea.trim(),
          investmentReadiness,
        });
        setIsSubmitting(false);
        setIsSuccess(true);
        show("Franchise enquiry submitted successfully!", "success");
      } catch (err) {
        setIsSubmitting(false);
        show("Failed to submit enquiry. Please try again.", "error");
      }
    }, 600);
  };

  if (isSuccess) {
    return (
      <div className="glass rounded-3xl p-8 text-center bg-white/90 shadow-xl border border-white">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce">
          ✓
        </div>
        <h3 className="font-display text-2xl text-[#2a1d2e] mb-2 font-bold">Enquiry Received!</h3>
        <p className="text-sm text-[#5a4a5e] mb-6">
          Thank you for your interest in growing with CakeStory Desserts. Our franchise expansion team will reach out to you within 24 hours.
        </p>
        <button
          onClick={() => {
            setFullName("");
            setMobile("");
            setCityArea("");
            setIsSuccess(false);
          }}
          className="btn-primary"
        >
          Submit Another Enquiry
        </button>
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-6 sm:p-8 bg-white/90 shadow-xl border border-white">
      <h3 className="font-display text-2xl font-bold text-[#2a1d2e] mb-1">Start Your Franchise Journey</h3>
      <p className="text-xs text-[#5a4a5e] mb-6">Fill in your details and we'll get back to you within 24 hours.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#2a1d2e] mb-1">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            className={`input-field ${errors.fullName ? "border-rose-400 bg-rose-50/50" : ""}`}
          />
          {errors.fullName && <p className="text-[11px] text-rose-500 mt-1">{errors.fullName}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2a1d2e] mb-1">
            Mobile Number <span className="text-rose-500">*</span>
          </label>
          <input
            type="tel"
            maxLength={10}
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
            placeholder="Enter your 10-digit mobile number"
            className={`input-field ${errors.mobile ? "border-rose-400 bg-rose-50/50" : ""}`}
          />
          {errors.mobile && <p className="text-[11px] text-rose-500 mt-1">{errors.mobile}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2a1d2e] mb-1">
            City / Area <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={cityArea}
            onChange={(e) => setCityArea(e.target.value)}
            placeholder="e.g., Pune - Kothrud"
            className={`input-field ${errors.cityArea ? "border-rose-400 bg-rose-50/50" : ""}`}
          />
          {errors.cityArea && <p className="text-[11px] text-rose-500 mt-1">{errors.cityArea}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#2a1d2e] mb-1">
            Investment Readiness <span className="text-rose-500">*</span>
          </label>
          <select
            value={investmentReadiness}
            onChange={(e) => setInvestmentReadiness(e.target.value as InvestmentOption)}
            className="input-field cursor-pointer"
          >
            {INVESTMENT_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full !py-3 font-semibold mt-2">
          {isSubmitting ? "Submitting Enquiry..." : "Submit Enquiry"}
        </button>

        <p className="text-center text-[11px] text-[#5a4a5e] mt-2">
          By submitting, you agree to be contacted by our franchise team
        </p>
      </form>
    </div>
  );
}
