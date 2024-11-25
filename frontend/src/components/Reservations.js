import React, { useState } from "react";
import axios from "axios";
import "./Reservation.css";

const Reservation = ({ stationId, onClose }) => {
  const [carPlateNumber, setCarPlateNumber] = useState("");
  const [carModel, setCarModel] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Station ID received in Reservation:", stationId);
    if (!stationId) {
      setError("Station ID is required to make a reservation.");
      return;
    }
    setSuccess("");

    try {
      const token = localStorage.getItem("token"); // Authentication token
      if (!token) {
        throw new Error("You must be logged in to make a reservation.");
      }
      console.log("Station ID:", stationId);

      const response = await axios.post(
        "http://localhost:5000/api/reservations",
        { stationId, carPlateNumber, carModel, day, time },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(response.data.message);
      setError("");

// Notify parent or trigger data fetch in "My Reservations"
if (onClose) onClose(); // Close modal or reset form
if (response.data.reservation) {
  // Example: Notify parent of new reservation
  if (typeof window.refreshReservations === "function") {
    window.refreshReservations();
  }
}

    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      setSuccess("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Close Button */}
      <button
        onClick={onClose}
        style={closeButtonStyle}
      >
        &times;
      </button>
      <h2>Make Reservation</h2>
      <div className="flex-div">
        <div>
          <input
            type="text"
            placeholder="Car Plate Number"
            value={carPlateNumber}
            onChange={(e) => setCarPlateNumber(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Car Model"
            value={carModel}
            onChange={(e) => setCarModel(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Day (e.g., Monday)"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            required
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
      </div>
      <button type="submit" className="Reservebtn">Reserve</button>
      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default Reservation;

const closeButtonStyle = {
  position: "absolute",
  top: "10px",
  right: "10px",
  backgroundColor: "transparent",
  border: "none",
  fontSize: "24px",
  cursor: "pointer",
  color: "#888",
};
