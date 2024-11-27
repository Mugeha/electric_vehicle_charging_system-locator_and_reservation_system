// reservationRoutes.js
const express = require("express");
const router = express.Router();
const ReservationController = require("../controllers/reservationsController");
const authMiddleware = require("../middleware/authMiddleware"); // Import the middleware
// const Reservation = require("../models/Reservations");

// Reservation route
router.post("/", authMiddleware, ReservationController.createReservation); // Protect the route with authMiddleware
// DELETE /api/reservations/:reservationId - Delete a specific reservation
router.delete("/:reservationId", authMiddleware, ReservationController.deleteReservation);

module.exports = router;

const Reservation = require("../models/Reservations");

const getReservations = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming req.user contains authenticated user data
    const reservations = await Reservation.find({ userId }).populate("stationId", "name address"); // Populate stationId with the name field

    res.status(200).json({ reservations });
  } catch (err) {
    console.error("Error fetching reservations:", err);
    res.status(500).json({ message: "Failed to fetch reservations" });
  }
};

// module.exports = { getReservations };

  
  router.get("/", authMiddleware, getReservations);
  
  
