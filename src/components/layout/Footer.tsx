import { Link } from "react-router-dom";
import { useFranchiseModal } from "../common/FranchiseModal";

export default function Footer() {
  const { openModal } = useFranchiseModal();

  return (
    <footer className="relative mt-24 glass-soft border-t border-white/40">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <div className="mb-4">
              <img
                src="/assets/logo/cs-logo.png"
                alt="CakeStory Desserts"
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </div>
            <p className="text-sm text-[#5a4a5e] max-w-xs leading-relaxed">
              Pune's growing bakery brand and franchise network. Combining standardized central manufacturing with high-growth local retail partnerships.
            </p>
            <div className="mt-5">
              <button onClick={openModal} className="btn-primary text-xs !py-2.5 !px-5 font-bold shadow-md">
                Franchise Enquiry →
              </button>
            </div>
          </div>

          {[
            {
              title: "Franchise & Brand",
              links: [
                ["Franchise Opportunities", "/franchise"],
                ["Pune Outlet Network", "/outlets"],
                ["Our Story", "/our-story"],
                ["Contact Us", "/contact"],
              ],
            },
            {
              title: "Resources & Trust",
              links: [
                ["Insights & Blog", "/blog"],
                ["Frequently Asked Questions", "/faq"],
                ["Quality & Hygiene", "/our-story"],
              ],
            },
            {
              title: "Management",
              links: [
                ["Franchise Enquiry", "#franchise-modal"],
                ["Admin Portal", "/admin/login"],
                ["Admin Dashboard", "/admin/dashboard"],
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-semibold text-[#2a1d2e] mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(([label, to]) => (
                  <li key={label}>
                    {to === "#franchise-modal" ? (
                      <button onClick={openModal} className="text-sm text-[#5a4a5e] hover:text-[#ff5c97] transition text-left">
                        {label}
                      </button>
                    ) : (
                      <Link to={to} className="text-sm text-[#5a4a5e] hover:text-[#ff5c97] transition">
                        {label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-white/40 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#5a4a5e]">© {new Date().getFullYear()} CakeStory Desserts. All rights reserved.</p>
          <p className="text-xs text-[#5a4a5e]">Every Flavour Has A Story • Pune Franchise Network</p>
          <p className="text-xs text-[#5a4a5e] flex items-center gap-1" style={{ fontFamily: "Poppins, sans-serif" }}>
            Designed &amp; developed by{" "}
            <a
              href="https://nirosha.org"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#2a1d2e] hover:text-[#ff5c97] transition-colors underline underline-offset-2"
            >
              Team Nirosha
            </a>.
          </p>
        </div>
      </div>
    </footer>
  );
}
