import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { toast } from "react-toastify";
import "./MyBookings.css";

const API = process.env.REACT_APP_API_URL;

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);

  const [filters, setFilters] = useState({
    date: "",
    hall: "",
    name: ""
  });

  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState(null);

  /* ---------------- LOAD BOOKINGS ---------------- */
  const loadBookings = useCallback(async () => {
  if (!user?.email) return;

  try {
    const res = await fetch(`${API}/bookings`);

    const data = await res.json();

    const userBookings = data.filter(
      (b) =>
        b.email === user.email &&
        (b.status === "approved" || b.status === "completed")
    );

    setBookings(userBookings);
  } catch (error) {
    console.error("Failed to load bookings:", error);
    toast.error("Failed to load bookings");
  }
}, [user?.email]);

  useEffect(() => {
  loadBookings();
}, [loadBookings]);

  /* ---------------- CANCEL ---------------- */
  const cancelBooking = async (id) => {
  toast(
    ({ closeToast }) => (
      <div>
        <p style={{ marginBottom: "10px" }}>
          Are you sure you want to cancel this booking?
        </p>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={async () => {
              closeToast();

              const res = await fetch(
                `http://localhost:5000/api/bookings/${id}/cancel`,
                {
                  method: "PUT"
                }
              );

              if (!res.ok) {
                const err = await res.json();
                toast.error(err.message || "Cancellation failed");
                return;
              }

              toast.success("Booking cancelled successfully");
              loadBookings();
            }}
            style={{
              background: "#ef4444",
              color: "#fff",
              border: "none",
              padding: "8px 14px",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Yes
          </button>

          <button
            onClick={closeToast}
            style={{
              background: "#e5e7eb",
              border: "none",
              padding: "8px 14px",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            No
          </button>
        </div>
      </div>
    ),
    {
      autoClose: false,
      closeOnClick: false
    }
  );
};

  /* ---------------- EDIT ---------------- */
  const editBooking = (booking) => {
    setEditData({
      ...booking,
      slots: booking.slots || []
    });
    setEditModal(true);
  };

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const updateBooking = async () => {
    if (!editData || !editData._id) {
      toast.warning("Invalid booking data");
      return;
    }

    const res = await fetch(
      `http://localhost:5000/api/bookings/${editData._id}/edit`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData)
      }
    );

    if (!res.ok) {
      const err = await res.json();
      toast.error(err.message);
      return;
    }

    toast.success("Booking updated successfully");
    setEditModal(false);
    loadBookings();
  };

  /* ---------------- FILTER ---------------- */
  const filteredBookings = bookings.filter((b) => {
    return (
      (!filters.date || b.date === filters.date) &&
      (!filters.hall ||
        b.hall.toLowerCase().includes(filters.hall.toLowerCase())) &&
      (!filters.name ||
        b.name.toLowerCase().includes(filters.name.toLowerCase()))
    );
  });

  return (
    <div className="mybooking-page">

      <h2 className="title">My Bookings</h2>

      {/* FILTER */}
      <div className="filter-bar">
        <input
          type="date"
          value={filters.date}
          onChange={(e) =>
            setFilters({ ...filters, date: e.target.value })
          }
        />

        <select
          value={filters.hall}
          onChange={(e) =>
            setFilters({ ...filters, hall: e.target.value })
          }
        >
          <option value="">All Halls</option>
          <option>Seminar Hall</option>
          <option>Studio Hall</option>
        </select>

        <input
          placeholder="Search by name"
          value={filters.name}
          onChange={(e) =>
            setFilters({ ...filters, name: e.target.value })
          }
        />

        <button onClick={() => setFilters({ date: "", hall: "", name: "" })}>
          Reset
        </button>
      </div>

      {/* BOOKING CARDS */}
      
      <div className="booking-grid">
  {filteredBookings.map((b) => (
    <div key={b._id} className="booking-card">

      <div className="card-header">
        <h3>{b.hall}</h3>
        <span className="status completed">
          Completed
        </span>
      </div>

      {/* MAIN TABLE */}
      <table className="booking-table">
        <tbody>

          <tr>
            <td>Name</td>
            <td>{b.name}</td>
          </tr>

          <tr>
            <td>Email</td>
            <td>{b.email}</td>
          </tr>

          <tr>
            <td>Phone</td>
            <td>{b.phone}</td>
          </tr>

          <tr>
            <td>Designation</td>
            <td>{b.designation}</td>
          </tr>

          <tr>
            <td>College</td>
            <td>{b.college}</td>
          </tr>

          <tr>
            <td>Department</td>
            <td>{b.department}</td>
          </tr>

          <tr>
            <td>Participants</td>
            <td>{b.year}</td>
          </tr>

          <tr>
            <td>Date</td>
            <td>{b.date}</td>
          </tr>

          <tr>
            <td>Slots</td>
            <td>{b.slots?.join(", ")}</td>
          </tr>

          <tr>
            <td>Purpose</td>
            <td>{b.purpose}</td>
          </tr>

          <tr>
            <td>Equipment</td>
            <td>{b.equipment}</td>
          </tr>

          {b.otherEquipment && (
            <tr>
              <td>Other Equipment</td>
              <td>{b.otherEquipment}</td>
            </tr>
          )}

        </tbody>
      </table>

      {/* ACTIONS */}
            <div className="actions">
              {b.status !== "completed" && (
                <>
                  <button
                    className="edit"
                    onClick={() => editBooking(b)}
                  >
                    Edit
                  </button>

                  <button
                    className="cancel"
                    onClick={() => cancelBooking(b._id)}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>

      {/* REPORT TABLE */}
      {b.technicianReport && (
        <div className="report-box">

          <h4>Technician Report</h4>

          <table className="booking-table report-table">
            <tbody>

              <tr>
                <td>Key Returned</td>
                <td>{b.technicianReport.keyReturned}</td>
              </tr>

              <tr>
                <td>Damage Found</td>
                <td>{b.technicianReport.damageFound}</td>
              </tr>

              <tr>
                <td>Banner Removed</td>
                <td>{b.technicianReport.bannerRemoved}</td>
              </tr>

              <tr>
                <td>Chairs Arranged</td>
                <td>{b.technicianReport.chairsArranged}</td>
              </tr>

              <tr>
                <td>Items Returned</td>
                <td>{b.technicianReport.itemsReturned}</td>
              </tr>

              {b.technicianReport.other && (
                <tr>
                  <td>Other Remarks</td>
                  <td>{b.technicianReport.other}</td>
                </tr>
              )}

            </tbody>
          </table>

        </div>
      )}

    </div>
  ))}
</div>

      {/* EDIT MODAL */}
      {editModal && (
        <div className="overlay">
          <div className="modal">

            <h3>Edit Booking</h3><br></br>

  {/* NAME */}
  
    <label>Name</label><br></br>
    <input
      value={editData.name || ""}
      onChange={(e) =>
        handleEditChange("name", e.target.value)
      }
    />

  {/* EMAIL */}
    <label>Email</label><br></br>
    <input
      type="email"
      value={editData.email || ""}
      onChange={(e) =>
        handleEditChange("email", e.target.value)
      }
    />

  {/* PHONE */}
    <label>Phone</label><br></br>
    <input
      type="text"
      value={editData.phone || ""}
      onChange={(e) =>
        handleEditChange(
          "phone",
          e.target.value.replace(/\D/g, "")
        )
      }
    />

  {/* DESIGNATION */}
  <div className="form-group">
    <label>Designation</label>

    <select
      value={editData.designation || ""}
      onChange={(e) =>
        handleEditChange("designation", e.target.value)
      }
    >
      <option value="">Select Designation</option>
      <option>Assistant Professor</option>
      <option>Head Of The Department</option>
      <option>Others</option>
    </select>
    </div>

  {/* COLLEGE */}
  <div className="form-group">
    <label>College</label>

    <select
      value={editData.college || ""}
      onChange={(e) =>
        handleEditChange("college", e.target.value)
      }
    >
      <option value="">Select College</option>

      <option value="UIT">
        United Institute Of Technology
      </option>

      <option value="UCAS">
        United College Of Arts & Science
      </option>

      <option value="UCMS">
        United College Of Medical Science
      </option>

      <option value="UCP">
        United College Of Pharmacy
      </option>

      <option value="UCPT">
        United College Of Physiotherapy
      </option>

      <option value="UPS">
        United Public School
      </option>
    </select>
    </div>

  {/* DEPARTMENT */}
  <div className="form-group">
    <label>Department</label>

    <input
      value={editData.department || ""}
      onChange={(e) =>
        handleEditChange("department", e.target.value)
      }
    />
    <label>Participants</label>

    <select
      value={editData.year || ""}
      onChange={(e) =>
        handleEditChange("year", e.target.value)
      }
    >
      <option value="">Select Participants</option>
      <option>0-50</option>
      <option>50-75</option>
      <option>75-100</option>
      <option>100-200</option>
      <option>200-300</option>
    </select>
    </div>

  {/* DATE */}
    <label>Date</label><br></br>

    <input
      type="date"
      value={editData.date || ""}
      onChange={(e) =>
        handleEditChange("date", e.target.value)
      }
    />

  {/* SLOT */}
  <div className="form-group">
    <label>Slots</label>

    <select
      value={editData.slots?.[0] || ""}
      onChange={(e) =>
        handleEditChange("slots", [e.target.value])
      }
    >
      <option value="">Select Slot</option>
      <option>Morning</option>
      <option>Afternoon</option>
      <option>Full Day</option>
    </select>
    </div>

  {/* PURPOSE */}
    <label>Purpose</label><br></br>

    <textarea
      value={editData.purpose || ""}
      onChange={(e) =>
        handleEditChange("purpose", e.target.value)
      }
    />

  {/* EQUIPMENT */}
  <div className="form-group">
    <label>Equipment</label>

    <select

      value={editData.equipment || ""}
      onChange={(e) =>
        handleEditChange("equipment", e.target.value)
      }
    >
      <option value="">Select Equipment</option>
      <option>Multimedia Projector</option>
      <option>AC</option>
      <option>PA System</option>
      <option>All of the above</option>
      <option>Other</option>
    </select>
    </div>

            <div className="modal-actions">
              <button className="save" onClick={updateBooking}>
                Update
              </button>

              <button
                className="close"
                onClick={() => setEditModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}