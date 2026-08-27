import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { ClipboardList, History } from "lucide-react";
import "./AdminHome.css";

export default function AdminHome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="admin-page">

      {/* HEADER */}
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage hall bookings and monitor activities</p>
        <span className="admin-user">Logged in as: {user?.email}</span>
      </div>

      {/* CARDS */}
      <div className="admin-grid">

        {/* BOOKINGS */}
        <div
          className="admin-card"
          onClick={() => navigate("/admin/bookings")}
        >
          <ClipboardList className="admin-icon" />
          <h3>Manage Bookings</h3>
          <p>Approve or reject booking requests</p>
        </div>

        {/* HISTORY */}
        <div
          className="admin-card"
          onClick={() => navigate("/admin/completed")}
        >
          <History className="admin-icon" />
          <h3>Booking History</h3>
          <p>View completed bookings and reports</p>
        </div>

      </div>

    </div>
  );
}