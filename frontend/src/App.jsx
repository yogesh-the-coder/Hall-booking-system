import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Bookings from "./pages/Bookings";

import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";
import Profile from "./pages/Profile";

import AdminBookings from "./pages/admin/AdminBookings";

import SeminarHall from "./pages/booking/SeminarHall";
import StudioHall from "./pages/booking/StudioHall";
import AdminHome from "./pages/admin/AdminHome";
import AdminCompleted from "./pages/admin/AdminCompleted";
import MyBookings from "./pages/user/MyBookings";

import { ToastContainer } from "react-toastify";
import About from "./pages/About";
import "react-toastify/dist/ReactToastify.css";

import '@fortawesome/fontawesome-free/css/all.min.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* ---------- AUTH ROUTES ---------- */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />


          {/* ---------- USER ROUTES ---------- */}
          <Route
            path="/home"
            element={
              <ProtectedRoute allowedRoles={["user"]}> 
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="profile" element={<Profile />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="bookings/seminar" element={<SeminarHall />} />
            <Route path="bookings/studio" element={<StudioHall />} />
            <Route path="my-bookings" element={<MyBookings />} />
            <Route path="about" element={<About />} />
          </Route>

          {/* ---------- ADMIN ROUTES ---------- */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
            
          >
            <Route index element={<AdminHome />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="completed" element={<AdminCompleted />} />
          </Route>


        </Routes>

        <ToastContainer position="top-right" autoClose={3000} />

      </AuthProvider>
    </BrowserRouter>
  );
}