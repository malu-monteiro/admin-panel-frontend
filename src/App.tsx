import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./index.css";

import { SchedulingButton } from "./pages/SchedulingButton";
import AdminPanel from "./pages/AdminPanel";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SchedulingButton />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}
