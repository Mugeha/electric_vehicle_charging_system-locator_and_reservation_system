// // Example Express routes
// const express = require('express');
// const router = express.Router();
// const { checkAuth } = require('./middleware/auth'); // Middleware to check if user is authenticated
// const Favorite = require('./models/Favorite'); // Assuming a 'Favorite' model exists

// // Get favorite stations for a logged-in user
// router.get('/api/favorites', checkAuth, async (req, res) => {
//   try {
//     const userId = req.user.id; // Assuming user ID is stored in req.user after authentication
//     const favorites = await Favorite.find({ userId }); // Query to get the user's favorite stations
//     res.json(favorites);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching favorite stations' });
//   }
// });

// // Remove a station from favorites
// router.delete('/api/favorites/:stationId', checkAuth, async (req, res) => {
//   try {
//     const { stationId } = req.params;
//     const userId = req.user.id; // Assuming user ID is stored in req.user after authentication
//     await Favorite.deleteOne({ userId, stationId }); // Remove the station from the user's favorites
//     res.json({ message: 'Station removed from favorites' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error removing station from favorites' });
//   }
// });

// module.exports = router;
