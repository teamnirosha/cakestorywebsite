import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { useFranchiseModal } from "../common/FranchiseModal";
import { useLanguage } from "../../context/LanguageContext";
import { prefersReducedMotion, MOTION } from "../../utils/motion";

function LeafIcon({ className = "w-4 h-4" }: { className?: string }) {
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
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

function SnowflakeIcon({ className = "w-4 h-4" }: { className?: string }) {
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
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
      <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
    </svg>
  );
}

function StoreIcon({ className = "w-4 h-4" }: { className?: string }) {
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
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
      <path d="M2 7h20" />
      <path d="M22 7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2" />
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

function MailIcon({ className = "w-4 h-4" }: { className?: string }) {
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
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function MapPinIcon({ className = "w-4 h-4" }: { className?: string }) {
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
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
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

export default function Footer() {
  const { openModal } = useFranchiseModal();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const footerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !footerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        footerRef.current,
        { opacity: 0.85, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: MOTION.duration.section,
          ease: MOTION.ease.default,
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 95%",
            end: "bottom top",
            toggleActions: "play reverse play reverse",
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const handleScrollTo = (id: string) => {
    if (location.pathname === "/") {
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname);
      }
      const el = document.getElementById(id);
      if (el) {
        const navHeight = 78;
        const targetY =
          id === "home" ? 0 : Math.max(0, el.getBoundingClientRect().top + window.scrollY - navHeight);
        window.scrollTo({
          top: targetY,
          behavior: prefersReducedMotion() ? "instant" : "smooth",
        });
      }
    } else {
      navigate("/", { state: { scrollTo: id } });
    }
  };

  return (
    <footer
      id="site-footer"
      ref={footerRef}
      className="relative border-t border-stone-800/80 bg-gradient-to-b from-[#160f15] via-[#120a10] to-[#0d070b] text-stone-300"
    >
      {/* 1. Feature Strip: Refined Vector Icons, Even Spacing, Subtle Separators */}
      <div className="border-b border-stone-800/70 bg-[#191116]/80 backdrop-blur-xs">
        <div className="w-full max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-around gap-4 sm:gap-6 text-xs sm:text-[13.5px] font-medium text-stone-300 text-center">
          <div className="flex items-center gap-2">
            <LeafIcon className="w-4 h-4 text-emerald-400/90 shrink-0" />
            <span>{t("footer.featVeg")}</span>
          </div>
          <span className="hidden md:inline text-stone-700/80" aria-hidden="true">•</span>
          <div className="flex items-center gap-2">
            <SnowflakeIcon className="w-4 h-4 text-[#c9a46a] shrink-0" />
            <span>{t("footer.featDelivery")}</span>
          </div>
          <span className="hidden md:inline text-stone-700/80" aria-hidden="true">•</span>
          <div className="flex items-center gap-2">
            <StoreIcon className="w-4 h-4 text-rose-400/90 shrink-0" />
            <span>{t("footer.featModel")}</span>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Columns */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 pt-14 sm:pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">

          {/* Column 1: Brand & Identity */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-5">
            <div className="inline-block">
              <img
                src="/assets/logo/cs-logo.png"
                alt="CakeStory Desserts - Every Flavour Has A Story"
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </div>

            <p className="text-sm sm:text-[15px] text-stone-300/90 leading-relaxed max-w-sm font-normal">
              {t("footer.desc")}
            </p>

            <div className="pt-1">
              <button
                type="button"
                onClick={openModal}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#961b3c] to-[#b32b50] hover:from-[#851835] hover:to-[#a02445] text-white font-medium text-xs sm:text-sm shadow-xs hover:shadow-sm cursor-pointer transition-all flex items-center gap-2 group border border-rose-400/20"
              >
                <span>{t("footer.ctaProspectus")}</span>
                <ArrowRightIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>

          {/* Column 2: Explore Navigation Links */}
          <div className="lg:col-span-3 space-y-3.5 sm:space-y-4">
            <h4 className="font-display text-xs sm:text-[13px] font-semibold text-[#e6ca9c] tracking-widest uppercase">
              {t("footer.exploreHeading")}
            </h4>
            <nav className="flex flex-col space-y-2.5 text-sm text-stone-300" aria-label="Footer Navigation">
              <button
                type="button"
                onClick={() => handleScrollTo("home")}
                className="text-left hover:text-[#faf7f2] transition-colors cursor-pointer py-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a46a]"
              >
                {t("nav.home")}
              </button>
              <button
                type="button"
                onClick={() => handleScrollTo("story")}
                className="text-left hover:text-[#faf7f2] transition-colors cursor-pointer py-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a46a]"
              >
                {t("nav.story")}
              </button>
              <button
                type="button"
                onClick={() => handleScrollTo("franchise")}
                className="text-left hover:text-[#faf7f2] transition-colors cursor-pointer py-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a46a]"
              >
                {t("nav.franchise")}
              </button>
              <button
                type="button"
                onClick={() => handleScrollTo("outlets")}
                className="text-left hover:text-[#faf7f2] transition-colors cursor-pointer py-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a46a]"
              >
                {t("nav.outlets")}
              </button>
              <button
                type="button"
                onClick={() => handleScrollTo("faq")}
                className="text-left hover:text-[#faf7f2] transition-colors cursor-pointer py-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a46a]"
              >
                {t("nav.faq")}
              </button>
              <button
                type="button"
                onClick={() => handleScrollTo("contact")}
                className="text-left hover:text-[#faf7f2] text-rose-300 font-medium transition-colors cursor-pointer py-0.5 flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c9a46a]"
              >
                <span>{t("nav.contact")}</span>
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </button>
            </nav>
          </div>

          {/* Column 3: Franchise Communications & Verified Contacts */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-display text-xs sm:text-[13px] font-semibold text-[#e6ca9c] tracking-widest uppercase">
              {t("footer.commsHeading")}
            </h4>

            <div className="space-y-3 text-xs sm:text-sm text-stone-300">
              {/* Phone Helpline Card */}
              <div className="p-3.5 rounded-2xl bg-[#1b1219]/90 border border-stone-800/90 hover:border-[#c9a46a]/30 transition-all">
                <div className="text-xs text-stone-400 mb-1 font-medium tracking-wide">{t("footer.helpdeskLabel")}</div>
                <a
                  href="tel:+918623940744"
                  className="text-base font-semibold text-stone-100 hover:text-[#e6ca9c] transition-colors flex items-center gap-2"
                >
                  <PhoneIcon className="w-4 h-4 text-[#c9a46a] shrink-0" />
                  <span>+91 86239 40744</span>
                </a>
              </div>

              {/* Verified Details List */}
              <div className="space-y-2 text-stone-300 text-xs sm:text-sm pt-1">
                <div className="flex items-center gap-2">
                  <GlobeIcon className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                  <span className="text-stone-400">{t("footer.portalLabel")} </span>
                  <a
                    href="https://cakestorydesserts.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-stone-200 hover:text-[#faf7f2] transition-colors font-medium"
                  >
                    cakestorydesserts.in
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MailIcon className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                  <span className="text-stone-400">{t("footer.emailLabel")} </span>
                  <a
                    href="mailto:contact@cakestorydesserts.in"
                    className="text-stone-200 hover:text-[#faf7f2] transition-colors font-medium"
                  >
                    contact@cakestorydesserts.in
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <MapPinIcon className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-stone-400">{t("footer.hubLabel")} </span>
                    <span className="text-stone-200">Baner, Pune, Maharashtra 411045</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 3. Bottom Legal & Copyright Bar (Left, Center, Right) */}
        <div className="mt-12 sm:mt-14 pt-6 border-t border-stone-800/80 grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-xs sm:text-[13px] text-stone-400">
          {/* Left: Copyright */}
          <p className="text-center md:text-left">
            © {new Date().getFullYear()} CakeStory Desserts{" "}. {t("footer.rights")}
          </p>

          {/* Center: Tagline */}
          <p className="font-display text-stone-300 text-center font-medium">
            {t("footer.tagline")}
          </p>

          {/* Right: Design & Development by Team Nirosha */}
          <div className="flex items-center justify-center md:justify-end gap-1.5 text-center md:text-right">
            <span>{t("footer.devBy")}</span>
            <span aria-hidden="true">:</span>
            <a
              href="https://nirosha.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-amber-200 hover:text-amber-100 transition-colors underline underline-offset-2"
              title="Team Nirosha - Website Architecture & Engineering"
            >
              <span>Team Nirosha</span>
              <span className="text-[11px] opacity-80" aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
