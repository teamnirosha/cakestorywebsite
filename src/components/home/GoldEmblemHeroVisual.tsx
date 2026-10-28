import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import csLogoImg from "../../assets/logo/cs-final-logo.png";
import { prefersReducedMotion } from "../../utils/motion";

interface GoldEmblemHeroVisualProps {
  className?: string;
  heroRef?: React.RefObject<HTMLElement | null>;
}

// 4-point sparkle star SVG symbol
function SparkleStar({ className = "w-4 h-4 text-amber-300" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0 C12 6.6 6.6 12 0 12 C6.6 12 12 17.4 12 24 C12 17.4 17.4 12 24 12 C17.4 12 12 6.6 12 0 Z" />
    </svg>
  );
}

export default function GoldEmblemHeroVisual({ className = "", heroRef }: GoldEmblemHeroVisualProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tiltCardRef = useRef<HTMLDivElement | null>(null);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const haloGlowRef = useRef<HTMLDivElement | null>(null);
  const backOrbitRef = useRef<SVGSVGElement | null>(null);
  const frontOrbitRef = useRef<SVGSVGElement | null>(null);
  const sparklesGroupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const isReduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      // 1. Initial Cinematic Entrance Reveal
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (isReduced) {
        gsap.set([tiltCardRef.current, haloGlowRef.current, backOrbitRef.current, frontOrbitRef.current, sparklesGroupRef.current], {
          opacity: 1,
          scale: 1,
          y: 0,
        });
        return;
      }

      // Initial state
      gsap.set(tiltCardRef.current, { opacity: 0, scale: 0.92, y: 22, rotateY: -6 });
      gsap.set(haloGlowRef.current, { opacity: 0, scale: 0.8 });
      gsap.set([backOrbitRef.current, frontOrbitRef.current], { opacity: 0 });
      gsap.set(sparklesGroupRef.current, { opacity: 0 });

      // Entrance animation sequence (~1.1s total, non-blocking)
      tl.to(haloGlowRef.current, { opacity: 0.95, scale: 1, duration: 1.2, ease: "power2.out" }, 0.1)
        .to(tiltCardRef.current, { opacity: 1, scale: 1, y: 0, rotateY: 0, duration: 1.1, ease: "power3.out" }, 0.2)
        .to([backOrbitRef.current, frontOrbitRef.current], { opacity: 1, duration: 0.9, ease: "power2.out" }, 0.38)
        .to(sparklesGroupRef.current, { opacity: 1, duration: 0.8, ease: "power2.out" }, 0.55);

      // 2. Organic Floating Animation (Continuous gentle floating and breathing)
      gsap.to(tiltCardRef.current, {
        y: "-=10",
        duration: 3.4,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      gsap.to(tiltCardRef.current, {
        rotationZ: "+=1.2",
        duration: 4.6,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      // Subtle breathing halo glow
      gsap.to(haloGlowRef.current, {
        scale: 1.08,
        opacity: 1,
        duration: 3.0,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      // 3. Stardust / Sparkle Twinkles
      const sparkles = sparklesGroupRef.current?.querySelectorAll(".orbit-sparkle");
      if (sparkles && sparkles.length > 0) {
        sparkles.forEach((sparkle, idx) => {
          gsap.to(sparkle, {
            scale: 1.45,
            opacity: 1,
            duration: 1.2 + (idx % 3) * 0.4,
            yoyo: true,
            repeat: -1,
            delay: (idx * 0.25) % 1.5,
            ease: "sine.inOut",
          });
        });
      }

      // 4. Desktop Pointer Tilt / Parallax Interaction
      const isTouch = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
      const hostElement = heroRef?.current || containerRef.current;

      if (!isTouch && hostElement) {
        let mouseX = 0;
        let mouseY = 0;

        const handleMouseMove = (e: MouseEvent) => {
          const rect = hostElement.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return;

          // Normalized coordinates: -1 to +1 from center of hero
          const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
          const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

          mouseX = Math.max(-1, Math.min(1, normX));
          mouseY = Math.max(-1, Math.min(1, normY));

          // Smooth tilt dampening
          gsap.to(tiltCardRef.current, {
            rotateY: mouseX * 6.5,
            rotateX: -mouseY * 5,
            x: mouseX * 8,
            y: mouseY * 6,
            duration: 0.8,
            ease: "power2.out",
            overwrite: "auto",
          });
        };

        const handleMouseLeave = () => {
          gsap.to(tiltCardRef.current, {
            rotateY: 0,
            rotateX: 0,
            x: 0,
            y: 0,
            duration: 1.2,
            ease: "power2.out",
            overwrite: "auto",
          });
        };

        hostElement.addEventListener("mousemove", handleMouseMove as EventListener);
        hostElement.addEventListener("mouseleave", handleMouseLeave as EventListener);

        return () => {
          hostElement.removeEventListener("mousemove", handleMouseMove as EventListener);
          hostElement.removeEventListener("mouseleave", handleMouseLeave as EventListener);
        };
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [heroRef]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-[270px] sm:max-w-[360px] md:max-w-[440px] lg:max-w-[620px] xl:max-w-[690px] aspect-[1.38/1] flex items-center justify-center select-none pointer-events-none sm:pointer-events-auto ${className}`}
      style={{ perspective: "1200px" }}
    >
      {/* 1. Warm Ambient Radial Gold Halo Glow (Illuminating the bakery shelves & counter behind) */}
      <div
        ref={haloGlowRef}
        aria-hidden="true"
        className="absolute inset-0 -m-8 sm:-m-12 lg:-m-16 rounded-full pointer-events-none transition-transform will-change-transform"
        style={{
          background:
            "radial-gradient(ellipse 68% 58% at 52% 48%, rgba(251, 191, 36, 0.42) 0%, rgba(217, 119, 6, 0.20) 42%, rgba(180, 83, 9, 0.06) 65%, rgba(0, 0, 0, 0) 80%)",
          filter: "blur(28px)",
        }}
      />

      {/* 2. Secondary Diffuse Counter Glow (Soft golden bounce on the showcase glass beneath) */}
      <div
        aria-hidden="true"
        className="absolute -bottom-8 sm:-bottom-12 left-1/2 -translate-x-1/2 w-4/5 h-20 sm:h-28 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(251, 191, 36, 0.32) 0%, rgba(245, 158, 11, 0.14) 50%, rgba(0, 0, 0, 0) 75%)",
          filter: "blur(22px)",
        }}
      />

      {/* 3. 3D Tilt Wrapper Container */}
      <div
        ref={tiltCardRef}
        className="relative w-full h-full flex items-center justify-center will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* 4. Layer A: Back Orbital Light Trail (Sweeps BEHIND the top & right of the logo) */}
        <svg
          ref={backOrbitRef}
          aria-hidden="true"
          viewBox="0 0 680 460"
          className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
        >
          <defs>
            {/* Luminous Gold Gradient for Back Arc */}
            <linearGradient id="backOrbitGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffd700" stopOpacity="0.15" />
              <stop offset="35%" stopColor="#f59e0b" stopOpacity="0.65" />
              <stop offset="70%" stopColor="#fef08a" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.85" />
            </linearGradient>

            {/* Glowing Bloom Filter */}
            <filter id="goldBloomBack" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Elliptical Path Passing Behind Logo: Top Arc from left to right */}
          {/* Outer Soft Ambient Glow */}
          <path
            d="M 105 310 C 80 185, 230 70, 465 80 C 580 85, 635 150, 625 220"
            fill="none"
            stroke="url(#backOrbitGrad)"
            strokeWidth="14"
            strokeLinecap="round"
            opacity="0.38"
            style={{ filter: "blur(9px)" }}
          />

          {/* Core Radiant Trail */}
          <path
            d="M 105 310 C 80 185, 230 70, 465 80 C 580 85, 635 150, 625 220"
            fill="none"
            stroke="url(#backOrbitGrad)"
            strokeWidth="3.8"
            strokeLinecap="round"
            filter="url(#goldBloomBack)"
          />

          {/* Intense White-Hot Filament */}
          <path
            d="M 160 240 C 205 140, 295 85, 455 85 C 535 88, 600 125, 618 175"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity="0.88"
            style={{ filter: "blur(0.5px)" }}
          />
        </svg>

        {/* 5. Authentic CakeStory Original Brand Logo (Centered at z-10) */}
        <div className="relative z-10 w-[84%] max-w-[460px] sm:max-w-[490px] lg:max-w-[520px] xl:max-w-[550px] flex items-center justify-center p-2">
          <img
            ref={logoImgRef}
            src={csLogoImg}
            alt="CakeStory Desserts - Every Flavour Has A Story"
            className="w-full h-auto object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.75)] drop-shadow-[0_0_45px_rgba(245,175,45,0.38)] drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] transform hover:scale-[1.02] transition-transform duration-300 pointer-events-auto select-none"
            draggable={false}
          />
        </div>

        {/* 6. Layer B: Front Orbital Light Trail (Sweeps IN FRONT of the lower ribbon & rim) */}
        <svg
          ref={frontOrbitRef}
          aria-hidden="true"
          viewBox="0 0 680 460"
          className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible"
        >
          <defs>
            {/* Brilliant Gold Gradient for Front Arc */}
            <linearGradient id="frontOrbitGrad" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="25%" stopColor="#fef08a" stopOpacity="0.98" />
              <stop offset="55%" stopColor="#f59e0b" stopOpacity="0.88" />
              <stop offset="85%" stopColor="#d97706" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#b45309" stopOpacity="0" />
            </linearGradient>

            {/* Glowing Bloom Filter Front */}
            <filter id="goldBloomFront" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4.5" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="9" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Sweeping Arc In Front of Lower Ribbon: from right (625, 220) swooping low across front to left (95, 310) */}
          {/* Outer Soft Ambient Bloom */}
          <path
            d="M 625 220 C 615 300, 500 395, 340 395 C 190 395, 95 355, 95 310"
            fill="none"
            stroke="url(#frontOrbitGrad)"
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.45"
            style={{ filter: "blur(11px)" }}
          />

          {/* Core Radiant Trail */}
          <path
            d="M 625 220 C 615 300, 500 395, 340 395 C 190 395, 95 355, 95 310"
            fill="none"
            stroke="url(#frontOrbitGrad)"
            strokeWidth="4.5"
            strokeLinecap="round"
            filter="url(#goldBloomFront)"
          />

          {/* White-Hot Intense Core Filament */}
          <path
            d="M 590 250 C 560 325, 470 388, 340 388 C 215 388, 125 355, 110 315"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.95"
            style={{ filter: "blur(0.8px)" }}
          />

          {/* Specular Highlight Glint on Front Trail */}
          <circle cx="335" cy="388" r="4" fill="#ffffff" filter="url(#goldBloomFront)" />
          <circle cx="335" cy="388" r="2" fill="#ffffff" />
        </svg>

        {/* 7. Sparkling Stardust Glints (Distributed naturally along the orbit path) */}
        <div
          ref={sparklesGroupRef}
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none z-30"
        >
          {/* Sparkle 1: Top Right of Logo near TM */}
          <div
            className="orbit-sparkle absolute top-[16%] right-[8%] transform -translate-x-1/2 -translate-y-1/2 opacity-85"
            style={{ filter: "drop-shadow(0 0 6px #ffd700)" }}
          >
            <SparkleStar className="w-5 h-5 text-yellow-200" />
          </div>

          {/* Sparkle 2: Lower Front Swoop (Bright Accent) */}
          <div
            className="orbit-sparkle absolute bottom-[10%] left-[48%] transform -translate-x-1/2 -translate-y-1/2 opacity-95"
            style={{ filter: "drop-shadow(0 0 8px #ffd700) drop-shadow(0 0 16px #ffaa00)" }}
          >
            <SparkleStar className="w-6 h-6 text-white" />
          </div>

          {/* Sparkle 3: Lower Left Trail Entrance */}
          <div
            className="orbit-sparkle absolute bottom-[24%] left-[10%] transform -translate-x-1/2 -translate-y-1/2 opacity-75"
            style={{ filter: "drop-shadow(0 0 5px #f59e0b)" }}
          >
            <SparkleStar className="w-4 h-4 text-amber-200" />
          </div>

          {/* Sparkle 4: Top Arc Center */}
          <div
            className="orbit-sparkle absolute top-[12%] left-[44%] transform -translate-x-1/2 -translate-y-1/2 opacity-70"
            style={{ filter: "drop-shadow(0 0 5px #fef08a)" }}
          >
            <SparkleStar className="w-3.5 h-3.5 text-yellow-100" />
          </div>

          {/* Sparkle 5: Right Arc Outer Glow */}
          <div
            className="orbit-sparkle absolute top-[44%] right-[4%] transform -translate-x-1/2 -translate-y-1/2 opacity-80"
            style={{ filter: "drop-shadow(0 0 6px #ffd700)" }}
          >
            <SparkleStar className="w-4 h-4 text-amber-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
