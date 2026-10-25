const FEATURES = [
  ["fa-map-location-dot", "Campus Navigator", "Find every block and facility on an interactive map."],
  ["fa-calendar-check", "Class Planner", "Never be late: your next class and its block, one tap away."],
  ["fa-box-open", "Lost & Found", "Report and recover items with fellow students."],
];
export default function AuthSide() {
  return (
    <div className="auth-info">
      <div className="auth-info-inner">
        <div className="project-icon"><i className="fa-solid fa-compass" /></div>
        <h2>CHITKARA CONNECT</h2>
        <p className="muted-light">Your Campus Companion</p>
        {FEATURES.map(([icon, t, d]) => (
          <div className="feature-item" key={t}><i className={`fa-solid ${icon}`} /><div><h3>{t}</h3><p>{d}</p></div></div>
        ))}
      </div>
    </div>
  );
}
