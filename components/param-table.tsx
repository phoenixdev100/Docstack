import type { ReactNode } from "react";

export interface Param {
  name: string;
  type: string;
  required?: boolean;
  description: ReactNode;
  default?: string;
  /** Marks the parameter deprecated - renders a badge and muted styling. */
  deprecated?: boolean;
}

/** Scannable parameter table for API docs. */
export function ParamTable({
  params,
  label,
}: {
  params: Param[];
  label?: string;
}) {
  return (
    <div>
      {label && <span className="section-label">{label}</span>}
      <div className="param-table-wrap">
        <table className="param-table">
          <thead>
            <tr>
              <th scope="col">Parameter</th>
              <th scope="col">Type</th>
              <th scope="col">Required</th>
              <th scope="col">Description</th>
            </tr>
          </thead>
          <tbody>
            {params.map((p) => (
              <tr key={p.name} className={p.deprecated ? "param-deprecated" : undefined}>
                <td>
                  <code className="param-name">{p.name}</code>
                  {p.deprecated && <span className="param-deprecated-badge">deprecated</span>}
                </td>
                <td>
                  <code className="param-type">{p.type}</code>
                </td>
                <td>
                  {p.required ? (
                    <span className="param-required">required</span>
                  ) : (
                    <span className="param-optional">
                      optional{p.default ? ` · ${p.default}` : ""}
                    </span>
                  )}
                </td>
                <td>{p.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
