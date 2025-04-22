import "./index.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";

import { Toaster } from "sonner";

import { NotFound } from "./pages/404";
import { Hero } from "./pages/home/Hero";
import { SignIn } from "./pages/auth/SignIn";
import { AdminPanel } from "./pages/admin/AdminPanel";
import { PrivateRoute } from "./pages/auth/PrivateRoute";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Hero />} />
          <Route path="/sign-in" element={<SignIn />} />

          {/* Rotas protegidas */}
          <Route
            path="/admin-panel"
            element={
              <PrivateRoute>
                <AdminPanel />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
