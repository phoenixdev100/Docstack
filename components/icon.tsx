import { icons, HelpCircle } from "lucide-react";

/**
 * Inline Lucide icon for prose - <Icon name="zap" /> renders the named icon.
 * Accepts any lucide-react icon name (kebab or PascalCase).
 */
export function Icon({ name }: { name: string }) {
  const pascal = name.replace(/(^|-)(\w)/g, (_, __, c: string) => c.toUpperCase());
  const Cmp = (icons as Record<string, typeof HelpCircle>)[pascal];
  if (!Cmp) return null;
  return <Cmp className="inline-icon" aria-hidden />;
}
