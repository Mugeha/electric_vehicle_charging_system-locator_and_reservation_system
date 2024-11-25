// reservationRoutes.js
const express = require("express");
const router = express.Router();
const ReservationController = require("../controllers/reservationsController");
const authMiddleware = require("../middleware/authMiddleware"); // Import the middleware

// Reservation route
router.post("/", authMiddleware, ReservationController.createReservation); // Protect the route with authMiddleware

module.exports = router;

const getUserReservations = async (req, res) => {
    try {
      const userId = req.user.id;
  
      // Find reservations for the logged-in user
      const reservations = await Reservation.find({ userId }).populate("stationId", "name");
  
      res.status(200).json({ reservations });
    } catch (err) {
      console.error("Error fetching reservations:", err.message);
      res.status(500).json({ message: "Failed to fetch reservations." });
    }
  };
  
  router.get("/", authMiddleware, getUserReservations);
  
