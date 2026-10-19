import { Sidebar } from "@/components/sidebar";
import { Footer } from "@/components/footer";
import { ReadingProgress } from "@/components/reading-progress";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="docs-shell">
      <ReadingProgress />
      <Sidebar />
      <div className="docs-main">
        {children}
        <Footer />
      </div>
    </div>
  );
}
