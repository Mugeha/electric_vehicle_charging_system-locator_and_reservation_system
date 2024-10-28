const express = require('express');
const router = express.Router();
const { signup, login, forgotPassword, verifyOtpAndResetPassword } = require('../controllers/userController');

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtpAndResetPassword);

module.exports = router;


