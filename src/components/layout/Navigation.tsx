import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useFranchiseModal } from "../common/FranchiseModal";

const links = [
  { to: "/", label: "Home" },
  { to: "/our-story", label: "Our Story" },
  { to: "/franchise", label: "Franchise" },
  { to: "/faq", label: "FAQ" },
  { to: "/outlets", label: "Outlets" },
  { to: "/contact", label: "Contact" },
  { to: "/blog", label: "Blog" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  const { openModal } = useFranchiseModal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [loc.pathname]);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? "py-3" : "py-5"}`}>
        <div className={`mx-auto px-6 transition-all duration-300 ${scrolled ? "max-w-6xl" : "max-w-7xl"}`}>
          <div className="glass rounded-full pl-5 pr-2 py-2 flex items-center justify-between transition-all">
            <Link to="/" className="flex items-center gap-2 group py-0.5">
              <img
                src="/assets/logo/cs-logo.png"
                alt="CakeStory Desserts"
                className="h-9 sm:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) =>
                    `px-3.5 py-2 rounded-full text-sm font-medium transition-all ${
                      isActive ? "bg-white/90 text-[#ff5c97] shadow-sm font-semibold" : "text-[#2a1d2e] hover:bg-white/50"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </div>

            <div className="flex items-center gap-2">
              
              <button
                onClick={openModal}
                className="btn-primary !py-2 !px-5 !text-sm whitespace-nowrap shadow-lg hover:shadow-pink-300/50"
              >
                Franchise Enquiry
              </button>

              <button
                onClick={() => setOpen(!open)}
                className="lg:hidden w-10 h-10 rounded-full bg-white/70 flex flex-col items-center justify-center gap-1.5"
                aria-label="Menu"
              >
                <span className={`w-4 h-0.5 bg-[#2a1d2e] transition-all ${open ? "rotate-45 translate-y-1" : ""}`} />
                <span className={`w-4 h-0.5 bg-[#2a1d2e] transition-all ${open ? "opacity-0" : ""}`} />
                <span className={`w-4 h-0.5 bg-[#2a1d2e] transition-all ${open ? "-rotate-45 -translate-y-1" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-30 lg:hidden pt-24">
          <div
            className="absolute inset-0 bg-gradient-to-b from-pink-50/95 via-rose-50/95 to-amber-50/95 backdrop-blur-xl"
            onClick={() => setOpen(false)}
          />
          <div className="relative flex flex-col items-center gap-2 p-6 fade-in">
            <img
              src="/assets/logo/cs-logo.png"
              alt="CakeStory Desserts"
              className="h-12 w-auto object-contain mb-2"
            />
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `px-8 py-3 rounded-full text-lg font-display font-medium transition-all ${
                    isActive ? "bg-white text-[#ff5c97] shadow-md font-bold" : "text-[#2a1d2e] hover:bg-white/60"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link to="/admin/login" className="text-sm font-semibold text-[#5a4a5e] py-2">
              Admin Panel
            </Link>
            <button
              onClick={() => {
                setOpen(false);
                openModal();
              }}
              className="btn-primary mt-2 w-full max-w-xs font-bold"
            >
              Franchise Enquiry
            </button>
          </div>
        </div>
      )}
    </>
  );
}
