import type { ReactNode } from "react";

/**
 * Numbered step-by-step tutorial block (Stripe/Supabase pattern).
 * Steps are numbered automatically via CSS counter.
 *
 * <Steps>
 *   <Step title="Install the SDK">...</Step>
 *   <Step title="Initialize the client">...</Step>
 * </Steps>
 */
export function Steps({ children }: { children: ReactNode }) {
  return <div className="steps">{children}</div>;
}

export function Step({
  title,
  children,
}: {
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="step">
      <div className="step-marker" aria-hidden>
        <span className="step-num" />
      </div>
      <div className="step-body">
        <h4 className="step-title">{title}</h4>
        <div className="step-content">{children}</div>
      </div>
    </div>
  );
}
