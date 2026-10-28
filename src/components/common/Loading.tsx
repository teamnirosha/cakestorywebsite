import { ReactNode } from "react";

export function LoadingScreen({ label = "Crafting a delightful experience for you..." }: { label?: string }) {
  return (
    <div
      className="min-h-[75vh] w-full flex items-center justify-center p-4 sm:p-6"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <section className="cs-loader-card !min-h-0 sm:!min-h-[520px] max-w-[420px] w-full py-8 sm:py-10 px-6 sm:px-8">
        {/* Eyebrow */}
        <div className="cs-loader-eyebrow !mb-5 text-[9px] sm:text-[10px]">
          A LITTLE SWEETNESS IS ON ITS WAY
        </div>

        {/* Orbit with Authentic Logo */}
        <div className="cs-brand-orbit !w-[160px] !h-[160px] !mb-5">
          <div className="cs-orbit-ring" aria-hidden="true" />
          <div className="cs-orbit-ring-inner" aria-hidden="true" />
          <div className="cs-logo-halo" aria-hidden="true" />
          <img
            src="/assets/logo/cs-final-logo.png"
            alt="CakeStory Desserts"
            className="cs-loader-logo !w-[115px] !h-[95px]"
            width={115}
            height={95}
          />
        </div>

        {/* Brand Headline */}
        <h2 className="cs-loader-h1 !text-2xl sm:!text-3xl mb-1.5">
          Every Flavour
          <br />
          Has a Story.
        </h2>

        {/* Supporting Copy from Label */}
        <p className="cs-loader-copy !text-xs sm:!text-[13px] !my-3 max-w-[280px]">
          {label}
        </p>

        {/* Refined Indeterminate Progress Track */}
        <div className="cs-loader-progress w-full max-w-[240px] mt-2">
          <div className="cs-progress-track">
            <div
              className="cs-progress-fill animate-pulse"
              style={{ width: "100%" }}
            />
          </div>

          <div className="cs-loader-status !mt-3 justify-center text-[10px]">
            <span className="cs-status-dot" aria-hidden="true" />
            <span>Preparing the sweetest details</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export function EmptyState({
  icon = "🍰",
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="glass rounded-3xl p-12 text-center max-w-md mx-auto">
      <div className="text-6xl mb-4 float-y inline-block">{icon}</div>
      <h3 className="font-display text-2xl mb-2 text-[#2a1d2e]">{title}</h3>
      {description && <p className="text-sm text-[#5a4a5e] mb-5">{description}</p>}
      {action}
    </div>
  );
}
