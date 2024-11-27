import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Reservation.css";

const Reservation = ({ stationId, onClose, stationName }) => {
  const [carPlateNumber, setCarPlateNumber] = useState("");
  const [carModel, setCarModel] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Station ID received in Reservation:", stationId);

    if (!stationId) {
      toast.error("Station ID is required to make a reservation.");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // Authentication token
      if (!token) {
        throw new Error("You must be logged in to make a reservation.");
      }

      const response = await axios.post(
        "http://localhost:5000/api/reservations",
        { stationId, stationName, carPlateNumber, carModel, day, time },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(response.data.message);
      setCarPlateNumber("");
      setCarModel("");
      setDay("");
      setTime("");

      // Close modal or reset form if provided
      if (onClose) onClose();

      // Notify parent or trigger data refresh (e.g., update reservation list)
      if (response.data.reservation) {
        if (typeof window.refreshReservations === "function") {
          window.refreshReservations();
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent closing the modal when form is submitted
            if (onClose) onClose();
          }}
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
      </form>

      {/* Toast Container */}
      <ToastContainer />
    </>
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
