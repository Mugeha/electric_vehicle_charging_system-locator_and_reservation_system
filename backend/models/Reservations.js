const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    stationId: { type: mongoose.Schema.Types.ObjectId, ref: "Station", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    carPlateNumber: { type: String, required: true },
    carModel: { type: String, required: true },
    day: { type: String, required: true },
    time: { type: String, required: true },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model("Reservation", reservationSchema);
