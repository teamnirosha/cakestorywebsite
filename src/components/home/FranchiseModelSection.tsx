import { useFranchiseModal } from "../common/FranchiseModal";
import { useLanguage } from "../../context/LanguageContext";

export default function FranchiseModelSection() {
  const { openModal } = useFranchiseModal();
  const { t } = useLanguage();

  const pillars = [
    {
      icon: "🏭",
      title: t("franchise.p1Title"),
      desc: t("franchise.p1Desc"),
      highlight: "Zero Chefs Needed",
    },
    {
      icon: "📐",
      title: t("franchise.p2Title"),
      desc: t("franchise.p2Desc"),
      highlight: "Low Rent & Capex",
    },
    {
      icon: "❄️",
      title: t("franchise.p3Title"),
      desc: t("franchise.p3Desc"),
      highlight: "Daily Fresh Stock",
    },
    {
      icon: "🎓",
      title: t("franchise.p4Title"),
      desc: t("franchise.p4Desc"),
      highlight: "Complete Handholding",
    },
  ];

  const steps = [
    { num: "01", label: t("steps.s1") },
    { num: "02", label: t("steps.s2") },
    { num: "03", label: t("steps.s3") },
    { num: "04", label: t("steps.s4") },
  ];

  return (
    <section id="franchise" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-50 text-pink-600 text-xs font-bold uppercase tracking-wider mb-3 border border-pink-100">
            {t("franchise.tag")}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
            {t("franchise.title")}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500 leading-relaxed">
            {t("franchise.subtitle")}
          </p>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-14">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-7 rounded-3xl bg-slate-50/80 border border-slate-100 hover:border-pink-200 hover:bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  {pillar.icon}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-pink-600 mb-1">
                  {pillar.highlight}
                </div>
                <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 mb-2 group-hover:text-pink-600 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 4-Step Partnership Journey Card */}
        <div className="rounded-[2.5rem] p-6 sm:p-10 lg:p-12 bg-gradient-to-br from-slate-900 via-slate-900 to-pink-950 text-white shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4 text-left">
              <span className="text-[10px] font-bold uppercase tracking-widest text-pink-400 bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20 inline-block">
                {t("steps.tag")}
              </span>
              <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                {t("steps.title")}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl font-light">
                Our team assists you with catchment audit, lease negotiation advisory, store layout execution, initial inventory rollout, and marketing buzz.
              </p>

              {/* 4 Step Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {steps.map((s) => (
                  <div key={s.num} className="p-3.5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md text-center">
                    <div className="text-xs font-bold text-pink-400 font-mono">{s.num}</div>
                    <div className="text-xs font-semibold text-white mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 text-center lg:text-right">
              <button
                onClick={openModal}
                className="btn-primary w-full sm:w-auto !py-4 !px-9 !text-sm sm:!text-base !font-bold shadow-xl shadow-pink-500/40 cursor-pointer"
              >
                <span>{t("steps.cta")}</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
