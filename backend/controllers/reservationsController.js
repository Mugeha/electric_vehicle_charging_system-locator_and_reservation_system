const Reservation = require("../models/Reservations"); // Import Reservation model
const Station = require("../models/Station"); // Import Station model if you need it (optional)

// Controller to create a new reservation
const createReservation = async (req, res) => {
  const { stationId, stationName, carPlateNumber, carModel, day, time } = req.body;

  if (!stationId || !stationName || !carPlateNumber || !carModel || !day || !time) {
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
      stationName,
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
// Controller to delete a reservation
const deleteReservation = async (req, res) => {
  try {
    const userId = req.user.id; // Extract the logged-in user's ID from the request
    const { reservationId } = req.params; // Get the reservation ID from the URL parameters

    // Check if the reservation exists and belongs to the user
    const reservation = await Reservation.findOne({ _id: reservationId, userId });
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found or you are not authorized to delete it." });
    }

    // Delete the reservation
    await reservation.deleteOne();
    res.status(200).json({ message: "Reservation deleted successfully." });
  } catch (err) {
    console.error("Error deleting reservation:", err.message);
    res.status(500).json({ message: "Failed to delete the reservation." });
  }
};

module.exports = { createReservation, deleteReservation };


// module.exports = { createReservation };
