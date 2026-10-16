import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Ensure ScrollTrigger is registered safely in browser environments
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Checks whether user prefers reduced motion for accessibility
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * CakeStory Desserts Unified Motion Design Tokens
 * Restrained, luxury-hospitality animation presets with smooth deceleration.
 */
export const MOTION = {
  duration: {
    micro: 0.2, // 200ms
    interaction: 0.25, // 250ms
    reveal: 0.75, // 750ms - restrained section/element entrance
    section: 0.85, // 850ms - larger section reveals
    hero: 1.1, // 1100ms - hero entrance
  },
  ease: {
    default: "power2.out",
    smooth: "power3.out",
    editorial: "power3.out",
    inOut: "power2.inOut",
  },
  distance: {
    subtle: 12,
    normal: 16,
    card: 20,
  },
} as const;

/**
 * Options for safe ScrollTrigger reveals
 */
export interface ScrollRevealOptions {
  trigger?: HTMLElement | string;
  start?: string;
  end?: string;
  toggleActions?: string;
  delay?: number;
  stagger?: number;
  y?: number;
  duration?: number;
  once?: boolean;
  clearProps?: string;
}

/**
 * Standard section heading and content reveal helper
 * Configured with reliable replay behavior when scrolling back into view.
 */
export function setupScrollReveal(
  target: HTMLElement | HTMLElement[] | NodeListOf<HTMLElement> | string,
  options: ScrollRevealOptions = {}
): gsap.core.Tween | null {
  if (prefersReducedMotion()) return null;

  const {
    trigger = target as any,
    start = "top 85%",
    end = "bottom top",
    toggleActions = "play reverse play reverse",
    delay = 0,
    stagger = 0,
    y = MOTION.distance.normal,
    duration = MOTION.duration.reveal,
    once = false,
    clearProps = undefined,
  } = options;

  const toVars: gsap.TweenVars = {
    opacity: 1,
    y: 0,
    duration,
    delay,
    stagger,
    ease: MOTION.ease.default,
    scrollTrigger: {
      trigger,
      start,
      end,
      toggleActions: once ? "play none none none" : toggleActions,
      once,
    },
  };

  if (clearProps) {
    toVars.clearProps = clearProps;
  }

  return gsap.fromTo(
    target,
    { opacity: 0, y },
    toVars
  );
}

/**
 * Safely parse localized numbers into numeric value and formatting strings
 * E.g., "12+" -> { num: 12, prefix: "", suffix: "+" }
 * "50,000+" -> { num: 50000, prefix: "", suffix: "+" }
 * "100%" -> { num: 100, prefix: "", suffix: "%" }
 * "0" -> { num: 0, prefix: "", suffix: "" }
 * "१२+" -> Marathi numbers handled appropriately
 */
export function parseStatValue(valStr: string): {
  target: number;
  prefix: string;
  suffix: string;
  isMarathi: boolean;
} {
  // Convert Marathi digits to English digits for math calculation
  const marathiDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
  let isMarathi = false;
  let normalized = valStr;

  for (let i = 0; i < 10; i++) {
    if (normalized.includes(marathiDigits[i])) {
      isMarathi = true;
      normalized = normalized.split(marathiDigits[i]).join(String(i));
    }
  }

  // Remove commas for clean float/int extraction
  const cleanStr = normalized.replace(/,/g, "");
  const match = cleanStr.match(/([^\d]*)([\d]+(?:\.[\d]+)?)(.*)/);

  if (!match) {
    return { target: 0, prefix: "", suffix: valStr, isMarathi };
  }

  const prefix = match[1] || "";
  const target = parseFloat(match[2]) || 0;
  const suffix = match[3] || "";

  return { target, prefix, suffix, isMarathi };
}

/**
 * Format numbers back to string, preserving commas and Marathi numerals if applicable
 */
export function formatStatValue(
  num: number,
  prefix: string,
  suffix: string,
  isMarathi: boolean
): string {
  const rounded = Math.round(num);
  let formatted = rounded.toLocaleString("en-IN");

  if (isMarathi) {
    const marathiDigits = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
    formatted = formatted.replace(/\d/g, (d) => marathiDigits[parseInt(d, 10)]);
  }

  return `${prefix}${formatted}${suffix}`;
}

/**
 * Animate numbers counting up on scroll with ScrollTrigger.
 * Includes smooth replay and resets cleanly when scrolled away.
 */
export function setupCounterAnimation(
  element: HTMLElement,
  rawVal: string,
  options: {
    trigger?: HTMLElement;
    duration?: number;
    delay?: number;
    start?: string;
  } = {}
): () => void {
  const { target, prefix, suffix, isMarathi } = parseStatValue(rawVal);

  // If reduced motion or target is 0, show immediately
  if (prefersReducedMotion() || target === 0) {
    element.textContent = rawVal;
    return () => {};
  }

  // Initialize element to zero representation before entrance to avoid abrupt text jump
  element.textContent = formatStatValue(0, prefix, suffix, isMarathi);

  const duration = options.duration ?? 1.3;
  const trigger = options.trigger ?? element;
  const counterObj = { val: 0 };

  const tween = gsap.to(counterObj, {
    val: target,
    duration,
    delay: options.delay ?? 0,
    ease: "power2.out",
    scrollTrigger: {
      trigger,
      start: options.start ?? "top 88%",
      end: "bottom top",
      toggleActions: "play reverse play reverse",
    },
    onUpdate: () => {
      element.textContent = formatStatValue(counterObj.val, prefix, suffix, isMarathi);
    },
    onComplete: () => {
      // Ensure exact final text representation matches rawVal
      element.textContent = rawVal;
    },
    onReverseComplete: () => {
      element.textContent = formatStatValue(0, prefix, suffix, isMarathi);
    },
  });

  return () => {
    tween.kill();
  };
}
