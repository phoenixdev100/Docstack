import type { ReactNode } from "react";

/** Keyboard key - renders <kbd> styling for shortcuts like Ctrl+K. */
export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="kbd">{children}</kbd>;
}
