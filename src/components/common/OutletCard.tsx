import { useState } from "react";
import { Link } from "react-router-dom";
import { Franchise } from "../../services/data";

interface OutletCardProps {
  outlet: Franchise;
  priority?: boolean;
  className?: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export default function OutletCard({
  outlet,
  priority = false,
  className = "",
  onClick,
  isSelected = false,
}: OutletCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const outletUrl = `/outlets/${outlet.slug || outlet.id}`;
  const hasImage = Boolean(outlet.image) && !imageError;

  return (
    <div
      onClick={onClick}
      className={`glass rounded-3xl overflow-hidden border border-white transition-all duration-300 hover:-translate-y-1.5 flex flex-col group min-w-0 ${
        onClick ? "cursor-pointer" : ""
      } ${
        isSelected
          ? "ring-2 ring-[#ff5c97] bg-white/95 shadow-xl"
          : "bg-white/85 hover:bg-white/95 shadow-md hover:shadow-2xl hover:border-pink-200/80"
      } ${className}`}
    >
      {/* 1. LOCATION MAP CONTAINER (Controlled 16/9 Ratio with Map Grid & Location Marker Pulse) */}
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-gradient-to-br from-slate-900 via-[#1e1b2e] to-slate-800 shrink-0">
        {hasImage ? (
          <>
            {/* Smooth Skeleton Blur while loading */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-purple-900/40 to-slate-900 animate-pulse" />
            )}
            <img
              src={outlet.image}
              alt={`${outlet.name} - Location`}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </>
        ) : (
          /* PREMIUM PHYSICAL LOCATION GRAPHIC (Map Grid + Animated Marker Pulse + Route Lines) */
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-[#271d33] to-[#1c2238] text-center overflow-hidden">
            {/* Soft Map Grid Dots Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#ff8fb1_1px,transparent_1px)] [background-size:18px_18px] opacity-25" />
            
            {/* Route Connection Accent Lines */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 300 160" fill="none" stroke="currentColor">
              <path d="M 20 130 Q 120 40 280 110" stroke="#ff8fb1" strokeWidth="1.5" strokeDasharray="4 4" />
              <path d="M 50 20 Q 160 140 260 30" stroke="#b9dcff" strokeWidth="1.5" strokeDasharray="3 3" />
            </svg>

            {/* Pulsing Location Pin Indicator */}
            <div className="relative z-10 mb-2">
              <div className="absolute -inset-2.5 rounded-full bg-pink-500/30 animate-ping" style={{ animationDuration: "2.5s" }} />
              <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#ff7eb3] to-[#ff5c97] shadow-lg shadow-pink-500/40 border border-white/80 flex items-center justify-center text-xl text-white group-hover:scale-110 transition-transform duration-300">
                📍
              </div>
            </div>

            <div className="relative z-10 text-xs font-bold text-white tracking-tight drop-shadow-xs">{outlet.name}</div>
            <div className="relative z-10 text-[10px] text-pink-200/90 font-medium mt-0.5">Physical Retail Outlet • {outlet.zone || "Pune Network"}</div>
          </div>
        )}

        {/* Operational Status Badge Overlay */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md backdrop-blur-md ${
              outlet.active
                ? "bg-emerald-500/90 text-white"
                : "bg-rose-500/90 text-white"
            }`}
          >
            {outlet.active ? "● Operational" : "○ Temporarily Closed"}
          </span>
        </div>

        {/* Pune Zone Tag Overlay */}
        <div className="absolute top-3 right-3 z-10">
          <span className="text-[10px] font-bold px-2 py-0.8 rounded-md bg-slate-900/80 text-pink-200 border border-white/20 backdrop-blur-md uppercase tracking-wide">
            {outlet.zone || outlet.city}
          </span>
        </div>
      </div>

      {/* 2. OUTLET CARD CONTENT (Immediately Follows Image, No Gaps) */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Outlet Identity */}
        <div className="mb-2">
          <h3 className="font-display font-bold text-base sm:text-lg text-[#2a1d2e] leading-snug group-hover:text-[#ff5c97] transition-colors truncate">
            <Link to={outletUrl}>{outlet.name}</Link>
          </h3>
          <div className="text-[11px] font-semibold text-[#ff5c97] truncate">
            {outlet.outletName} • Pune Network
          </div>
        </div>

        {/* Address */}
        <p className="text-xs text-[#5a4a5e] leading-relaxed line-clamp-2 mb-3 min-h-[32px]">
          📍 {outlet.address}
        </p>

        {/* Operating Hours */}
        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mb-4 border-t border-slate-100 pt-2.5">
          <span>🕐</span>
          <span>Open Daily: <strong className="text-slate-700 font-semibold">{outlet.openingHours}</strong></span>
        </div>

        {/* 3. CARD FOOTER & ACTIONS */}
        <div className="mt-auto pt-3 border-t border-slate-100/90 flex items-center justify-between gap-2">
          <a
            href={`tel:${outlet.phone}`}
            className="text-xs font-semibold text-slate-700 hover:text-[#ff5c97] transition-colors flex items-center gap-1 truncate"
            title={`Call ${outlet.name}`}
          >
            <span>📞</span>
            <span className="truncate">{outlet.phone}</span>
          </a>

          <Link
            to={outletUrl}
            className="btn-ghost !text-xs !py-1.5 !px-3 font-semibold text-[#ff5c97] group-hover:bg-pink-50 transition-colors shrink-0"
          >
            View Page →
          </Link>
        </div>
      </div>
    </div>
  );
}
