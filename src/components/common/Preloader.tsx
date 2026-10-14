import { useState, useEffect } from "react";

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 300);
          return 100;
        }
        return prev + Math.floor(Math.random() * 20) + 15;
      });
    }, 80);

    return () => clearInterval(timer);
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-500 bg-gradient-to-br from-rose-500 via-pink-500 to-amber-500 text-white ${
        progress >= 100 ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative flex flex-col items-center">
        {/* Animated Brand Roundel */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white p-3 shadow-2xl flex items-center justify-center mb-6 animate-pulse">
          <img
            src="/assets/logo/cs-logo.png"
            alt="CakeStory Desserts"
            className="w-full h-full object-contain filter drop-shadow-sm"
          />
        </div>

        {/* Brand Name */}
        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-wide text-white drop-shadow-md mb-4 text-center">
          CakeStory Desserts
        </h2>

        {/* Progress Bar */}
        <div className="w-48 sm:w-60 h-2 rounded-full bg-white/20 backdrop-blur-sm overflow-hidden p-0.5 border border-white/30">
          <div
            className="h-full bg-amber-300 rounded-full transition-all duration-150 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <p className="text-xs text-white/90 font-medium mt-3 tracking-wider">
          Loading sweetness...
        </p>
      </div>
    </div>
  );
}
