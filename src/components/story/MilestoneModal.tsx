import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useLanguage } from "../../context/LanguageContext";
import { prefersReducedMotion } from "../../utils/motion";

export interface MilestoneItem {
  year: string;
  tag: string;
  title: string;
  desc: string;
  stat: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestones: MilestoneItem[];
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  triggerElement?: HTMLElement | null;
}

function CloseIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function ChevronLeftIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export default function MilestoneModal({
  isOpen,
  onClose,
  milestones,
  currentIndex,
  onSelectIndex,
  triggerElement,
}: MilestoneModalProps) {
  const { t } = useLanguage();
  const [isClosing, setIsClosing] = useState(false);
  const modalCardRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const activeMilestone = milestones[currentIndex] || milestones[0];
  const IconComponent = activeMilestone?.icon;

  const handleClose = useCallback(() => {
    if (isClosing) return;
    if (prefersReducedMotion()) {
      onClose();
      return;
    }
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  }, [isClosing, onClose]);

  // Handle escape key, body scroll lock, and keyboard focus trap
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus close button initially
    const focusTimer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 60);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
        return;
      }

      // Keyboard arrow navigation between milestones
      if (e.key === "ArrowLeft" && currentIndex > 0) {
        e.preventDefault();
        onSelectIndex(currentIndex - 1);
        return;
      }
      if (e.key === "ArrowRight" && currentIndex < milestones.length - 1) {
        e.preventDefault();
        onSelectIndex(currentIndex + 1);
        return;
      }

      // Focus trap
      if (e.key === "Tab" && modalCardRef.current) {
        const focusable = modalCardRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(focusTimer);

      // Restore focus to triggering card
      if (triggerElement && typeof triggerElement.focus === "function") {
        setTimeout(() => {
          triggerElement.focus();
        }, 60);
      }
    };
  }, [isOpen, handleClose, currentIndex, milestones.length, onSelectIndex, triggerElement]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-3.5 sm:p-5 md:p-6 overflow-y-auto bg-stone-950/80 backdrop-blur-sm ${
        isClosing ? "modal-backdrop-exit-anim" : "modal-backdrop-anim"
      }`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="milestone-modal-title"
    >
      {/* Modal Card Surface: Guaranteed Solid Warm Ivory (#fffdf9) with refined border & deep shadow */}
      <div
        ref={modalCardRef}
        style={{ backgroundColor: "#fffdf9" }}
        className={`relative w-full max-w-lg rounded-3xl p-5.5 sm:p-7 shadow-2xl border border-stone-200/90 my-auto max-h-[90dvh] sm:max-h-[85vh] overflow-y-auto ${
          isClosing ? "modal-card-exit-anim" : "modal-card-anim"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accessible Close Button with generous touch target */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 w-11 h-11 rounded-full bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-700 hover:text-stone-950 flex items-center justify-center transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#8a1836] z-20 shadow-xs"
          aria-label="Close milestone details"
        >
          <CloseIcon className="w-5 h-5 text-stone-700" />
        </button>

        {/* Modal Header: Badge, Phase Tag & Icon */}
        <div className="flex items-start gap-3.5 pr-14 mb-4">
          {IconComponent && (
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100/90 text-[#8a1836] flex items-center justify-center shrink-0 shadow-2xs">
              <IconComponent className="w-6 h-6" />
            </div>
          )}
          <div className="flex flex-col items-start gap-1">
            <div className="inline-flex items-center gap-2">
              <span className="font-semibold text-xs px-2.5 py-0.5 rounded-md bg-[#8a1836] text-white tracking-wide shadow-2xs">
                {activeMilestone.year}
              </span>
              <span className="text-xs font-semibold text-[#8a1836] tracking-tight">
                {activeMilestone.tag}
              </span>
            </div>
            <span className="text-[11px] text-stone-500 font-medium uppercase tracking-wider">
              CakeStory Growth Milestone
            </span>
          </div>
        </div>

        {/* Milestone Title */}
        <h3
          id="milestone-modal-title"
          className="font-display text-xl sm:text-2xl font-medium text-stone-950 leading-snug tracking-tight mb-2.5"
        >
          {activeMilestone.title}
        </h3>

        {/* Milestone Full Descriptive Text */}
        <p className="text-stone-700 text-sm sm:text-[15px] leading-relaxed font-normal mb-5">
          {activeMilestone.desc}
        </p>

        {/* Operational Benchmark Box (matching brand dark benchmark card) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-stone-900 text-white border border-stone-800 shadow-md flex items-center justify-between gap-4 mb-5">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
              {t("story.benchmark")}
            </span>
            <span className="text-xs text-rose-300 font-medium mt-0.5">
              {activeMilestone.tag}
            </span>
          </div>
          <div className="text-right">
            <span className="font-display text-xl sm:text-2xl font-medium text-amber-300">
              {activeMilestone.stat}
            </span>
          </div>
        </div>

        {/* Milestone Switcher Navigation: Prev / Next & Timeline Dots */}
        <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onSelectIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:text-[#8a1836] hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            aria-label="Previous milestone"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            <span className="hidden xs:inline">Prev</span>
          </button>

          {/* Milestone Step Pills */}
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Milestones">
            {milestones.map((m, idx) => (
              <button
                key={m.year}
                type="button"
                role="tab"
                aria-selected={idx === currentIndex}
                aria-label={`Go to ${m.year}`}
                onClick={() => onSelectIndex(idx)}
                className={`transition-all rounded-full cursor-pointer ${
                  idx === currentIndex
                    ? "w-7 h-2.5 bg-[#8a1836]"
                    : "w-2.5 h-2.5 bg-stone-300 hover:bg-stone-400"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => onSelectIndex(Math.min(milestones.length - 1, currentIndex + 1))}
            disabled={currentIndex === milestones.length - 1}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 hover:text-[#8a1836] hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            aria-label="Next milestone"
          >
            <span className="hidden xs:inline">Next</span>
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
