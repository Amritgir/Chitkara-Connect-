import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { useSearchParams } from "react-router-dom";
import { CHITKARA_BLOCKS, CAMPUS_CENTER } from "../data/blocks";
import useDebounce from "../hooks/useDebounce";
import Tabs from "../components/Tabs";
import { Empty } from "../components/States";

const pin = (icon) => L.divIcon({ className: "", iconSize: [38, 38], iconAnchor: [19, 38], popupAnchor: [0, -34], html: `<div class="map-pin"><i class="fa-solid ${icon}"></i></div>` });

export default function CampusMap() {
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get("search") || "");
  const [category, setCategory] = useState("all");
  const debounced = useDebounce(search, 250);
  const mapRef = useRef(null);
  const layerRef = useRef(null);
  const markers = useRef({});
  const el = useRef(null);

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    return CHITKARA_BLOCKS.filter((b) => (category === "all" || b.category === category) &&
      [b.name, b.branch, b.tag, b.landmark, b.category].some((t) => t.toLowerCase().includes(q)));
  }, [debounced, category]);

  // create map once
  useEffect(() => {
    const map = L.map(el.current).setView(CAMPUS_CENTER, 17);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap | Chitkara Connect" }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // redraw markers when the filtered list changes
  useEffect(() => {
    const layer = layerRef.current;
    layer.clearLayers();
    markers.current = {};
    filtered.forEach((b) => {
      const m = L.marker([b.lat, b.lng], { icon: pin(b.icon) }).bindPopup(
        `<span class="badge ${b.category === "Academic" ? "badge-lost" : "badge-found"}">${b.category}</span>
         <h3 class="popup-title">${b.name}</h3><p class="popup-text">${b.branch}</p><p class="popup-text muted">${b.landmark}</p>
         <a class="popup-link" target="_blank" rel="noreferrer" href="https://www.google.com/maps/dir/?api=1&destination=${b.lat},${b.lng}">Get directions →</a>`
      );
      layer.addLayer(m);
      markers.current[b.id] = m;
    });
  }, [filtered]);

  const focus = (id) => {
    const b = CHITKARA_BLOCKS.find((x) => x.id === id);
    if (!b || !mapRef.current) return;
    mapRef.current.flyTo([b.lat, b.lng], 18, { duration: 1 });
    setTimeout(() => markers.current[id]?.openPopup(), 1000);
  };

  // deep link: /map?focus=turing (used by Class Planner)
  useEffect(() => {
    const id = params.get("focus");
    if (id) setTimeout(() => focus(id), 300);
    // eslint-disable-next-line
  }, []);

  const tabs = [{ key: "all", label: "All" }, { key: "Academic", label: "Academic", icon: "fa-building-columns" }, { key: "Facility", label: "Facilities", icon: "fa-dumbbell" }, { key: "Food", label: "Food", icon: "fa-utensils" }];

  return (
    <section className="section map-section">
      <div className="container">
        <div className="section-title left"><span>Campus Navigator</span><h2>Find any block in seconds</h2></div>
        <div className="map-layout">
          <aside className="map-side">
            <div className="search-box"><i className="fa-solid fa-magnifying-glass" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search block, branch, landmark..." aria-label="Search campus" /></div>
            <Tabs tabs={tabs} active={category} onChange={setCategory} />
            <div className="block-list">
              {filtered.length === 0 ? <Empty icon="fa-location-crosshairs" title="No results" text="Try another block name or branch." /> :
                filtered.map((b) => (
                  <button key={b.id} className="block-card" onClick={() => focus(b.id)}>
                    <h3><i className={`fa-solid ${b.icon}`} /> {b.name}</h3>
                    <p><strong>{b.tag}</strong></p><p>{b.branch}</p>
                  </button>
                ))}
            </div>
          </aside>
          <div className="map-wrap"><div ref={el} className="campus-map" /></div>
        </div>
      </div>
    </section>
  );
}
