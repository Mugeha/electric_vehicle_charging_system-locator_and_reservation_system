const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Signup logic
exports.signup = async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    const payload = { user: { id: user._id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token });
    console.log(req.body); // Debugging output
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Login logic
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email address" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const payload = { user: { id: user._id, name: user.name } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Forgot Password logic with OTP
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    console.log(`Sending OTP to ${email}`);

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save the OTP and its expiry date in the user's record
    user.resetPasswordToken = otp;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: "gmail", // or another email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: user.email,
      subject: "Your OTP for Password Reset",
      text:
        `You are receiving this email because you (or someone else) has requested to reset your password.\n\n` +
        `Your OTP is: ${otp}\n\n` +
        `If you did not request this, please ignore this email.\n` +
        `Note: This OTP is valid for 1 hour.`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Send a response after email is sent successfully
    res.status(200).json({ message: "OTP sent to your email." });
  } catch (error) {
    console.log(`Server error: ${error}`);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

// Verify OTP and Reset Password logic
exports.verifyOtpAndResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({
      email,
      resetPasswordToken: otp,
      resetPasswordExpires: { $gt: Date.now() }, // Ensure OTP hasn't expired
    });

    if (!user)
      return res.status(400).json({ message: "OTP is invalid or has expired" });

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear the OTP and expiry after successful password reset
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Protected routes (require authentication)
exports.setFavorites = async (req, res) => {
  const { stationId } = req.body;

  const userId = req.params.userId;
  // console.log(`stationId: ${stationId}, userId: ${userId}`);
  try {
    const user = await User.findById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const isFavorite = user.favorites.includes(stationId);

    if (isFavorite) {
      // Remove station from favorites
      user.favorites.pull(stationId);
    } else {
      // Add station to favorites
      user.favorites.push(stationId);
    }

    await user.save();
    res.json({ success: true, favoriteStations: user.favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Route to get all favorite stations for a user
exports.getFavorites = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId).populate("favorites"); // Populate favorite station details if necessary
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.json({ success: true, favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
