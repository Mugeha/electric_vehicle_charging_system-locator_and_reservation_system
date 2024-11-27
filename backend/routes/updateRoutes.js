const express = require("express");
const router = express.Router();
const { updateUser } = require("../controllers/updateController"); // Adjust the path if necessary
const authMiddleware = require("../middleware/authMiddleware");

// Update user route
router.put("/", authMiddleware, updateUser);

module.exports = router;
