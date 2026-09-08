import { ReactNode } from "react";

export default function PageShell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <main className={`pt-24 pb-12 min-h-screen relative overflow-hidden ${className}`}>
      {children}
    </main>
  );
}
