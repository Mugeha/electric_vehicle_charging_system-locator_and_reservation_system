// userRoutes.js
const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  forgotPassword,
  verifyOtpAndResetPassword,
  setFavorites,
  getFavorites,
} = require("../controllers/userController");
const User = require("../models/User"); // Import the User model
const verifyToken = require("../middleware/authMiddleware"); // Ensure only authenticated users can manage favorites

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtpAndResetPassword);
router.post("/favorites/:userId", verifyToken, setFavorites);
router.get("/favorites/:userId", getFavorites);

module.exports = router;
