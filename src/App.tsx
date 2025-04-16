import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./index.css";

import { Hero } from "./pages/Hero";
import { AdminPanel } from "./pages/AdminPanel";
import NewAdminPanel from "./pages/NewAdminPanel";
import Login from "./pages/Login";

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/test" element={<NewAdminPanel />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}
