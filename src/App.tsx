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

import { AuthProvider } from "./contexts/AuthProvider";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Hero />} />
            <Route path="/sign-in" element={<SignIn />} />

            {/* Protected routes */}
            <Route
              path="/admin-panel"
              element={
                <PrivateRoute>
                  <AdminPanel />
                </PrivateRoute>
              }
            />

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}
