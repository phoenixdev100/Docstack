/**
 * Abstraction for the interactive "Try it" API console.
 *
 * The UI depends only on `ApiRunner`. Today `MockApiRunner` returns the
 * documented example response locally and clearly labels it as a mock - it
 * never performs a real network call. To go live, implement `ApiRunner`
 * against a sandbox/proxy endpoint and return it from `getApiRunner()`.
 */

export type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

export interface ApiRequestConfig {
  method: HttpMethod;
  path: string;
  headers: Record<string, string>;
  query: Record<string, string>;
  body?: string;
}

export interface ApiResponseResult {
  status: number;
  statusText: string;
  body: string;
  /** Milliseconds the call took (real or simulated). */
  durationMs: number;
  /** True when the response did not come from a live API. */
  mocked: boolean;
}

export interface ApiRunner {
  execute(config: ApiRequestConfig): Promise<ApiResponseResult>;
}

export class MockApiRunner implements ApiRunner {
  constructor(private example: { status: number; body: string }) {}

  async execute(): Promise<ApiResponseResult> {
    // Small artificial delay so the console shows a realistic lifecycle.
    const start = performance.now();
    await new Promise((r) => setTimeout(r, 240 + Math.random() * 180));
    return {
      status: this.example.status,
      statusText: statusText(this.example.status),
      body: this.example.body,
      durationMs: Math.round(performance.now() - start),
      mocked: true,
    };
  }
}

export function statusText(status: number): string {
  const map: Record<number, string> = {
    200: "OK",
    201: "Created",
    204: "No Content",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    409: "Conflict",
    422: "Unprocessable Entity",
    429: "Too Many Requests",
    500: "Internal Server Error",
  };
  return map[status] ?? "Response";
}
