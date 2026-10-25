import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useItemStore } from "../store/useStore";
import WeatherCard from "../components/WeatherCard";

const FEATURES = [
  { to: "/map", icon: "fa-map-location-dot", title: "Campus Block Finder", text: "Search academic blocks, food courts and facilities on an interactive map with one-tap directions." },
  { to: "/planner", icon: "fa-calendar-check", title: "Class Planner", text: "Save your timetable, see your next class and jump straight to its block on the map.", badge: "New" },
  { to: "/lost-found", icon: "fa-magnifying-glass-location", title: "Lost & Found Portal", text: "Post, search, edit and resolve lost or found items with category, location and contact info." },
  { to: "/notices", icon: "fa-bullhorn", title: "Campus Notices", text: "Live notice board fetched from a REST API with search, filters, saved notices and infinite scroll.", badge: "API" },
];

function Counter({ to }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let cur = 0;
    const id = setInterval(() => { cur += Math.max(1, Math.ceil(to / 25)); if (cur >= to) { cur = to; clearInterval(id); } setN(cur); }, 40);
    return () => clearInterval(id);
  }, [to]);
  return <>{n}</>;
}

export default function Home() {
  const { user } = useAuth();
  const items = useItemStore((s) => s.items);
  const open = items.filter((i) => !i.resolved).length;
  const solved = items.filter((i) => i.resolved).length;

  return (
    <>
      <section className="hero">
        <div className="blob b1" /><div className="blob b2" />
        <div className="container hero-grid">
          <div className="fade-up">
            <div className="pill"><i className="fa-solid fa-graduation-cap" /> Built by students, for students</div>
            <h1>{user ? `Hey ${user.name.split(" ")[0]},` : "Welcome to"} <span className="grad">your campus</span>, simplified.</h1>
            <p>Find blocks, never miss a class, recover lost belongings and stay updated with notices - all in one place for Chitkara University students.</p>
            <div className="hero-actions">
              <Link to="/map" className="btn btn-primary"><i className="fa-solid fa-compass" /> Open Campus Map</Link>
              {user ? <Link to="/planner" className="btn btn-secondary"><i className="fa-solid fa-calendar-check" /> My Planner</Link> : <Link to="/signup" className="btn btn-secondary"><i className="fa-solid fa-user-plus" /> Get Started</Link>}
            </div>
            <div className="stats">
              <div><b><Counter to={10} />+</b><span>Campus places</span></div>
              <div><b><Counter to={open} /></b><span>Open lost &amp; found</span></div>
              <div><b><Counter to={solved} /></b><span>Items returned</span></div>
            </div>
          </div>
          <div className="hero-side fade-up">
            <WeatherCard />
            <div className="hero-img"><img src="/images/Higher-Education.jpg" alt="Chitkara campus" /><span className="float-tag"><i className="fa-solid fa-location-dot" /> Punjab Campus</span></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <span>What you can do</span>
            <h2>Everyday campus problems, one app</h2>
            <p>Freshers get lost, timetables change, ID cards vanish. Chitkara Connect fixes the small things that cost you time.</p>
          </div>
          <div className="cards four">
            {FEATURES.map((f) => (
              <Link to={f.to} className="card feature" key={f.to}>
                {f.badge && <span className="ribbon">{f.badge}</span>}
                <div className="card-icon"><i className={`fa-solid ${f.icon}`} /></div>
                <h3>{f.title}</h3><p>{f.text}</p>
                <span className="link-arrow">Open <i className="fa-solid fa-arrow-right" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
