import React, { useEffect, useState } from "react";
import axios from "axios";

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
 


  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("User not logged in");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/reservations", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReservations(response.data.reservations);
    } catch (err) {
      console.error("Error fetching reservations:", err);
    }
  };

  useEffect(() => {
    fetchReservations();

    // Optional: Expose fetchReservations globally to refresh after reservation
    window.refreshReservations = fetchReservations;

    return () => {
      window.refreshReservations = null; // Cleanup
    };
  }, []);

  return (
    <div>
      <h2>My Reservations</h2>
      {reservations.length === 0 ? (
        <p>No reservations found.</p>
      ) : (
        <ul>
          {reservations.map((res) => (
            <li key={res._id}>
              <p>Station: {res.stationId.name}</p>
              <p>Car Model: {res.carModel}</p>
              <p>Day: {res.day}, Time: {res.time}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyReservations;
