import clsx from "clsx";
import { CodeBlock } from "./code-block";

const STATUS_VARIANTS: Record<string, string> = {
  "2": "badge-success",
  "4": "badge-warning",
  "5": "badge-danger",
};

/** JSON response sample with an HTTP status chip. */
export async function ResponseExample({
  status,
  statusText,
  code,
}: {
  status: number;
  statusText?: string;
  code: string;
}) {
  const variant = STATUS_VARIANTS[String(status)[0]] ?? "badge";
  const label = statusText ? `${status} ${statusText}` : String(status);
  return (
    <div className="endpoint">
      <div className="endpoint-head">
        <span className={clsx("badge", variant)}>{label}</span>
        <code className="endpoint-path">application/json</code>
      </div>
      <CodeBlock lang="json" code={code} />
    </div>
  );
}
