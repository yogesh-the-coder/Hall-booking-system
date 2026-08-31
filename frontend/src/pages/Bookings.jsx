import { useNavigate } from 'react-router-dom';
import seminarImg from "../assets/seminar.jpeg";
import studioImg from "../assets/studio.jpeg";
import "./Bookings.css";

export default function Bookings() {
  const navigate = useNavigate();

  return (
    <div className="booking-page">

      <h2 className="title">Choose Hall for Booking</h2>
      

      <div className="card-grid">

        {/* SEMINAR */}
        <div
          className="booking-card"
          onClick={() => navigate('/home/bookings/seminar')}
        >
          <img src={seminarImg} alt="Seminar Hall" />
          <div className="card-content">
            <h3>Seminar Hall</h3>
            <p>Capacity: 300 People</p>
          </div>
        </div>

        {/* STUDIO */}
        <div
          className="booking-card"
          onClick={() => navigate('/home/bookings/studio')}
        >
          <img src={studioImg} alt="Studio Hall" />
          <div className="card-content">
            <h3>Studio Hall</h3>
            <p>Capacity: 100 People</p>
            
          </div>

        </div>
        

      </div>

    </div>
  );
}