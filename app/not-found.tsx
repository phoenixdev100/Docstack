import Link from "next/link";
import { Footer } from "@/components/footer";

export default function NotFound() {
  return (
    <>
      <div className="not-found">
        <p className="not-found-code">404</p>
        <h1>Page not found.</h1>
        <p>
          The documentation page you&rsquo;re looking for doesn&rsquo;t exist or
          may have moved.
        </p>
        <Link href="/docs" className="btn btn-primary">
          Back to documentation
        </Link>
      </div>
      <Footer />
    </>
  );
}
