import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CakeImage, { CakeImageProps } from "./CakeImage";
import { twMerge } from "tailwind-merge";

gsap.registerPlugin(ScrollTrigger);

export interface ImageRevealProps extends CakeImageProps {
  revealVariant?: "fade-scale" | "clip-up" | "clip-right" | "soft-blur";
  containerClassName?: string;
  glassFrame?: boolean;
}

/**
 * ImageReveal — Premium GSAP ScrollTrigger reveal component for CakeStory Desserts.
 * Reveals image assets with elegant clip paths, scaling, or soft blur when scrolled into view.
 * Provides subtle interactive hover effects while respecting reduced-motion accessibility.
 */
export default function ImageReveal({
  src,
  alt,
  aspect = "square",
  fit = "cover",
  revealVariant = "fade-scale",
  containerClassName = "",
  glassFrame = false,
  badge,
  badgePosition,
  priority = false,
  className = "",
  imgClassName = "",
  ...rest
}: ImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect reduced motion settings
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !containerRef.current) return;

    const el = containerRef.current;
    const imgEl = imageRef.current;

    const ctx = gsap.context(() => {
      if (revealVariant === "fade-scale") {
        gsap.fromTo(
          imgEl,
          { opacity: 0, scale: 1.05 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
          }
        );
      } else if (revealVariant === "clip-up") {
        gsap.fromTo(
          el,
          { clipPath: "inset(100% 0% 0% 0% round 1.5rem)", opacity: 0 },
          {
            clipPath: "inset(0% 0% 0% 0% round 1.5rem)",
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              once: true,
            },
          }
        );
      } else if (revealVariant === "soft-blur") {
        gsap.fromTo(
          imgEl,
          { filter: "blur(12px)", opacity: 0, scale: 1.04 },
          {
            filter: "blur(0px)",
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
          }
        );
      }
    }, el);

    return () => ctx.revert();
  }, [revealVariant]);

  return (
    <div
      ref={containerRef}
      className={twMerge(
        "relative overflow-hidden transition-shadow duration-500 group",
        glassFrame ? "glass rounded-3xl p-2.5 bg-white/80 border border-white shadow-lg" : "rounded-3xl",
        containerClassName
      )}
    >
      <div ref={imageRef} className="w-full h-full overflow-hidden rounded-2xl">
        <CakeImage
          src={src}
          alt={alt}
          aspect={aspect}
          fit={fit}
          priority={priority}
          hoverZoom
          badge={badge}
          badgePosition={badgePosition}
          className={className}
          imgClassName={twMerge("transition-transform duration-700 ease-out group-hover:scale-[1.03]", imgClassName)}
          {...rest}
        />
      </div>
    </div>
  );
}
