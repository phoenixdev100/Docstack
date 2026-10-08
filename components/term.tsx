import type { ReactNode } from "react";

/**
 * Inline glossary term - dotted underline with a hover tooltip showing the
 * definition. <Term definition="Opaque pagination token">cursor</Term>
 */
export function Term({
  definition,
  children,
}: {
  definition: string;
  children: ReactNode;
}) {
  return (
    <span className="term" data-tip={definition} tabIndex={0}>
      {children}
    </span>
  );
}
