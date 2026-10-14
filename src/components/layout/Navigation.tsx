import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useFranchiseModal } from "../common/FranchiseModal";

const navLinks = [
  { to: "/our-story", label: "Our Story" },
  { to: "/cakes", label: "Cakes" },
  { to: "/franchise", label: "Franchise" },
  { to: "/outlets", label: "Locations" },
  { to: "/blog", label: "Insights" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { openModal } = useFranchiseModal();

  // Scroll listener for dynamic navbar compression
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Keyboard navigation: Close on Escape key & body scroll lock
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 pointer-events-none ${
          scrolled ? "py-2.5 sm:py-3" : "py-4 sm:py-5"
        }`}
      >
        <div className={`mx-auto px-4 sm:px-6 transition-all duration-300 ${scrolled ? "max-w-6xl" : "max-w-7xl"}`}>
          <nav
            aria-label="Main Navigation"
            className="pointer-events-auto glass-pill px-3.5 sm:px-5 py-2 flex items-center justify-between transition-all duration-300"
          >
            {/* Brand Logo & Origin Badge */}
            <div className="flex items-center gap-2.5">
              <Link
                to="/"
                className="flex items-center gap-2 group py-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e63971] rounded-full"
                aria-label="CakeStory Desserts Homepage"
              >
                <img
                  src="/assets/logo/cs-logo.png"
                  alt="CakeStory Desserts"
                  className="h-8 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
              <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-100 text-[10px] font-bold text-[#e63971] tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Pune Network
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e63971] ${
                      isActive
                        ? "bg-white text-[#e63971] shadow-xs font-bold"
                        : "text-[#2a1d2e] hover:text-[#e63971] hover:bg-white/60"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            {/* Action Group */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <button
                onClick={openModal}
                className="btn-primary !py-2 sm:!py-2.5 !px-4 sm:!px-5 !text-xs sm:!text-[13px] !font-bold whitespace-nowrap shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#e63971]"
                aria-label="Open Franchise Enquiry Form"
              >
                <span>Franchise Enquiry</span>
                <span aria-hidden="true">→</span>
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-9 sm:w-10 h-9 sm:h-10 rounded-full bg-white/80 border border-white hover:bg-white flex flex-col items-center justify-center gap-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e63971]"
                aria-expanded={mobileMenuOpen}
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              >
                <span
                  className={`w-4 h-0.5 bg-[#2a1d2e] transition-all duration-300 origin-center ${
                    mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
                />
                <span
                  className={`w-4 h-0.5 bg-[#2a1d2e] transition-all duration-200 ${
                    mobileMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`w-4 h-0.5 bg-[#2a1d2e] transition-all duration-300 origin-center ${
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
        <div className="fixed inset-0 z-30 lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile Navigation Menu">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#1c121e]/40 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <div className="relative pt-24 pb-8 px-5 max-w-md mx-auto h-full flex flex-col justify-between overflow-y-auto">
            <div className="glass-card p-6 shadow-2xl flex flex-col gap-2 fade-in">
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-rose-100/60">
                <div className="flex items-center gap-2">
                  <img
                    src="/assets/logo/cs-logo.png"
                    alt="CakeStory Desserts"
                    className="h-8 w-auto object-contain"
                  />
                  <span className="text-[10px] font-bold text-[#e63971] uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded-full">
                    Pune Network
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-semibold text-[#5a4a5e] hover:text-[#e63971] px-2 py-1"
                  aria-label="Close menu"
                >
                  ✕ Close
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="flex flex-col gap-1.5">
                {navLinks.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-4 py-3 rounded-2xl text-base font-display transition-all ${
                        isActive
                          ? "bg-rose-50 text-[#e63971] font-bold shadow-2xs"
                          : "text-[#2a1d2e] hover:bg-white/80 hover:text-[#e63971]"
                      }`
                    }
                  >
                    <span>{item.label}</span>
                    <span className="text-xs text-rose-300" aria-hidden="true">→</span>
                  </NavLink>
                ))}
              </nav>

              <div className="pt-4 mt-2 border-t border-rose-100/60 flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openModal();
                  }}
                  className="btn-primary w-full !py-3 !text-sm font-bold shadow-lg"
                >
                  <span>Apply for Franchise</span>
                  <span aria-hidden="true">→</span>
                </button>

                <div className="flex items-center justify-between px-2 pt-1">
                  <Link
                    to="/admin/login"
                    className="text-xs font-medium text-[#8c7a90] hover:text-[#e63971] transition"
                  >
                    Manager Portal →
                  </Link>
                  <span className="text-[11px] text-[#8c7a90]">
                    12 Pune Outlets
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center py-2 text-[11px] text-white/80">
              © {new Date().getFullYear()} CakeStory Desserts • Central Kitchen SOPs
            </div>
          </div>
        </div>
      )}
    </>
  );
}
