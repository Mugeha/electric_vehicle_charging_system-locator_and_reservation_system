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
const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware"); 
const reservationRoutes = require("../routes/ReservationRoutes");  // Make sure this path is correct

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtpAndResetPassword);
router.post("/favorites/:userId", verifyToken, setFavorites);
router.get("/favorites/:userId", getFavorites);

// Mount reservation routes to the '/reservations' path
router.use("/reservations", reservationRoutes); 

module.exports = router;
