import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { Spinner } from "./components/States";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

// Code splitting: heavy pages load only when visited
const CampusMap = lazy(() => import("./pages/CampusMap"));
const LostFound = lazy(() => import("./pages/LostFound"));
const Planner = lazy(() => import("./pages/Planner"));
const Notices = lazy(() => import("./pages/Notices"));

export default function App() {
  return (
    <Suspense fallback={<Spinner text="Loading page..." />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route element={<ProtectedRoute />}>
            <Route path="map" element={<CampusMap />} />
            <Route path="lost-found" element={<LostFound />} />
            <Route path="planner" element={<Planner />} />
            <Route path="notices" element={<Notices />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
