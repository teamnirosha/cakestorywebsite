import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFranchiseModal } from "../common/FranchiseModal";
import { useLanguage } from "../../context/LanguageContext";
import { prefersReducedMotion } from "../../utils/motion";

export const NAV_ITEMS = [
  { id: "home", labelKey: "nav.home" },
  { id: "story", labelKey: "nav.story" },
  { id: "franchise", labelKey: "nav.franchise" },
  { id: "outlets", labelKey: "nav.outlets" },
  { id: "faq", labelKey: "nav.faq" },
  { id: "contact", labelKey: "nav.contact" },
] as const;

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");
  const [indicatorStyle, setIndicatorStyle] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({ left: 0, width: 0, opacity: 0 });

  const isScrollingToRef = useRef<boolean>(false);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { openModal } = useFranchiseModal();
  const { language, toggleLanguage, t } = useLanguage();

  // Smooth scroll to section with navbar clearance offset
  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    isScrollingToRef.current = true;
    setMobileMenuOpen(false);

    if (location.pathname === "/") {
      // Clean up any existing hash from address bar immediately
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname);
      }

      const el = document.getElementById(sectionId);
      if (el) {
        const navHeight = 78;
        const targetY =
          sectionId === "home"
            ? 0
            : Math.max(0, el.getBoundingClientRect().top + window.scrollY - navHeight);

        window.scrollTo({
          top: targetY,
          behavior: prefersReducedMotion() ? "instant" : "smooth",
        });

        // Release scroll-locking lock after smooth scroll settles
        setTimeout(() => {
          isScrollingToRef.current = false;
        }, 850);
      } else {
        isScrollingToRef.current = false;
      }
    } else {
      isScrollingToRef.current = false;
      // Navigate cleanly to homepage and pass destination in router state (no hash in URL)
      navigate("/", { state: { scrollTo: sectionId } });
    }
  };

  // Authoritative, continuous section tracking without deadbands or default jumps
  useEffect(() => {
    if (location.pathname !== "/") {
      if (location.pathname.startsWith("/outlets")) {
        setActiveSection("outlets");
      } else {
        setActiveSection("");
      }
      const handleGeneralScroll = () => {
        setScrolled(window.scrollY > 40);
      };
      window.addEventListener("scroll", handleGeneralScroll, { passive: true });
      handleGeneralScroll();
      return () => window.removeEventListener("scroll", handleGeneralScroll);
    }

    const calculateActiveSection = () => {
      // Do not override user's deliberate destination while in smooth scroll flight
      if (isScrollingToRef.current) return;

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // 1. Extreme Top Check (home)
      if (scrollY < 80) {
        setActiveSection("home");
        return;
      }

      // 2. Extreme Bottom Check (contact)
      if (windowHeight + scrollY >= documentHeight - 70) {
        setActiveSection("contact");
        return;
      }

      // 3. Document Coordinates for each section
      // The activation line is situated at scrollY + 140 (comfortably below floating navbar)
      const activationY = scrollY + 140;

      const storyEl = document.getElementById("story");
      const franchiseEl = document.getElementById("franchise");
      const outletsEl = document.getElementById("outlets");
      const faqEl = document.getElementById("faq");
      const contactEl = document.getElementById("contact");

      const getTop = (el: HTMLElement | null) =>
        el ? el.getBoundingClientRect().top + scrollY : Infinity;

      const storyTop = getTop(storyEl);
      const franchiseTop = getTop(franchiseEl);
      const outletsTop = getTop(outletsEl);
      const faqTop = getTop(faqEl);
      const contactTop = getTop(contactEl);

      // Continuous, gapless partition:
      if (activationY < storyTop) {
        setActiveSection("home");
      } else if (activationY < franchiseTop) {
        // Encompasses BrandStorySection and NumbersSection seamlessly
        setActiveSection("story");
      } else if (activationY < outletsTop) {
        setActiveSection("franchise");
      } else if (activationY < faqTop) {
        setActiveSection("outlets");
      } else if (activationY < contactTop) {
        setActiveSection("faq");
      } else {
        setActiveSection("contact");
      }
    };

    let ticking = false;
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      if (!ticking) {
        window.requestAnimationFrame(() => {
          calculateActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  // Handle section scrolling and ensure clean URL without hash
  useEffect(() => {
    if (location.pathname === "/") {
      // Automatically strip any hash from address bar immediately
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname);
      }

      const scrollToTarget =
        (location.state as { scrollTo?: string })?.scrollTo ||
        (location.hash ? location.hash.replace("#", "") : null);

      if (scrollToTarget) {
        const timer = setTimeout(() => {
          const el = document.getElementById(scrollToTarget);
          if (el) {
            const navHeight = 78;
            const targetY =
              scrollToTarget === "home"
                ? 0
                : Math.max(0, el.getBoundingClientRect().top + window.scrollY - navHeight);

            window.scrollTo({
              top: targetY,
              behavior: prefersReducedMotion() ? "instant" : "smooth",
            });
            setActiveSection(scrollToTarget);
          }
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [location.pathname, location.state]);

  // Update sliding pill indicator position whenever active section, language, or scroll changes
  useLayoutEffect(() => {
    let animFrameId: number;

    const updateIndicator = () => {
      if (!navContainerRef.current) return;
      if (!activeSection) {
        setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
        return;
      }

      const activeBtn = navContainerRef.current.querySelector<HTMLButtonElement>(
        `#nav-link-${activeSection}`
      );

      if (activeBtn) {
        const containerRect = navContainerRef.current.getBoundingClientRect();
        const btnRect = activeBtn.getBoundingClientRect();
        const left = btnRect.left - containerRect.left;
        const width = btnRect.width;

        setIndicatorStyle({
          left: Math.round(left),
          width: Math.round(width),
          opacity: 1,
        });
      } else {
        setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    };

    // Immediate layout pass
    updateIndicator();

    // Settle layout pass after DOM repaint
    animFrameId = requestAnimationFrame(updateIndicator);

    // Dynamic timer updates during the 500ms shrink transition
    const t1 = setTimeout(updateIndicator, 150);
    const t2 = setTimeout(updateIndicator, 320);
    const t3 = setTimeout(updateIndicator, 520);

    // Watch for dynamic font loading to avoid font-metric reflow offset
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        updateIndicator();
      });
    }

    window.addEventListener("resize", updateIndicator, { passive: true });

    // ResizeObserver on the container and individual buttons
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && navContainerRef.current) {
      ro = new ResizeObserver(() => {
        updateIndicator();
      });
      ro.observe(navContainerRef.current);
      const buttons = navContainerRef.current.querySelectorAll("button");
      buttons.forEach((btn) => ro?.observe(btn));
    }

    return () => {
      cancelAnimationFrame(animFrameId);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener("resize", updateIndicator);
      ro?.disconnect();
    };
  }, [activeSection, language, scrolled]);

  return (
    <>
      {/* Floating Dynamic Shrinking Capsule Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-out pointer-events-none ${
          scrolled ? "py-1 sm:py-1.5" : "py-2 sm:py-2.5"
        }`}
      >
        <div
          className={`w-full mx-auto px-2.5 xs:px-3.5 sm:px-6 transition-all duration-500 ease-out ${
            scrolled ? "max-w-5xl lg:max-w-6xl" : "max-w-7xl"
          }`}
        >
          <nav
            aria-label="Main Navigation"
            className={`pointer-events-auto rounded-full flex items-center justify-between transition-all duration-500 ease-out ${
              scrolled
                ? "px-2.5 xs:px-3 sm:px-4.5 py-1.5 bg-[#120516]/92 backdrop-blur-2xl border border-white/25 shadow-[0_16px_45px_-5px_rgba(0,0,0,0.65)] ring-1 ring-white/10"
                : "px-2.5 xs:px-3.5 sm:px-6 py-1.5 sm:py-2 bg-black/55 backdrop-blur-xl border border-white/20 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.35)]"
            }`}
          >
            {/* Brand Logo & Refined Typographic Wordmark */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              <Link
                to="/"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("home");
                }}
                className="flex items-center gap-1.5 sm:gap-3 group py-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-2xl"
                aria-label="CakeStory Desserts Homepage"
              >
                <div className="relative transition-transform duration-300 group-hover:scale-105 flex items-center py-0.5 shrink-0">
                  <img
                    src="/assets/logo/cs-logo.png"
                    alt="CakeStory Desserts - Every Flavour Has A Story"
                    className={`w-auto object-contain drop-shadow-md transition-all duration-500 ease-out ${
                      scrolled ? "h-6.5 xs:h-7 sm:h-8 lg:h-8.5" : "h-7.5 xs:h-8 sm:h-9.5 lg:h-10"
                    }`}
                  />
                </div>

                {/* Refined Brand Wordmark Beside Logo */}
                <div className="flex flex-col justify-center select-none text-left">
                  <span
                    className={`font-display font-medium uppercase tracking-[0.15em] sm:tracking-[0.18em] leading-none text-[#fffaf4] transition-all duration-500 ease-out ${
                      scrolled
                        ? "text-[10.5px] xs:text-[11.5px] sm:text-[12px] lg:text-[12.5px]"
                        : "text-[11.5px] xs:text-[12px] sm:text-[13.5px] lg:text-[14.5px]"
                    }`}
                  >
                    CAKESTORY
                  </span>
                  <div
                    className={`flex items-center gap-1 sm:gap-1.5 transition-all duration-500 ease-out ${
                      scrolled ? "mt-0.5" : "mt-0.5 sm:mt-1"
                    }`}
                  >
                    <span
                      className={`font-sans font-medium uppercase tracking-[0.22em] sm:tracking-[0.26em] leading-none text-[#e88d9f] transition-all duration-500 ease-out ${
                        scrolled ? "text-[6.5px] sm:text-[8px]" : "text-[7px] sm:text-[9px]"
                      }`}
                    >
                      DESSERTS
                    </span>
                    <span className="text-[7px] sm:text-[7.5px] font-sans tracking-widest font-normal uppercase opacity-75 text-amber-200/80 hidden sm:inline">
                      • PUNE
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links with Smooth Animated Gliding Pill */}
            <div
              ref={navContainerRef}
              className="hidden lg:flex items-center relative p-1 rounded-full"
            >
              {/* Gliding Pill Active Indicator */}
              <div
                className="absolute top-1 bottom-1 rounded-full transition-[transform,width,opacity] duration-200 ease-out pointer-events-none bg-white/20 border border-white/25 shadow-xs"
                style={{
                  left: 0,
                  transform: `translateX(${indicatorStyle.left}px)`,
                  width: `${indicatorStyle.width}px`,
                  opacity: indicatorStyle.opacity,
                }}
                aria-hidden="true"
              />

              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`relative z-10 rounded-full font-medium transition-all duration-300 cursor-pointer whitespace-nowrap text-center flex items-center justify-center ${
                      scrolled
                        ? "px-3 py-1 text-[12.5px] xl:text-[13px]"
                        : "px-3.5 py-1.5 text-[13.5px] xl:text-[14px]"
                    } ${
                      isActive
                        ? "text-amber-300 font-semibold"
                        : "text-white/85 hover:text-white"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <span>{t(item.labelKey)}</span>
                  </button>
                );
              })}
            </div>

            {/* Action Group */}
            <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 shrink-0">
              {/* Marathi / English Language Toggle Button */}
              <button
                id="lang-toggle-btn"
                onClick={toggleLanguage}
                title="Toggle Language (मराठी / English)"
                aria-label="Toggle Language (मराठी / English)"
                className={`rounded-full font-semibold transition-all duration-500 ease-out flex items-center gap-1 sm:gap-1.5 cursor-pointer shadow-xs hover:scale-105 active:scale-95 bg-white/10 hover:bg-white/20 border border-white/25 text-white ${
                  scrolled
                    ? "px-2 xs:px-2.5 py-1 text-[10.5px] sm:text-xs"
                    : "px-2 xs:px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-[13px]"
                }`}
              >
                <span className="text-[10px] sm:text-xs font-mono opacity-70">文A</span>
                <span className="font-bold text-amber-300">
                  {language === "en" ? "मराठी" : "EN"}
                  <span className="hidden sm:inline">{language === "mr" ? "glish" : ""}</span>
                </span>
              </button>

              {/* Primary Franchise Enquiry CTA Button */}
              <button
                id="nav-franchise-cta"
                onClick={openModal}
                className={`btn-primary whitespace-nowrap shadow-md shadow-rose-950/20 rounded-full cursor-pointer hover:scale-105 active:scale-95 transition-all duration-500 ease-out shrink-0 ${
                  scrolled
                    ? "!py-1 sm:!py-1.5 !px-2.5 sm:!px-3.5 !text-[11px] sm:!text-xs !font-bold"
                    : "!py-1 sm:!py-2 !px-2.5 xs:!px-3 sm:!px-4.5 !text-[11px] sm:!text-[13px] !font-bold"
                }`}
                aria-label="Open Franchise Enquiry Form"
              >
                <span className="inline sm:hidden">{language === "mr" ? "चौकशी" : "Enquire"}</span>
                <span className="hidden sm:inline">{t("nav.enquiry")}</span>
                <span aria-hidden="true" className="ml-0.5 sm:ml-1 font-bold">
                  →
                </span>
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                id="nav-mobile-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden rounded-full flex flex-col items-center justify-center gap-1 transition-all duration-500 cursor-pointer bg-white/15 hover:bg-white/25 border border-white/20 text-white shrink-0 ${
                  scrolled ? "w-7.5 h-7.5 sm:w-8 sm:h-8" : "w-8 h-8 sm:w-9 sm:h-9"
                }`}
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              >
                <span
                  className={`w-3.5 sm:w-4 h-0.5 transition-all duration-300 origin-center bg-white ${
                    mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                />
                <span
                  className={`w-3.5 sm:w-4 h-0.5 transition-all duration-200 bg-white ${
                    mobileMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`w-3.5 sm:w-4 h-0.5 transition-all duration-300 origin-center bg-white ${
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
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/assets/logo/cs-logo.png"
                    alt="CakeStory Desserts"
                    className="h-10 w-auto object-contain drop-shadow-xs"
                  />
                  <div className="flex flex-col select-none text-left">
                    <span className="font-display font-medium text-xs text-[#21161d] tracking-[0.16em] uppercase leading-tight">
                      CAKESTORY
                    </span>
                    <span className="text-[8.5px] font-sans font-medium text-[#961b3c] tracking-[0.24em] uppercase leading-tight">
                      DESSERTS • PUNE
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs transition-colors cursor-pointer"
                  aria-label="Close navigation menu"
                >
                  ✕
                </button>
              </div>

              {/* Navigation Links with Canonical Order and Active Highlight */}
              <div className="py-6 space-y-1.5">
                {NAV_ITEMS.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`nav-mobile-link-${item.id}`}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl font-display text-sm transition-all flex items-center justify-between cursor-pointer ${
                        isActive
                          ? "bg-rose-50 text-[#961b3c] font-bold border border-rose-100"
                          : "text-slate-800 hover:bg-rose-50/60 hover:text-[#961b3c] font-medium"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <span>{t(item.labelKey)}</span>
                      <span
                        className={`text-xs ${
                          isActive ? "text-[#961b3c] font-bold" : "text-slate-400"
                        }`}
                      >
                        →
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <button
                onClick={() => {
                  toggleLanguage();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>文A</span>
                <span className="text-[#961b3c] font-bold">
                  {language === "en" ? "मराठी भाषेमध्ये पहा" : "Switch to English"}
                </span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openModal();
                }}
                className="btn-primary w-full !py-3 text-xs font-bold shadow-md cursor-pointer"
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
