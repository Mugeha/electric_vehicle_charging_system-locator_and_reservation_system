import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toastify styles
import "./res.css";

const MyReservations = () => {
  const [reservations, setReservations] = useState([]); // State for user reservations
  const [loading, setLoading] = useState(true); // Loading state for better user experience
  const [error, setError] = useState(null); // Error state to handle failures

  // Function to fetch reservations for the logged-in user
  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not logged in");
        setLoading(false);
        toast.error("User not logged in!");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/reservations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Reservations fetched:", response.data);

      if (response.data && response.data.reservations) {
        setReservations(response.data.reservations); // Set reservations in state
        toast.success("Reservations fetched successfully!");
      } else {
        setReservations([]); // Handle no reservations case
        toast.info("No reservations found.");
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching reservations:", err);
      setError("Failed to fetch reservations. Please try again later.");
      toast.error("Failed to fetch reservations. Please try again later.");
      setLoading(false);
    }
  };

  // Function to delete a reservation
  const deleteReservation = async (reservationId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("User not logged in");
        toast.error("User not logged in!");
        return;
      }

      await axios.delete(`http://localhost:5000/api/reservations/${reservationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove the deleted reservation from the list
      setReservations(reservations.filter((res) => res._id !== reservationId));
      toast.success("Reservation deleted successfully!");
      console.log("Reservation deleted successfully.");
    } catch (err) {
      console.error("Error deleting reservation:", err.message);
      toast.error("Failed to delete the reservation.");
    }
  };

  // Fetch reservations on component mount
  useEffect(() => {
    fetchReservations();

    // Expose fetchReservations globally for real-time updates after making a reservation
    window.refreshReservations = fetchReservations;

    return () => {
      window.refreshReservations = null; // Cleanup
    };
  }, []);

  return (
    <>
      <div className="stationsReserved">
        <h2>My Reservations</h2>
        {loading ? (
          <p>Loading reservations...</p>
        ) : error ? (
          <p>{error}</p>
        ) : reservations.length === 0 ? (
          <p>No reservations found.</p>
        ) : (
          <ul className="reserve-list">
            {reservations.map((res) => (
              <li key={res._id}>
                <p>
                  <strong>Station:</strong> {res.stationName || "Unknown Station"}
                </p>
                <p>
                  <strong>Car Model:</strong> {res.carModel}
                </p>
                <p>
                  <strong>Car Plate Number:</strong> {res.carPlateNumber}
                </p>
                <p>
                  <strong>Day:</strong> {res.day}, <strong>Time:</strong> {res.time}
                </p>
                <button
                  onClick={() => deleteReservation(res._id)}
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    cursor: "pointer",
                    marginTop: "10px",
                  }}
                >
                  Cancel Reservation
                </button>
                <hr />
              </li>
            ))}
          </ul>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default MyReservations;
