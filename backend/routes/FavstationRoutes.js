// In your backend, e.g., Express route
const express = require('express');
const router = express.Router();
const FavoriteStation = require('./models/FavoriteStations'); // MongoDB model for favorites

// Endpoint to add a station to favorites
router.post('/favoriteStations', async (req, res) => {
  const { stationId } = req.body;
  const userId = req.user.id; // Assuming user is authenticated

  try {
    const favorite = await FavoriteStation.create({ userId, stationId });
    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ error: 'Error adding favorite station' });
  }
});

module.exports = router;
