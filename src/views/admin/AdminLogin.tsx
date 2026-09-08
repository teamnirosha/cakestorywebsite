import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../services/data";
import { useToast } from "../../components/common/Toast";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { show } = useToast();

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
        setErrorMessage("Invalid username or password.");
        show("Invalid username or password.", "error");
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 selection:bg-pink-500 selection:text-white">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-white/95 shadow-xl mx-auto mb-4 border border-white/20">
            <img src="/assets/logo/cs-logo.png" alt="CakeStory Desserts" className="h-12 w-auto object-contain" />
          </div>
          <h1 className="text-2xl font-bold font-display tracking-wide text-white">CakeStory Desserts</h1>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-pink-400 mt-1 uppercase tracking-wider bg-pink-500/10 px-3 py-0.5 rounded-full border border-pink-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
            ADMIN PORTAL
          </div>
        </div>

        {/* Secure Login Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <div className="mb-6 text-center">
            <h2 className="text-lg font-bold text-white font-display">Sign In to Continue</h2>
            <p className="text-xs text-slate-400 mt-0.5">Authorized operations & franchise personnel only</p>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">
                Username or Email
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                placeholder="Enter admin username"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition placeholder:text-slate-600"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-semibold text-slate-300">Access Password</label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition placeholder:text-slate-600"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs px-1"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "👁️‍🗨️" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold text-xs shadow-lg shadow-pink-500/25 transition-all disabled:opacity-60 mt-2 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Portal</span>
                  <span>→</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Public Website Return */}
        <div className="text-center mt-6">
          <Link to="/" className="text-xs font-semibold text-slate-400 hover:text-white transition inline-flex items-center gap-1">
            <span>← Return to Public Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
