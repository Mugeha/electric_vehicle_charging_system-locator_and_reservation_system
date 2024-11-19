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

router.put("/update", authenticate, async (req, res) => {
  const { email, password, country, postalCode, profilePicture } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, // Assuming you attach the user ID in the token middleware
      { email, password, country, postalCode, profilePicture },
      { new: true }
    );

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
