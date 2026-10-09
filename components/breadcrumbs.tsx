import Link from "next/link";
import { Fragment } from "react";

export function Breadcrumbs({
  items = [],
}: {
  items?: { title: string; href?: string }[];
}) {
  if (!items || items.length === 0) return null;

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <Fragment key={i}>
            {i > 0 && (
              <span className="sep" aria-hidden>
                /
              </span>
            )}
            {item.href && !last ? (
              <Link href={item.href}>{item.title}</Link>
            ) : (
              <span className={last ? "current" : undefined}>{item.title}</span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
