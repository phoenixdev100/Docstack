"use client";

import {
  Children,
  isValidElement,
  useId,
  useState,
  type ReactNode,
} from "react";
import { ChevronDown } from "lucide-react";

/** Expandable sections. Use <AccordionItem title="..."> children. */
export function Accordion({ children }: { children: ReactNode }) {
  const items = Children.toArray(children).filter(isValidElement);
  const [open, setOpen] = useState<Set<number>>(new Set());
  const baseId = useId();

  function toggle(i: number) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <div className="accordion">
      {items.map((child, i) => {
        const title =
          (child.props as { title?: string }).title ?? `Section ${i + 1}`;
        const expanded = open.has(i);
        return (
          <div className="accordion-item" key={i}>
            <button
              type="button"
              className="accordion-trigger"
              aria-expanded={expanded}
              aria-controls={`${baseId}-panel-${i}`}
              id={`${baseId}-trigger-${i}`}
              onClick={() => toggle(i)}
            >
              {title}
              <ChevronDown aria-hidden />
            </button>
            <div
              className="accordion-panel"
              id={`${baseId}-panel-${i}`}
              role="region"
              aria-labelledby={`${baseId}-trigger-${i}`}
              hidden={!expanded}
            >
              {child}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function AccordionItem({
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return <>{children}</>;
}
