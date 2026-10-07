import type { ReactNode } from "react";
import { Info, Lightbulb, OctagonAlert, TriangleAlert } from "lucide-react";
import clsx from "clsx";

const TYPES = {
  note: { icon: Info, label: "Note" },
  tip: { icon: Lightbulb, label: "Tip" },
  warning: { icon: TriangleAlert, label: "Warning" },
  important: { icon: OctagonAlert, label: "Important" },
} as const;

export type CalloutType = keyof typeof TYPES;

export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}) {
  const { icon: Icon, label } = TYPES[type] ?? TYPES.note;
  return (
    <aside className={clsx("callout", `callout-${type}`)}>
      <Icon className="callout-icon" aria-hidden />
      <div className="callout-body">
        <span className="callout-title">{title ?? label}</span>
        {children}
      </div>
    </aside>
  );
}
