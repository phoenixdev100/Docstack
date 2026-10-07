import type { ReactNode } from "react";
import clsx from "clsx";

export type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export function MethodBadge({ method }: { method: HttpMethod }) {
  return (
    <span className={clsx("method-badge", `method-${method.toLowerCase()}`)}>
      {method}
    </span>
  );
}

/** Method + path banner used at the top of API endpoint docs. */
export function ApiEndpoint({
  method,
  path,
  children,
}: {
  method: HttpMethod;
  path: string;
  children?: ReactNode;
}) {
  return (
    <div className="endpoint">
      <div className="endpoint-head">
        <MethodBadge method={method} />
        <code className="endpoint-path">{path}</code>
      </div>
      {children && <div className="endpoint-body">{children}</div>}
    </div>
  );
}
