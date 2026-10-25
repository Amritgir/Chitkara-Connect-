import { useState } from "react";
import { NavLink, Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import { useEffect } from "react";

const LINKS = [
  { to: "/", label: "Home", icon: "fa-house", end: true },
  { to: "/map", label: "Campus Map", icon: "fa-map-location-dot" },
  { to: "/lost-found", label: "Lost & Found", icon: "fa-box-open" },
  { to: "/planner", label: "Class Planner", icon: "fa-calendar-check" },
  { to: "/notices", label: "Notices", icon: "fa-bullhorn" },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [pathname]);

  return (
    <>
      <nav className="navbar">
        <div className="container nav-container">
          <Link to="/" className="brand">
            <img src="/images/images.png" alt="Chitkara University" className="brand-logo" />
            <div className="brand-content"><h1>CHITKARA</h1><span>CONNECT</span></div>
          </Link>
          <ul className={`nav-menu ${open ? "open" : ""}`}>
            {LINKS.map((l) => (
              <li key={l.to}><NavLink to={l.to} end={l.end} className="nav-link"><i className={`fa-solid ${l.icon}`} /> {l.label}</NavLink></li>
            ))}
            <li className="nav-auth">
              {user ? (
                <>
                  <span className="user-chip"><i className="fa-solid fa-circle-user" /> {user.name.split(" ")[0]}</span>
                  <button className="nav-btn" onClick={() => { logout(); toast("You have been logged out.", "info"); }}><i className="fa-solid fa-right-from-bracket" /> Logout</button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className="nav-link"><i className="fa-solid fa-right-to-bracket" /> Login</NavLink>
                  <Link to="/signup" className="nav-btn"><i className="fa-solid fa-user-plus" /> Sign Up</Link>
                </>
              )}
            </li>
          </ul>
          <div className="nav-tools">
            <button className="icon-btn" onClick={toggle} aria-label="Toggle theme" title="Toggle theme"><i className={`fa-solid ${theme === "dark" ? "fa-sun" : "fa-moon"}`} /></button>
            <button className="icon-btn menu-toggle" onClick={() => setOpen((o) => !o)} aria-label="Menu"><i className={`fa-solid ${open ? "fa-xmark" : "fa-bars"}`} /></button>
          </div>
        </div>
      </nav>
      <main><Outlet /></main>
      <footer className="footer">
        <div className="container footer-content">
          <p><b>CHITKARA CONNECT</b> - built with React, Router, Zustand &amp; Axios</p>
          <p>Made for Chitkara University Punjab Campus - Front End Engineering-II</p>
        </div>
      </footer>
    </>
  );
}
