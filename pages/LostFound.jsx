import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useItemStore } from "../store/useStore";
import { CHITKARA_BLOCKS, ITEM_CATEGORIES } from "../data/blocks";
import useDebounce from "../hooks/useDebounce";
import Modal from "../components/Modal";
import Tabs from "../components/Tabs";
import Dropdown from "../components/Dropdown";
import InputField from "../components/InputField";
import Pagination from "../components/Pagination";
import { Empty } from "../components/States";
import { validateItem } from "../utils/validators";

const PER_PAGE = 6;
const DEFAULT_IMG = "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=700&auto=format&fit=crop&q=70";
const SORTS = [{ value: "new", label: "Newest" }, { value: "old", label: "Oldest" }, { value: "az", label: "Title A-Z" }];
const EMPTY = { type: "lost", title: "", category: "Electronics", location: CHITKARA_BLOCKS[0].name, description: "", contactInfo: "", imageUrl: "" };

export default function LostFound() {
  const { user } = useAuth();
  const toast = useToast();
  const { items, addItem, updateItem, removeItem } = useItemStore();
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("new");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const q = useDebounce(query).trim().toLowerCase();

  const visible = useMemo(() => {
    const list = items.filter((i) => (type === "all" || i.type === type) &&
      [i.title, i.location, i.category, i.description].some((t) => t.toLowerCase().includes(q)));
    return list.sort((a, b) => sort === "az" ? a.title.localeCompare(b.title) : sort === "old" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
  }, [items, type, q, sort]);

  const pages = Math.max(1, Math.ceil(visible.length / PER_PAGE));
  const current = Math.min(page, pages);
  const slice = visible.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const count = (t) => items.filter((i) => t === "all" || i.type === t).length;

  const openAdd = () => { setForm(EMPTY); setErrors({}); setEditId(null); setFormOpen(true); };
  const openEdit = (item) => { setForm({ ...EMPTY, ...item }); setErrors({}); setEditId(item.id); setFormOpen(true); };
  const change = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setErrors({ ...errors, [e.target.name]: undefined }); };

  const submit = (e) => {
    e.preventDefault();
    const errs = validateItem(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const data = { type: form.type, title: form.title.trim(), category: form.category, location: form.location, description: form.description.trim(), contactInfo: form.contactInfo.trim(), imageUrl: form.imageUrl.trim() };
    if (editId) { updateItem(editId, data); toast("Item updated."); }
    else { addItem({ ...data, contactName: user.name, ownerEmail: user.email }); toast("Your item has been published."); setPage(1); }
    setFormOpen(false);
  };

  return (
    <section className="section">
      <div className="container">
        <div className="page-head">
          <div className="section-title left"><span>Lost &amp; Found</span><h2>Lost something? Found something?</h2><p>Help your fellow students recover their belongings.</p></div>
          <button className="btn btn-primary" onClick={openAdd}><i className="fa-solid fa-plus" /> Report Item</button>
        </div>

        <div className="toolbar">
          <Tabs active={type} onChange={(t) => { setType(t); setPage(1); }} tabs={[
            { key: "all", label: "All", count: count("all") }, { key: "lost", label: "Lost", icon: "fa-circle-exclamation", count: count("lost") }, { key: "found", label: "Found", icon: "fa-circle-check", count: count("found") }]} />
          <div className="search-box"><i className="fa-solid fa-magnifying-glass" /><input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search items, places..." aria-label="Search items" /></div>
          <Dropdown label="Sort" options={SORTS} value={sort} onChange={setSort} />
        </div>

        {slice.length === 0 ? <Empty title="No items found" text="No item matches your search or filter." /> : (
          <div className="cards">
            {slice.map((item) => {
              const owner = user.email === item.ownerEmail;
              return (
                <article className={`item-card ${item.resolved ? "resolved" : ""}`} key={item.id}>
                  <div className="item-img">
                    <img src={item.imageUrl || DEFAULT_IMG} onError={(e) => { e.currentTarget.src = DEFAULT_IMG; }} alt={item.title} loading="lazy" />
                    <span className={`badge ${item.type === "lost" ? "badge-lost" : "badge-found"}`}><i className={`fa-solid ${item.type === "lost" ? "fa-circle-exclamation" : "fa-circle-check"}`} /> {item.type.toUpperCase()}</span>
                    {item.resolved && <span className="resolved-tag"><i className="fa-solid fa-handshake" /> Resolved</span>}
                  </div>
                  <div className="item-body">
                    <p className="eyebrow">{item.category}</p>
                    <h3>{item.title}</h3>
                    <p className="clamp">{item.description}</p>
                    <div className="meta">
                      <span><i className="fa-solid fa-location-dot" /> {item.location}</span>
                      <span><i className="fa-solid fa-calendar" /> {item.date}</span>
                      <span><i className="fa-solid fa-user" /> {item.contactName}</span>
                      <span><i className="fa-solid fa-phone" /> {item.contactInfo}</span>
                    </div>
                  </div>
                  <div className="item-footer">
                    <Link className="btn btn-sm btn-secondary" to={`/map?search=${encodeURIComponent(item.location)}`}><i className="fa-solid fa-map" /> Map</Link>
                    {owner ? (
                      <div className="actions">
                        <button className="icon-btn" title={item.resolved ? "Reopen" : "Mark resolved"} onClick={() => { updateItem(item.id, { resolved: !item.resolved }); toast(item.resolved ? "Item reopened." : "Marked as resolved.", "info"); }}><i className="fa-solid fa-handshake" /></button>
                        <button className="icon-btn" title="Edit" onClick={() => openEdit(item)}><i className="fa-solid fa-pen" /></button>
                        <button className="icon-btn danger" title="Delete" onClick={() => setToDelete(item)}><i className="fa-solid fa-trash" /></button>
                      </div>
                    ) : <span className="muted small"><i className="fa-solid fa-lock" /> Owner only</span>}
                  </div>
                </article>
              );
            })}
          </div>
        )}
        <Pagination page={current} pages={pages} onChange={setPage} />
      </div>

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editId ? "Edit Item" : "Report an Item"}>
        <form onSubmit={submit} noValidate className="form-grid">
          <InputField as="select" label="Type" id="type" value={form.type} onChange={change}><option value="lost">I lost something</option><option value="found">I found something</option></InputField>
          <InputField as="select" label="Category" id="category" value={form.category} onChange={change}>{ITEM_CATEGORIES.map((c) => <option key={c}>{c}</option>)}</InputField>
          <div className="span2"><InputField label="Title" id="title" value={form.title} onChange={change} error={errors.title} placeholder="e.g. Blue water bottle" /></div>
          <InputField as="select" label="Location" id="location" value={form.location} onChange={change}>{CHITKARA_BLOCKS.map((b) => <option key={b.id}>{b.name}</option>)}</InputField>
          <InputField label="Contact (mobile / email)" id="contactInfo" value={form.contactInfo} onChange={change} error={errors.contactInfo} placeholder="9876543210" />
          <div className="span2"><InputField as="textarea" rows={3} label="Description" id="description" value={form.description} onChange={change} error={errors.description} placeholder="Colour, brand, marks..." /></div>
          <div className="span2"><InputField label="Image link (optional)" id="imageUrl" value={form.imageUrl} onChange={change} error={errors.imageUrl} placeholder="https://..." /></div>
          <div className="span2 modal-actions"><button type="button" className="btn btn-secondary" onClick={() => setFormOpen(false)}>Cancel</button><button className="btn btn-primary">{editId ? "Save Changes" : "Publish"}</button></div>
        </form>
      </Modal>

      <Modal open={!!toDelete} onClose={() => setToDelete(null)} title="Delete this post?" size="sm">
        <p>"{toDelete?.title}" will be permanently removed from the portal.</p>
        <div className="modal-actions"><button className="btn btn-secondary" onClick={() => setToDelete(null)}>Cancel</button>
          <button className="btn btn-danger" onClick={() => { removeItem(toDelete.id); setToDelete(null); toast("Item removed.", "info"); }}>Delete</button></div>
      </Modal>
    </section>
  );
}
