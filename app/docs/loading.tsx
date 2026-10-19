export default function DocsLoading() {
  return (
    <>
      <article className="docs-article">
        <div className="docs-article-inner" aria-busy="true" aria-label="Loading">
          <div className="skeleton" style={{ height: "0.8rem", width: "30%", marginBottom: "1.5rem" }} />
          <div className="skeleton" style={{ height: "2rem", width: "60%", marginBottom: "0.75rem" }} />
          <div className="skeleton" style={{ height: "1rem", width: "80%", marginBottom: "2.5rem" }} />
          {[90, 100, 95, 70].map((w, i) => (
            <div
              key={i}
              className="skeleton"
              style={{ height: "0.9rem", width: `${w}%`, marginBottom: "0.9rem" }}
            />
          ))}
          <div className="skeleton" style={{ height: "10rem", marginTop: "1.5rem" }} />
        </div>
      </article>
      <aside className="docs-toc" aria-hidden />
    </>
  );
}
