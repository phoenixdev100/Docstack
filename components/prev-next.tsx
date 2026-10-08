import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { FlatNavItem } from "@/lib/navigation";

export function PrevNext({
  prev,
  next,
}: {
  prev?: FlatNavItem;
  next?: FlatNavItem;
}) {
  if (!prev && !next) return null;
  return (
    <nav className="prev-next" aria-label="Pagination">
      {prev ? (
        <Link href={prev.href} className="prev-next-card">
          <span className="prev-next-label">
            <ArrowLeft aria-hidden />
            Previous
          </span>
          <span className="prev-next-title">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next.href} className="prev-next-card next">
          <span className="prev-next-label">
            Next
            <ArrowRight aria-hidden />
          </span>
          <span className="prev-next-title">{next.title}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
