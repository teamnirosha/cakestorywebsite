import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type ToastType = "success" | "error" | "info" | "warning";

type Toast = {
  id: number;
  message: string;
  type: ToastType;
};

type ToastCtx = {
  show: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const colorMap: Record<ToastType, string> = {
    success: "from-emerald-400 to-green-500",
    error: "from-rose-500 to-red-500",
    info: "from-blue-400 to-indigo-500",
    warning: "from-amber-400 to-orange-500",
  };

  const iconMap: Record<ToastType, string> = {
    success: "✓",
    error: "✕",
    info: "i",
    warning: "!",
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto glass rounded-2xl px-5 py-3.5 flex items-center gap-3 shadow-xl min-w-[280px] max-w-md fade-in border-l-4"
            style={{ borderLeftColor: t.type === "success" ? "#10b981" : t.type === "error" ? "#ef4444" : t.type === "warning" ? "#f59e0b" : "#6366f1" }}
          >
            <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${colorMap[t.type]} flex items-center justify-center text-white text-sm font-bold shadow-md`}>
              {iconMap[t.type]}
            </div>
            <span className="text-sm font-medium text-[#2a1d2e] flex-1">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
