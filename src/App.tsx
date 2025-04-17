import "./index.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Hero } from "./pages/home/Hero";
import { SignIn } from "./pages/auth/SignIn";
import { AdminPanel } from "./pages/admin/AdminPanel";

import { NotFound } from "./pages/404";
// import { PrivateRoute } from "./pages/auth/PrivateRoute";

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/sign-in" element={<SignIn />} />

        <Route
          path="/admin-panel"
          element={
            // <PrivateRoute>
            <AdminPanel />
            // </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
