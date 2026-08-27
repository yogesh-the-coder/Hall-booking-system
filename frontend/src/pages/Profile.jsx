import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

import {
  Mail,
  ShieldCheck,
  UserCircle2,
  CalendarDays,
  LogOut,
  Sparkles
} from "lucide-react";

export default function Profile() {

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (

    <div style={styles.page}>

      {/* HERO */}

      <div style={styles.hero}>

        <div>

          <h1 style={styles.heading}>
            Welcome Back 👋
          </h1>

          <p style={styles.subHeading}>
            Check your role , mail in the below profile section 
          </p>

        </div>

        <Sparkles size={70} color="#fff" />

      </div>

      {/* PROFILE CARD */}

      <div style={styles.card}>

        {/* PROFILE IMAGE */}

        <div style={styles.avatar}>
          <UserCircle2 size={90} />
        </div>

        <br></br>

        <div style={styles.infoRow1}>
            <Mail size={18} />
            <span>{user?.email}</span>
          </div>

        {/* DETAILS */}

        <div style={styles.infoBox}>

          

          <div style={styles.infoRow}>
            <ShieldCheck size={18} />
            <span>
              Role : {user?.role}
            </span>
          </div>

          <div style={styles.infoRow}>
            <CalendarDays size={18} />
            <span>
              Active Hall Booking User
            </span>
          </div>

        </div>

        {/* STATS */}

        <div style={styles.statsContainer}>

          <div style={styles.statCard}>
            <h3>24/7</h3>
            <p>Booking Access</p>
          </div>

          <div style={styles.statCard}>
            <h3>Fast</h3>
            <p>Approval Process</p>
          </div>

          <div style={styles.statCard}>
            <h3>Secure</h3>
            <p>User System</p>
          </div>

        </div>

        {/* BUTTON */}

        <button
          style={styles.logoutBtn}
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>

    </div>
  );
}

const styles = {

  page: {
    minHeight: "100vh",
    padding: "35px",
    background:
      "linear-gradient(135deg,#eef4ff,#f8fbff,#f5f3ff)"
  },

  hero: {
    maxWidth: "1100px",
    margin: "0 auto 30px",

    background:
      "linear-gradient(135deg,#2563eb,#4f7cff,#7c3aed)",

    borderRadius: "28px",

    padding: "35px 40px",

    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    color: "#fff",

    boxShadow:
      "0 18px 45px rgba(37,99,235,0.22)"
  },

  heading: {
    fontSize: "38px",
    fontWeight: "800",
    marginBottom: "10px"
  },

  subHeading: {
    fontSize: "16px",
    opacity: 0.95,
    lineHeight: "1.7"
  },

  card: {
    maxWidth: "1100px",
    margin: "auto",

    background: "#fff",

    borderRadius: "30px",

    padding: "40px",

    boxShadow:
      "0 15px 40px rgba(0,0,0,0.08)",

    textAlign: "center"
  },

  avatar: {
    width: "120px",
    height: "120px",

    margin: "auto",

    borderRadius: "50%",

    background:
      "linear-gradient(135deg,#2563eb,#7c3aed)",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    color: "#fff",

    boxShadow:
      "0 12px 30px rgba(79,124,255,0.25)"
  },

  userName: {
    marginTop: "18px",
    fontSize: "30px",
    fontWeight: "700",
    color: "#111827"
  },

  roleBadge: {
    display: "inline-block",

    marginTop: "10px",

    padding: "8px 18px",

    borderRadius: "999px",

    background: "#eef2ff",

    color: "#4338ca",

    fontWeight: "700",

    fontSize: "13px",

    letterSpacing: "1px"
  },

  infoBox: {
    marginTop: "35px",

    display: "flex",
    flexDirection: "column",
    gap: "18px",

    background: "#f8fafc",

    padding: "25px",
    

    borderRadius: "22px"
  },

  infoRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",

    color: "#374151",
    

    fontSize: "15px",
    fontWeight: "500"
  },

  statsContainer: {
    marginTop: "30px",

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(180px,1fr))",

    gap: "20px"
  },

  statCard: {
    background:
      "linear-gradient(135deg,#eff6ff,#f5f3ff)",

    padding: "22px",

    borderRadius: "22px",

    boxShadow:
      "0 8px 22px rgba(0,0,0,0.04)"
  },

  logoutBtn: {
    marginTop: "35px",

    width: "100%",

    padding: "15px",

    border: "none",
    borderRadius: "18px",

    background:
      "linear-gradient(135deg,#ef4444,#dc2626)",

    color: "#fff",

    fontSize: "16px",
    fontWeight: "700",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",

    cursor: "pointer",

    transition: "0.3s ease",

    boxShadow:
      "0 10px 24px rgba(239,68,68,0.25)"
  },

infoRow1: {
    display: "flex",
    alignItems: "center",
    gap: "12px",

    color: "#374151",
    justifyContent: "center",

    fontSize: "15px",
    fontWeight: "500"
  },

};