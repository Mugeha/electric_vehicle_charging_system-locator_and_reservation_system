const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  name: String,
  address: String,
  position: {
    type: [Number], // [latitude, longitude]
    required: true,
  },
  status: {
    type: String,
    enum: ['Available', 'Occupied', 'Not Working', 'No Information'],
    default: 'Available',
  },
  rating: { type: Number, default: 0 },
  power: String,
  type: String,
});

module.exports = mongoose.model('Station', stationSchema);
