import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);
const USERS = "cc_users";
const CURRENT = "cc_current_user";
const read = (k, fallback) => { try { return JSON.parse(localStorage.getItem(k)) ?? fallback; } catch { return fallback; } };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => read(CURRENT, null));

  const signup = useCallback(({ name, email, password }) => {
    const users = read(USERS, []);
    const mail = email.trim().toLowerCase();
    if (users.some((u) => u.email === mail)) return { ok: false, error: "An account with this email already exists. Please log in." };
    localStorage.setItem(USERS, JSON.stringify([...users, { name: name.trim(), email: mail, password }]));
    return { ok: true };
  }, []);

  const login = useCallback(({ email, password }) => {
    const mail = email.trim().toLowerCase();
    const found = read(USERS, []).find((u) => u.email === mail && u.password === password);
    if (!found) return { ok: false, error: "Invalid email or password." };
    const session = { name: found.name, email: found.email };
    localStorage.setItem(CURRENT, JSON.stringify(session));
    setUser(session);
    return { ok: true, user: session };
  }, []);

  const logout = useCallback(() => { localStorage.removeItem(CURRENT); setUser(null); }, []);

  return <AuthContext.Provider value={{ user, signup, login, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
