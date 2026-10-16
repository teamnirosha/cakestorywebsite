import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { franchiseService } from "../../services/data";
import { useLanguage } from "../../context/LanguageContext";

const CENTRAL_WHATSAPP_PHONE = "919823045671";

function WhatsAppIcon({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

/**
 * FloatingWhatsApp — Active, responsive, context-aware WhatsApp chat widget.
 * Features:
 * - Active radar ping and online status badge
 * - Smart vertical lifting when scrolled into footer (never obscures Team Nirosha credit)
 * - Interactive greeting tooltip
 * - Context-aware messaging for outlet pages vs. general inquiry
 */
export default function FloatingWhatsApp() {
  const { pathname } = useLocation();
  const { language } = useLanguage();
  const [isNearFooter, setIsNearFooter] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Detect current outlet if on outlet page
  const currentOutlet = useMemo(() => {
    const match = pathname.match(/\/outlets\/([^/]+)/);
    if (!match) return null;
    const slugOrId = decodeURIComponent(match[1]);
    return franchiseService.get(slugOrId) || null;
  }, [pathname]);

  // Compute clean WhatsApp destination URL
  const whatsappUrl = useMemo(() => {
    let digits = CENTRAL_WHATSAPP_PHONE;
    if (currentOutlet && currentOutlet.phone) {
      const clean = currentOutlet.phone.replace(/\D/g, "");
      if (clean.length >= 10) {
        digits = clean.startsWith("91") && clean.length === 12 ? clean : `91${clean.slice(-10)}`;
      }
    }

    const message = currentOutlet
      ? language === "mr"
        ? `नमस्कार CakeStory Desserts (${currentOutlet.outletName || currentOutlet.name}), मला ताज्या सेलिब्रेशन केकबद्दल चौकशी करायची आहे.`
        : `Hello CakeStory Desserts (${currentOutlet.outletName || currentOutlet.name}), I would like to order fresh celebration cakes.`
      : language === "mr"
      ? `नमस्कार CakeStory Desserts, मला सेलिब्रेशन केक्स आणि ऑर्डरबद्दल चौकशी करायची आहे.`
      : `Hello CakeStory Desserts, I would like to enquire about ordering fresh celebration cakes.`;

    return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
  }, [currentOutlet, language]);

  // Observe site-footer to dynamically elevate button and avoid obscuring Team Nirosha credit
  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsNearFooter(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.05,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, [pathname]);

  // Automatically tease the tooltip once on load so users see it's active
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasInteracted) {
        setIsTooltipOpen(true);
        const hideTimer = setTimeout(() => {
          setIsTooltipOpen(false);
        }, 5000);
        return () => clearTimeout(hideTimer);
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, [hasInteracted]);

  const targetTitle = currentOutlet
    ? `Order from CakeStory ${currentOutlet.outletName || currentOutlet.name}`
    : "Chat with CakeStory Desserts on WhatsApp";

  return (
    <div
      className={`fixed right-5 sm:right-7 z-50 flex flex-col items-end transition-all duration-300 ease-out pointer-events-none ${
        isNearFooter ? "bottom-24 sm:bottom-28" : "bottom-6 sm:bottom-7"
      }`}
      aria-live="polite"
    >
      {/* Interactive Tooltip Card */}
      <div
        className={`mb-2.5 pointer-events-auto transition-all duration-300 origin-bottom-right ${
          isTooltipOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-2 pointer-events-none"
        }`}
      >
        <div className="bg-white dark:bg-[#1c121e] rounded-2xl p-3.5 shadow-2xl border border-emerald-100 dark:border-white/10 text-slate-900 dark:text-white text-xs max-w-[230px] relative backdrop-blur-md">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Online • Instant Reply</span>
            </div>
            <button
              onClick={() => {
                setIsTooltipOpen(false);
                setHasInteracted(true);
              }}
              className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-xs px-1"
              aria-label="Dismiss tooltip"
            >
              ✕
            </button>
          </div>
          <p className="font-semibold text-[13px] leading-snug">
            {currentOutlet
              ? `Chat with ${currentOutlet.outletName || currentOutlet.name}`
              : "Order Fresh Celebration Cakes"}
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setHasInteracted(true)}
            className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] shadow-sm transition-colors"
          >
            <span>Start WhatsApp Chat</span>
            <span aria-hidden="true">→</span>
          </a>
          {/* Tooltip Tail */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white dark:bg-[#1c121e] border-r border-b border-emerald-100 dark:border-white/10 rotate-45" />
        </div>
      </div>

      {/* Main Floating WhatsApp Anchor Button */}
      <div className="relative group pointer-events-auto">
        {/* Subtle Radar Waves */}
        <span className="absolute -inset-1.5 rounded-full bg-emerald-400/40 animate-ping pointer-events-none" />

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setHasInteracted(true)}
          onMouseEnter={() => setIsTooltipOpen(true)}
          onMouseLeave={() => setIsTooltipOpen(false)}
          className="relative w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-gradient-to-tr from-[#1ea94e] via-[#25D366] to-[#34e77b] text-white shadow-xl shadow-emerald-950/40 hover:shadow-2xl hover:shadow-emerald-500/50 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-400/50 cursor-pointer"
          title={targetTitle}
          aria-label={targetTitle}
        >
          <WhatsAppIcon className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-xs" />

          {/* Active Status Jewel Badge */}
          <span className="absolute top-0 right-0 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-400 border-2 border-white shadow-xs" />
          </span>
        </a>
      </div>
    </div>
  );
}
