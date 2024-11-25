const Reservation = require("../models/Reservations"); // Import Reservation model
const Station = require("../models/Station"); // Import Station model if you need it (optional)

// Controller to create a new reservation
const createReservation = async (req, res) => {
  const { stationId, carPlateNumber, carModel, day, time } = req.body;

  if (!stationId || !carPlateNumber || !carModel || !day || !time) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // `authMiddleware` ensures `req.user` is available and contains the logged-in user's ID
    const userId = req.user.id;

    // Check if a reservation already exists for the station at the specified time and day
    const existingReservation = await Reservation.findOne({ stationId, day, time });
    if (existingReservation) {
      return res.status(400).json({ message: "Station is already reserved at this time." });
    }

    // Create the new reservation
    const newReservation = new Reservation({
      stationId,
      userId, // Assign the logged-in user to the reservation
      carPlateNumber,
      carModel,
      day,
      time,
    });

    await newReservation.save(); // Save the reservation to the database
    res.status(201).json({ message: "Reservation successful!", reservation: newReservation });
  } catch (err) {
    console.error("Error creating reservation:", err.message);
    res.status(500).json({ message: "An error occurred during the reservation process." });
  }
};

module.exports = { createReservation };
