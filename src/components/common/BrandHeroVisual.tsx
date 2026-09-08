import React from "react";
import CakeImage from "./CakeImage";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

export interface HeroSupportingCardData {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface HeroFloatingBadgeData {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  position: "top-left" | "bottom-right";
}

export interface BrandHeroVisualProps {
  imageAsset?: string;
  alt?: string;
  caption?: string;
  badge?: string;
  aspect?: "square" | "4/3" | "16/9" | "16/10" | "3/2" | "2/1" | "2/3" | "3/4" | "auto";
  fit?: "contain" | "cover" | "scale-down";
  supportingCards?: HeroSupportingCardData[];
  floatingBadges?: HeroFloatingBadgeData[];
  className?: string;
  imageContainerClassName?: string;
  footerContent?: React.ReactNode;
}

/**
 * BrandHeroVisual — Reusable hero visual showcase tailored specifically
 * for the CakeStory Desserts official celebration cake hero image.
 * 
 * Features:
 * - Built around the authentic portrait 2:3 aspect ratio (682x1024)
 * - Eliminates layout shift with a stable container aspect ratio
 * - Never stretches, squashes, or inappropriately crops cake elements
 * - Seamless edge-to-edge presentation matching the photo's studio backdrop
 * - Completely responsive across 1440px desktop, 1024px tablet, and 390px/360px mobile
 */
export default function BrandHeroVisual({
  imageAsset = "/images/hero-cake.jpg",
  alt = "CakeStory Desserts Signature Artisanal Creation",
  badge,
  aspect = "2/3",
  fit = "cover",
  supportingCards,
  floatingBadges,
  className = "",
  imageContainerClassName = "",
  footerContent,
}: BrandHeroVisualProps) {
  return (
    <div className={twMerge("relative w-full max-w-[290px] sm:max-w-[340px] lg:max-w-[380px] mx-auto", className)}>
      {/* Subtle Backlighting Light Ray Radial Glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-pink-300/30 via-rose-200/40 to-blue-300/30 rounded-[3rem] blur-2xl pointer-events-none opacity-80 animate-pulse" style={{ animationDuration: "5s" }} />

      {/* Main Glass Framing Container */}
      <div className="hero-visual-card glass rounded-[2rem] sm:rounded-[2.5rem] p-3 sm:p-4 shadow-2xl bg-white/85 border border-white relative overflow-hidden backdrop-blur-md transition-transform duration-300 ease-out">
        {/* Controlled Image Box designed around the 2:3 aspect ratio */}
        <div
          className={twMerge(
            clsx(
              "relative w-full aspect-[2/3] rounded-2xl sm:rounded-3xl overflow-hidden shadow-inner border border-rose-100/80 bg-[#fcecef] flex items-center justify-center",
              imageContainerClassName
            )
          )}
        >
          <CakeImage
            src={imageAsset}
            alt={alt}
            aspect={aspect}
            fit={fit}
            priority={true}
            hoverZoom
            badge={badge}
            className="w-full h-full"
            imgClassName="w-full h-full object-cover object-center"
          />

          {/* Micro Ambient Floating Sparkles inside card */}
          <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-white/80 blur-[1px] animate-ping" style={{ animationDuration: "3s" }} />
          <div className="absolute bottom-6 left-5 w-2.5 h-2.5 rounded-full bg-pink-200/80 blur-[1px] animate-pulse" />
        </div>

        {/* Supporting Capability Mini-Cards */}
        {supportingCards && supportingCards.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-2 sm:gap-2.5">
            {supportingCards.map((card) => (
              <div
                key={card.id}
                className="glass-soft rounded-xl sm:rounded-2xl p-2 sm:p-2.5 text-left border border-white/80 shadow-2xs hover:border-pink-200 transition hover:-translate-y-0.5"
              >
                <div className="text-sm sm:text-base">{card.icon}</div>
                <div className="font-bold text-[11px] sm:text-xs text-[#2a1d2e] mt-0.5 truncate">{card.title}</div>
                <div className="text-[10px] text-[#5a4a5e] leading-tight mt-0.5 line-clamp-2">{card.description}</div>
              </div>
            ))}
          </div>
        )}

        {/* Optional Custom Footer Content */}
        {footerContent}
      </div>

      {/* Floating Trust Badges (Positioned cleanly anchored to container, hidden on small mobile to avoid overflow) */}
      {floatingBadges &&
        floatingBadges.map((badgeItem, idx) => {
          const isTopLeft = badgeItem.position === "top-left";
          return (
            <div
              key={badgeItem.id}
              className={clsx(
                `hero-floating-badge-${idx + 1}`,
                "hidden sm:flex absolute glass rounded-2xl px-3 sm:px-3.5 py-1.5 sm:py-2 items-center gap-2 sm:gap-2.5 shadow-lg border border-white float-y z-20 max-w-[190px] sm:max-w-[210px] bg-white/95 backdrop-blur-md pointer-events-none transition-transform duration-300 ease-out",
                isTopLeft
                  ? "-top-3 -left-2 lg:-top-3 lg:-left-3"
                  : "top-[54%] -right-2 lg:top-[56%] lg:-right-4"
              )}
              style={{ animationDelay: isTopLeft ? "0s" : "1.2s" }}
            >
              <span className="text-base sm:text-lg shrink-0">{badgeItem.icon}</span>
              <div className="min-w-0">
                <div className="text-[11px] sm:text-xs font-bold text-[#2a1d2e] truncate">{badgeItem.title}</div>
                <div className="text-[9px] sm:text-[10px] text-[#5a4a5e] truncate">{badgeItem.subtitle}</div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
