import { useState } from "react";
import { enquiryService } from "../../services/data";
import { sendLeadToWebhook } from "../../services/webhook";
import { useToast } from "../common/Toast";
import { useLanguage } from "../../context/LanguageContext";

export default function FranchiseLeadSection() {
  const { t } = useLanguage();
  const { show } = useToast();

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [cityArea, setCityArea] = useState("");
  const [investmentReadiness, setInvestmentReadiness] = useState<
    "Ready to invest immediately" | "Within 3 months" | "Within 6 months" | "Just exploring"
  >("Ready to invest immediately");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

      // 2. Dump lead data asynchronously to n8n webhook
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
    <section id="contact" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold uppercase tracking-wider mb-3 border border-pink-500/30">
            {t("contact.tag")}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            {t("contact.title")}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed font-light">
            {t("contact.subtitle")}
          </p>
        </div>

        {/* Application Card */}
        <div className="rounded-3xl bg-slate-950/80 border border-slate-800 p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce">
                ✓
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-2">
                {t("contact.successTitle")}
              </h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed mb-6">
                {t("contact.successDesc")}
              </p>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setFullName("");
                  setMobile("");
                  setCityArea("");
                }}
                className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">
                    {t("contact.name")} <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Patil"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 transition text-xs sm:text-sm"
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">
                    {t("contact.phone")} <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="e.g. 98230XXXXX"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 transition text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Preferred Location */}
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">
                    {t("contact.city")} <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={cityArea}
                    onChange={(e) => setCityArea(e.target.value)}
                    placeholder="e.g. Baner / Kothrud / PCMC"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 transition text-xs sm:text-sm"
                  />
                </div>

                {/* Investment Readiness */}
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">
                    {t("contact.readiness")}
                  </label>
                  <select
                    value={investmentReadiness}
                    onChange={(e) => setInvestmentReadiness(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-pink-500 transition text-xs sm:text-sm cursor-pointer"
                  >
                    <option value="Ready to invest immediately">{t("contact.readiness1")}</option>
                    <option value="Within 3 months">{t("contact.readiness2")}</option>
                    <option value="Within 6 months">{t("contact.readiness3")}</option>
                    <option value="Just exploring">{t("contact.readiness4")}</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-sm sm:text-base shadow-xl shadow-pink-500/25 transition-all mt-4 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>{t("contact.submitting")}</span>
                ) : (
                  <>
                    <span>{t("contact.submit")}</span>
                    <span aria-hidden="true">→</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-slate-400 text-center pt-2">
                🔒 Your personal and business details are kept confidential under strict non-disclosure.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
