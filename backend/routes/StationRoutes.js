const express = require('express');
const router = express.Router();
const Station = require('../models/Station');

// Get all stations
router.get('/', async (req, res) => {
    try {
        const stations = await Station.find();
        res.json(stations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
