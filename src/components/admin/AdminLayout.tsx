import { ReactNode, useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { authService } from "../../services/data";
import { useToast } from "../common/Toast";

export default function AdminLayout({
  children,
  title,
  subtitle,
  action,
}: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem("cs_admin_sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { show } = useToast();
  const user = authService.current();

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("cs_admin_sidebar_collapsed", String(next));
      } catch { }
      return next;
    });
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = () => setUserDropdownOpen(false);
    if (userDropdownOpen) {
      window.addEventListener("click", handleOutsideClick);
      return () => window.removeEventListener("click", handleOutsideClick);
    }
  }, [userDropdownOpen]);

  // ONLY 3 primary ERP modules as requested
  const navItems = [
    {
      to: "/admin/dashboard",
      label: "Dashboard",
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z"
          />
        </svg>
      ),
    },
    {
      to: "/admin/franchises",
      label: "Outlets Network",
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      to: "/admin/enquiries",
      label: "Lead Management",
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      ),
    },
    {
      to: "/admin/gallery",
      label: "Sweet Scenes",
      icon: (
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" strokeWidth="1.8" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" strokeWidth="1.8" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" strokeWidth="2.5" />
        </svg>
      ),
    },
  ];

  const logout = () => {
    authService.logout();
    show("Admin session closed", "info");
    navigate("/admin/login");
  };

  // Compute active module title for breadcrumbs
  const getBreadcrumbTitle = () => {
    if (location.pathname.startsWith("/admin/franchises")) return "Outlets Network";
    if (location.pathname.startsWith("/admin/enquiries")) return "Lead Management";
    if (location.pathname.startsWith("/admin/gallery")) return "Sweet Scenes & Reels";
    if (location.pathname.startsWith("/admin/account") || location.pathname.startsWith("/admin/settings")) return "Settings";
    return "Dashboard";
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#f8fafc] text-slate-800 font-sans selection:bg-pink-500 selection:text-white">
      {/* ----------------- FIXED ENTERPRISE SIDEBAR ----------------- */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 transition-all duration-300 lg:static lg:translate-x-0 ${isCollapsed ? "w-20" : "w-64"
          } ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}`}
      >
        {/* Top Sidebar Brand Area (Aligned seamlessly with Header h-16) */}
        <div className="h-16 px-3.5 border-b border-slate-200/80 flex items-center justify-between shrink-0">
          <Link
            to="/admin/dashboard"
            className={`flex items-center gap-2.5 min-w-0 transition-opacity ${isCollapsed ? "justify-center w-full" : ""
              }`}
          >
            <img
              src="/assets/logo/cs-logo.png"
              alt="CakeStory Desserts"
              className="h-8 w-auto object-contain shrink-0"
            />
            {!isCollapsed && (
              <div className="truncate">
                <span className="font-semibold text-slate-900 text-sm tracking-tight block leading-tight">
                  CakeStory <span className="text-[#ff5c97] font-semibold text-sm">Desserts</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase block">
                  Management
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Sidebar Collapse Button (in sidebar header) */}
          {!isCollapsed && (
            <button
              type="button"
              onClick={toggleCollapse}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer shrink-0"
              title="Collapse sidebar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Mobile close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Sidebar Navigation Items */}
        <div className="p-3 space-y-4 flex-1 overflow-y-auto flex flex-col justify-between">
          <div>
            {!isCollapsed && (
              <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                Operations
              </div>
            )}
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  title={isCollapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs transition-colors duration-150 ${isCollapsed ? "justify-center px-0" : ""
                    } ${isActive
                      ? "bg-pink-50/80 text-[#ff5c97] font-semibold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                    }`
                  }
                >
                  {item.icon}
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Desktop Collapse / Expand Button (in sidebar!) */}
          <div className="hidden lg:block pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={toggleCollapse}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer ${isCollapsed ? "justify-center px-0" : ""
                }`}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isCollapsed ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                )}
              </svg>
              {!isCollapsed && <span>Collapse Sidebar</span>}
            </button>
          </div>
        </div>

        {/* Sidebar Footer (Branding & Quick Settings) */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60 shrink-0">
          {!isCollapsed ? (
            <div className="space-y-2">
              <div className="text-[10px] text-slate-400 font-medium leading-tight">
                Designed & Developed by{" "}
                <span className="text-slate-700 font-semibold">Team Nirosha</span>
              </div>
              <div className="flex items-center justify-between text-xs pt-1">
                <Link
                  to="/admin/settings"
                  className="text-slate-500 hover:text-[#ff5c97] text-[11px] font-medium transition"
                >
                  Settings
                </Link>
                <button
                  onClick={logout}
                  className="text-rose-600 hover:text-rose-700 text-[11px] font-medium cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Link
                to="/admin/settings"
                title="Settings"
                className="p-1.5 text-slate-400 hover:text-[#ff5c97] rounded-lg transition"
              >
                ⚙️
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ----------------- RIGHT COLUMN (FIXED TOP BAR + SCROLLABLE MAIN) ----------------- */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Fixed Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
          {/* Left: Mobile Toggle & Clean Breadcrumb */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {/* Mobile Sidebar Open Toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              aria-label="Open Navigation"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Clean Breadcrumb without emojis or heavy bold */}
            <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span className="text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </span>
              <span className="text-slate-600">CakeStory</span>
              <span className="text-slate-300">/</span>
              <span className="text-[#ff5c97] font-semibold">{getBreadcrumbTitle()}</span>
            </nav>
          </div>

          {/* Right: Operational Status & Admin Profile */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Operational
            </span>

            {/* User Profile Pill & Dropdown */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-pink-100 text-[#ff5c97] flex items-center justify-center font-bold text-xs border border-pink-200">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
                </div>
                <div className="hidden sm:block text-left pr-1">
                  <div className="text-xs font-semibold text-slate-800 leading-none">ADMIN</div>
                </div>
                <span className="text-[10px] text-slate-400">▾</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50 text-xs text-slate-700 animate-fade-in">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <div className="font-semibold text-slate-900">{user?.name || "Operations Lead"}</div>
                    <div className="text-[10px] text-slate-400 truncate">{user?.username || "admin"}</div>
                  </div>
                  <Link
                    to="/admin/settings"
                    className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 transition font-medium"
                  >
                    <span>⚙️</span>
                    <span>System Settings</span>
                  </Link>
                  <Link
                    to="/"
                    className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 transition text-slate-600"
                  >
                    <span>🌐</span>
                    <span>View Website</span>
                  </Link>
                  <div className="border-t border-slate-100 my-1" />
                  <button
                    onClick={logout}
                    className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-rose-600 hover:bg-rose-50 font-medium transition"
                  >
                    <span>↩</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Content Container (The ONLY container that scrolls!) */}
        <main className="flex-1 overflow-y-auto bg-[#f8fafc]">
          {/* Optional Title Header Banner for Sub-pages (only if title is explicitly provided) */}
          {title && (
            <div className="bg-white border-b border-slate-200/80 px-6 sm:px-8 py-3.5 flex items-center justify-between gap-4">
              <div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h1>
                {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
              </div>
              {action && <div className="shrink-0">{action}</div>}
            </div>
          )}

          {/* Page Content Body (Optimized enterprise width and padding, no wasted empty spaces) */}
          <div className="p-4 sm:p-5 lg:p-6 w-full max-w-[1600px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
