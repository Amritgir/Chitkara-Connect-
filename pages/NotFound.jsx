import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <section className="section">
      <div className="container state-box">
        <div className="big-404">404</div>
        <h2>Oops! You seem to be lost on campus</h2>
        <p>The page you are looking for does not exist. Let's get you back to a known block.</p>
        <div className="hero-actions" style={{ justifyContent: "center" }}>
          <Link to="/" className="btn btn-primary"><i className="fa-solid fa-house" /> Go Home</Link>
          <Link to="/map" className="btn btn-secondary"><i className="fa-solid fa-compass" /> Open Campus Map</Link>
        </div>
      </div>
    </section>
  );
}
