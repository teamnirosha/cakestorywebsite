import { ReactNode, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { authService } from "../../services/data";
import { useToast } from "../common/Toast";

export default function AdminLayout({
  children,
  title,
  subtitle,
  action,
}: {
  children: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { show } = useToast();
  const user = authService.current();

  const navItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: "📊" },
    { to: "/admin/franchises", label: "Outlet Network", icon: "🏪" },
    { to: "/admin/enquiries", label: "Franchise Leads", icon: "📋" },
    { to: "/admin/catalog", label: "Product Catalog", icon: "🎂" },
  ];

  const logout = () => {
    authService.logout();
    show("Admin session closed", "info");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans">
      {/* Mobile Top Bar */}
      <header className="lg:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-auto px-1.5 py-0.5 rounded bg-white/95 flex items-center justify-center shadow-xs">
            <img src="/assets/logo/cs-logo.png" alt="CakeStory Desserts" className="h-6 w-auto object-contain" />
          </div>
          <div>
            <div className="font-display font-bold text-sm tracking-wide text-white">CakeStory Desserts</div>
            <div className="text-[9px] text-pink-400 font-semibold tracking-wider uppercase">Operations Portal</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold px-3"
          >
            {sidebarOpen ? "✕ Close" : "☰ Menu"}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Professional ERP Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-200 lg:static lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Brand Header */}
          <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-800 bg-slate-950/60">
            <div className="h-9 w-auto px-2 py-1 rounded-lg bg-white/95 flex items-center justify-center shadow-sm shrink-0">
              <img src="/assets/logo/cs-logo.png" alt="CakeStory Desserts" className="h-7 w-auto object-contain" />
            </div>
            <div className="min-w-0">
              <div className="font-display font-bold text-white text-sm tracking-wide truncate">CakeStory Desserts</div>
              <div className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">OPERATIONS PORTAL</div>
            </div>
          </div>

          {/* Navigation Links — Strictly 4 Essential Modules */}
          <div className="px-3 py-4 flex-1 overflow-y-auto space-y-1">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Operations & Management
            </div>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-pink-600 text-white font-semibold shadow-sm"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <span className="text-sm">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* User Session Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/40">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 flex items-center justify-center font-bold text-xs shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white truncate">{user?.name || "Operations Lead"}</div>
                <div className="text-[10px] text-slate-400 truncate">{user?.email || "admin@cakestory.com"}</div>
              </div>
              <button
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-md hover:bg-slate-800 transition"
                title="Log out"
              >
                ↩
              </button>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
              <span>JSON Data Mode</span>
              <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Active
              </span>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Bar for Desktop */}
          <header className="bg-white border-b border-slate-200 px-6 py-3.5 hidden lg:flex items-center justify-between shadow-xs sticky top-0 z-20">
            <div>
              <h1 className="text-lg font-bold text-slate-900 font-display">{title}</h1>
              {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-medium px-2.5 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200">
                Central Pune Production Hub
              </span>
              {action || (
                <Link
                  to="/admin/franchises/add"
                  className="bg-pink-600 hover:bg-pink-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs transition flex items-center gap-1.5"
                >
                  <span>+</span> Add Outlet
                </Link>
              )}
            </div>
          </header>

          {/* Page Body */}
          <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
