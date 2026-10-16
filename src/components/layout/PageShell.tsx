import { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
  className?: string;
  noTopPadding?: boolean;
}

export default function PageShell({
  children,
  className = "",
  noTopPadding = false,
}: PageShellProps) {
  return (
    <main
      className={`relative min-h-screen ${
        noTopPadding ? "pt-0 pb-0" : "pt-24 pb-12"
      } ${className}`}
    >
      {children}
    </main>
  );
}
