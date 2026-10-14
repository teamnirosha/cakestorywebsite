import { useFranchiseModal } from "../common/FranchiseModal";
import { useLanguage } from "../../context/LanguageContext";

export default function StorefrontHero() {
  const { openModal } = useFranchiseModal();
  const { t } = useLanguage();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative min-h-[90vh] lg:min-h-[92vh] flex items-center justify-center overflow-hidden bg-slate-950 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Background 3D Storefront Image with Cinematic Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/cakestory-storefront-hero.jpg"
          alt="CakeStory Desserts Franchise Storefront"
          className="w-full h-full object-cover object-center filter brightness-[0.65] contrast-[1.05] transform scale-105 transition-transform duration-1000"
        />
        {/* Cinematic Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-950/40 to-slate-950/90" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center text-white my-auto py-10">
        {/* Live Partner Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-pink-300 mb-6 shadow-xl animate-fadeIn">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{t("hero.badge")}</span>
        </div>

        {/* Big Punchy Headline */}
        <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15] max-w-4xl mx-auto drop-shadow-xl">
          {t("hero.titlePrefix")}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300">
            {t("hero.titleHighlight")}
          </span>
        </h1>

        {/* 3 Core Trust Checkmarks Pill Strip */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mt-6 text-xs sm:text-sm font-medium text-slate-200">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
            <span className="text-emerald-400 font-bold">✓</span> {t("hero.trust1")}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
            <span className="text-emerald-400 font-bold">✓</span> {t("hero.trust2")}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
            <span className="text-emerald-400 font-bold">✓</span> {t("hero.trust3")}
          </span>
        </div>

        {/* Concise High-Level Proposition */}
        <p className="mt-6 text-sm sm:text-base lg:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
          {t("hero.desc")}
        </p>

        {/* High-Converting CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8 sm:mt-10">
          <button
            onClick={openModal}
            className="px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-sm sm:text-base shadow-2xl shadow-pink-500/50 hover:shadow-pink-500/70 transform hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer border border-pink-400/40"
          >
            <span>{t("hero.ctaPrimary")}</span>
            <span aria-hidden="true">→</span>
          </button>

          <button
            onClick={() => scrollToSection("story")}
            className="px-7 py-4 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-semibold text-sm sm:text-base border border-white/30 transition-all flex items-center gap-2 cursor-pointer hover:-translate-y-0.5"
          >
            <span>▷</span>
            <span>{t("hero.ctaSecondary")}</span>
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-12 sm:mt-14 flex flex-col items-center justify-center opacity-70 hover:opacity-100 transition-opacity">
          <button
            onClick={() => scrollToSection("story")}
            className="text-xs text-slate-300 font-medium flex flex-col items-center gap-1 cursor-pointer"
            aria-label="Scroll to story"
          >
            <div className="w-5 h-8 rounded-full border-2 border-white/40 flex items-start justify-center p-1">
              <div className="w-1.5 h-2 bg-pink-400 rounded-full animate-bounce" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
