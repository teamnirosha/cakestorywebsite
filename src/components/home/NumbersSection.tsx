import { useLanguage } from "../../context/LanguageContext";

export default function NumbersSection() {
  const { t } = useLanguage();

  const stats = [
    {
      val: t("numbers.stat1Val"),
      label: t("numbers.stat1Label"),
      sub: t("numbers.stat1Sub"),
      icon: "🏪",
      color: "from-rose-50 to-pink-50 text-rose-600",
    },
    {
      val: t("numbers.stat2Val"),
      label: t("numbers.stat2Label"),
      sub: t("numbers.stat2Sub"),
      icon: "🎂",
      color: "from-amber-50 to-orange-50 text-amber-600",
    },
    {
      val: t("numbers.stat3Val"),
      label: t("numbers.stat3Label"),
      sub: t("numbers.stat3Sub"),
      icon: "📈",
      color: "from-emerald-50 to-teal-50 text-emerald-600",
    },
    {
      val: t("numbers.stat4Val"),
      label: t("numbers.stat4Label"),
      sub: t("numbers.stat4Sub"),
      icon: "⭐",
      color: "from-blue-50 to-indigo-50 text-blue-600",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/70 border-y border-slate-100">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-200">
            {t("numbers.tag")}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
            {t("numbers.title")}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-500">
            {t("numbers.subtitle")}
          </p>
        </div>

        {/* 4 Clean Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center justify-center"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-2xl mb-3 shadow-xs`}>
                {s.icon}
              </div>
              <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900">
                {s.val}
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
                {s.label}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {s.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Brand Red/Rose Trust Banner (inspired by Screenshot 4) */}
        <div className="rounded-3xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-around gap-6 text-center md:text-left">
          {/* Item 1 */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-2xl shrink-0 border border-white/20">
              🚫
            </div>
            <div>
              <div className="font-display font-bold text-sm sm:text-base text-white">
                {t("numbers.banner1")}
              </div>
              <div className="text-xs text-rose-100 font-light mt-0.5">
                {t("numbers.banner1Sub")}
              </div>
            </div>
          </div>

          <div className="hidden md:block w-px h-12 bg-white/20" />

          {/* Item 2 */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-2xl shrink-0 border border-white/20">
              ⚡
            </div>
            <div>
              <div className="font-display font-bold text-sm sm:text-base text-white">
                {t("numbers.banner2")}
              </div>
              <div className="text-xs text-rose-100 font-light mt-0.5">
                {t("numbers.banner2Sub")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
