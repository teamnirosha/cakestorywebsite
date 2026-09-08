import { twMerge } from "tailwind-merge";

interface BakeryBackgroundDecorProps {
  variant?: "hero" | "strengths" | "timeline" | "hygiene" | "outlets" | "cta" | "franchise";
  className?: string;
}

/**
 * BakeryBackgroundDecor — Atmospheric background elements for CakeStory Desserts.
 * Displays ultra-subtle, non-distracting SVG illustrations & bakery-inspired vectors
 * (flour dust, cream swirls, strawberry silhouettes, crumb accents).
 * Operates at low opacity behind content.
 */
export default function BakeryBackgroundDecor({
  variant = "hero",
  className = "",
}: BakeryBackgroundDecorProps) {
  return (
    <div
      aria-hidden="true"
      className={twMerge(
        "absolute inset-0 pointer-events-none select-none overflow-hidden z-0 opacity-40 sm:opacity-60 transition-opacity duration-700",
        className
      )}
    >
      {variant === "hero" && (
        <>
          {/* Flour & Powder Dust Particles */}
          <div className="absolute top-[12%] left-[8%] w-3 h-3 rounded-full bg-pink-300/40 blur-[1px] float-y" style={{ animationDuration: "7s" }} />
          <div className="absolute top-[28%] left-[18%] w-2 h-2 rounded-full bg-blue-300/40 blur-[1px] float-y" style={{ animationDuration: "9s", animationDelay: "1s" }} />
          <div className="absolute top-[65%] left-[12%] w-4 h-4 rounded-full bg-amber-200/50 blur-[2px] float-y" style={{ animationDuration: "11s", animationDelay: "2s" }} />
          <div className="absolute top-[20%] right-[14%] w-3.5 h-3.5 rounded-full bg-rose-300/40 blur-[1px] float-y" style={{ animationDuration: "8s", animationDelay: "1.5s" }} />
          <div className="absolute top-[75%] right-[22%] w-2.5 h-2.5 rounded-full bg-purple-200/40 blur-[1px] float-y" style={{ animationDuration: "10s", animationDelay: "0.5s" }} />

          {/* Cream Swirl Outline Vector - Top Left */}
          <svg className="absolute top-[6%] left-[4%] w-28 h-28 text-pink-300/20 float-y" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ animationDuration: "12s" }}>
            <path d="M50 15 C 20 20, 10 50, 35 75 C 60 100, 90 70, 75 40 C 65 20, 40 30, 45 50 C 50 65, 65 60, 60 50 C 55 42, 45 45, 50 50" />
          </svg>

          {/* Strawberry Silhouette Vector - Bottom Right */}
          <svg className="absolute bottom-[10%] right-[6%] w-24 h-24 text-rose-300/25 float-y" viewBox="0 0 64 64" fill="currentColor" style={{ animationDuration: "14s", animationDelay: "3s" }}>
            <path d="M32 6C24 6 12 18 12 34C12 48 22 58 32 58C42 58 52 48 52 34C52 18 40 6 32 6ZM26 22A2 2 0 1 1 26 18A2 2 0 0 1 26 22ZM38 22A2 2 0 1 1 38 18A2 2 0 0 1 38 22ZM20 34A2 2 0 1 1 20 30A2 2 0 0 1 20 34ZM32 34A2 2 0 1 1 32 30A2 2 0 0 1 32 34ZM44 34A2 2 0 1 1 44 30A2 2 0 0 1 44 34ZM26 46A2 2 0 1 1 26 42A2 2 0 0 1 26 46ZM38 46A2 2 0 1 1 38 42A2 2 0 0 1 38 46Z" opacity="0.4" />
          </svg>

          {/* Delicate Line Grid Accent */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-200/20 to-transparent" />
        </>
      )}

      {variant === "strengths" && (
        <>
          {/* Subtle Whisk/Wheat & Pastry Flour Accents */}
          <svg className="absolute top-8 left-10 w-32 h-32 text-pink-300/15 float-y" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2">
            <circle cx="50" cy="50" r="35" strokeDasharray="4 4" />
            <circle cx="50" cy="50" r="20" strokeDasharray="2 4" />
          </svg>
          <svg className="absolute bottom-10 right-12 w-36 h-36 text-blue-300/15 float-y" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ animationDelay: "2s" }}>
            <path d="M20 50 Q 50 10, 80 50 Q 50 90, 20 50 Z" />
            <circle cx="50" cy="50" r="8" />
          </svg>
          <div className="absolute top-[40%] right-[15%] w-3 h-3 rounded-full bg-amber-300/40 blur-[1px]" />
          <div className="absolute bottom-[30%] left-[20%] w-2 h-2 rounded-full bg-pink-300/40 blur-[1px]" />
        </>
      )}

      {variant === "timeline" && (
        <>
          {/* Curved Frosting Stroke Background */}
          <svg className="absolute top-1/4 -left-12 w-72 h-72 text-pink-200/20 pointer-events-none" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 100 Q 100 20, 190 100 T 370 100" />
          </svg>
          <div className="absolute bottom-16 right-8 w-4 h-4 rounded-full bg-rose-200/50 blur-[2px] float-y" />
        </>
      )}

      {variant === "hygiene" && (
        <>
          {/* Sparkle Clean Discipline Vectors */}
          <svg className="absolute top-12 right-16 w-20 h-20 text-emerald-300/20 float-y" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
          </svg>
          <svg className="absolute bottom-16 left-12 w-16 h-16 text-blue-300/20 float-y" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ animationDelay: "1.5s" }}>
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
          </svg>
          <div className="absolute top-1/2 left-1/3 w-3 h-3 rounded-full bg-emerald-200/40 blur-[1px]" />
        </>
      )}

      {variant === "outlets" && (
        <>
          {/* Subtle Map Location Grid Dots */}
          <div className="absolute inset-0 bg-[radial-gradient(#ff8fb1_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.07]" />
          <svg className="absolute top-10 right-10 w-40 h-40 text-pink-300/15 float-y" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="50" cy="50" r="45" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="30" strokeDasharray="2 2" />
          </svg>
        </>
      )}

      {variant === "cta" && (
        <>
          {/* High Depth Floating Starbursts */}
          <svg className="absolute top-6 left-12 w-20 h-20 text-white/30 float-y" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
          <svg className="absolute bottom-8 right-14 w-16 h-16 text-amber-200/40 float-y" viewBox="0 0 24 24" fill="currentColor" style={{ animationDelay: "2s" }}>
            <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
          </svg>
          <div className="absolute top-1/3 right-1/4 w-3 h-3 rounded-full bg-white/50 blur-[1px]" />
        </>
      )}

      {variant === "franchise" && (
        <>
          {/* Abstract Business Network Growth Lines & Location Nodes */}
          <svg className="absolute inset-0 w-full h-full text-pink-400/15 pointer-events-none" viewBox="0 0 800 400" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M 50 350 Q 250 150 450 250 T 750 80" strokeDasharray="4 4" />
            <path d="M 100 80 Q 300 280 600 120" strokeDasharray="3 3" stroke="#6fa8f5" strokeOpacity="0.2" />
            <circle cx="250" cy="190" r="4" fill="#ff5c97" />
            <circle cx="450" cy="250" r="6" fill="#6fa8f5" />
            <circle cx="600" cy="120" r="5" fill="#ff7eb3" />
          </svg>
          <div className="absolute top-10 left-16 w-36 h-36 rounded-full bg-emerald-100/30 blur-2xl float-y" />
          <div className="absolute bottom-12 right-20 w-44 h-44 rounded-full bg-pink-200/30 blur-2xl float-y" style={{ animationDelay: "2s" }} />
        </>
      )}
    </div>
  );
}
