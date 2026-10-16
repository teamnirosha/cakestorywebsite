import { useState, useEffect } from "react";
import { prefersReducedMotion } from "../../utils/motion";

export default function Preloader() {
  const [loading, setLoading] = useState(() => {
    if (typeof window === "undefined") return false;
    if (prefersReducedMotion()) return false;
    // Don't show preloader again in the same browser session
    return !sessionStorage.getItem("cs_preloader_seen");
  });

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!loading) return;

    // Fast, crisp loading animation: completes in ~350ms
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          sessionStorage.setItem("cs_preloader_seen", "true");
          setTimeout(() => setLoading(false), 220);
          return 100;
        }
        return prev + 35;
      });
    }, 60);

    // Failsafe: max 600ms total
    const failsafe = setTimeout(() => {
      setLoading(false);
      sessionStorage.setItem("cs_preloader_seen", "true");
    }, 600);

    return () => {
      clearInterval(timer);
      clearTimeout(failsafe);
    };
  }, [loading]);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-300 bg-gradient-to-br from-rose-600 via-pink-600 to-amber-600 text-white ${
        progress >= 100 ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      <div className="relative flex flex-col items-center">
        {/* Brand Logo */}
        <div className="mb-5 flex items-center justify-center">
          <img
            src="/assets/logo/cs-logo.png"
            alt="CakeStory Desserts"
            className="w-44 sm:w-56 h-auto object-contain filter drop-shadow-2xl"
          />
        </div>

        {/* Progress Bar */}
        <div className="w-44 sm:w-56 h-1.5 rounded-full bg-white/20 backdrop-blur-xs overflow-hidden p-0.5 border border-white/30">
          <div
            className="h-full bg-amber-300 rounded-full transition-all duration-150 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
