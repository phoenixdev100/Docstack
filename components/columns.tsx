import type { ReactNode } from "react";

/**
 * Responsive multi-column layout - collapses to one column on mobile.
 * Useful for side-by-side text + media, or parallel option blocks.
 *
 * <Columns cols={2}>
 *   <Column>Left content</Column>
 *   <Column>Right content</Column>
 * </Columns>
 */
export function Columns({
  cols = 2,
  children,
}: {
  cols?: 2 | 3;
  children: ReactNode;
}) {
  return (
    <div className="columns" style={{ ["--cols" as string]: cols }}>
      {children}
    </div>
  );
}

export function Column({ children }: { children: ReactNode }) {
  return <div className="column">{children}</div>;
}
