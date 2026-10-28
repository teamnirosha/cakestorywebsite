import { useState, useEffect, useRef } from "react";
import { prefersReducedMotion } from "../../utils/motion";
import { isSupabaseConfigured, syncAllFromSupabase } from "../../services/data";

interface MilestoneStage {
  minProgress: number;
  phase: string;
  status: string;
}

const STAGES: MilestoneStage[] = [
  { minProgress: 0, phase: "PREPARING YOUR EXPERIENCE", status: "Gathering the sweetest details" },
  { minProgress: 28, phase: "SETTING THE TABLE", status: "Preparing the brand experience" },
  { minProgress: 56, phase: "ADDING FINISHING TOUCHES", status: "Bringing everything together" },
  { minProgress: 84, phase: "ALMOST READY", status: "Your CakeStory is nearly here" },
  { minProgress: 100, phase: "READY TO BEGIN", status: "Welcome to CakeStory" },
];

export default function Preloader({ onComplete }: { onComplete?: () => void }) {
  // Check if initial reveal was already completed during this session
  const [shouldShow] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return !sessionStorage.getItem("cs_initial_reveal_done");
    } catch {
      return false;
    }
  });

  const [displayProgress, setDisplayProgress] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [unmounted, setUnmounted] = useState<boolean>(!shouldShow);

  const targetProgressRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!shouldShow || unmounted) return;

    const isReduced = prefersReducedMotion();

    if (isReduced) {
      setDisplayProgress(100);
      setIsDone(true);
      try {
        sessionStorage.setItem("cs_initial_reveal_done", "true");
      } catch {
        // Ignore session storage errors
      }
      if (onComplete) onComplete();
      const t = setTimeout(() => setUnmounted(true), 100);
      return () => clearTimeout(t);
    }

    let isCancelled = false;
    let completedTasks = 0;
    const totalTasks = 4;

    const incrementMilestone = () => {
      if (isCancelled) return;
      completedTasks++;
      const fraction = completedTasks / totalTasks;
      targetProgressRef.current = Math.min(100, Math.round(fraction * 100));
    };

    // 1. Task: Font system readiness
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready
        .then(() => incrementMilestone())
        .catch(() => incrementMilestone());
    } else {
      setTimeout(incrementMilestone, 150);
    }

    // 2. Task: Essential CakeStory logo asset decoded
    const logoImg = new Image();
    logoImg.src = "/assets/logo/cs-final-logo.png";
    if (logoImg.decode) {
      logoImg.decode()
        .then(() => incrementMilestone())
        .catch(() => incrementMilestone());
    } else {
      logoImg.onload = () => incrementMilestone();
      logoImg.onerror = () => incrementMilestone();
    }

    // 3. Task: Above-the-fold storefront hero background visual
    const heroImg = new Image();
    heroImg.src = "/assets/kitchen-production-B80EBNdo.jpg";
    if (heroImg.decode) {
      heroImg.decode()
        .then(() => incrementMilestone())
        .catch(() => incrementMilestone());
    } else {
      heroImg.onload = () => incrementMilestone();
      heroImg.onerror = () => incrementMilestone();
    }

    // 4. Task: Initial Supabase cloud catalog & outlet synchronization
    if (isSupabaseConfigured()) {
      syncAllFromSupabase()
        .then(() => incrementMilestone())
        .catch(() => incrementMilestone());
    } else {
      setTimeout(incrementMilestone, 100);
    }

    // Global safety failsafe: Guarantee 100% completion in max 2.5s
    const failsafeTimer = setTimeout(() => {
      targetProgressRef.current = 100;
    }, 2500);

    // Initial natural ramp to ensure silky visual transition
    const naturalRamp = setTimeout(() => {
      if (targetProgressRef.current < 25) {
        targetProgressRef.current = 28;
      }
    }, 280);

    // Smooth progress interpolation loop
    let current = 0;
    const updateProgress = () => {
      if (isCancelled) return;

      const target = targetProgressRef.current;
      if (current < target) {
        // Refined ease-out step for continuous, luxurious movement
        const step = Math.max(0.6, (target - current) * 0.14);
        current = Math.min(target, current + step);
        setDisplayProgress(current);
      }

      if (current >= 100) {
        // Settle briefly on 100% then trigger graceful fade out
        setTimeout(() => {
          if (isCancelled) return;
          setIsDone(true);
          try {
            sessionStorage.setItem("cs_initial_reveal_done", "true");
          } catch {
            // Ignore
          }
          if (onComplete) onComplete();

          // Wait 1.05s for CSS transition to finish before unmounting completely
          setTimeout(() => {
            if (!isCancelled) setUnmounted(true);
          }, 1050);
        }, 360);
      } else {
        animFrameRef.current = requestAnimationFrame(updateProgress);
      }
    };

    animFrameRef.current = requestAnimationFrame(updateProgress);

    return () => {
      isCancelled = true;
      clearTimeout(failsafeTimer);
      clearTimeout(naturalRamp);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [shouldShow, unmounted, onComplete]);

  if (!shouldShow || unmounted) {
    return null;
  }

  // Determine current phase and status text based on progress
  const activeStage = [...STAGES].reverse().find((s) => displayProgress >= s.minProgress) || STAGES[0];

  return (
    <div
      id="cakestory-loader"
      className={`cs-loader-overlay ${isDone ? "done" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading CakeStory Desserts"
      aria-hidden={isDone}
    >
      {/* Decorative Peripheral Ornaments */}
      <div className="cs-loader-ornament cs-loader-ornament-a" aria-hidden="true" />
      <div className="cs-loader-ornament cs-loader-ornament-b" aria-hidden="true" />

      {/* Main Luxury Arched Card */}
      <section className="cs-loader-card">
        {/* Eyebrow */}
        <div className="cs-loader-eyebrow">A LITTLE SWEETNESS IS ON ITS WAY</div>

        {/* Logo Orbit Showcase */}
        <div className="cs-brand-orbit">
          <div className="cs-orbit-ring" aria-hidden="true" />
          <div className="cs-orbit-ring-inner" aria-hidden="true" />
          <div className="cs-logo-halo" aria-hidden="true" />
          <img
            src="/assets/logo/cs-final-logo.png"
            alt="CakeStory Desserts"
            className="cs-loader-logo"
            width={150}
            height={125}
          />
        </div>

        {/* Heading & Supporting Copy */}
        <h1 className="cs-loader-h1">
          Every Flavour
          <br />
          Has a Story.
        </h1>

        <p className="cs-loader-copy">
          Crafting a delightful experience for you.
          <br />
          Just a moment while we prepare everything.
        </p>

        {/* Progress Indicator */}
        <div className="cs-loader-progress">
          <div className="cs-progress-meta">
            <span id="cs-loader-phase">{activeStage.phase}</span>
            <span className="cs-progress-pct" id="cs-loader-pct">
              {Math.floor(displayProgress)}%
            </span>
          </div>

          <div className="cs-progress-track">
            <div
              className="cs-progress-fill"
              style={{ width: `${Math.min(displayProgress, 100)}%` }}
            />
          </div>

          <div className="cs-loader-status" id="cs-loader-status">
            <span className="cs-status-dot" aria-hidden="true" />
            <span>{activeStage.status}</span>
          </div>
        </div>
      </section>

      {/* Ambient Footer */}
      <div className="cs-loader-footer">Made with care, for every celebration.</div>
    </div>
  );
}
