import { useAuth } from "../auth/AuthContext";
import {
  CalendarDays,
  Building2,
  ClipboardList,
  Sparkles
} from "lucide-react";

import "./Home.css";
import { useState } from "react";
import funnyEmoji from "../assets/funnyEmoji.png";


export default function Home() {
  const { user } = useAuth();
  const [showMagic, setShowMagic] = useState(false);


  return (
    <div className="home-page">

      {/* HERO SECTION */}
      <div className="hero-card">

        <div className="hero-content">
          <h1>
            Welcome Back 👋
          </h1>

          <h2>{user?.email}</h2>

          <p>
            Book And Enjoy Your Favourite Hall !
          </p>

          <button
  className="hero-btn"
  onClick={() => setShowMagic(true)}
>
  Click Me for the Magic ✨
</button>

        </div>

        <div className="hero-icon">
          <Sparkles size={110} />
        </div>

      </div>


      {/* BOTTOM SECTION */}
      <div className="info-banner">

        <div>
          <h2>Smart Hall Management System</h2>

          <p>
            Fast • Secure • Modern • Responsive
          </p>
        </div>

      </div>

{/* SECTION TITLE */}

<div className="offer-section">

  <div className="offer-line"></div>

  <div className="offer-content">

    <div className="offer-icon">
  ✨✨
</div>

<h2 className="offer-heading">
  What We Offer
</h2>

  </div>

</div>

      {/* FEATURE CARDS */}
      <div className="feature-grid">

        <div className="feature-card">
          <div className="feature-icon blue">
            <Building2 size={34} />
          </div>

          <h3>Hall Booking</h3>

          <p>
            Easily Reserve Seminar and Studio Halls
            with Modern slot Management.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon green">
            <CalendarDays size={34} />
          </div>

          <h3>Schedule Events</h3>

          <p>
            Plan Ceremonies, Workshops,
            Meetings and Academic Events Smoothly.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon purple">
            <ClipboardList size={34} />
          </div>

          <h3>Track Bookings</h3>

          <p>
            Monitor Booking Approvals,
            Status Updates and Reports Instantly.
          </p>
        </div>

      </div>

      

      <br></br>
      <br></br>
      <br></br>
      <br></br>

{/* MAGIC MODAL */}

{showMagic && (

  <div
    className="magic-overlay"
    onClick={() => setShowMagic(false)}
  >

    <div
      className="magic-card"
      onClick={(e) => e.stopPropagation()}
    >

      <img
        src={funnyEmoji}
        alt="Funny Emoji"
        className="magic-emoji"
      />

      <h1>OOPS ! 😂</h1>

      <p>
        This is a Booking Site ,
        Not a Magic Show 🎭
      </p>

      <h3>
        Go Soon and Book Your Hall Now 🚀
      </h3>

      <button
        className="magic-close"
        onClick={() => setShowMagic(false)}
      >
        Close
      </button>

    </div>

  </div>

)}

    </div>
  );
}