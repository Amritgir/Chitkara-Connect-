import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import InputField from "../components/InputField";
import { validateLogin } from "../utils/validators";
import AuthSide from "../components/AuthSide";

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const change = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); setErrors({ ...errors, [e.target.name]: undefined }); };

  const submit = (e) => {
    e.preventDefault();
    const errs = validateLogin(form);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const res = login(form);
    if (!res.ok) return toast(res.error, "error");
    toast(`Welcome back, ${res.user.name.split(" ")[0]}!`);
    navigate(location.state?.from || "/", { replace: true });
  };

  return (
    <section className="auth-split">
      <AuthSide />
      <div className="auth-form-side">
        <form className="auth-card" onSubmit={submit} noValidate>
          <h2>Welcome Back</h2>
          <p className="muted">Login with your Chitkara University email ID.</p>
          <InputField label="Chitkara Email ID" id="email" type="email" placeholder="example@chitkara.edu.in" value={form.email} onChange={change} error={errors.email} autoComplete="email" />
          <InputField label="Password" id="password" type={show ? "text" : "password"} placeholder="Enter your password" value={form.password} onChange={change} error={errors.password} autoComplete="current-password" />
          <label className="check"><input type="checkbox" checked={show} onChange={() => setShow(!show)} /> Show password</label>
          <button className="btn btn-primary btn-block"><i className="fa-solid fa-right-to-bracket" /> Login</button>
          <p className="auth-switch">New user? <Link to="/signup">Create an account</Link></p>
        </form>
      </div>
    </section>
  );
}
