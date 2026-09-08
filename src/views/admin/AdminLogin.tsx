import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../services/data";
import { useToast } from "../../components/common/Toast";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@cakestory.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { show } = useToast();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const user = authService.login(email, password);
      if (user) {
        show("Logged into CakeStory Desserts Operations Portal");
        navigate("/admin/dashboard");
      } else {
        show("Invalid credentials", "error");
      }
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-white/95 shadow-lg mx-auto mb-3">
            <img src="/assets/logo/cs-logo.png" alt="CakeStory Desserts" className="h-12 w-auto object-contain" />
          </div>
          <h1 className="text-xl font-bold font-display tracking-wider text-white">CakeStory Desserts</h1>
          <p className="text-xs text-slate-400 mt-1">Operations & Franchise Management Portal</p>
        </div>

        {/* Login Box */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={submit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Administrator Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-pink-500 transition"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Access Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-pink-500 transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs transition shadow-md disabled:opacity-60 mt-2"
            >
              {loading ? "Authenticating..." : "Sign In to ERP →"}
            </button>

            <div className="pt-2 text-center">
              <span className="text-[11px] text-slate-400">
                Demo Credentials: <strong className="text-slate-200">admin@cakestory.com</strong> / <strong className="text-slate-200">admin123</strong>
              </span>
            </div>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-slate-400 hover:text-white transition">
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
