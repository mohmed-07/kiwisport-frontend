import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import Dashboard from "./Dashboard"; 
import Members from "./pages/Members";
import Attendance from "./pages/Attendance";
import Payments from "./pages/Payments";
import MemberHome from "./pages/MemberHome";
import SuperAdmin from "./pages/SuperAdmin"; // Make sure you created this file!

// We keep these imported in case you want to enable them later
import Login from "./pages/Login"; 
import Register from "./pages/Register";

import { AuthProvider, useAuth } from "./context/AuthContext";

// --- 1. SUPER ADMIN GUARD (Only for YOU) ---
// Blocks everyone except role="superuser"
const SuperAdminRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/member-home" />;
  if (user.role !== "superuser") return <Navigate to="/" />; // Redirects standard admins to dashboard
  
  return children;
};

// --- 2. ADMIN GUARD (Club Managers + You) ---
// Blocks members, but allows "admin" AND "superuser"
const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) return <Navigate to="/member-home" />;
  
  // Allow access if you are a Manager OR the Superuser
  if (user.role === "admin" || user.role === "superuser") {
    return children;
  }
  
  return <Navigate to="/member-home" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          
          {/* --- PUBLIC / MEMBER ROUTES --- */}
          <Route path="/member-home" element={<MemberHome />} />
          
          {/* Login/Register disabled for Dev Mode 
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          */}

          {/* --- SUPER ADMIN ROUTE (The "God Mode" Page) --- */}
          <Route path="/super-admin" element={
            <SuperAdminRoute>
              <SuperAdmin />
            </SuperAdminRoute>
          } />

          {/* --- MANAGER DASHBOARD ROUTES --- */}
          {/* Accessible by Admin AND Superuser */}
          <Route path="/" element={
              <AdminRoute>
                <Layout />
              </AdminRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="members" element={<Members />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="payments" element={<Payments />} />
          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}