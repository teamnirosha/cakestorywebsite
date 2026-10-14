import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFranchiseModal } from "../common/FranchiseModal";
import { useLanguage } from "../../context/LanguageContext";

export default function Footer() {
  const { openModal } = useFranchiseModal();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const handleScrollTo = (id: string) => {
    if (location.pathname === "/") {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/#${id}`);
    }
  };

  return (
    <footer className="relative mt-20 border-t border-slate-200 overflow-hidden bg-slate-900 text-slate-300">
      {/* Brand Value Pillars Bar */}
      <div className="border-b border-slate-800 bg-slate-950/60">
        <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <span className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-lg shrink-0">
              🌱
            </span>
            <div>
              <div className="font-bold text-xs sm:text-sm text-white">100% Pure Vegetarian</div>
              <div className="text-[11px] text-slate-400">Pure veg recipes crafted with premium dairy cream</div>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <span className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-lg shrink-0">
              ❄️
            </span>
            <div>
              <div className="font-bold text-xs sm:text-sm text-white">Daily Cold-Chain Supply</div>
              <div className="text-[11px] text-slate-400">Refrigerated morning dispatch to every Pune outlet</div>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <span className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-lg shrink-0">
              🏪
            </span>
            <div>
              <div className="font-bold text-xs sm:text-sm text-white">Turnkey Franchise Model</div>
              <div className="text-[11px] text-slate-400">Zero in-store baking • High retail profit margins</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Information */}
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Brand & Mission */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-block p-2 rounded-2xl bg-white/95 shadow-md">
              <img
                src="/assets/logo/cs-logo.png"
                alt="CakeStory Desserts"
                className="h-10 w-auto object-contain"
              />
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              CakeStory Desserts is Pune's rapidly scaling celebration cake franchise brand. We combine centralized cleanroom batch manufacturing with high-margin retail store partnerships across prime residential and commercial catchments.
            </p>

            <div className="pt-1">
              <button
                onClick={openModal}
                className="btn-primary !py-2.5 !px-6 !text-xs !font-bold shadow-md cursor-pointer"
              >
                <span>Request Franchise Prospectus →</span>
              </button>
            </div>
          </div>

          {/* Quick Section Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display text-sm font-bold text-white tracking-wide uppercase text-xs">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleScrollTo("home")}
                  className="text-slate-400 hover:text-pink-400 transition cursor-pointer"
                >
                  {t("nav.home")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo("story")}
                  className="text-slate-400 hover:text-pink-400 transition cursor-pointer"
                >
                  {t("nav.story")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo("franchise")}
                  className="text-slate-400 hover:text-pink-400 transition cursor-pointer"
                >
                  {t("nav.franchise")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo("outlets")}
                  className="text-slate-400 hover:text-pink-400 transition cursor-pointer"
                >
                  {t("nav.outlets")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo("faq")}
                  className="text-slate-400 hover:text-pink-400 transition cursor-pointer"
                >
                  {t("nav.faq")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleScrollTo("contact")}
                  className="text-slate-400 hover:text-pink-400 transition cursor-pointer"
                >
                  {t("nav.contact")}
                </button>
              </li>
            </ul>
          </div>

          {/* Corporate Desk */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-display text-sm font-bold text-white tracking-wide uppercase text-xs">
              Corporate Headquarters
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div>
                <strong className="text-white block mb-0.5">Central Hub & Office:</strong>
                Commercial Tower 3, Near Pancard Club Road, Baner, Pune, Maharashtra 411045
              </div>
              <div>
                <strong className="text-white block mb-0.5">Franchise Desk Phone:</strong>
                <a href="tel:+919823045600" className="hover:text-pink-400 transition">
                  +91 98230 45600 / +91 20 6789 0123
                </a>
              </div>
              <div>
                <strong className="text-white block mb-0.5">Official Communications:</strong>
                <a href="mailto:franchise@cakestory.com" className="hover:text-pink-400 transition">
                  franchise@cakestory.com
                </a>
              </div>
              <div className="pt-2">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-pink-400 transition"
                >
                  <span>🔐 {t("footer.opsLogin")}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal, Attribution & Tagline */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CakeStory Desserts. {t("footer.rights")}</p>
          <p className="font-display text-center text-slate-400">
            {t("footer.tagline")}
          </p>
          <p className="flex items-center gap-1">
            {t("footer.devBy")}{" "}
            <a
              href="https://nirosha.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-pink-400 hover:text-pink-300 transition underline underline-offset-2"
            >
              Team Nirosha
            </a>.
          </p>
        </div>
      </div>
    </footer>
  );
}
