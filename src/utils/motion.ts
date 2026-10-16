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
    reveal: 0.55, // 550ms
    section: 0.65, // 650ms
    hero: 1.1, // 1100ms
  },
  ease: {
    default: "power2.out",
    smooth: "power3.out",
    editorial: "sine.out",
    inOut: "power2.inOut",
  },
  distance: {
    subtle: 12,
    normal: 18,
    card: 24,
  },
} as const;

/**
 * Options for safe ScrollTrigger reveals
 */
export interface ScrollRevealOptions {
  trigger?: HTMLElement | string;
  start?: string;
  delay?: number;
  stagger?: number;
  y?: number;
  duration?: number;
  once?: boolean;
  clearProps?: string;
}

/**
 * Standard section heading and content reveal helper
 * Uses fromTo with clearProps to prevent layout shifts or stuck invisible states.
 */
export function setupScrollReveal(
  target: HTMLElement | HTMLElement[] | NodeListOf<HTMLElement> | string,
  options: ScrollRevealOptions = {}
): gsap.core.Tween | null {
  if (prefersReducedMotion()) return null;

  const {
    trigger = target as any,
    start = "top 88%",
    delay = 0,
    stagger = 0,
    y = MOTION.distance.normal,
    duration = MOTION.duration.reveal,
    once = true,
    clearProps = "opacity,transform",
  } = options;

  return gsap.fromTo(
    target,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      stagger,
      ease: MOTION.ease.default,
      clearProps,
      scrollTrigger: {
        trigger,
        start,
        once,
      },
    }
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
 * Animate numbers counting up on scroll with ScrollTrigger
 */
export function setupCounterAnimation(
  element: HTMLElement,
  rawVal: string,
  options: {
    trigger?: HTMLElement;
    duration?: number;
    delay?: number;
  } = {}
): () => void {
  const { target, prefix, suffix, isMarathi } = parseStatValue(rawVal);

  // If reduced motion or target is 0, show immediately
  if (prefersReducedMotion() || target === 0) {
    element.textContent = rawVal;
    return () => {};
  }

  const duration = options.duration ?? 1.4;
  const trigger = options.trigger ?? element;
  const counterObj = { val: 0 };

  const tween = gsap.to(counterObj, {
    val: target,
    duration,
    delay: options.delay ?? 0,
    ease: "power2.out",
    scrollTrigger: {
      trigger,
      start: "top 90%",
      once: true,
    },
    onUpdate: () => {
      element.textContent = formatStatValue(counterObj.val, prefix, suffix, isMarathi);
    },
    onComplete: () => {
      // Ensure exact final text representation matches rawVal
      element.textContent = rawVal;
    },
  });

  return () => {
    tween.kill();
  };
}
