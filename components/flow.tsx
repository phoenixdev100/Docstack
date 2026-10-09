import type { ReactNode } from "react";

type Tone = "default" | "accent" | "success" | "warning" | "danger";

export interface FlowOutcome {
  label: string;
  result: string;
  tone?: Tone;
}

export interface FlowStep {
  /** Small lane/actor label above the title, e.g. "Your server" / "Meridian". */
  label?: string;
  title: string;
  detail?: string;
  /** Monospace detail, e.g. a request line or header. */
  code?: string;
  tone?: Tone;
  /** Decision outcomes rendered under the card (branches). */
  outcomes?: FlowOutcome[];
}

/**
 * Pure-CSS process diagram - renders a vertical stepper (or a horizontal
 * pipeline) with numbered markers, connector lines, and tone-coded cards.
 * No client JS; meant to replace ASCII-art diagrams in docs.
 */
export function Flow({
  steps = [],
  direction = "vertical",
  caption,
}: {
  steps?: FlowStep[];
  direction?: "vertical" | "horizontal";
  caption?: ReactNode;
}) {
  if (!steps || steps.length === 0) return null;

  if (direction === "horizontal") {
    return (
      <figure className="flow">
        <ol className="flow-track-h" aria-label="Flow diagram">
          {steps.map((s, i) => (
            <li key={i} className="flow-hstep">
              <div className={`flow-hcard tone-${s.tone ?? "default"}`}>
                {s.label && <span className="flow-label">{s.label}</span>}
                <span className="flow-title">{s.title}</span>
                {s.detail && <span className="flow-detail">{s.detail}</span>}
              </div>
              {i < steps.length - 1 && (
                <span className="flow-harrow" aria-hidden>
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
        {caption && <figcaption className="flow-caption">{caption}</figcaption>}
      </figure>
    );
  }

  return (
    <figure className="flow">
      <ol className="flow-track" aria-label="Flow diagram">
        {steps.map((s, i) => (
          <li key={i} className="flow-step">
            <div className="flow-marker-col" aria-hidden>
              <span className={`flow-dot tone-${s.tone ?? "default"}`}>
                {i + 1}
              </span>
              {i < steps.length - 1 && <span className="flow-line" />}
            </div>
            <div className={`flow-card tone-${s.tone ?? "default"}`}>
              {s.label && <span className="flow-label">{s.label}</span>}
              <span className="flow-title">{s.title}</span>
              {s.detail && <span className="flow-detail">{s.detail}</span>}
              {s.code && <code className="flow-code">{s.code}</code>}
              {s.outcomes && (
                <ul className="flow-outcomes">
                  {s.outcomes.map((o, j) => (
                    <li key={j} className={`flow-outcome tone-${o.tone ?? "default"}`}>
                      <span className="flow-outcome-label">{o.label}</span>
                      <span className="flow-outcome-arrow" aria-hidden>
                        →
                      </span>
                      <span className="flow-outcome-result">{o.result}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>
      {caption && <figcaption className="flow-caption">{caption}</figcaption>}
    </figure>
  );
}
