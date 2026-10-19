import { NextResponse } from "next/server";
import fs from "node:fs";
import { getDoc, parseDocSlug } from "@/lib/docs";
import { getAllDocs } from "@/lib/docs";
import { DEFAULT_VERSION } from "@/lib/navigation";

/** Serves the raw .mdx source for a docs page - used by "Copy as Markdown". */
export function generateStaticParams() {
  return getAllDocs().map((doc) => ({
    slug:
      doc.version === DEFAULT_VERSION
        ? doc.slug
        : [doc.version, ...doc.slug],
  }));
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const { version, slug: docSlug } = parseDocSlug(slug);
  const doc = getDoc(version, docSlug);
  if (!doc) return new NextResponse("Not found", { status: 404 });

  const raw = fs.readFileSync(doc.filePath, "utf8");
  return new NextResponse(raw, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
