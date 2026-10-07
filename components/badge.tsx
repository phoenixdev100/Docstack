import type { ReactNode } from "react";
import clsx from "clsx";

export function Badge({
  children,
  variant,
}: {
  children: ReactNode;
  variant?: "accent" | "success" | "warning" | "danger";
}) {
  return (
    <span className={clsx("badge", variant && `badge-${variant}`)}>
      {children}
    </span>
  );
}
