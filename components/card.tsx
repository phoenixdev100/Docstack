import Link from "next/link";
import type { ReactNode } from "react";
import * as Lucide from "lucide-react";

export function CardGrid({ children }: { children: ReactNode }) {
  return <div className="card-grid">{children}</div>;
}

const ICONS: Record<string, Lucide.LucideIcon> = {
  zap: Lucide.Zap,
  code: Lucide.Code2,
  book: Lucide.BookOpen,
  key: Lucide.KeyRound,
  terminal: Lucide.Terminal,
  box: Lucide.Package,
  layers: Lucide.Layers,
  globe: Lucide.Globe,
  shield: Lucide.ShieldCheck,
  server: Lucide.Server,
  webhook: Lucide.Webhook,
  clock: Lucide.Clock,
};

export function Card({
  title,
  href,
  icon,
  children,
}: {
  title: string;
  href: string;
  icon?: keyof typeof ICONS;
  children?: ReactNode;
}) {
  const Icon = icon ? ICONS[icon] : undefined;
  return (
    <Link href={href} className="card">
      {Icon && (
        <span className="card-icon">
          <Icon aria-hidden />
        </span>
      )}
      <span className="card-title">{title}</span>
      {children && <span className="card-desc">{children}</span>}
    </Link>
  );
}
