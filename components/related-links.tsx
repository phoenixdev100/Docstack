import Link from "next/link";
import { FileText } from "lucide-react";

/**
 * "See also" link list for the end of a page - compact alternative to CardGrid.
 *
 * <RelatedLinks links={[
 *   { title: "Webhooks", href: "/docs/guides/webhooks" },
 * ]} />
 */
export function RelatedLinks({
  links,
}: {
  links: { title: string; href: string }[];
}) {
  return (
    <div className="related-links">
      {links.map((l) => (
        <Link key={l.href} href={l.href} className="popular-link">
          <FileText aria-hidden />
          {l.title}
        </Link>
      ))}
    </div>
  );
}
