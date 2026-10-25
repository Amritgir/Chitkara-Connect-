import { useEffect, useRef, useState } from "react";

export default function Dropdown({ label, options, value, onChange, icon = "fa-arrow-down-wide-short" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const current = options.find((o) => o.value === value);
  return (
    <div className="dropdown" ref={ref}>
      <button type="button" className="dropdown-btn" onClick={() => setOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={open}>
        <i className={`fa-solid ${icon}`} /> <span>{label}: <b>{current?.label}</b></span> <i className={`fa-solid fa-chevron-${open ? "up" : "down"} caret`} />
      </button>
      {open && (
        <ul className="dropdown-menu" role="listbox">
          {options.map((o) => (
            <li key={o.value}>
              <button type="button" className={o.value === value ? "selected" : ""} onClick={() => { onChange(o.value); setOpen(false); }}>
                {o.label} {o.value === value && <i className="fa-solid fa-check" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
