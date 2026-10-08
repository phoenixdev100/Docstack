"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import {
  MockApiRunner,
  type ApiResponseResult,
  type ApiRunner,
  type HttpMethod,
} from "@/lib/api-runner";

interface TryItProps {
  method: HttpMethod;
  path: string;
  /** Example response rendered when "Send" is pressed (clearly marked mock). */
  exampleStatus: number;
  exampleBody: string;
}

/**
 * Interactive API console. The request is executed through the `ApiRunner`
 * abstraction - currently `MockApiRunner`, which returns the documented
 * example response without touching the network. Swap the runner for a
 * sandbox proxy runner to go live without changing this UI.
 */
export function TryIt({ method, path, exampleStatus, exampleBody }: TryItProps) {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [requestBody, setRequestBody] = useState("");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<ApiResponseResult | null>(null);

  const runner: ApiRunner = new MockApiRunner({
    status: exampleStatus,
    body: exampleBody,
  });

  async function send() {
    setRunning(true);
    setResult(null);
    const res = await runner.execute({
      method,
      path,
      headers: {
        Authorization: `Bearer ${apiKey || "mrnd_test_…"}`,
        "Content-Type": "application/json",
      },
      query: {},
      body: requestBody || undefined,
    });
    setResult(res);
    setRunning(false);
  }

  if (!open) {
    return (
      <button type="button" className="btn btn-secondary btn-sm" onClick={() => setOpen(true)}>
        <Play aria-hidden /> Try it
      </button>
    );
  }

  return (
    <div className="tryit">
      <div className="tryit-head">
        <span className={`method-badge method-${method.toLowerCase()}`}>{method}</span>
        <code className="endpoint-path">{path}</code>
        <button type="button" className="btn btn-primary btn-sm" onClick={send} disabled={running}>
          {running ? "Sending…" : "Send request"}
        </button>
      </div>
      <div className="tryit-body">
        <label className="tryit-field">
          <span>Authorization</span>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="mrnd_test_…"
            autoComplete="off"
          />
        </label>
        {(method === "POST" || method === "PATCH" || method === "PUT") && (
          <label className="tryit-field">
            <span>Request body (JSON)</span>
            <textarea
              rows={4}
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              placeholder='{"name": "My Project"}'
              spellCheck={false}
            />
          </label>
        )}
        {result && (
          <div className="tryit-result">
            <div className="tryit-result-meta">
              <span className={`badge ${result.status < 300 ? "badge-success" : "badge-danger"}`}>
                {result.status} {result.statusText}
              </span>
              <span>{result.durationMs} ms</span>
              {result.mocked && <span className="badge badge-warning">Mock response</span>}
            </div>
            <pre>{result.body}</pre>
          </div>
        )}
        {result?.mocked && (
          <p className="tryit-note">
            This is an example response returned locally - no request was sent to
            the API. Connect a sandbox runner in <code>lib/api-runner.ts</code> to
            execute live requests.
          </p>
        )}
      </div>
    </div>
  );
}
