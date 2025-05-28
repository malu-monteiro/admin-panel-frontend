import "./index.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";

import { Toaster } from "sonner";

import { NotFound } from "./pages/404";
import { Home } from "./pages/home";
import { SignIn } from "./pages/auth/SignIn";
import { AdminPanel } from "./pages/admin/AdminPanel";
import { VerifyEmail } from "./pages/auth/VerifyEmail";
import { ResetPassword } from "./pages/auth/ResetPassword";

// import { PrivateRoute } from "./routes/PrivateRoute";

import { AuthProvider } from "./contexts/AuthProvider";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />

            {/* Protected routes */}
            <Route
              path="/admin-panel"
              element={
                // <PrivateRoute>
                <AdminPanel />
                // </PrivateRoute>
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
