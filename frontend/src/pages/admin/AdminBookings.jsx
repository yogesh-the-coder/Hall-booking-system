import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  Home,
  Info,
  Building2,
  ClipboardCheck,
} from "lucide-react";

export default function AdminBookings() {
  const [tab, setTab] = useState("pending");
  const [bookings, setBookings] = useState([]);
  const [reports, setReports] = useState({});
  const [activeBooking, setActiveBooking] = useState(null); // ✅ modal control

  const handleReportChange = (id, field, value) => {
    setReports(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const isReportComplete = (id) => {
  const r = reports[id] || {};

  return (
    (r.KeyReturned || r.keyReturned) &&
    (r.DamageFound || r.damageFound) &&
    (r.BannerRemoved || r.bannerRemoved) &&
    (r.ChairsArranged || r.chairsArranged) &&
    (r.ItemsReturned || r.itemsReturned)
  );
};

const deleteBooking = async (id) => {

  toast.dismiss();

  toast(
    ({ closeToast }) => (
      <div style={{ width: "100%" }}>

        <div
          style={{
            fontSize: "16px",
            fontWeight: "600",
            marginBottom: "8px",
            color: "#111827"
          }}
        >
          Delete Booking
        </div>

        <div
          style={{
            fontSize: "14px",
            color: "#4b5563",
            marginBottom: "16px",
            lineHeight: "1.5"
          }}
        >
          Are you sure you want to permanently delete this booking?
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px"
          }}
        >

          <button
            onClick={() => closeToast()}
            style={{
              padding: "8px 14px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              background: "#ffffff",
              color: "#374151",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            Cancel
          </button>

          <button
            onClick={async () => {

              try {

                const res = await fetch(
                  `http://localhost:5000/api/bookings/${id}`,
                  {
                    method: "DELETE"
                  }
                );

                const data = await res.json();

                if (!res.ok) {
                  toast.error(
                    data.message || "Unable to delete booking"
                  );
                  return;
                }

                toast.success("Booking deleted successfully");

                loadBookings();

                closeToast();

              } catch (error) {

                toast.error(
                  "Server error while deleting booking"
                );
              }
            }}
            style={{
              padding: "8px 14px",
              borderRadius: "8px",
              border: "none",
              background: "#dc2626",
              color: "#ffffff",
              cursor: "pointer",
              fontWeight: "600"
            }}
          >
            Delete
          </button>

        </div>

      </div>
    ),
    {
      position: "top-center",
      autoClose: false,
      closeButton: false,
      hideProgressBar: true,
      draggable: false,
      style: {
        borderRadius: "14px",
        padding: "8px",
        minWidth: "360px"
      }
    }
  );
};

  const loadBookings = async () => {
    const res = await fetch("http://localhost:5000/api/bookings");
    const data = await res.json();
    setBookings(data);

    const initialReports = {};
    data.forEach(b => {
      if (b.technicianReport) {
        initialReports[b._id] = b.technicianReport;
      }
    });
    setReports(initialReports);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const approveBooking = async (booking) => {
    await fetch(`http://localhost:5000/api/bookings/${booking._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "approved" })
    });
    loadBookings();
  };

  const rejectBooking = async (id) => {
    await fetch(`http://localhost:5000/api/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "rejected" })
    });
    loadBookings();
  };

  const saveReport = async (id) => {
    const res = await fetch(`http://localhost:5000/api/bookings/${id}/report`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reports[id])
    });

    if (!res.ok) {
      const err = await res.json();
      toast.error(err.message || "Something went wrong");
      return;
    }

    await loadBookings();
    toast.success("Report saved successfully");
  };

  const markCompleted = async (id) => {
    if (!isReportComplete(id)) {
      toast.warning("Complete report before marking as completed");
      return;
    }

    const res = await fetch(`http://localhost:5000/api/bookings/${id}/complete`, {
      method: "PUT"
    });

    if (!res.ok) {
      const err = await res.json();
      toast.error(err.message || "Something went wrong");
      return;
    }

    await loadBookings();
    setActiveBooking(null); // close modal
    toast.success("Booking marked as completed");
  };

  const filteredBookings = bookings.filter(b => b.status === tab);

  return (
    <div style={{ padding: "30px" }}>

      <h2>Booking Approval Panel</h2>

      <div style={styles.tabs}>
        <button style={{
    ...styles.tabButton,
    ...(tab === "pending" ? styles.activeTab : {})
  }} onClick={() => setTab("pending")}>Pending</button>
        <button style={{
    ...styles.tabButton,
    ...(tab === "approved" ? styles.activeTab : {})
  }}
  onClick={() => setTab("approved")}>Approved</button>
        <button style={{
    ...styles.tabButton,
    ...(tab === "rejected" ? styles.activeTab : {})
  }}
  onClick={() => setTab("rejected")}>Rejected</button>
      </div>

      {filteredBookings.map(b => (
        <div
  key={b._id}
  style={styles.card}
  onMouseEnter={(e) =>
    Object.assign(e.currentTarget.style, styles.cardHover)
  }
  onMouseLeave={(e) =>
    Object.assign(e.currentTarget.style, styles.card)
  }
>
  <button
  style={styles.deleteBtn}
  onClick={() => deleteBooking(b._id)}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "#dc2626";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "#ef4444";
  }}
>
  <Trash2 size={16} />
</button>
          <h3>{b.hall}</h3>

<p>
  <b>Name:</b> {b.name}
</p>

<p>
  <b>Designation:</b> {b.designation}
</p>

<p>
  <b>Email:</b> {b.email}
</p>

<p>
  <b>Phone:</b> {b.phone}
</p>

<p>
  <b>College:</b> {b.college}
</p>

<p>
  <b>Department:</b> {b.department}
</p>

<p>
  <b>Participants:</b> {b.year}
</p>

<p>
  <b>Event Title:</b> {b.purpose}
</p>

<p>
  <b>Equipment:</b> {b.equipment}
</p>

{b.otherEquipment && (
  <p>
    <b>Other Equipment:</b>
    {" "}
    {b.otherEquipment}
  </p>
)}

<p>
  <b>Date:</b> {b.date}
</p>

<p>
  <b>Slots:</b>
  {" "}
  {b.slots?.join(", ")}
</p>

          {b.status === "pending" && (
            <>
              <button style={styles.approve}
  onMouseEnter={(e) =>
    (e.target.style.background = "#059669")
  }
  onMouseLeave={(e) =>
    (e.target.style.background = "#10b981")
  } onClick={() => approveBooking(b)} >Approve</button>
              <button  style={styles.reject}
  onMouseEnter={(e) =>
    (e.target.style.background = "#dc2626")
  }
  onMouseLeave={(e) =>
    (e.target.style.background = "#ef4444")
  }  onClick={() => rejectBooking(b._id)} >Reject</button>
            </>
          )}

          {b.status === "approved" && (
            <button
              style={styles.openBtn}
  onMouseEnter={(e) => {
    e.target.style.transform = "translateY(-2px)";
    e.target.style.boxShadow = "0 6px 14px rgba(0,0,0,0.2)";
  }}
  onMouseLeave={(e) => {
    e.target.style.transform = "translateY(0)";
    e.target.style.boxShadow = "0 4px 10px rgba(0,0,0,0.15)";
  }}
              onClick={() => setActiveBooking(b)}
            >
              Open Technician Report
            </button>
          )}
        </div>
      ))}

      {/* ✅ MODAL */}
      {activeBooking && (
        <div style={styles.overlay}>
          <div style={styles.modal}>

            <div style={styles.modalHeader}>Technician Report</div>

            {[
  "keyReturned",
  "damageFound",
  "bannerRemoved",
  "chairsArranged",
  "itemsReturned"
].map(field => (
              <div key={field} style={styles.formGroup}>
                <label>
  {field
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, str => str.toUpperCase())}
</label>
                <select style={styles.select}
                 
                  value={reports[activeBooking._id]?.[field] || ""}
                  onChange={(e) =>
                    handleReportChange(activeBooking._id, field, e.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
            ))}

            <textarea style={styles.textarea}
              placeholder="Other remarks"
              value={reports[activeBooking._id]?.other || ""}
              onChange={(e) =>
                handleReportChange(activeBooking._id, "other", e.target.value)
              }
            />

            <div style={styles.buttonRow}>
              <button style={styles.secondaryBtn} onClick={() => saveReport(activeBooking._id)}>
                Save
              </button>

              <button style={styles.primaryBtn}
                onClick={() => markCompleted(activeBooking._id)}
                styles={{ background: "green", marginLeft: "90px" }}
              >
                Complete
              </button>

              <button style={styles.secondaryBtn}
                onClick={() => setActiveBooking(null)}
                styles={{ marginLeft: "90px" }}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

const styles = {
  /* ---------- TABS ---------- */
  tabs: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
    background: "#f9fafb",
    padding: "10px",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
  },

  tabButton: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#e5e7eb",
    cursor: "pointer",
    fontWeight: "500",
    transition: "0.2s"
  },

  activeTab: {
    background: "#4f7cff",
    color: "#fff"
  },

  /* ---------- CARD ---------- */
  card: {
  background: "#ffffff",
  padding: "18px",
  marginBottom: "15px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  transition: "0.2s",
  position: "relative"
},

  cardHover: {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 16px rgba(0,0,0,0.1)"
  },

  /* ---------- BUTTONS ---------- */
  approve: {
    background: "#10b981",
    color: "#fff",
    padding: "8px 14px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "10px",
    transition: "0.2s"
  },

  deleteBtn: {
  position: "absolute",
  top: "12px",
  right: "12px",
  background: "#ef4444",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  width: "34px",
  height: "34px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "0.2s"
},

  approveHover: {
    background: "#059669"
  },

  reject: {
    background: "#ef4444",
    color: "#fff",
    padding: "8px 14px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "0.2s"
  },

  rejectHover: {
    background: "#dc2626"
  },
  openBtn: {
  background: "linear-gradient(135deg, #021449, #1e3a8a)",
  color: "#fff",
  padding: "10px 16px",
  marginTop: "10px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "500",
  letterSpacing: "0.3px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  transition: "all 0.25s ease"
},
  overlay: {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999
},
modalHeader: {
  fontSize: "18px",
  fontWeight: "600",
  marginBottom: "15px",
  borderBottom: "1px solid #eee",
  paddingBottom: "8px"
},
  modal: {
  background: "#ffffff",
  padding: "25px",
  width: "420px",
  borderRadius: "14px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  border: "1px solid #e5e7eb",
  position: "relative",
  animation: "fadeIn 0.25s ease"
},
  formGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "10px"
  },
   input: {
  width: "100%",
  padding: "8px 10px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc"
},
select: {
  width: "100%",
  padding: "8px 10px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc"
},
textarea: {
  width: "100%",
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  marginTop: "10px"
},
buttonRow: {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "15px"
},
primaryBtn: {
  background: "#03255e",
  color: "#fff",
  padding: "8px 14px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
},
secondaryBtn: {
  background: "#e5e7eb",
  padding: "8px 14px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
}
};