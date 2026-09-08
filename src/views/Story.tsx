import React, { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PageShell from "../components/layout/PageShell";

import StoryHero from "../components/story/StoryHero";
import StoryIntro from "../components/story/StoryIntro";
import ProcessStory from "../components/story/ProcessStory";
import QualitySection from "../components/story/QualitySection";
import BrandValues from "../components/story/BrandValues";
import HumanTouch from "../components/story/HumanTouch";
import StoryTimeline from "../components/story/StoryTimeline";
import BakeryToBusiness from "../components/story/BakeryToBusiness";
import PuneConnectionMap from "../components/story/PuneConnectionMap";
import StoryVision from "../components/story/StoryVision";
import StoryCTA from "../components/story/StoryCTA";

gsap.registerPlugin(ScrollTrigger);

export default function Story() {
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect reduced motion accessibility
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (!containerRef.current) return;

      // 1. Hero Entrance Animation with clearProps safety and element existence check
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

      const animateTarget = (selector: string, fromVars: gsap.TweenVars, toVars: gsap.TweenVars, position?: string) => {
        if (containerRef.current && containerRef.current.querySelector(selector)) {
          heroTl.fromTo(selector, fromVars, toVars, position);
        }
      };

      animateTarget(".story-hero-badge", { opacity: 0, y: -15 }, { opacity: 1, y: 0, duration: 0.6, clearProps: "opacity,transform" });
      animateTarget(".story-hero-title", { opacity: 0, y: 25, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.85, clearProps: "opacity,transform" }, "-=0.4");
      animateTarget(".story-hero-sub", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.75, clearProps: "opacity,transform" }, "-=0.6");
      animateTarget(".story-hero-pillars", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.75, clearProps: "opacity,transform" }, "-=0.5");
      animateTarget(".story-hero-cta", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.75, clearProps: "opacity,transform" }, "-=0.5");
      animateTarget(".story-hero-visual", { opacity: 0, scale: 0.96, y: 15 }, { opacity: 1, scale: 1, y: 0, duration: 1, clearProps: "opacity,transform" }, "-=0.8");

      // 2. Safe Section Reveals (Elements remain 100% visible by default in CSS)
      const sections = gsap.utils.toArray<HTMLElement>(
        containerRef.current.querySelectorAll(".reveal-story-section")
      );

      sections.forEach((sec) => {
        gsap.fromTo(
          sec,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power2.out",
            clearProps: "opacity,transform",
            scrollTrigger: {
              trigger: sec,
              start: "top 88%",
              once: true,
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <PageShell>
      <div ref={containerRef} className="space-y-4 sm:space-y-6">
        <StoryHero />
        <StoryIntro />
        
        <ProcessStory />
        <BrandValues />
        
        <StoryTimeline />
        <StoryVision />
      </div>
    </PageShell>
  );
}
