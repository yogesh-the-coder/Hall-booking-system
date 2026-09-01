import { useEffect, useState } from "react";
import "./AdminCompleted.css";
import uitLogo from "../../assets/UIT.jpeg";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const API = process.env.REACT_APP_API_URL;

export default function AdminCompleted() {
  const [bookings, setBookings] = useState([]);

  const downloadPDF = async (id, hallName) => {

  const input = document.getElementById(id);

  if (!input) return;

  const canvas = await html2canvas(input, {
    scale: 2
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();

  const imgProps = pdf.getImageProperties(imgData);

  const pdfHeight =
    (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(
    imgData,
    "PNG",
    0,
    0,
    pdfWidth,
    pdfHeight
  );

  pdf.save(`${hallName}-booking-report.pdf`);
};

  const [filters, setFilters] = useState({
    date: "",
    hall: "",
    name: ""
  });

  const loadBookings = async () => {
    const res = await fetch(`${API}/bookings`);
    const data = await res.json();
    setBookings(data.filter((b) => b.status === "completed"));
  };

  useEffect(() => {
    loadBookings();
  }, []);

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
    <div className="admin-completed-page">

      {/* HEADER */}
      <h2 className="page-title">Completed Bookings</h2>

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
          type="text"
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

      {/* LIST */}
      <div className="document-wrapper">

  {filteredBookings.map((b) => (

    <div
  className="document-card"
  id={`pdf-${b._id}`}
  key={b._id}
>

      {/* HEADER */}

      <div className="doc-top">

        <div className="doc-logo">
          <img src={uitLogo} alt="UIT Logo" />
        </div>

        <div className="doc-title">
          <h1>UNITED EDUCATIONAL INSTITUTIONS</h1>

          <p>
            Periyanaickenpalayam, Coimbatore - 641020
          </p>

          <h2>
            SEMINAR HALL – REQUISITION FORM
          </h2>
        </div>

        <div className="doc-index">
          <b>INDEX NO :</b>
        </div>

      </div>

      {/* BOOKING DATE */}

      <div className="booking-date">
        <b>Date of Booking :</b> {b.date}
      </div>

      {/* MAIN TABLE */}

      <table className="document-table">

        <tbody>

          <tr>
            <td>1.</td>
            <td>Name of the Organizer / Coordinator</td>
            <td>{b.name}</td>
          </tr>

          <tr>
            <td>2.</td>
            <td>Email & Contact Details</td>
            <td>
              {b.email}
              <br />
              {b.phone}
            </td>
          </tr>

          <tr>
            <td>3.</td>
            <td>Institution / Department</td>
            <td>
              {b.college}
              <br />
              {b.department}
            </td>
          </tr>

          <tr>
            <td>4.</td>
            <td>Designation</td>
            <td>{b.designation}</td>
          </tr>

          <tr>
            <td>5.</td>
            <td>Title of the Program</td>
            <td>{b.purpose}</td>
          </tr>

          <tr>
            <td>6.</td>
            <td>Date & Time of Program</td>
            <td>
              {b.date}
              <br />
              {b.slots?.join(", ")}
            </td>
          </tr>

          <tr>
            <td>7.</td>
            <td>No. of Participants</td>
            <td>{b.year}</td>
          </tr>

          <tr>
            <td>8.</td>
            <td>Materials / Equipments Used</td>
            <td>
              {b.equipment}

              {b.otherEquipment && (
                <>
                  <br />
                  {b.otherEquipment}
                </>
              )}
            </td>
          </tr>

        </tbody>

      </table>

      {/* SIGNATURE SECTION */}

      <div className="signature-grid">

        <div className="signature-box">
          <div className="signature-space"></div>
          <h4>PROGRAM COORDINATOR</h4>
        </div>

        <div className="signature-box">
          <div className="signature-space"></div>
          <h4>HOD</h4>
        </div>

        <div className="signature-box">
          <div className="signature-space"></div>
          <h4>PRINCIPAL</h4>
        </div>

        <div className="signature-box">
          <div className="signature-space"></div>
          <h4>SEMINAR HALL INCHARGE</h4>
          <p>📞 78454 68472</p>
        </div>

        <div className="signature-box">
          <div className="signature-space"></div>
          <h4>ELECTRICAL INCHARGE</h4>
          <p>📞 89400 22624</p>
        </div>

      </div>

      {/* REPORT */}

      {b.technicianReport && (

        <div className="report-section">

          <h3>Technician Report</h3>

          <table className="document-table">

            <tbody>

              <tr>
                <td>Key Returned Properly</td>
                <td>{b.technicianReport.keyReturned}</td>
              </tr>

              <tr>
                <td>Damage Found</td>
                <td>{b.technicianReport.damageFound}</td>
              </tr>

              <tr>
                <td>Banner Removed Properly</td>
                <td>{b.technicianReport.bannerRemoved}</td>
              </tr>

              <tr>
                <td>Chairs Arranged Properly</td>
                <td>{b.technicianReport.chairsArranged}</td>
              </tr>

              <tr>
                <td>Items Returned</td>
                <td>{b.technicianReport.itemsReturned}</td>
              </tr>

              <tr>
                <td>Other Remarks</td>
                <td>{b.technicianReport.other || "-"}</td>
              </tr>

            </tbody>

          </table>

        </div>

      )}

      <div className="document-actions">

  <button
    className="pdf-btn"
    onClick={() =>
      downloadPDF(
        `pdf-${b._id}`,
        b.hall
      )
    }
  >
    Export PDF
  </button>

</div>

    </div>

  ))}

</div>

    </div>
  );
}