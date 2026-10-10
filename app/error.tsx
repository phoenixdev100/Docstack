"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="not-found">
      <p className="not-found-code">Error</p>
      <h1>Something went wrong.</h1>
      <p>
        An unexpected error occurred while loading this page. Try again, or head
        back to the documentation.
      </p>
      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
        <button type="button" className="btn btn-primary" onClick={reset}>
          Try again
        </button>
        <Link href="/docs" className="btn">
          Back to documentation
        </Link>
      </div>
    </div>
  );
}
