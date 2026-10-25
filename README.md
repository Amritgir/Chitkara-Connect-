# Chitkara Connect (React) - FEE-II Project, PBE-2

Campus companion for Chitkara University students: Campus Map, Lost & Found, **Class Planner (new)**, and Campus Notices (REST API).

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build -> dist/
```
Deploy on Vercel/Netlify (SPA rewrites included: `vercel.json`, `public/_redirects`).

## Syllabus coverage (Lectures 1-72)
| Topic | Where |
|---|---|
| Components, props, JSX, lists, conditional rendering | every page, `components/` |
| useState / useEffect / useRef / useMemo / useCallback | `Planner`, `Notices`, `CampusMap`, `LostFound` |
| Custom hooks | `hooks/useDebounce.js`, `hooks/useAsync.js` |
| Lifting state up, reusable UI | `Tabs`, `Dropdown`, `Modal`, `InputField`, `Pagination` |
| React Router: nested, protected routes, 404, query params | `App.jsx`, `ProtectedRoute.jsx`, `NotFound.jsx`, `/map?focus=` |
| Context API (global state) | `AuthContext`, `ThemeContext`, `ToastContext` |
| Zustand + persistence | `store/useStore.js` |
| Async state, loading/error handling | `useAsync`, `States.jsx` |
| Forms, controlled components, validation | `Login`, `Signup`, `LostFound`, `Planner`, `utils/validators.js` |
| Modal, tabs, dropdown, toast | `components/`, `ToastContext` |
| Search, filter, sort | Map, Lost & Found, Notices |
| REST API with Axios, retry/backoff | `services/api.js` (JSONPlaceholder + Open-Meteo) |
| Pagination, infinite scroll, debounce | Lost & Found (pagination), Notices (IntersectionObserver), search boxes |
| CRUD workflows | Lost & Found, Class Planner |
| Lazy loading / code splitting | `React.lazy` in `App.jsx` |

## New skill: Class Planner
Freshers waste time finding rooms and missing classes. Add your timetable once; the app shows your **next class, time remaining, and the block on the map** (one tap), blocks clashing classes, and works per student account.

Data is kept in the browser (localStorage). Existing accounts from the old version still work.
