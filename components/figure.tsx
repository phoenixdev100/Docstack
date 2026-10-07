import type { ReactNode } from "react";

/**
 * Captioned media frame for images, screenshots, diagrams, and embeds.
 *
 * <Figure src="/img/flow.png" alt="Delivery flow" caption="..." />
 * or
 * <Figure caption="Dashboard > Webhooks">
 *   <img src="..." alt="..." />
 * </Figure>
 */
export function Figure({
  src,
  alt = "",
  caption,
  children,
}: {
  src?: string;
  alt?: string;
  caption?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <figure className="figure">
      <div className="figure-media">
        {src ? <img src={src} alt={alt} loading="lazy" /> : children}
      </div>
      {caption && <figcaption className="figure-caption">{caption}</figcaption>}
    </figure>
  );
}
