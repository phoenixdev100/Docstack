import Image from "next/image";
import { site } from "@/lib/site";

/** Brand mark - the PNG logo served from /logo.png, auto-optimized by next/image. */
export function Logo({ size = 20 }: { size?: number }) {
  return (
    <Image
      src="/logo.png"
      width={size}
      height={size}
      alt={`${site.name} logo`}
      priority
      style={{ display: "block" }}
    />
  );
}
