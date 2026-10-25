import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import InputField from "../components/InputField";
import AuthSide from "../components/AuthSide";
import { validateSignup, passwordStrength } from "../utils/validators";

export default function Signup() {
  const { signup } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const strength = passwordStrength(form.password);

  const change = (e) => {
    const next = { ...form, [e.target.name]: e.target.value };
    setForm(next);
    if (touched[e.target.name]) setErrors(validateSignup(next)); // live validation after first blur
  };
  const blur = (e) => { setTouched({ ...touched, [e.target.name]: true }); setErrors(validateSignup(form)); };
  const shown = (k) => (touched[k] ? errors[k] : undefined);

  const submit = (e) => {
    e.preventDefault();
    const errs = validateSignup(form);
    setErrors(errs);
    setTouched({ name: true, email: true, password: true, confirm: true });
    if (Object.keys(errs).length) return;
    const res = signup(form);
    if (!res.ok) { toast(res.error, "error"); return navigate("/login"); }
    toast("Account created! Please log in.");
    navigate("/login");
  };

  return (
    <section className="auth-split">
      <AuthSide />
      <div className="auth-form-side">
        <form className="auth-card" onSubmit={submit} noValidate>
          <h2>Create Account</h2>
          <p className="muted">Sign up using your Chitkara University email ID.</p>
          <InputField label="Full Name" id="name" placeholder="Enter your full name" value={form.name} onChange={change} onBlur={blur} error={shown("name")} />
          <InputField label="Chitkara Email ID" id="email" type="email" placeholder="example@chitkara.edu.in" value={form.email} onChange={change} onBlur={blur} error={shown("email")} />
          <InputField label="Password" id="password" type="password" placeholder="Minimum 6 characters" value={form.password} onChange={change} onBlur={blur} error={shown("password")} />
          {form.password && (
            <div className="strength" aria-label={`Password strength: ${strength.label}`}>
              {[1, 2, 3, 4].map((i) => <span key={i} className={i <= strength.score ? `on s${strength.score}` : ""} />)}
              <em>{strength.label}</em>
            </div>
          )}
          <InputField label="Confirm Password" id="confirm" type="password" placeholder="Re-enter password" value={form.confirm} onChange={change} onBlur={blur} error={shown("confirm")} />
          <button className="btn btn-primary btn-block"><i className="fa-solid fa-user-plus" /> Sign Up</button>
          <p className="auth-switch">Already have an account? <Link to="/login">Login here</Link></p>
        </form>
      </div>
    </section>
  );
}
