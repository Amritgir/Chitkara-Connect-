import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import axios from "axios";
import { fetchNotices, errorMessage } from "../services/api";
import { useBookmarkStore } from "../store/useStore";
import useDebounce from "../hooks/useDebounce";
import Tabs from "../components/Tabs";
import Dropdown from "../components/Dropdown";
import Modal from "../components/Modal";
import { ErrorBox, Skeletons, Empty } from "../components/States";
import { useToast } from "../context/ToastContext";

const LIMIT = 9;
const CATS = ["Academic", "Exams", "Events", "Hostel", "Placements"];
const SORTS = [{ value: "new", label: "Newest" }, { value: "old", label: "Oldest" }, { value: "az", label: "Title A-Z" }];

export default function Notices() {
  const toast = useToast();
  const { saved, toggle } = useBookmarkStore();
  const [notices, setNotices] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(Infinity);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cat, setCat] = useState("all");
  const [sort, setSort] = useState("new");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(null);
  const q = useDebounce(query).trim().toLowerCase();
  const sentinel = useRef(null);
  const hasMore = notices.length < Math.min(total, 60);

  const load = useCallback((signal) => {
    setLoading(true); setError(null);
    return fetchNotices(page, LIMIT, signal)
      .then(({ notices: n, total }) => { setNotices((prev) => [...prev, ...n.filter((x) => !prev.some((p) => p.id === x.id))]); setTotal(total); setLoading(false); })
      .catch((err) => { if (!axios.isCancel(err)) { setError(errorMessage(err)); setLoading(false); } });
  }, [page]);

  useEffect(() => { const c = new AbortController(); load(c.signal); return () => c.abort(); }, [load]);

  // infinite scroll
  useEffect(() => {
    const node = sentinel.current;
    if (!node) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !loading && !error && hasMore) setPage((p) => p + 1); }, { rootMargin: "200px" });
    io.observe(node);
    return () => io.disconnect();
  }, [loading, error, hasMore]);

  const visible = useMemo(() => {
    const list = notices.filter((n) => (cat === "all" || (cat === "saved" ? saved.includes(n.id) : n.category === cat)) &&
      (n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)));
    return list.sort((a, b) => sort === "az" ? a.title.localeCompare(b.title) : sort === "old" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
  }, [notices, cat, q, sort, saved]);

  const tabs = [{ key: "all", label: "All" }, ...CATS.map((c) => ({ key: c, label: c })), { key: "saved", label: "Saved", icon: "fa-bookmark", count: saved.length }];

  return (
    <section className="section">
      <div className="container">
        <div className="section-title left"><span>Campus Notices</span><h2>Stay in the loop</h2><p>Notices are loaded live from a REST API with pagination, retry and infinite scroll.</p></div>
        <div className="toolbar">
          <div className="search-box"><i className="fa-solid fa-magnifying-glass" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search notices..." aria-label="Search notices" /></div>
          <Dropdown label="Sort" options={SORTS} value={sort} onChange={setSort} />
        </div>
        <div className="scroll-x"><Tabs tabs={tabs} active={cat} onChange={setCat} /></div>

        {visible.length > 0 && (
          <div className="cards">
            {visible.map((n) => (
              <article className="notice-card" key={n.id}>
                <div className="notice-top"><span className={`chip chip-${n.category}`}>{n.category}</span><span className="muted small">{n.date}</span></div>
                <h3 className="clamp2">{n.title}</h3>
                <p className="clamp">{n.body}</p>
                <div className="notice-foot">
                  <button className="link-btn" onClick={() => setActive(n)}>Read more <i className="fa-solid fa-arrow-right" /></button>
                  <button className={`icon-btn ${saved.includes(n.id) ? "on" : ""}`} aria-label="Save notice" onClick={() => { toggle(n.id); toast(saved.includes(n.id) ? "Removed from saved." : "Notice saved.", "info"); }}>
                    <i className={`fa-${saved.includes(n.id) ? "solid" : "regular"} fa-bookmark`} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
        {loading && <Skeletons n={notices.length ? 3 : 6} />}
        {error && <ErrorBox message={error} onRetry={() => load(new AbortController().signal)} />}
        {!loading && !error && visible.length === 0 && <Empty icon="fa-newspaper" title="No notices found" text={hasMore ? "Scroll down to load more, or change your filters." : "Nothing matches your search or filter."} />}
        <div ref={sentinel} style={{ height: 1 }} />
        {!hasMore && !loading && notices.length > 0 && <p className="muted small" style={{ textAlign: "center", marginTop: 24 }}>You're all caught up.</p>}
      </div>

      <Modal open={!!active} onClose={() => setActive(null)} title={active?.category + " Notice"}>
        <h3>{active?.title}</h3><p className="muted small">{active?.date}</p><p style={{ marginTop: 12 }}>{active?.body}</p>
      </Modal>
    </section>
  );
}
