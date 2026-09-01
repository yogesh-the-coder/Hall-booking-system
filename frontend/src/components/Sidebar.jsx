import { NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";

import {
  Home,
  Info,
  Building2,
  ClipboardCheck,
} from "lucide-react";

import "./Sidebar.css";

export default function Sidebar() {

  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    isActive
      ? "bottom-item active"
      : "bottom-item";

  return (

    <div className="bottom-nav">

      {/* USER MENU */}

      {user?.role === "user" && (
  <>

    <NavLink
      to="/home"
      className={navClass}
    >
      <Home size={22} />
      <span>Home</span>
    </NavLink>

    <NavLink
      to="/home/about"
      className={navClass}
    >
      <Info size={22} />
      <span>About the Hall</span>
    </NavLink>

    <NavLink
      to="/home/bookings"
      className={navClass}
    >
      <Building2 size={22} />
      <span>Book Hall</span>
    </NavLink>

    <NavLink
      to="/home/my-bookings"
      className={navClass}
    >
      <ClipboardCheck size={22} />
      <span>My Bookings</span>
    </NavLink>

    <NavLink
      to="/home/profile"
      className={navClass}
    >
      <UserCircle2 size={22} />
      <span>Profile</span>
    </NavLink>

  </>
)}

      {/* ADMIN MENU */}

      {user?.role === "admin" && (
        <>

          <NavLink
            to="/admin"
            className={navClass}
          >
            <LayoutDashboard size={22} />
            <span>Dashboard</span>
          </NavLink>

          <div
            className="bottom-item"
            onClick={handleLogout}
          >
            <LogOut size={22} />
            <span>Logout</span>
          </div>

        </>
      )}

    </div>
  );
}