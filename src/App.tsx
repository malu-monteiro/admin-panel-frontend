import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./index.css";

import { Home } from "./pages/Home";
import { AdminPanel } from "./pages/AdminPanel";

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}
