import { useLanguage } from "../../context/LanguageContext";

export default function BrandStorySection() {
  const { t } = useLanguage();

  const timeline = [
    {
      year: t("story.t1Year"),
      title: t("story.t1Title"),
      desc: t("story.t1Desc"),
      icon: "🌱",
    },
    {
      year: t("story.t2Year"),
      title: t("story.t2Title"),
      desc: t("story.t2Desc"),
      icon: "❤️",
    },
    {
      year: t("story.t3Year"),
      title: t("story.t3Title"),
      desc: t("story.t3Desc"),
      icon: "🤝",
    },
    {
      year: t("story.t4Year"),
      title: t("story.t4Title"),
      desc: t("story.t4Desc"),
      icon: "🚀",
    },
  ];

  return (
    <section id="story" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white text-slate-800 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-50 text-pink-600 text-xs font-bold uppercase tracking-wider mb-3 border border-pink-100">
            {t("story.tag")}
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
            {t("story.title")}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500 leading-relaxed">
            {t("story.subtitle")}
          </p>
        </div>

        {/* 4 Clean Timeline Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {timeline.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-slate-50/80 border border-slate-100 hover:border-pink-200 hover:bg-white hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-pink-100 text-pink-600 font-mono">
                    {item.year}
                  </span>
                  <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                </div>
                <h3 className="font-display text-lg font-bold text-slate-900 mb-2 group-hover:text-pink-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Meet the Founder / Leadership Card (Screenshot 3 style) */}
        <div className="rounded-[2.5rem] bg-gradient-to-br from-slate-50 via-white to-pink-50/40 border border-slate-200/80 p-6 sm:p-10 shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-12 gap-8 items-center">
            {/* Left: Founder Portrait */}
            <div className="md:col-span-5 relative">
              <div className="relative aspect-square max-w-[340px] mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                <img
                  src="/images/founder.jpg"
                  alt="CakeStory Desserts Founder & Leadership"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-white text-center">
                  <div className="font-display text-sm font-bold text-slate-900">{t("founder.name")}</div>
                  <div className="text-[11px] text-pink-600 font-semibold">{t("founder.role")}</div>
                </div>
              </div>
            </div>

            {/* Right: Vision Story & Quote */}
            <div className="md:col-span-7 space-y-4 text-left">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-pink-600 bg-pink-100/60 px-3 py-1 rounded-full border border-pink-200/50">
                {t("founder.tag")}
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                {t("founder.title")}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {t("founder.desc")}
              </p>

              {/* Quote Highlight Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-amber-900 font-medium italic text-sm sm:text-base shadow-xs">
                {t("founder.quote")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
