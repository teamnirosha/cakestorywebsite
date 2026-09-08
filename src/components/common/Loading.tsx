import { ReactNode } from "react";

export function LoadingScreen({ label = "Loading CakeStory Desserts..." }: { label?: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="relative w-20 h-20 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-300 to-rose-400 spin-slow opacity-80" />
        <div className="absolute inset-1.5 rounded-full bg-white flex items-center justify-center p-2 shadow-inner">
          <img src="/assets/logo/cs-logo.png" alt="CakeStory Desserts" className="max-h-full max-w-full object-contain" />
        </div>
      </div>
      <p className="text-sm text-[#5a4a5e] font-medium">{label}</p>
    </div>
  );
}

export function EmptyState({ icon = "🍰", title, description, action }: { icon?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="glass rounded-3xl p-12 text-center max-w-md mx-auto">
      <div className="text-6xl mb-4 float-y inline-block">{icon}</div>
      <h3 className="font-display text-2xl mb-2 text-[#2a1d2e]">{title}</h3>
      {description && <p className="text-sm text-[#5a4a5e] mb-5">{description}</p>}
      {action}
    </div>
  );
}
