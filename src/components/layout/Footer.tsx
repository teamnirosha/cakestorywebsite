import { Link } from "react-router-dom";
import { useFranchiseModal } from "../common/FranchiseModal";

export default function Footer() {
  const { openModal } = useFranchiseModal();

  return (
    <footer className="relative mt-20 sm:mt-28 glass-soft border-t border-rose-100/70 overflow-hidden bg-gradient-to-b from-white/40 via-white/70 to-rose-50/40">
      {/* Ambient background accents */}
      <div className="blob w-80 h-80 -bottom-20 -left-20 bg-pink-200/30" />
      <div className="blob w-96 h-96 -top-20 -right-20 bg-blue-100/30" />

      {/* Brand Value Pillars Bar */}
      <div className="border-b border-rose-100/60 bg-white/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <span className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-lg shrink-0 shadow-2xs">
              🌱
            </span>
            <div>
              <div className="font-bold text-xs sm:text-sm text-[#2a1d2e]">100% Pure Vegetarian</div>
              <div className="text-[11px] text-[#5a4a5e]">Cloud-soft eggless artisanal recipes</div>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <span className="w-10 h-10 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-lg shrink-0 shadow-2xs">
              ❄️
            </span>
            <div>
              <div className="font-bold text-xs sm:text-sm text-[#2a1d2e]">Daily Cold-Chain Logistics</div>
              <div className="text-[11px] text-[#5a4a5e]">Central kitchen consistency across Pune</div>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3">
            <span className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-lg shrink-0 shadow-2xs">
              🏪
            </span>
            <div>
              <div className="font-bold text-xs sm:text-sm text-[#2a1d2e]">Turnkey Partner Model</div>
              <div className="text-[11px] text-[#5a4a5e]">Zero in-store baking • High retail margins</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Information */}
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand Manifesto & Franchise CTA Card */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-block group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e63971] rounded-2xl">
              <img
                src="/assets/logo/cs-logo.png"
                alt="CakeStory Desserts"
                className="h-11 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            <p className="text-xs sm:text-sm text-[#5a4a5e] leading-relaxed max-w-sm">
              CakeStory Desserts is Pune's rapidly scaling artisanal bakery brand. We blend standardized pharmaceutical-grade central production with high-margin retail franchise partnerships across prime catchments.
            </p>

            {/* Quick Conversion Card */}
            <div className="glass-card p-4 sm:p-5 rounded-2xl border border-rose-100 bg-white/80 shadow-xs max-w-sm">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#e63971] mb-1">
                Territory Allotment Open
              </div>
              <div className="font-display font-bold text-sm text-[#2a1d2e] mb-2">
                Grow Your Business With CakeStory
              </div>
              <button
                onClick={openModal}
                className="btn-primary w-full !py-2.5 !text-xs !font-bold shadow-md"
              >
                <span>Request Franchise Prospectus</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          {/* Column 2: Brand & Craftsmanship */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-display text-sm font-bold text-[#2a1d2e] tracking-tight">Brand &amp; Craft</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/our-story" className="text-[#5a4a5e] hover:text-[#e63971] transition-colors focus:outline-none focus-visible:underline">
                  Our Story &amp; Origins
                </Link>
              </li>
              <li>
                <Link to="/cakes" className="text-[#5a4a5e] hover:text-[#e63971] transition-colors focus:outline-none focus-visible:underline">
                  Artisanal Cakes Catalog
                </Link>
              </li>
              <li>
                <Link to="/factory" className="text-[#5a4a5e] hover:text-[#e63971] transition-colors focus:outline-none focus-visible:underline">
                  Central Kitchen SOPs
                </Link>
              </li>
              <li>
                <Link to="/custom-cake" className="text-[#5a4a5e] hover:text-[#e63971] transition-colors focus:outline-none focus-visible:underline">
                  Custom Cake Orders
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-[#5a4a5e] hover:text-[#e63971] transition-colors focus:outline-none focus-visible:underline">
                  Bakery Industry Insights
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Franchise & Outlets */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display text-sm font-bold text-[#2a1d2e] tracking-tight">Franchise &amp; Stores</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/franchise" className="text-[#5a4a5e] hover:text-[#e63971] transition-colors font-medium focus:outline-none focus-visible:underline">
                  Franchise Model &amp; Economics
                </Link>
              </li>
              <li>
                <Link to="/outlets" className="text-[#5a4a5e] hover:text-[#e63971] transition-colors focus:outline-none focus-visible:underline">
                  Pune Outlets Directory (12 Stores)
                </Link>
              </li>
              <li>
                <Link to="/outlets/cakestory-baner" className="text-[#5a4a5e] hover:text-[#e63971] transition-colors focus:outline-none focus-visible:underline">
                  Baner Flagship Outlet
                </Link>
              </li>
              <li>
                <Link to="/outlets/cakestory-hinjewadi" className="text-[#5a4a5e] hover:text-[#e63971] transition-colors focus:outline-none focus-visible:underline">
                  Hinjewadi Tech Catchment
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-[#5a4a5e] hover:text-[#e63971] transition-colors focus:outline-none focus-visible:underline">
                  Franchise FAQs &amp; Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Central Operations Office */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display text-sm font-bold text-[#2a1d2e] tracking-tight">Corporate Desk</h4>
            <div className="space-y-2.5 text-xs text-[#5a4a5e]">
              <div>
                <strong className="text-[#2a1d2e] block mb-0.5">Central Hub &amp; Headquarters:</strong>
                Commercial Tower 3, Near Pancard Club Road, Baner, Pune, Maharashtra 411045
              </div>
              <div>
                <strong className="text-[#2a1d2e] block mb-0.5">Franchise Inquiry Hotline:</strong>
                <a href="tel:+919823045600" className="hover:text-[#e63971] transition-colors">
                  +91 98230 45600 / +91 20 6789 0123
                </a>
              </div>
              <div>
                <strong className="text-[#2a1d2e] block mb-0.5">Official Inquiries:</strong>
                <a href="mailto:franchise@cakestory.com" className="hover:text-[#e63971] transition-colors">
                  franchise@cakestory.com
                </a>
              </div>
              <div className="pt-2">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#8c7a90] hover:text-[#e63971] transition-colors"
                >
                  <span>🔐 Operations Login</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal, Attribution & Tagline */}
        <div className="mt-12 pt-6 border-t border-rose-100/70 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#8c7a90]">
          <p>© {new Date().getFullYear()} CakeStory Desserts. All rights reserved.</p>
          <p className="font-display text-center text-[#5a4a5e]">
            Every Flavour Has A Story • Pune Franchise Network
          </p>
          <p className="flex items-center gap-1" style={{ fontFamily: "Poppins, sans-serif" }}>
            Designed &amp; developed by{" "}
            <a
              href="https://nirosha.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#2a1d2e] hover:text-[#e63971] transition-colors underline underline-offset-2"
            >
              Team Nirosha
            </a>.
          </p>
        </div>
      </div>
    </footer>
  );
}
