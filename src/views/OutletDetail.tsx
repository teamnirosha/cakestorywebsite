import { useEffect, useState, useRef, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PageShell from "../components/layout/PageShell";
import { franchiseService } from "../services/data";
import { useFranchiseModal } from "../components/common/FranchiseModal";
import { useLanguage } from "../context/LanguageContext";
import { prefersReducedMotion, MOTION } from "../utils/motion";

gsap.registerPlugin(ScrollTrigger);

// ---------- Animated / Active SVG Vector Icons ----------

function NavigationIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="3 11 22 2 13 21 11 13 3 11" />
    </svg>
  );
}

function PhoneIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.33C9.33 7.33 9.03 7.41 8.78 7.68C8.53 7.95 7.82 8.62 7.82 9.97C7.82 11.32 8.81 12.63 8.94 12.81C9.08 12.99 10.87 15.75 13.61 16.93C14.27 17.21 14.77 17.38 15.18 17.51C15.84 17.72 16.44 17.69 16.92 17.62C17.45 17.54 18.56 16.95 18.79 16.3C19.02 15.65 19.02 15.09 18.95 14.98C18.88 14.86 18.7 14.8 18.43 14.66C18.15 14.53 16.82 13.87 16.57 13.78C16.32 13.69 16.14 13.64 15.96 13.92C15.78 14.19 15.26 14.8 15.1 14.98C14.94 15.17 14.79 15.19 14.51 15.05C14.24 14.92 13.35 14.63 12.3 13.69C11.48 12.96 10.93 12.06 10.77 11.78C10.61 11.51 10.75 11.36 10.89 11.23C11.01 11.11 11.16 10.92 11.3 10.76C11.44 10.6 11.49 10.48 11.58 10.3C11.67 10.12 11.62 9.96 11.56 9.83C11.49 9.69 10.97 8.42 10.76 7.9C10.55 7.4 10.34 7.47 10.18 7.46C10.03 7.46 9.85 7.33 9.53 7.33Z" />
    </svg>
  );
}

function ClockIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function MapPinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function SparklesIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2L14.4 7.6L20 10L14.4 12.4L12 18L9.6 12.4L4 10L9.6 7.6L12 2Z" />
    </svg>
  );
}

// ---------- Main Outlet Detail Component ----------

export default function OutletDetail() {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const { openModal } = useFranchiseModal();
  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamic Outlet Lookup
  const outlet = id ? franchiseService.get(id) : undefined;

  // Nearby Outlets (Fetch 3 other outlets)
  const nearbyOutlets = useMemo(() => {
    if (!outlet) return [];
    return franchiseService
      .listActive()
      .filter((o) => o.id !== outlet.id)
      .slice(0, 3);
  }, [outlet?.id]);

  // Fallback Image
  const [imgSrc, setImgSrc] = useState<string>(
    outlet?.image || "/images/outlets/baner.jpg"
  );

  useEffect(() => {
    if (outlet?.image) {
      setImgSrc(outlet.image);
    } else {
      setImgSrc("/images/outlets/baner.jpg");
    }
  }, [outlet?.id, outlet?.image]);

  // Dynamic SEO Metadata
  useEffect(() => {
    if (!outlet) return;

    const displayArea = outlet.outletName || outlet.name.replace(/^CakeStory Desserts\s*—\s*/i, "");
    const baseTitle = `${t("outletDetail.bestCakesIn", "Best Cakes in")} ${displayArea}, Pune | CakeStory Desserts`;
    const metaDescription = `${outlet.description || t("outletDetail.newDesc")} ${outlet.address}. Call ${outlet.phone}.`;

    document.title = baseTitle;

    let metaTag = document.querySelector('meta[name="description"]');
    if (!metaTag) {
      metaTag = document.createElement("meta");
      metaTag.setAttribute("name", "description");
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute("content", metaDescription);

    const schemaId = "cakestory-outlet-schema";
    let scriptTag = document.getElementById(schemaId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.id = schemaId;
      scriptTag.type = "application/ld+json";
      document.head.appendChild(scriptTag);
    }

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "Bakery",
      name: outlet.name,
      image: window.location.origin + (outlet.image || "/images/outlets/baner.jpg"),
      telephone: outlet.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: outlet.address,
        addressLocality: outlet.zone || outlet.city,
        addressRegion: outlet.state || "Maharashtra",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: outlet.latitude,
        longitude: outlet.longitude,
      },
      openingHours: outlet.openingHours,
      servesCuisine: "Pure Vegetarian Bakery, Cakes, Pastries, Desserts",
      priceRange: "₹₹",
    };

    scriptTag.text = JSON.stringify(schemaData);

    return () => {
      const existingScript = document.getElementById(schemaId);
      if (existingScript) existingScript.remove();
    };
  }, [outlet, language, t]);

  // Smooth Entrance Animations with GSAP
  useEffect(() => {
    if (prefersReducedMotion() || !containerRef.current || !outlet) return;

    const ctx = gsap.context(() => {
      // 1. Hero elements entrance on initial load
      gsap.fromTo(
        ".boutique-hero-elem",
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: MOTION.ease.default,
        }
      );

      // 2. Sections down the page reveal on scroll and replay reliably
      gsap.utils.toArray<HTMLElement>(".boutique-scroll-elem").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: MOTION.ease.default,
            scrollTrigger: {
              trigger: el,
              start: "top 86%",
              end: "bottom top",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [outlet?.id]);

  // Current day index in Indian Standard Time (IST)
  const currentDayIndex = useMemo(() => {
    const now = new Date();
    const utcMs = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
    const istDate = new Date(utcMs + 5.5 * 60 * 60 * 1000);
    return istDate.getDay(); // 0 is Sunday, 1-5 is Mon-Fri, 6 is Saturday
  }, []);



  // If Outlet is not found
  if (!outlet) {
    return (
      <PageShell>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center">
          <div className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl p-10 shadow-2xl border border-slate-200 dark:border-white/10">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-5 text-3xl">
              🎂
            </div>
            <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {t("outletDetail.notFoundTitle")}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              {t("outletDetail.notFoundDesc")}
            </p>
            <Link
              to="/"
              state={{ scrollTo: "outlets" }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rose-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              ← {t("outletDetail.viewAll")}
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${outlet.latitude},${outlet.longitude}`;
  const cleanPhoneDigits = outlet.phone ? outlet.phone.replace(/\D/g, "") : "";
  const whatsappDigits = cleanPhoneDigits.startsWith("91") ? cleanPhoneDigits : `91${cleanPhoneDigits}`;
  const whatsappOrderUrl = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
    `Hello CakeStory Desserts (${outlet.outletName || outlet.name}), I would like to order fresh celebration cakes.`
  )}`;
  const franchiseWhatsappUrl = `https://wa.me/919823045671?text=${encodeURIComponent(
    `Hello CakeStory Franchise Team, I am interested in opening a franchise in ${outlet.zone || outlet.city}.`
  )}`;

  // Display location title
  const displayLocation = outlet.outletName || outlet.name.replace(/^CakeStory Desserts\s*—\s*/i, "");

  // Google Maps Embed (100% Free, Zero API Key Required)
  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${outlet.latitude},${outlet.longitude}&hl=en&z=15&output=embed`;

  return (
    <PageShell noTopPadding>
      <div
        ref={containerRef}
        className="w-full bg-[#fdfaf7] dark:bg-[#0c0810] text-slate-900 dark:text-slate-100 min-h-screen transition-colors duration-300"
      >
        {/* =========================================================
            1. SEAMLESS ROYAL HERO (ZERO GAP BELOW FLOATING NAVBAR)
        ========================================================= */}
        <section className="w-full bg-gradient-to-b from-[#1b0a1d] via-[#140716] to-[#0d040e] text-white pt-24 sm:pt-28 pb-12 sm:pb-16 relative overflow-hidden border-b border-amber-500/20 shadow-2xl">

          {/* Ambient Royal Lighting Blobs */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 -right-32 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

            {/* Direct 2-Tier Breadcrumb: Our Outlets > Current Outlet */}
            <nav
              aria-label="Breadcrumb"
              className="boutique-hero-elem flex items-center gap-2 mb-6 sm:mb-8 text-xs sm:text-sm font-medium text-rose-200/80"
            >
              <Link
                to="/"
                state={{ scrollTo: "outlets" }}
                className="hover:text-amber-300 transition-colors flex items-center gap-1.5"
              >
                <span>{t("outletDetail.ourOutlets")}</span>
              </Link>
              <span className="text-rose-400/50">&gt;</span>
              <span className="text-amber-300 font-semibold truncate max-w-[240px] sm:max-w-none">
                {displayLocation}
              </span>
            </nav>

            {/* Hero Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">

              {/* Left Column: Royal Headings, Badges, Narrative, 3 Action Buttons */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-5 boutique-hero-elem">

                {/* Official Boutique Jewel Capsule */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-amber-500/10 border border-amber-400/40 text-amber-200 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md">
                  <SparklesIcon className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span>{t("outletDetail.officialBadge")}</span>
                </div>

                {/* Stately Main Headline */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight leading-[1.12]">
                  <span className="text-white block sm:inline">
                    {language === "mr" ? "१००% शुद्ध शाकाहारी केक्स. " : "Pure Veg Cakes. "}
                  </span>
                  <span className="bg-gradient-to-r from-amber-200 via-rose-300 to-amber-300 bg-clip-text text-transparent drop-shadow-sm">
                    {language === "mr" ? "अस्सल आनंद." : "Pure Happiness."}
                  </span>
                </h1>

                {/* Dynamic Location Line - Highlighted Gracefully with Radiant Glass Capsule */}
                <div className="pt-1">
                  <div className="inline-flex items-center flex-wrap gap-2 sm:gap-2.5 px-4 py-1.5 sm:py-2 rounded-2xl sm:rounded-full bg-gradient-to-r from-white/[0.08] via-amber-400/[0.08] to-rose-500/[0.08] backdrop-blur-md border border-amber-300/35 shadow-[0_0_25px_rgba(251,191,36,0.18)]">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 text-xs shadow-xs">
                      📍
                    </span>
                    {language === "mr" ? (
                      <>
                        <span className="bg-gradient-to-r from-amber-100 via-rose-100 to-amber-200 bg-clip-text text-transparent font-medium text-sm sm:text-base lg:text-lg font-display tracking-wide">
                          {displayLocation}, {outlet.city || "पुणे"}
                        </span>
                        <span className="text-rose-100/90 font-light text-sm sm:text-base lg:text-lg font-display">
                          मधील आपला आवडता डेझर्ट स्पॉट.
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-rose-100/90 font-light text-sm sm:text-base lg:text-lg font-display">
                          Your Sweet Spot in
                        </span>
                        <span className="bg-gradient-to-r from-amber-100 via-amber-200 to-rose-200 bg-clip-text text-transparent font-medium text-sm sm:text-base lg:text-lg font-display tracking-wide">
                          {displayLocation}, {outlet.city || "Pune"}.
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Evocative Narrative */}
                <p className="text-sm sm:text-base text-rose-100/80 leading-relaxed max-w-xl font-normal">
                  {t("outletDetail.newDesc")}
                </p>

                {/* 3 Active Interactive Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5 pt-2 w-full sm:w-auto">

                  {/* Button 1: Call Store (Glowing Royal Blue / Rose) */}
                  <a
                    href={`tel:${cleanPhoneDigits}`}
                    className="group relative w-full sm:w-auto justify-center px-6 py-3.5 rounded-full bg-gradient-to-r from-[#e63971] via-[#d42d65] to-[#b31b51] hover:from-[#ff4a86] hover:to-[#c7225c] text-white font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-rose-950/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-12 transition-transform">
                      <PhoneIcon className="w-3.5 h-3.5 text-white" />
                    </span>
                    <span>{t("outletDetail.callStoreBtn")}</span>
                  </a>

                  {/* Button 2: WhatsApp Order (Emerald with Pulse) */}
                  <a
                    href={whatsappOrderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-full sm:w-auto justify-center px-6 py-3.5 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-emerald-950/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
                    </span>
                    <span>{t("outletDetail.whatsAppOrderBtn")}</span>
                  </a>

                  {/* Button 3: Get Directions (Glassmorphic Gold Outline) */}
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto justify-center px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-amber-200 border border-amber-300/40 font-bold text-sm sm:text-base flex items-center gap-2.5 hover:text-white hover:border-amber-300 transition-all cursor-pointer backdrop-blur-md"
                  >
                    <NavigationIcon className="w-4 h-4 text-amber-300" />
                    <span>{t("outletDetail.getDirectionsBtn")}</span>
                  </a>

                </div>

              </div>

              {/* Right Column: Imperial Amber-Gold Framed Boutique Photo */}
              <div className="lg:col-span-5 boutique-hero-elem">
                <div className="relative rounded-[2rem] sm:rounded-[2.5rem] border-3 sm:border-4 border-amber-400/90 shadow-2xl shadow-rose-950/60 overflow-hidden aspect-[16/10] sm:aspect-[4/3] bg-stone-900 group">
                  <img
                    src={imgSrc}
                    alt={`CakeStory Desserts ${displayLocation}`}
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-108"
                  />

                  {/* Shimmer Highlight Line */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-white/10 pointer-events-none" />

                  {/* Interactive Location Badge in Bottom-Left */}
                  <div className="absolute bottom-4 left-4 px-4 py-2 rounded-full bg-black/75 backdrop-blur-md text-amber-200 text-xs font-bold border border-amber-400/30 shadow-lg flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-white">📍 {displayLocation}, {outlet.city || "Pune"}</span>
                  </div>

                  {/* Pure Veg Emblem in Top-Right */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-400/40 text-emerald-300 text-[11px] font-bold flex items-center gap-1.5 shadow-md">
                    <span>🌱</span>
                    <span>100% Pure Veg</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================
        {/* =========================================================
            2. STORE LOCATION, TIMINGS & INTERACTIVE MAP (FULL WIDTH)
        ========================================================= */}
        <section className="w-full py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-[#150d18] rounded-[2.5rem] p-6 sm:p-10 lg:p-12 shadow-2xl border border-rose-100/80 dark:border-white/10 boutique-scroll-elem">

              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 mb-8 border-b border-rose-100/60 dark:border-white/10">
                <div>
                  <span className="text-xs font-bold text-[#e63971] uppercase tracking-wider block mb-1">
                    {t("outletDetail.visitUsTag")}
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black font-display text-slate-900 dark:text-white">
                    {t("outletDetail.storeLocationTimings")}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
                    Experience handcrafted 100% pure vegetarian celebration cakes, fresh desserts, and counter specials daily at CakeStory {displayLocation}.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <a
                    href={`tel:${cleanPhoneDigits}`}
                    className="px-5 py-2.5 rounded-full bg-rose-50 hover:bg-rose-100 dark:bg-white/10 dark:hover:bg-white/15 text-[#e63971] dark:text-rose-300 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-2xs"
                  >
                    <PhoneIcon className="w-4 h-4" />
                    <span>{outlet.phone}</span>
                  </a>
                </div>
              </div>

              {/* 2-Column Full Width Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">

                {/* Left Column (5 Cols): Address, Timings, Services */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-6">

                  {/* Address Card */}
                  <div className="p-5 rounded-2xl bg-rose-50/40 dark:bg-white/5 border border-rose-100 dark:border-white/10 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#e63971]/10 text-[#e63971] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                        <MapPinIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">
                          {t("outletDetail.addressLocality")}
                        </div>
                        <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-snug">
                          {outlet.address}, {outlet.city}, {outlet.state}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <a
                        href={directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#e63971] to-[#b31b51] hover:from-[#f0477e] hover:to-[#c7225c] text-white text-xs font-bold shadow-md shadow-rose-950/20 hover:scale-102 active:scale-98 transition-all cursor-pointer"
                      >
                        <NavigationIcon className="w-3.5 h-3.5 text-white" />
                        <span>{t("outletDetail.getDirectionsMaps")}</span>
                      </a>
                      <a
                        href={whatsappOrderUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-950/20 transition-all cursor-pointer"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5 text-white" />
                        <span>{t("outletDetail.whatsAppOrderBtn")}</span>
                      </a>
                    </div>
                  </div>

                  {/* Timings Table */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-rose-100/80 dark:border-white/10 space-y-3 shadow-2xs">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      <ClockIcon className="w-4 h-4 text-[#e63971]" />
                      <span>{t("outletDetail.operatingTimings")}</span>
                    </div>

                    <div className="space-y-2 text-xs sm:text-sm">
                      {/* Mon - Fri */}
                      <div
                        className={`flex justify-between items-center py-2 px-3 rounded-xl transition-colors ${currentDayIndex >= 1 && currentDayIndex <= 5
                            ? "bg-[#e63971]/10 text-[#e63971] font-bold border border-[#e63971]/20"
                            : "text-slate-700 dark:text-slate-300"
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{t("outletDetail.mondayToFriday")}</span>
                          {currentDayIndex >= 1 && currentDayIndex <= 5 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e63971] text-white">
                              {t("outletDetail.today")}
                            </span>
                          )}
                        </div>
                        <span className="font-bold">{outlet.openingHours}</span>
                      </div>

                      {/* Saturday */}
                      <div
                        className={`flex justify-between items-center py-2 px-3 rounded-xl transition-colors ${currentDayIndex === 6
                            ? "bg-[#e63971]/10 text-[#e63971] font-bold border border-[#e63971]/20"
                            : "text-slate-700 dark:text-slate-300"
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{t("outletDetail.saturday")}</span>
                          {currentDayIndex === 6 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e63971] text-white">
                              {t("outletDetail.today")}
                            </span>
                          )}
                        </div>
                        <span className="font-bold">{outlet.openingHours}</span>
                      </div>

                      {/* Sunday */}
                      <div
                        className={`flex justify-between items-center py-2 px-3 rounded-xl transition-colors ${currentDayIndex === 0
                            ? "bg-[#e63971]/10 text-[#e63971] font-bold border border-[#e63971]/20"
                            : "text-slate-700 dark:text-slate-300"
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{t("outletDetail.sunday")}</span>
                          {currentDayIndex === 0 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#e63971] text-white">
                              {t("outletDetail.today")}
                            </span>
                          )}
                        </div>
                        <span className="font-bold">{outlet.openingHours}</span>
                      </div>
                    </div>
                  </div>

                  {/* Store Capabilities / Services */}
                  {outlet.services && outlet.services.length > 0 && (
                    <div className="pt-2">
                      <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5">
                        {t("outletDetail.capabilitiesHeading")}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {outlet.services.map((service) => (
                          <span
                            key={service}
                            className="px-3 py-1 rounded-full bg-rose-50/80 dark:bg-white/5 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-rose-100 dark:border-white/10 shadow-2xs"
                          >
                            ✓ {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* Right Column (7 Cols): Expansive Full-Height Interactive Map */}
                <div className="lg:col-span-7 flex flex-col">
                  <div className="relative w-full h-[360px] sm:h-[420px] lg:h-full min-h-[420px] rounded-3xl overflow-hidden border border-rose-100 dark:border-white/10 shadow-lg group">
                    <iframe
                      title={`Google Map - CakeStory ${displayLocation}`}
                      src={googleMapsEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full"
                    />

                    {/* Floating Map Pin Glass Badge */}
                    <div className="absolute bottom-4 left-4 right-4 sm:right-auto px-4 py-2.5 rounded-2xl bg-white/95 dark:bg-[#180e1c]/95 backdrop-blur-md border border-rose-100/80 dark:border-white/15 shadow-xl flex items-center justify-between sm:justify-start gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#e63971] animate-ping" />
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          📍 {displayLocation}, {outlet.city || "Pune"}
                        </span>
                      </div>
                      <a
                        href={directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-[#e63971] hover:underline cursor-pointer"
                      >
                        Navigate →
                      </a>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* =========================================================
            3. NEARBY OUTLETS SHOWCASE (ATMOSPHERIC SECTION WITH BACKGROUND)
        ========================================================= */}
        <section className="relative w-full py-20 sm:py-24 text-white overflow-hidden">

          {/* Atmospheric Contextual Storefront Background with Rich Plum Overlays */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/cakestory-storefront-hero.jpg"
              alt="CakeStory Boutiques Across Pune"
              className="w-full h-full object-cover object-center filter brightness-[0.20] saturate-[1.25] scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#130616] via-[#1a081e]/90 to-[#100312]" />
            <div className="absolute inset-0 bg-radial from-rose-950/20 via-transparent to-black/60 pointer-events-none" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

            {/* Elevated Section Header */}
            <div className="boutique-scroll-elem mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-1">
                  {t("outletDetail.moreLocations")}
                </span>
                <h2 className="text-2xl sm:text-4xl font-black font-display text-white">
                  {t("outletDetail.nearbyHeading")} 
                </h2>
                <p className="text-xs sm:text-sm text-rose-100/75 mt-1 max-w-xl">
                  {t("outletDetail.nearSubtext")}
                </p>
              </div>

              <Link
                to="/"
                state={{ scrollTo: "outlets" }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs sm:text-sm transition-all self-start sm:self-auto shrink-0 shadow-lg hover:border-amber-300/40"
              >
                <span>{t("outletDetail.allPuneOutlets", "View All Pune Outlets")}</span>
                <span>→</span>
              </Link>
            </div>

            {/* 3 Frosted Glass Boutique Cards (No Images Inside Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 boutique-scroll-elem">
              {nearbyOutlets.map((nearby) => {
                const nearbyDisplay = nearby.outletName || nearby.name.replace(/^CakeStory Desserts\s*—\s*/i, "");
                return (
                  <div
                    key={nearby.id}
                    className="p-6 sm:p-7 rounded-3xl bg-white/[0.07] hover:bg-white/[0.12] backdrop-blur-xl border border-white/15 hover:border-amber-300/40 shadow-2xl transition-all duration-300 group flex flex-col justify-between"
                  >
                    <div>
                      {/* Zone & Status Badges */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="px-3 py-1 rounded-full bg-white/10 text-rose-200 text-xs font-bold border border-white/15">
                          📍 {nearby.zone || nearby.city || "Pune"}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>{t("outletDetail.openToday", "Open Today")}</span>
                        </span>
                      </div>

                      {/* Outlet Name */}
                      <h3 className="text-xl sm:text-2xl font-bold font-display text-white group-hover:text-amber-300 transition-colors mb-2.5">
                        CakeStory {nearbyDisplay}
                      </h3>

                      {/* Address */}
                      <p className="text-xs sm:text-sm text-rose-100/75 leading-relaxed mb-6 line-clamp-2">
                        {nearby.address}
                      </p>

                      {/* Quick Details */}
                      <div className="space-y-2 mb-6 text-xs text-rose-200/90 font-medium">
                        <div className="flex items-center gap-2">
                          <span className="text-amber-300">🕒</span>
                          <span>{nearby.openingHours || "10:00 AM – 11:30 PM"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400">🌱</span>
                          <span>100% Pure Veg & Eggless</span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Explore Link */}
                    <Link
                      to={`/outlets/${nearby.slug || nearby.id}`}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500/30 to-[#e63971]/40 hover:from-[#e63971] hover:to-rose-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-rose-300/30 hover:border-rose-400 transition-all shadow-md group-hover:shadow-lg"
                    >
                      <span>{t("outletDetail.viewBoutique", "Explore Boutique")}</span>
                      <span className="transition-transform group-hover:translate-x-1 font-bold">→</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================
            4. FRANCHISE OPPORTUNITY BANNER (BILINGUAL & LUXURIOUS)
        ========================================================= */}
        <section className="w-full pb-10 pt-10 sm:pb-12 sm:pt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="boutique-scroll-elem rounded-3xl sm:rounded-[2.5rem] p-8 sm:p-12 lg:p-14 bg-gradient-to-r from-[#b31b51] via-[#e63971] to-amber-500 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10 max-w-3xl">

                {/* Yellow Tag */}
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-300 text-slate-950 text-xs font-black uppercase tracking-wider mb-5 shadow-xs">
                  {t("outletDetail.franchiseTag")}
                </div>

                {/* Big Royal Headline */}
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-display mb-4 text-white leading-tight">
                  {t("outletDetail.franchiseBannerHeading")}
                </h2>

                {/* Subtext */}
                <p className="text-sm sm:text-base text-white/95 leading-relaxed mb-8 font-medium max-w-2xl">
                  {t("outletDetail.franchiseBannerSub")}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4">
                  {/* White CTA Button */}
                  <button
                    type="button"
                    onClick={openModal}
                    className="px-6 sm:px-8 py-3.5 rounded-xl bg-white text-rose-900 font-black text-sm sm:text-base shadow-lg hover:bg-rose-50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>{t("outletDetail.startFranchiseBtn")}</span>
                    <span>→</span>
                  </button>

                  {/* WhatsApp Team Button */}
                  <a
                    href={franchiseWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 sm:px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>{t("outletDetail.whatsAppFranchiseBtn")}</span>
                  </a>
                </div>

              </div>

              {/* Decorative Background Accents */}
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -top-20 -left-20 w-60 h-60 bg-amber-300/20 rounded-full blur-2xl pointer-events-none" />
            </div>
          </div>
        </section>

      </div>
    </PageShell>
  );
}
