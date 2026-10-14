import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFranchiseModal } from "../common/FranchiseModal";
import { useLanguage } from "../../context/LanguageContext";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { openModal } = useFranchiseModal();
  const { language, toggleLanguage, t } = useLanguage();

  const navItems = [
    { id: "home", labelKey: "nav.home" },
    { id: "story", labelKey: "nav.story" },
    { id: "franchise", labelKey: "nav.franchise" },
    { id: "faq", labelKey: "nav.faq" },
    { id: "outlets", labelKey: "nav.outlets" },
    { id: "contact", labelKey: "nav.contact" },
  ];

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (location.pathname === "/") {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  // Scroll listener for dynamic navbar compression
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle hash scrolling when navigating back from other pages
  useEffect(() => {
    if (location.pathname === "/" && location.hash) {
      const targetId = location.hash.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 pointer-events-none ${
          scrolled ? "py-2 sm:py-2.5" : "py-3 sm:py-4"
        }`}
      >
        <div className={`mx-auto px-4 sm:px-6 transition-all duration-300 ${scrolled ? "max-w-6xl" : "max-w-7xl"}`}>
          <nav
            aria-label="Main Navigation"
            className="pointer-events-auto glass-pill px-3.5 sm:px-5 py-2 flex items-center justify-between transition-all duration-300 shadow-md bg-white/90 backdrop-blur-md border border-white/80"
          >
            {/* Brand Logo & Origin Badge */}
            <div className="flex items-center gap-2.5">
              <Link
                to="/"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("home");
                }}
                className="flex items-center gap-2 group py-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 rounded-full"
                aria-label="CakeStory Desserts Homepage"
              >
                <img
                  src="/assets/logo/cs-logo.png"
                  alt="CakeStory Desserts"
                  className="h-8 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
              <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-100 text-[10px] font-bold text-pink-600 tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Pune Franchise Network
              </span>
            </div>

            {/* Desktop Single-Page Navigation Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="px-3.5 py-1.5 rounded-full text-[13px] font-semibold text-slate-700 hover:text-pink-600 hover:bg-pink-50/60 transition-all cursor-pointer"
                >
                  {t(item.labelKey)}
                </button>
              ))}
            </div>

            {/* Action Group */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Marathi / English Language Toggle Button (inspired by pizzatoons.in) */}
              <button
                onClick={toggleLanguage}
                title="Toggle Language (मराठी / English)"
                className="px-2.5 sm:px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200/80 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs hover:scale-105"
              >
                <span className="text-xs">文A</span>
                <span className="font-semibold text-pink-600">
                  {language === "en" ? "मराठी" : "English"}
                </span>
              </button>

              {/* Primary Franchise Enquiry CTA Button */}
              <button
                onClick={openModal}
                className="btn-primary !py-2 sm:!py-2.5 !px-4 sm:!px-5 !text-xs sm:!text-[13px] !font-bold whitespace-nowrap shadow-md cursor-pointer"
                aria-label="Open Franchise Enquiry Form"
              >
                <span>{t("nav.enquiry")}</span>
                <span aria-hidden="true">→</span>
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-9 h-9 rounded-full bg-white/80 border border-white hover:bg-white flex flex-col items-center justify-center gap-1 transition-colors"
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              >
                <span
                  className={`w-4 h-0.5 bg-slate-800 transition-all duration-300 origin-center ${
                    mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                />
                <span
                  className={`w-4 h-0.5 bg-slate-800 transition-all duration-200 ${
                    mobileMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`w-4 h-0.5 bg-slate-800 transition-all duration-300 origin-center ${
                    mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
                />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <img src="/assets/logo/cs-logo.png" alt="CakeStory Desserts" className="h-8 w-auto object-contain" />
                  <span className="font-display font-bold text-xs text-slate-900">CakeStory</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Navigation Links */}
              <div className="py-6 space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className="w-full text-left px-4 py-2.5 rounded-xl font-display font-bold text-sm text-slate-800 hover:bg-pink-50 hover:text-pink-600 transition flex items-center justify-between"
                  >
                    <span>{t(item.labelKey)}</span>
                    <span className="text-slate-400 text-xs">→</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              {/* Language Switch */}
              <button
                onClick={() => {
                  toggleLanguage();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-2"
              >
                <span>文A Switch to</span>
                <span className="text-pink-600 font-bold">
                  {language === "en" ? "मराठी (Marathi)" : "English"}
                </span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openModal();
                }}
                className="btn-primary w-full !py-3 text-xs font-bold shadow-md"
              >
                <span>{t("nav.enquiry")} →</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
