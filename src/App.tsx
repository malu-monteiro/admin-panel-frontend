import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./index.css";

import { Hero } from "./pages/Hero";
import { AdminPanel } from "./pages/AdminPanel";

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}
