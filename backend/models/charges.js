const mongoose = require("mongoose");

const chargeSchema = new mongoose.Schema({
  stationId: { type: mongoose.Schema.Types.ObjectId, ref: "Station", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true }, // Amount charged (e.g., in kWh or currency)
  chargeType: { type: String, enum: ["fast", "slow"], required: true },
  date: { type: Date, default: Date.now }, // Date of the charging session
  duration: { type: Number, required: true }, // Duration in minutes
});

module.exports = mongoose.model("Charge", chargeSchema);
