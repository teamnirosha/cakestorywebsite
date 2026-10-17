import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../services/data";
import { useToast } from "../../components/common/Toast";
import kitchenProductionBg from "../../assets/business/kitchen-production.jpg";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { show } = useToast();

  useEffect(() => {
    if (authService.isAuthed()) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMessage("Please enter both username and password.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    setTimeout(() => {
      const user = authService.login(username, password);
      if (user) {
        show("Authenticated — Welcome to CakeStory Admin Portal", "success");
        navigate("/admin/dashboard");
      } else {
        setErrorMessage("Invalid username or password. Please try again.");
        show("Invalid username or password.", "error");
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white overflow-x-hidden selection:bg-pink-500 selection:text-white">
      {/* ----------------- LEFT VISUAL HERO PANEL (ADMIN / CENTRAL OPS) ----------------- */}
      <div className="relative w-full lg:w-[54%] min-h-[380px] lg:min-h-screen bg-[#140b15] flex flex-col justify-between p-6 sm:p-10 lg:p-16 overflow-hidden">
        {/* Central Kitchen & Production Operations Background */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-1000 ease-out"
          style={{ backgroundImage: `url(${kitchenProductionBg})` }}
          aria-hidden="true"
        />

        {/* Sophisticated Layered Gradient Overlays */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#140b15] via-[#1a0e1c]/80 to-[#140b15]/75 mix-blend-multiply"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#140b15]/95 via-[#1a0e1c]/75 to-transparent"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-radial from-pink-900/20 via-transparent to-black/60 pointer-events-none"
          aria-hidden="true"
        />

        {/* Decorative Wave Divider for Desktop (Organic Curved Edge) */}
        <svg
          className="hidden lg:block absolute top-0 -right-1 bottom-0 h-full w-28 text-white pointer-events-none z-10"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M40,0 C85,28 10,72 50,100 L100,100 L100,0 Z" fill="currentColor" />
        </svg>

        {/* Top Tag Pill */}
        <div className="relative z-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#ff5c97] animate-pulse" />
            <span className="text-[11px] font-bold tracking-widest uppercase">
              Operations Control Center
            </span>
          </div>
        </div>

        {/* Hero Headline & Admin Operational Information */}
        <div className="relative z-20 my-auto py-8 lg:py-0 max-w-xl">
          <div className="inline-block text-[#ffb3cf] text-xs sm:text-sm font-bold tracking-widest uppercase mb-3">
            Central Hub • Store Network Management
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white leading-[1.1] tracking-tight drop-shadow-md">
            Central Ops,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff7aa8] via-[#ffa3c4] to-[#fce4ec]">
              Smarter
            </span>{" "}
            Control
          </h1>

          <p className="mt-4 text-xs sm:text-base text-rose-100/85 font-medium leading-relaxed max-w-md">
            Secure administrative console for franchise leads pipeline, outlet performance, catalogue inventory, and central operations.
          </p>

          {/* Admin Security Badge */}
          <div className="mt-6 inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-amber-400 text-stone-900 font-bold text-xs shadow-xl shadow-amber-400/20 transform hover:scale-105 transition duration-300">
            <span>Authorized Operations Personnel Only 🔐</span>
          </div>
        </div>

        {/* Bottom Hero Brand Caption */}
        <div className="relative z-20 hidden sm:flex items-center gap-4 text-xs text-rose-200/60 font-medium">
          <span>Pune Central Headquarters</span>
          <span>•</span>
          <span>Enterprise Management Console</span>
        </div>
      </div>

      {/* ----------------- RIGHT CLEAN LOGIN PANEL ----------------- */}
      <div className="w-full lg:w-[46%] min-h-screen bg-gradient-to-br from-white via-[#fff9fb] to-[#fdf2f6] flex flex-col justify-between p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md mx-auto my-auto py-6">
          {/* Brand Logo Header (Pure Transparent PNG, Enlarged, No Background Box) */}
          <div className="text-center mb-10">
            <Link to="/" className="inline-block transition-transform duration-300 hover:scale-105">
              <img
                src="/assets/logo/cs-logo.png"
                alt="CakeStory Desserts"
                className="h-24 sm:h-28 md:h-32 w-auto object-contain mx-auto drop-shadow-sm"
              />
            </Link>

            <div className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.25em] text-[#ff5c97] uppercase mt-4">
              Operations & Franchise Admin Portal
            </div>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5 animate-shake">
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                ✕
              </span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Default Access Credential Pill */}
          <div className="mb-6 p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2 text-amber-950 font-medium">
              <span className="text-base">🔑</span>
              <span>
                Default Login: <strong className="font-bold text-amber-900 font-mono">admin</strong> &bull; <strong className="font-bold text-amber-900 font-mono">CakeStory@Admin2026</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setUsername("admin");
                setPassword("CakeStory@Admin2026");
                if (errorMessage) setErrorMessage("");
              }}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] tracking-wide transition shadow-xs cursor-pointer self-start sm:self-auto shrink-0"
            >
              Fill Credentials
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div>
              <label className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                  placeholder="Enter your username"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#edf2f9] border border-transparent focus:border-[#ff5c97] focus:bg-white focus:ring-4 focus:ring-pink-500/10 text-slate-800 text-sm font-medium transition duration-200 placeholder:text-slate-400"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[11px] font-bold tracking-wider text-slate-500 uppercase mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-[#edf2f9] border border-transparent focus:border-[#ff5c97] focus:bg-white focus:ring-4 focus:ring-pink-500/10 text-slate-800 text-sm font-medium transition duration-200 placeholder:text-slate-400"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-1 rounded-md transition"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                      />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#ff5c97] via-[#e63273] to-[#c71d60] hover:from-[#f54d8b] hover:to-[#b61554] text-white font-bold text-sm tracking-wide shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <span className="text-base">→</span>
                </>
              )}
            </button>
          </form>

          {/* Return Link */}
          <div className="text-center mt-6">
            <Link
              to="/"
              className="text-xs font-semibold text-slate-500 hover:text-[#ff5c97] transition inline-flex items-center gap-1.5"
            >
              <span>←</span>
              <span>Return to Public Website</span>
            </Link>
          </div>
        </div>

        {/* Footer Copyright */}
        <div className="text-center pt-4">
          <p className="text-[11px] text-slate-400 font-medium">
            © 2026 CakeStory Desserts. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
