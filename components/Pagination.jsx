export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  return (
    <nav className="pagination" aria-label="Pagination">
      <button disabled={page === 1} onClick={() => onChange(page - 1)}><i className="fa-solid fa-chevron-left" /></button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <button key={p} className={p === page ? "active" : ""} onClick={() => onChange(p)}>{p}</button>
      ))}
      <button disabled={page === pages} onClick={() => onChange(page + 1)}><i className="fa-solid fa-chevron-right" /></button>
    </nav>
  );
}
