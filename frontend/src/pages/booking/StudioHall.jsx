import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SeminarHall.css";
import studioImg from "../../assets/studio.jpeg";
import { toast } from "react-toastify";

/* ---------- TIME SLOTS ---------- */

const allSlots = [
  "Forenoon",
  "Afternoon",
  "Full Day"
];

/* ---------- EMAIL VALIDATION ---------- */

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};


/* ---------- DEPARTMENTS ---------- */

const departments = {
  UIT: [
    "Information Technology",
    "Robotics And Automation",
    "Artificial Intelligence And Data Science",
    "Computer Science Engineering",
    "Electronics And Communication Engineering",
    "Cyber Security"
  ],
  UCAS: [
    "Computer Science",
    "Data Science",
    "Commerce",
    "Business Administration",
    "Data Analytics"
  ]
};

export default function StudioHall() {

  const navigate = useNavigate();

  /* ---------- FORM STATES ---------- */
  
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [purpose, setPurpose] = useState("");
  const [equipment, setEquipment] = useState("");
  const [otherEquipment, setOtherEquipment] = useState("");
  const [otherDesignation, setOtherDesignation] = useState("");
  const [errors, setErrors] = useState({});

  const [showSlots, setShowSlots] = useState(false);

  /* ---------- SLOT STATES ---------- */

  const [date, setDate] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);

  /* ---------- FETCH BOOKED SLOTS ---------- */

  useEffect(() => {

    if (!date) return;

    const fetchBookings = async () => {

      const res = await fetch("http://localhost:5000/api/bookings");
      const data = await res.json();

      const booked = data
        .filter(
          (b) =>
            b.hall === "Studio Hall" &&   // ✅ IMPORTANT
            b.date === date &&
            b.status === "approved"
        )
        .flatMap((b) => {
          if (b.slots) return b.slots;
          if (b.slot) return [b.slot];
          return [];
        });

      setBookedSlots(booked);
    };

    fetchBookings();

  }, [date]);

   /* ---------- VALIDATION ---------- */

  const validateForm = () => {

    const newErrors = {};

    if (!name) newErrors.name = "Name is required";

    if (!designation) {
  newErrors.designation = "Select designation";
}

if (designation === "Others" && !otherDesignation.trim()) {
  newErrors.otherDesignation = "Enter your designation";
}

    if (!email) newErrors.email = "Email is required";
    else if (!validateEmail(email))
      newErrors.email = "Invalid email format";

    if (!phone) newErrors.phone = "Phone number is required";
    else if (phone.length !== 10)
      newErrors.phone = "Enter 10 digit number";

    if (!college) newErrors.college = "Select college";

    if (!department) newErrors.department = "Select department";

    if (!year) newErrors.year = "Select no.of participants";

    if (!purpose.trim()) {
    newErrors.purpose = "Title of the program is required";
  } else if (purpose.length > 100) {
    newErrors.purpose = "Maximum 100 characters allowed";
  }

  if (!equipment) newErrors.equipment = "Select equipment";

if (equipment === "Other" && !otherEquipment.trim()) {
  newErrors.otherEquipment = "Please specify other equipment";
}

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* ---------- FORM SUBMIT ---------- */

 const handleUserSubmit = () => {
  const isValid = validateForm();

  if (!isValid) {
    toast.error("Please fill all required fields correctly");
    return;
  }

  toast.success("Form validated successfully");
  setShowSlots(true);
};

  /* ---------- BOOKING ---------- */

  const handleBooking = async () => {


    if (!date || selectedSlots.length === 0) {
      toast.error("Select date and slots");
      return;
    }

    try {

      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          hall: "Studio Hall",
          name,
          designation: designation === "Others" ? otherDesignation : designation,
          email,
          phone,
          college,
          department,
          year,
          purpose,
          equipment,        // ✅ ADD THIS
          otherEquipment, 
          date,
          slots: selectedSlots
        })
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.message || "Booking failed");
        return;
      }

      toast.success("Booking request sent to Admin");

      setSelectedSlots([]);
      navigate("/home");

    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Server error");
    }

  };

  return (
  <div className="booking-container"
  style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${studioImg})`
      }}
  >


    {!showSlots && (
      <>
        
    <div className="booking-banner">
  <button className="primary-btn"><h1>Studio Hall Booking</h1></button>
</div>

        <div className="form-group">
          <input placeholder="Name of the organizer / Coordinator" onChange={(e) => setName(e.target.value)} />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-group">
  <select
    value={designation}
    onChange={(e) => {
      setDesignation(e.target.value);

      // clear input if not Others
      if (e.target.value !== "Others") {
        setOtherDesignation("");
      }
    }}
  >
    <option value="">Designation</option>
    <option>Assistant Professor</option>
    <option>Head Of The Department</option>
    <option>Others</option>
  </select>

  {errors.designation && (
    <span className="error-text">{errors.designation}</span>
  )}

</div>

{designation === "Others" && (
  <div className="form-group">
    <input
      placeholder="Enter your designation"
      value={otherDesignation}
      onChange={(e) => setOtherDesignation(e.target.value)}
    />
  </div>
)}

        <div className="form-group">
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group">
          <input
            placeholder="Phone Number"
            value={phone}
            maxLength="10"
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <select onChange={(e) => { setCollege(e.target.value); setDepartment(""); }}>
            <option value="">Select College</option>

            <option value="UIT">United Institute Of Technology</option>
            <option value="UCAS">United College Of Arts & Science</option>
            <option value="UCMS">United College Of Medical Science</option>
            <option value="UCP">United College Of Pharmacy</option>
            <option value="UCPT">United College Of Physiotherapy</option>
            <option value="UPS">United Public School</option>

          </select>
          {errors.college && <span className="error-text">{errors.college}</span>}
        </div>

        {departments[college] && (
  <div className="form-group">
  <select
    onChange={(e) => {
      setDepartment(e.target.value);

      // ✅ CLEAR DEPARTMENT ERROR
      setErrors((prev) => ({
        ...prev,
        department: ""
      }));
    }}
  >
      <option value="">Select Department</option>
      {departments[college].map((dep) => (
        <option key={dep}>{dep}</option>
      ))}
    </select>

    {errors.department && (
      <span className="error-text">{errors.department}</span>
    )}
  </div>
)}

        <div className="form-group">
          <select onChange={(e) => setYear(e.target.value)}>
            <option value="">No.of participants</option>
            <option>0-25</option>
            <option>25-50</option>
            <option>50-75</option>
            <option>75-100</option>
          </select>
          {errors.year && <span className="error-text">{errors.year}</span>}
        </div>

        <div className="form-group">
          <textarea
            placeholder="Title of the program"
            value={purpose}
            maxLength={100}
            onChange={(e) => setPurpose(e.target.value)}
          />
          {errors.purpose && <span className="error-text">{errors.purpose}</span>}

          <div
            className="char-count"
            style={{ color: purpose.length > 90 ? "red" : "#666" }}
          >
            {purpose.length}/100
          </div>
        </div>

        <div className="form-group">
  <select
    value={equipment}
    onChange={(e) => setEquipment(e.target.value)}
  >
    <option value="">Materials / Equipments Needed</option>
    <option>Multimedia Projector</option>
    <option>AC</option>
    <option>PA System</option>
    <option>All of the above( Multimedia Projector,AC,PA System )</option>
    <option>Other</option>
  </select>

  {errors.equipment && (
    <span className="error-text">{errors.equipment}</span>
  )}
</div>

{/* SHOW ONLY IF OTHER */}
{equipment === "Other" && (
  <div className="form-group">
    <input
      placeholder="Enter other equipment"
      value={otherEquipment}
      onChange={(e) => setOtherEquipment(e.target.value)}
    />
    {errors.otherEquipment && (
      <span className="error-text">{errors.otherEquipment}</span>
    )}
  </div>
)}

        <button className="primary-btn" onClick={handleUserSubmit}>
          Continue Booking
        </button>
      </>
    )}

    {/* ---------- SLOT UI ---------- */}

    {showSlots && (
  <div className="slot-booking-card">

    {/* DATE SECTION */}

    <div className="slot-section">

      <div className="slot-header">
        <h3>Select Event Date</h3>
        <p>Choose your preferred booking date</p>
      </div>

      <input
        className="date-input"
        type="date"
        min={new Date().toISOString().split("T")[0]}
        onChange={(e) => setDate(e.target.value)}
      />

    </div>

    {/* SLOT SECTION */}

    <div className="slot-section">

      <div className="slot-header">
        <h3>Available Time Slots</h3>
        <p>Select one or more available sessions</p>
      </div>

      <div className="slot-container">

        {allSlots.map((slot) => {

  const isSelected =
    selectedSlots.includes(slot);

  /* BOOKED CONDITIONS */

  const fullDayBooked =
    bookedSlots.includes("Full Day");

  const forenoonBooked =
    bookedSlots.includes("Forenoon");

  const afternoonBooked =
    bookedSlots.includes("Afternoon");

  let isDisabled = false;

  /* FULL DAY BOOKED */

  if (fullDayBooked) {

    isDisabled = true;

  }

  /* FORENOON BOOKED */

  else if (
    slot === "Forenoon" &&
    forenoonBooked
  ) {

    isDisabled = true;

  }

  /* AFTERNOON BOOKED */

  else if (
    slot === "Afternoon" &&
    afternoonBooked
  ) {

    isDisabled = true;

  }

  /* HIDE FULL DAY IF ANY HALF SLOT BOOKED */

  else if (
    slot === "Full Day" &&
    (
      forenoonBooked ||
      afternoonBooked
    )
  ) {

    isDisabled = true;

  }

  return (

    <button
      key={slot}

      disabled={isDisabled}

      onClick={() => {

        if (isDisabled) return;

        let updatedSlots =
          [...selectedSlots];

        /* FULL DAY */

        if (slot === "Full Day") {

          if (
            updatedSlots.includes(
              "Full Day"
            )
          ) {

            updatedSlots = [];

          } else {

            updatedSlots =
              ["Full Day"];

          }

        } else {

          updatedSlots =
            updatedSlots.filter(
              s => s !== "Full Day"
            );

          if (
            updatedSlots.includes(slot)
          ) {

            updatedSlots =
              updatedSlots.filter(
                s => s !== slot
              );

          } else {

            updatedSlots.push(slot);

          }
        }

        setSelectedSlots(
          updatedSlots
        );
      }}

      className={`slot-btn
        ${isSelected
          ? "slot-selected"
          : ""
        }

        ${isDisabled
          ? "slot-disabled"
          : ""
        }
      `}
    >

      <span className="slot-icon">
        ⏰
      </span>

      {slot}

    </button>
  );
})}

      </div>

      {/* SELECTED INFO */}

      <div className="selected-slot-box">

        <div>
          <h4>Selected Slots</h4>

          <p>
            {
              selectedSlots.length
            } slot(s) selected
          </p>
        </div>

        <div className="selected-count">
          {selectedSlots.length}
        </div>

      </div>

    </div>

    {/* BUTTON */}

    <button
      className="primary-btn confirm-btn"
      onClick={handleBooking}
    >
      Confirm Booking
    </button>

  </div>
)}

  </div>
)
}