import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { getProductImage, handleImageError, DEFAULT_FALLBACK_IMAGE } from "../../utils/imageResolver";

export interface CakeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "aspect" | "src"> {
  src?: string | null;
  alt: string;
  aspect?: "square" | "4/3" | "16/9" | "16/10" | "3/2" | "2/1" | "2/3" | "3/4" | "auto";
  fit?: "cover" | "contain" | "scale-down";
  position?: "center" | "top" | "bottom";
  hoverZoom?: boolean;
  fallback?: string;
  className?: string;
  imgClassName?: string;
  bgClassName?: string;
  badge?: string;
  badgePosition?: "bottom-left" | "bottom-right" | "top-left" | "top-right";
  badgeClassName?: string;
  priority?: boolean;
  children?: React.ReactNode;
}

/**
 * CakeImage — Global responsive image component for CakeStory.
 * Ensures:
 * - Proper aspect ratio container to eliminate layout shift (CLS)
 * - Safe image scaling without stretching or aspect ratio distortion
 * - Graceful fallback to default CakeStory asset if broken/missing
 * - Context-aware fit modes ("contain" for full cake silhouettes, "cover" for full-bleed cards)
 * - Clean responsive behavior across mobile, tablet, and desktop
 * - twMerge integration so passed sizes never conflict with defaults
 */
export default function CakeImage({
  src,
  alt,
  aspect = "square",
  fit = "cover",
  position = "center",
  hoverZoom = false,
  fallback = DEFAULT_FALLBACK_IMAGE,
  className = "",
  imgClassName = "",
  bgClassName = "",
  loading,
  badge,
  badgePosition = "bottom-left",
  badgeClassName = "",
  priority = false,
  style,
  children,
  ...rest
}: CakeImageProps) {
  const [loaded, setLoaded] = useState(false);
  const resolvedSrc = getProductImage(src);

  // Aspect ratio classes for predictable viewport container
  const aspectClasses: Record<string, string> = {
    square: "aspect-square",
    "4/3": "aspect-[4/3]",
    "16/9": "aspect-[16/9]",
    "16/10": "aspect-[16/10]",
    "3/2": "aspect-[3/2]",
    "2/1": "aspect-[2/1]",
    "2/3": "aspect-[2/3]",
    "3/4": "aspect-[3/4]",
    auto: "",
  };

  // Object-fit classes (no unwanted hardcoded padding)
  const fitClasses: Record<string, string> = {
    cover: "object-cover",
    contain: "object-contain",
    "scale-down": "object-scale-down",
  };

  // Object-position classes
  const positionClasses: Record<string, string> = {
    center: "object-center",
    top: "object-top",
    bottom: "object-bottom",
  };

  // Default subtle background if contain
  const defaultBg = fit === "contain"
    ? "bg-gradient-to-b from-slate-50/90 to-pink-50/30"
    : "bg-slate-100/50";

  const badgePositions: Record<string, string> = {
    "bottom-left": "bottom-2.5 left-2.5",
    "bottom-right": "bottom-2.5 right-2.5",
    "top-left": "top-2.5 left-2.5",
    "top-right": "top-2.5 right-2.5",
  };

  // Container styling with tailwind-merge to prevent width/height/overflow clashes
  const containerClasses = twMerge(
    clsx(
      "relative w-full overflow-hidden block select-none box-border",
      aspectClasses[aspect] || "",
      bgClassName || defaultBg,
      className
    )
  );

  const imageClasses = twMerge(
    clsx(
      "w-full h-full block max-w-full transition-all duration-500 ease-out",
      fitClasses[fit] || "object-cover",
      positionClasses[position] || "object-center",
      hoverZoom && "group-hover:scale-105",
      loaded ? "opacity-100" : "opacity-0",
      imgClassName
    )
  );

  return (
    <div className={containerClasses}>
      <img
        src={resolvedSrc}
        alt={alt}
        loading={priority ? "eager" : (loading || "lazy")}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          handleImageError(e, fallback);
          setLoaded(true);
        }}
        style={{ imageOrientation: "from-image", ...style }}
        className={imageClasses}
        {...rest}
      />

      {badge && (
        <span
          className={twMerge(
            clsx(
              "absolute text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider backdrop-blur-md shadow-xs pointer-events-none z-10 max-w-[90%] truncate",
              badgePositions[badgePosition] || badgePositions["bottom-left"],
              badgeClassName || "bg-slate-900/80 text-white"
            )
          )}
        >
          {badge}
        </span>
      )}

      {children}
    </div>
  );
}
