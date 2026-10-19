import { useState, useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { useLanguage } from "../../context/LanguageContext";
import { prefersReducedMotion, MOTION } from "../../utils/motion";
import { galleryService, GalleryReelItem, GallerySectionSettings } from "../../services/data";
import galleryBackdropImg from "../../assets/gallery-3d-backdrop.jpg";

// Handcrafted SVG Icons matching CakeStory's design language
function InstagramCameraIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" strokeWidth="2.5" />
    </svg>
  );
}

function PlaySolidIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
}

function PauseSolidIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

function VolumeUpIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function VolumeMuteIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

function ExternalArrowIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  );
}

function UsersCelebrationIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function VideoCameraIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m22 8-6 4 6 4V8Z" />
      <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
    </svg>
  );
}

function HeartIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export default function InstagramGallerySection() {
  const { language, t } = useLanguage();
  const sectionRef = useRef<HTMLElement | null>(null);
  const carouselContainerRef = useRef<HTMLDivElement | null>(null);
  const activeVideoRef = useRef<HTMLVideoElement | null>(null);

  // Dynamic Settings and Reels from galleryService
  const [settings, setSettings] = useState<GallerySectionSettings>(() => galleryService.getSettings());
  const [reels, setReels] = useState<GalleryReelItem[]>(() => galleryService.listReels());

  // Listen for admin changes via live custom event
  useEffect(() => {
    const handleGalleryUpdate = () => {
      setSettings(galleryService.getSettings());
      setReels(galleryService.listReels());
    };
    window.addEventListener("cakestory:gallery_updated", handleGalleryUpdate);
    return () => window.removeEventListener("cakestory:gallery_updated", handleGalleryUpdate);
  }, []);

  // Carousel Active Index
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Playback & Sound State (starts false until user scrolls to gallery section)
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [currentTimeFormatted, setCurrentTimeFormatted] = useState<string>("0:00");
  const [durationFormatted, setDurationFormatted] = useState<string>("");
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);

  // Auto-hide controls & meta overlay during active playback (disappears after 2.5s, reveals on hover)
  const [isOverlayVisible, setIsOverlayVisible] = useState<boolean>(true);
  const overlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startOverlayHideTimer = useCallback((delay = 2500) => {
    if (overlayTimerRef.current) {
      clearTimeout(overlayTimerRef.current);
    }
    overlayTimerRef.current = setTimeout(() => {
      setIsOverlayVisible(false);
    }, delay);
  }, []);

  const resetOverlayTimer = useCallback(() => {
    setIsOverlayVisible(true);
    if (isPlaying) {
      startOverlayHideTimer(2500);
    }
  }, [isPlaying, startOverlayHideTimer]);

  useEffect(() => {
    if (isPlaying) {
      setIsOverlayVisible(true);
      startOverlayHideTimer(2500);
    } else {
      if (overlayTimerRef.current) {
        clearTimeout(overlayTimerRef.current);
      }
      setIsOverlayVisible(true);
    }
    return () => {
      if (overlayTimerRef.current) {
        clearTimeout(overlayTimerRef.current);
      }
    };
  }, [isPlaying, activeIndex, startOverlayHideTimer]);

  // Stop video when user scrolls to other sections; auto-play when entering gallery section
  const wasIntersectingRef = useRef<boolean>(false);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const video = activeVideoRef.current;
        const isSufficientlyVisible = entry.isIntersecting && entry.intersectionRatio >= 0.2;

        if (isSufficientlyVisible && !wasIntersectingRef.current) {
          // Entering gallery section from elsewhere: auto-play
          setIsPlaying(true);
          if (video && video.paused) {
            video.play().catch(() => {});
          }
          wasIntersectingRef.current = true;
        } else if (!isSufficientlyVisible && wasIntersectingRef.current) {
          // Leaving gallery section to other sections: auto-stop
          setIsPlaying(false);
          if (video && !video.paused) {
            video.pause();
          }
          wasIntersectingRef.current = false;
        }
      },
      {
        threshold: [0, 0.2, 0.5], // Triggers cleanly on scroll entry and exit
      }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // Responsive Viewport Width
  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 1280
  );

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Touch Gesture tracking
  const touchStartXRef = useRef<number>(0);
  const touchEndXRef = useRef<number>(0);

  const total = reels.length;

  // Safe navigation handlers
  const handlePrev = useCallback(() => {
    if (total === 0) return;
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
  }, [total]);

  const handleNext = useCallback(() => {
    if (total === 0) return;
    setActiveIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
  }, [total]);

  // Dedicated single-click instant play/pause toggle
  const togglePlayPause = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const video = activeVideoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().catch(() => {
        video.muted = true;
        video.play().catch(() => { });
      });
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
    resetOverlayTimer();
  }, [resetOverlayTimer]);

  // Card click: focus card or toggle play
  const handleCardClick = useCallback((index: number) => {
    if (index === activeIndex) {
      togglePlayPause();
    } else {
      setActiveIndex(index);
      setIsPlaying(true);
      resetOverlayTimer();
    }
  }, [activeIndex, togglePlayPause, resetOverlayTimer]);

  // Interactive Video Scrubber: Single-click seek + smooth drag forward & backward
  const isDraggingScrubberRef = useRef<boolean>(false);

  const seekToPosition = useCallback((clientX: number, scrubberElement: HTMLElement) => {
    const video = activeVideoRef.current;
    if (!video || !video.duration || isNaN(video.duration)) return;
    const rect = scrubberElement.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = clickX / rect.width;
    const targetTime = percentage * video.duration;

    video.currentTime = targetTime;
    setCurrentTimeFormatted(formatTime(targetTime));
    setPlaybackProgress(percentage * 100);
    resetOverlayTimer();
  }, [resetOverlayTimer]);

  const handleScrubberSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    seekToPosition(e.clientX, e.currentTarget);
  }, [seekToPosition]);

  const handleScrubberPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    isDraggingScrubberRef.current = true;
    seekToPosition(e.clientX, target);

    const onPointerMove = (moveEvent: PointerEvent) => {
      if (!isDraggingScrubberRef.current) return;
      seekToPosition(moveEvent.clientX, target);
    };

    const onPointerUp = (upEvent: PointerEvent) => {
      isDraggingScrubberRef.current = false;
      try {
        target.releasePointerCapture(upEvent.pointerId);
      } catch { }
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  }, [seekToPosition]);

  // Synchronize Active Video Element Playback
  useEffect(() => {
    const video = activeVideoRef.current;
    if (!video) return;

    video.muted = isMuted;

    if (isPlaying) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser policy blocks sound autoplay, enforce mute
          video.muted = true;
          video.play().catch(() => { });
        });
      }
    } else {
      video.pause();
    }
  }, [activeIndex, isPlaying, isMuted]);

  // Track video time and progress
  const handleTimeUpdate = () => {
    const video = activeVideoRef.current;
    if (!video) return;
    const cur = video.currentTime;
    const dur = video.duration || 1;
    setCurrentTimeFormatted(formatTime(cur));
    setPlaybackProgress((cur / dur) * 100);
    if (!durationFormatted && video.duration && !isNaN(video.duration)) {
      setDurationFormatted(formatTime(video.duration));
    }
  };

  const handleLoadedMetadata = () => {
    const video = activeVideoRef.current;
    if (!video || !video.duration || isNaN(video.duration)) return;
    setDurationFormatted(formatTime(video.duration));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "m" || e.key === "M") {
        setIsMuted((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const deltaX = touchStartXRef.current - touchEndXRef.current;
    const swipeThreshold = 45;
    if (deltaX > swipeThreshold) {
      handleNext();
    } else if (deltaX < -swipeThreshold) {
      handlePrev();
    }
  };

  // GSAP Entrance Animation
  useEffect(() => {
    if (prefersReducedMotion() || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const headerElements = sectionRef.current?.querySelectorAll(".gallery-header-node");
      if (headerElements && headerElements.length > 0) {
        gsap.fromTo(
          headerElements,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.08,
            ease: MOTION.ease.default,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        );
      }

      const stage = carouselContainerRef.current;
      if (stage) {
        gsap.fromTo(
          stage,
          { opacity: 0, scale: 0.96, y: 28 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.85,
            ease: MOTION.ease.smooth,
            scrollTrigger: {
              trigger: stage,
              start: "top 88%",
              toggleActions: "play none none none",
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Editorial supporting highlights
  const supportingHighlights = [
    { id: "hl-1", icon: InstagramCameraIcon, text: t("gallery.highlight1", "Daily Fresh Creations") },
    { id: "hl-2", icon: UsersCelebrationIcon, text: t("gallery.highlight2", "Real Customer Celebrations") },
    { id: "hl-3", icon: VideoCameraIcon, text: t("gallery.highlight3", "Behind The Scenes Moments") },
    { id: "hl-4", icon: HeartIcon, text: t("gallery.highlight4", "A Growing CakeStory Family") },
  ];

  // If admin disables Gallery section, safely unmount so surrounding sections remain intact
  if (settings.enabled === false) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      id="gallery"
      aria-label="CakeStory Desserts Sweet Scenes Reel Gallery"
      className="relative pt-24 sm:pt-32 lg:pt-36 pb-16 sm:pb-24 bg-[#faf6f0] text-stone-900 border-t border-[#eedfcb]/70 overflow-hidden select-none scroll-mt-24 sm:scroll-mt-28"
    >
      {/* High-Resolution 3D Patisserie Interior Backdrop with ambient lighting & reflections */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0" aria-hidden="true">
        <img
          src={galleryBackdropImg}
          alt=""
          className="w-full h-full object-cover object-[center_35%] filter blur-[8px] scale-110 opacity-85 transition-opacity duration-1000"
        />
        {/* Luxury Seamless Top & Bottom Vignettes preserving full 3D salon depth & lighting */}
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#faf6f0] via-[#faf6f0]/75 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#faf6f0] via-[#faf6f0]/75 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,248,238,0.3)_0%,_transparent_75%)]" />
        <div className="absolute top-1/4 -left-10 w-72 h-72 rounded-full bg-rose-200/20 blur-3xl" />
        <div className="absolute top-1/3 -right-10 w-72 h-72 rounded-full bg-amber-200/20 blur-3xl" />
      </div>

      {/* 1. Centered Editorial Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative w-full max-w-4xl mx-auto mb-8 sm:mb-12">

          {/* Soft Luminous Backing Aura for crystal-clear readability against backdrop */}
          <div className="absolute inset-0 -inset-x-8 -inset-y-6 sm:-inset-x-12 sm:-inset-y-8 bg-[radial-gradient(ellipse_at_center,_rgba(255,250,244,0.92)_0%,_rgba(255,250,244,0.72)_48%,_transparent_78%)] pointer-events-none rounded-full blur-xl -z-10" />

          {/* Centered Heading & Subtitle Block */}
          <div className="text-center mx-auto px-2 relative z-10">
            {/* Eyebrow Badge - Centered on its own dedicated row with active effects */}
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="gallery-header-node group inline-flex items-center gap-2.5 px-4.5 py-1.5 rounded-full bg-white/95 hover:bg-white backdrop-blur-md border border-[#e8d5c4] hover:border-[#b51f50]/40 shadow-xs hover:shadow-[0_4px_16px_rgba(181,31,80,0.18)] hover:-translate-y-0.5 transition-all duration-300 text-xs font-semibold tracking-[0.22em] uppercase text-[#8c2243] cursor-default select-none">
                {/* Active Pulsing Instagram Dot Indicator */}
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e1306c] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af]" />
                </span>
                <span className="transition-colors">{language === "mr" && settings.eyebrowMarathi ? settings.eyebrowMarathi : settings.eyebrow}</span>
              </div>
            </div>

            {/* Main Heading */}
            <div className="relative inline-block mx-auto max-w-full">
              <h2 className="gallery-header-node font-display text-3xl sm:text-4xl md:text-[42px] lg:text-[46px] font-medium text-[#2d0e1b] leading-[1.18] tracking-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                {language === "mr" && settings.headingMarathi ? settings.headingMarathi : settings.heading}
              </h2>
            </div>

            {/* Subtitle */}
            <p className="gallery-header-node mt-3 text-sm sm:text-base md:text-lg text-[#5a434c] leading-relaxed max-w-2xl mx-auto font-normal drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
              {language === "mr" && settings.subtitleMarathi ? settings.subtitleMarathi : settings.subtitle}
            </p>

            {/* Action Strip: Sleek Centered Instagram Follow Button (Audio mute button removed as requested) */}
            <div className="gallery-header-node mt-6 sm:mt-7 flex items-center justify-center">
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-[#361220] hover:bg-stone-900 text-white shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-xs sm:text-[13px] font-semibold tracking-wide group"
                title="Open verified CakeStory Desserts Instagram Profile (@cakestorydesserts)"
              >
                <div className="w-5 h-5 rounded-full bg-[#f5d59a]/20 flex items-center justify-center text-[#f5d59a] group-hover:bg-[#f5d59a]/30 transition-colors">
                  <InstagramCameraIcon className="w-3.5 h-3.5" />
                </div>
                <span>{settings.ctaLabel || t("gallery.followBtn", "Follow Us on Instagram")}</span>
                <ExternalArrowIcon className="w-3 h-3 text-white/70 group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Full-Width Panoramic Reels Stage according to device */}
      <div className="w-full relative z-10 overflow-hidden">
        {/* Empty State Fallback */}
        {reels.length === 0 ? (
          <div className="py-20 text-center bg-white/70 backdrop-blur-md rounded-3xl border border-[#e8d5c4] max-w-lg mx-auto">
            <InstagramCameraIcon className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <p className="text-base font-medium text-stone-800">No reels added yet.</p>
          </div>
        ) : (
          <div
            ref={carouselContainerRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative w-full py-2 sm:py-6 flex flex-col items-center justify-center overflow-visible"
            style={{ perspective: "1300px" }}
          >


            {/* Horizontal Stage Wrapper - Full Device Width Spreading */}
            <div
              className="relative w-full h-[500px] sm:h-[560px] lg:h-[620px] flex items-center justify-center transition-transform duration-500 ease-out"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {reels.map((reel, idx) => {
                let offset = idx - activeIndex;
                if (total > 0) {
                  while (offset > Math.floor(total / 2)) offset -= total;
                  while (offset < -Math.floor((total - 1) / 2)) offset += total;
                }

                const isActive = offset === 0;
                const isAbs = Math.abs(offset);

                if (isAbs > (viewportWidth >= 1280 ? 3 : 2)) return null;

                const isMobile = viewportWidth < 768;
                const isTablet = viewportWidth >= 768 && viewportWidth < 1024;

                let translateX = 0;
                let scale = 1;
                let blur = 0;
                let opacity = 1;
                let zIndex = 30;

                // Luxury forward-facing cards: No rotateY tilt distortion!
                // Uses optical scale hierarchy and depth-of-field lens blur for ultra-premium aesthetic
                if (isMobile) {
                  if (isActive) {
                    translateX = 0;
                    scale = 1.04;
                    blur = 0;
                    opacity = 1;
                    zIndex = 30;
                  } else if (isAbs === 1) {
                    translateX = offset * (viewportWidth > 420 ? 190 : 175);
                    scale = 0.85;
                    blur = 2;
                    opacity = 0.7;
                    zIndex = 15;
                  } else {
                    opacity = 0;
                    zIndex = 0;
                  }
                } else if (isTablet) {
                  if (isActive) {
                    translateX = 0;
                    scale = 1.08;
                    blur = 0;
                    opacity = 1;
                    zIndex = 30;
                  } else if (isAbs === 1) {
                    translateX = offset * 215;
                    scale = 0.86;
                    blur = 1.5;
                    opacity = 0.88;
                    zIndex = 20;
                  } else if (isAbs === 2) {
                    translateX = offset * 185;
                    scale = 0.74;
                    blur = 3.5;
                    opacity = 0.65;
                    zIndex = 10;
                  }
                } else {
                  // Desktop & Wide Screens - Full Width Panoramic Fan without tilt
                  const baseSpread = viewportWidth >= 1600 ? 300 : viewportWidth >= 1366 ? 265 : 235;
                  if (isActive) {
                    translateX = 0;
                    scale = 1.12;
                    blur = 0;
                    opacity = 1;
                    zIndex = 35;
                  } else if (isAbs === 1) {
                    translateX = offset * baseSpread;
                    scale = 0.88;
                    blur = 1.2;
                    opacity = 0.88;
                    zIndex = 20;
                  } else if (isAbs === 2) {
                    translateX = offset * (baseSpread * 0.92);
                    scale = 0.74;
                    blur = 3.2;
                    opacity = 0.68;
                    zIndex = 10;
                  } else if (isAbs === 3) {
                    translateX = offset * (baseSpread * 0.85);
                    scale = 0.62;
                    blur = 4.8;
                    opacity = 0.48;
                    zIndex = 5;
                  }
                }

                const isReduced = prefersReducedMotion();
                const computedTransform = `translateX(${translateX}px) scale(${scale})`;
                const computedFilter = isReduced ? "none" : `blur(${blur}px)`;

                if (opacity <= 0) return null;

                const displayTitle = language === "mr" && reel.marathiTitle ? reel.marathiTitle : reel.title;
                const videoSrc = reel.videoUrl || `/videos/reels/reel-${(idx % 5) + 1}.mp4`;
                const hideActiveOverlay = isActive && isPlaying && !isOverlayVisible;

                return (
                  <div
                    key={reel.id}
                    id={isActive ? "active-reel-card" : undefined}
                    data-active={isActive ? "true" : "false"}
                    onClick={() => handleCardClick(idx)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View Reel: ${displayTitle}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleCardClick(idx);
                      }
                    }}
                    onMouseEnter={() => {
                      if (isActive) {
                        resetOverlayTimer();
                      }
                    }}
                    onMouseMove={() => {
                      if (isActive) {
                        resetOverlayTimer();
                      }
                    }}
                    onMouseLeave={() => {
                      if (isActive && isPlaying) {
                        startOverlayHideTimer(800);
                      }
                    }}
                    style={{
                      transform: computedTransform,
                      filter: computedFilter,
                      opacity,
                      zIndex,
                      WebkitBoxReflect: isActive
                        ? "below 6px linear-gradient(to bottom, transparent 65%, rgba(0, 0, 0, 0.22))"
                        : undefined,
                    }}
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[245px] sm:w-[265px] md:w-[280px] lg:w-[295px] xl:w-[310px] aspect-[9/16] rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ease-out will-change-transform group select-none ${isActive
                      ? "border-2 border-[#e6b86a] ring-4 ring-[#e6b86a]/25 shadow-[0_24px_50px_rgba(45,14,27,0.32),0_8px_20px_rgba(0,0,0,0.18)]"
                      : "border border-stone-800/40 shadow-[0_12px_32px_rgba(0,0,0,0.22)] hover:opacity-100"
                      }`}
                  >
                    {/* Media Surface / Authentic Local MP4 Video Player */}
                    <div className="relative w-full h-full overflow-hidden bg-stone-950">

                      {/* REAL HTML5 VIDEO ELEMENT (Active card plays live, side cards render first frame) */}
                      {isActive ? (
                        <video
                          ref={activeVideoRef}
                          key={`active-video-${reel.id}`}
                          src={videoSrc}
                          playsInline
                          webkit-playsinline="true"
                          loop
                          muted={isMuted}
                          preload="auto"
                          onTimeUpdate={handleTimeUpdate}
                          onLoadedMetadata={handleLoadedMetadata}
                          onCanPlay={() => {
                            if (isPlaying && activeVideoRef.current) {
                              activeVideoRef.current.play().catch(() => { });
                            }
                          }}
                          onPlay={() => setIsPlaying(true)}
                          onPause={() => setIsPlaying(false)}
                          className="w-full h-full object-cover pointer-events-none transition-transform duration-700"
                        />
                      ) : (
                        <video
                          key={`side-video-${reel.id}`}
                          src={videoSrc}
                          playsInline
                          webkit-playsinline="true"
                          muted
                          preload="metadata"
                          className="w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-700"
                        />
                      )}

                      {/* Top & Bottom Cinematic Vignette Gradients (Smoothly fades out when overlays hide) */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/60 pointer-events-none transition-opacity duration-500 ease-out ${hideActiveOverlay ? "opacity-0" : isActive ? "opacity-100" : "opacity-75"
                          }`}
                      />

                      {/* Top Bar: Instagram Logo Badge & Quick Mute Button on Active Card */}
                      <div
                        className={`absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between text-white/95 z-20 transition-all duration-500 ease-out ${isActive
                          ? hideActiveOverlay
                            ? "opacity-0 -translate-y-2 pointer-events-none"
                            : "opacity-100 translate-y-0 pointer-events-auto"
                          : "opacity-50 pointer-events-none"
                          }`}
                      >
                        <div className="w-7 h-7 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/20">
                          <InstagramCameraIcon className="w-3.5 h-3.5 text-white" />
                        </div>

                        {isActive ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsMuted(!isMuted);
                            }}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-[10.5px] font-medium text-white border border-white/20 transition-all cursor-pointer shadow-xs"
                            title={isMuted ? "Unmute audio" : "Mute audio"}
                          >
                            {isMuted ? (
                              <>
                                <VolumeMuteIcon className="w-3 h-3 text-rose-300" />
                                <span>Unmute</span>
                              </>
                            ) : (
                              <>
                                <VolumeUpIcon className="w-3 h-3 text-emerald-300 animate-pulse" />
                                <span>Sound On</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <div className="text-white/70 tracking-widest text-xs font-mono">•••</div>
                        )}
                      </div>

                      {/* Center Play Indicator Overlay: ONLY on active card when paused. NO outer circle div. Never on background cards */}
                      {isActive && !isPlaying && (
                        <div
                          id="center-play-overlay"
                          onClick={togglePlayPause}
                          className="absolute inset-0 flex items-center justify-center cursor-pointer z-30 transition-all duration-300"
                        >
                          <PlaySolidIcon className="w-10 h-10 sm:w-12 sm:h-12 ml-1 text-white/95 drop-shadow-[0_4px_18px_rgba(0,0,0,0.9)] hover:scale-110 transition-transform duration-200" />
                        </div>
                      )}

                      {/* Bottom Meta & Video Controller Strip */}
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className={`absolute bottom-3 left-3 right-3 text-white flex flex-col gap-1.5 z-20 transition-all duration-500 ease-out ${isActive
                          ? hideActiveOverlay
                            ? "opacity-0 translate-y-2 pointer-events-none"
                            : "opacity-100 translate-y-0 pointer-events-auto"
                          : "opacity-75 pointer-events-none"
                          }`}
                      >
                        {/* Title Extracted from Genuine Instagram Link */}
                        <p className="text-xs sm:text-[13px] font-semibold text-white/95 line-clamp-1 text-left leading-tight drop-shadow-sm">
                          {displayTitle}
                        </p>

                        {/* Description Extracted from Reel */}
                        <p className="text-[11px] text-white/80 line-clamp-2 text-left leading-snug drop-shadow-xs">
                          {reel.description}
                        </p>

                        {/* On Active Card: Render Live Video Player Scrubber & Time */}
                        {isActive && (
                          <div className="pt-1.5 flex flex-col gap-1.5 border-t border-white/20">

                            {/* Interactive Seekable Video Scrubber Bar: Single-click forward/backward + smooth drag */}
                            <div
                              role="slider"
                              tabIndex={0}
                              aria-label="Seek video progress"
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-valuenow={Math.round(playbackProgress)}
                              onClick={handleScrubberSeek}
                              onPointerDown={handleScrubberPointerDown}
                              className="w-full py-2 -my-1 cursor-pointer group/scrubber relative flex items-center select-none touch-none"
                            >
                              {/* Background Track */}
                              <div className="w-full h-1 group-hover/scrubber:h-2 bg-white/30 rounded-full overflow-hidden relative transition-all duration-200">
                                {/* Progress Fill */}
                                <div
                                  className="bg-gradient-to-r from-amber-400 to-rose-400 h-full rounded-full transition-[width] duration-100 ease-linear pointer-events-none"
                                  style={{ width: `${playbackProgress}%` }}
                                />
                              </div>

                              {/* Scrubber Thumb Knob (appears on hover) */}
                              <div
                                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white border border-amber-400 shadow-[0_0_10px_rgba(255,200,100,0.95)] opacity-0 group-hover/scrubber:opacity-100 transition-opacity pointer-events-none"
                                style={{ left: `calc(${playbackProgress}% - 6px)` }}
                              />
                            </div>

                            {/* Controls Bar: Play/Pause (Clean icon only, no outer circle), Live Duration & Sound Toggle */}
                            <div className="flex items-center justify-between text-[11px] text-white/90 font-mono">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  id="reel-play-pause-btn"
                                  onClick={togglePlayPause}
                                  aria-label={isPlaying ? "Pause video" : "Play video"}
                                  className="text-white hover:text-amber-300 p-0.5 transition-colors cursor-pointer focus:outline-none flex items-center justify-center active:scale-90"
                                >
                                  {isPlaying ? <PauseSolidIcon className="w-3.5 h-3.5" /> : <PlaySolidIcon className="w-3.5 h-3.5 ml-0.5" />}
                                </button>
                                <span>{currentTimeFormatted} / {durationFormatted || reel.duration || "0:24"}</span>
                              </div>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsMuted(!isMuted);
                                }}
                                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/50 hover:bg-black/70 text-white font-sans text-[10px] font-medium tracking-wide transition-colors cursor-pointer border border-white/20"
                                title={isMuted ? "Click to unmute audio" : "Click to mute audio"}
                              >
                                {isMuted ? (
                                  <>
                                    <VolumeMuteIcon className="w-3 h-3 text-rose-300" />
                                    <span>Muted</span>
                                  </>
                                ) : (
                                  <>
                                    <VolumeUpIcon className="w-3 h-3 text-emerald-300 animate-pulse" />
                                    <span>Sound On</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Subtle natural contact shadow under active card (clean, realistic, no yellow lines or blobs) */}
            <div className="w-44 sm:w-56 h-3 bg-stone-900/12 rounded-full blur-sm mx-auto -mt-1 pointer-events-none" />

            {/* Centered Pagination Indicator Bar */}
            <div className="mt-5 sm:mt-6 flex items-center justify-center z-30">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/85 border border-[#e8ded3] backdrop-blur-md shadow-xs">
                {reels.map((_, dotIdx) => {
                  const isCurrent = dotIdx === activeIndex;
                  return (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => setActiveIndex(dotIdx)}
                      aria-label={`Go to reel ${dotIdx + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${isCurrent
                        ? "w-7 bg-[#361220]"
                        : "w-2 bg-[#d9c7b8] hover:bg-[#a89098]"
                        }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Supporting Highlights Strip (4 Pillars) */}
      {settings.showHighlights !== false && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="gallery-highlights-strip mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[#eedfcb]/70">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {supportingHighlights.map((hl) => {
                const Icon = hl.icon;
                return (
                  <div
                    key={hl.id}
                    className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-white/80 hover:bg-white/95 backdrop-blur-md border border-[#e8ded3]/90 hover:border-[#e6b86a]/60 shadow-2xs hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#fbf3e8] group-hover:bg-[#361220] border border-[#ebd6be] flex items-center justify-center shrink-0 transition-colors">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#8c2243] group-hover:text-[#f5d59a] transition-colors" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-[#42242e] leading-snug">
                      {hl.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
