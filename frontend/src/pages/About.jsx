import {
  CalendarCheck,
  Users,
  Presentation,
  Sparkles,
  Layers,
  Mic
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import "./About.css";

import { Phone, User } from "lucide-react";

export default function About() {
  const { user } = useAuth();

  return (
    <div className="about-page">

      {/* HERO */}
      <div className="about-hero">
        <h1>About Hall Booking System</h1>
        <p>
          A Modern Platform to Manage Seminar and Studio Hall Bookings Efficiently.
        </p>
        <span className="about-user">Welcome, {user?.email}</span>
      </div>

      {/* Seminar Hall */}
      <section className="about-section">
        <h2>Seminar Hall</h2>

        <div className="card-grid">
          <div className="card">
            <Users className="icon" />
            <h3>Capacity</h3>
            <p>Supports large audiences with structured seating.</p>
          </div>

          <div className="card">
            <Presentation className="icon" />
            <h3>Presentation Ready</h3>
            <p>Equipped with projectors, mic, and sound systems.</p>
          </div>

          <div className="card">
            <Mic className="icon" />
            <h3>Acoustics</h3>
            <p>Clear sound delivery for lectures and events.</p>
          </div>
        </div>
      </section>

      {/* STUDIO HALL */}
      <section className="about-section">
        <h2>Studio Hall</h2>

        <div className="card-grid">
          <div className="card">
            <Layers className="icon" />
            <h3>Flexible Layout</h3>
            <p>Open space for customizable arrangements.</p>
          </div>

          <div className="card">
            <Sparkles className="icon" />
            <h3>Creative Use</h3>
            <p>Perfect for workshops, rehearsals, and activities.</p>
          </div>

          <div className="card">
            <Users className="icon" />
            <h3>Interactive</h3>
            <p>Designed for small group collaboration.</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="about-section">
        <h2>Platform Features</h2>

        <div className="card-grid">
          <div className="card">
            <CalendarCheck className="icon" />
            <h3>Easy Booking</h3>
            <p>Book halls quickly with real-time availability.</p>
          </div>

          <div className="card">
            <Users className="icon" />
            <h3>User Friendly</h3>
            <p>Simple interface for all users.</p>
          </div>

          <div className="card">
            <Sparkles className="icon" />
            <h3>Modern UI</h3>
            <p>Clean and responsive design.</p>
          </div>
        </div>
      </section>

      <div className="about-contact">
  <h2>For More Details Contact</h2>

  <div className="contact-card">

    <div className="contact-row">
      <User size={18} className="contact-icon" />
      <span>HALL INCHARGE</span>
    </div>

    <div className="contact-row">
      <Phone size={18} className="contact-icon" />
      <a href="tel:7845468472" className="contact-phone">
        78454 68472
      </a>
    </div>

  </div>
</div>

    </div>

  );
}