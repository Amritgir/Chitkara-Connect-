import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useClassStore } from "../store/useStore";
import { CHITKARA_BLOCKS } from "../data/blocks";
import Modal from "../components/Modal";
import Tabs from "../components/Tabs";
import InputField from "../components/InputField";
import { Empty } from "../components/States";
import { validateClass } from "../utils/validators";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const COLORS = ["#e31e24", "#7c3aed", "#0ea5e9", "#10b981", "#f59e0b", "#ec4899"];
const toMin = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
const fmt = (t) => { const h = Number(t.slice(0, 2)); return `${h % 12 || 12}:${t.slice(3)} ${h >= 12 ? "PM" : "AM"}`; };
const blockOf = (id) => CHITKARA_BLOCKS.find((b) => b.id === id);
const EMPTY = { subject: "", day: 1, start: "", end: "", block: "turing", room: "", color: COLORS[0] };

// Finds the next upcoming class within the coming week
function findNext(classes, now) {
  let best = null;
  for (let off = 0; off < 7; off++) {
    const day = (now.getDay() + off) % 7;
    const nowMin = now.getHours() * 60 + now.getMinutes();
    classes.filter((c) => c.day === day && (off > 0 || toMin(c.start) > nowMin)).forEach((c) => {
      const diff = off * 1440 + toMin(c.start) - nowMin;
      if (!best || diff < best.diff) best = { ...c, diff, off };
    });
    if (best) break;
  }
  return best;
}
const eta = (d) => d < 60 ? `in ${d} min` : d < 1440 ? `in ${Math.floor(d / 60)}h ${d % 60}m` : `in ${Math.floor(d / 1440)} day(s)`;

export default function Planner() {
  const { user } = useAuth();
  const toast = useToast();
  const { classes, addClass, updateClass, removeClass } = useClassStore();
  const [now, setNow] = useState(new Date());
  const [day, setDay] = useState(new Date().getDay() === 0 ? 1 : new Date().getDay());
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => { const id = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(id); }, []);

  const mine = useMemo(() => classes.filter((c) => c.ownerEmail === user.email), [classes, user.email]);
  const next = useMemo(() => findNext(mine, now), [mine, now]);
  const dayList = mine.filter((c) => c.day === day).sort((a, b) => a.start.localeCompare(b.start));
  const hours = Math.round(dayList.reduce((s, c) => s + (toMin(c.end) - toMin(c.start)), 0) / 6) / 10;

  const openAdd = () => { setForm({ ...EMPTY, day, color: COLORS[mine.length % COLORS.length] }); setErrors({}); setEditId(null); setOpen(true); };
  const openEdit = (c) => { setForm(c); setErrors({}); setEditId(c.id); setOpen(true); };
  const change = (e) => { const v = e.target.name === "day" ? Number(e.target.value) : e.target.value; setForm({ ...form, [e.target.name]: v }); setErrors({ ...errors, [e.target.name]: undefined }); };

  const submit = (e) => {
    e.preventDefault();
    const errs = validateClass(form);
    const clash = !Object.keys(errs).length && mine.find((c) => c.id !== editId && c.day === form.day && toMin(form.start) < toMin(c.end) && toMin(form.end) > toMin(c.start));
    if (clash) errs.start = `Clashes with ${clash.subject} (${fmt(clash.start)} - ${fmt(clash.end)}).`;
    setErrors(errs);
    if (Object.keys(errs).length) return;
    if (editId) { updateClass(editId, form); toast("Class updated."); } else { addClass({ ...form, ownerEmail: user.email }); toast("Class added to your planner."); }
    setDay(form.day);
    setOpen(false);
  };

  const nb = next && blockOf(next.block);
  return (
    <section className="section">
      <div className="container">
        <div className="page-head">
          <div className="section-title left"><span>Class Planner</span><h2>Never be late to class again</h2><p>Save your timetable once - we'll tell you what's next and where it is.</p></div>
          <button className="btn btn-primary" onClick={openAdd}><i className="fa-solid fa-plus" /> Add Class</button>
        </div>

        {next ? (
          <div className="next-class" style={{ "--c": next.color }}>
            <div className="nc-icon"><i className={`fa-solid ${nb?.icon || "fa-school"}`} /></div>
            <div className="nc-info">
              <span className="eyebrow">Next class - {eta(next.diff)}</span>
              <h3>{next.subject}</h3>
              <p><i className="fa-regular fa-clock" /> {DAYS[next.day]}, {fmt(next.start)} - {fmt(next.end)} &nbsp;<i className="fa-solid fa-location-dot" /> {nb?.name}{next.room && `, Room ${next.room}`}</p>
            </div>
            <Link to={`/map?focus=${next.block}`} className="btn btn-light"><i className="fa-solid fa-route" /> Find on map</Link>
          </div>
        ) : <div className="next-class empty"><i className="fa-solid fa-mug-hot" /> <div><h3>No upcoming classes</h3><p>Add your timetable to see what's next.</p></div></div>}

        <Tabs active={day} onChange={setDay} tabs={[1, 2, 3, 4, 5, 6].map((d) => ({ key: d, label: DAYS[d], count: mine.filter((c) => c.day === d).length }))} />
        {dayList.length > 0 && <p className="muted small" style={{ margin: "10px 0" }}>{dayList.length} class(es) - {hours} hours of lectures today</p>}

        {dayList.length === 0 ? <Empty icon="fa-calendar-plus" title={`Nothing planned on ${DAYS[day]}`} text="Enjoy the free day or add a class."><button className="btn btn-secondary" onClick={openAdd}>Add a class</button></Empty> : (
          <div className="timeline">
            {dayList.map((c) => (
              <div className="tl-item" key={c.id} style={{ "--c": c.color }}>
                <div className="tl-time"><b>{fmt(c.start)}</b><span>{fmt(c.end)}</span></div>
                <div className="tl-card">
                  <div><h3>{c.subject}</h3><p className="muted"><i className="fa-solid fa-location-dot" /> {blockOf(c.block)?.name}{c.room && ` - Room ${c.room}`}</p></div>
                  <div className="actions">
                    <Link className="icon-btn" to={`/map?focus=${c.block}`} title="Show on map"><i className="fa-solid fa-map-pin" /></Link>
                    <button className="icon-btn" onClick={() => openEdit(c)} title="Edit"><i className="fa-solid fa-pen" /></button>
                    <button className="icon-btn danger" onClick={() => { removeClass(c.id); toast("Class removed.", "info"); }} title="Delete"><i className="fa-solid fa-trash" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editId ? "Edit Class" : "Add Class"}>
        <form onSubmit={submit} noValidate className="form-grid">
          <div className="span2"><InputField label="Subject" id="subject" value={form.subject} onChange={change} error={errors.subject} placeholder="e.g. Front End Engineering-II" /></div>
          <InputField as="select" label="Day" id="day" value={form.day} onChange={change}>{[1, 2, 3, 4, 5, 6].map((d) => <option key={d} value={d}>{DAYS[d]}</option>)}</InputField>
          <InputField as="select" label="Block" id="block" value={form.block} onChange={change}>{CHITKARA_BLOCKS.filter((b) => b.category !== "Food").map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</InputField>
          <InputField label="Start time" id="start" type="time" value={form.start} onChange={change} error={errors.start} />
          <InputField label="End time" id="end" type="time" value={form.end} onChange={change} error={errors.end} />
          <InputField label="Room (optional)" id="room" value={form.room} onChange={change} placeholder="e.g. 204" />
          <div className="form-group"><label>Colour</label><div className="swatches">{COLORS.map((c) => <button type="button" key={c} aria-label={c} className={form.color === c ? "on" : ""} style={{ background: c }} onClick={() => setForm({ ...form, color: c })} />)}</div></div>
          <div className="span2 modal-actions"><button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>Cancel</button><button className="btn btn-primary">{editId ? "Save" : "Add Class"}</button></div>
        </form>
      </Modal>
    </section>
  );
}
