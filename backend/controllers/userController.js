const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

    user = new User({ name, email, password });
    await user.save();

    const payload = { user: { id: user._id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token });
    console.log(req.body); // Add this to debug
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

    const payload = { user: { id: user._id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "4h",
    });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const crypto = require("crypto");
const nodemailer = require("nodemailer"); // You'll need to install nodemailer

// Forgot Password logic
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    console.log(`From ${process.env.EMAIL_USER} to ${email}`);

    // Generate a reset token (you can also use JWT)
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Save the token and its expiry date in the user's record
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email with the reset link
    const transporter = nodemailer.createTransport({
      service: "gmail", // or another email service
      auth: {
        user: process.env.EMAIL_USER, // Make sure these are defined in your .env file
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: user.email,
      subject: "Password Reset",
      text:
        `You are receiving this email because you (or someone else) has requested to reset your password.\n\n` +
        `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
        `http://localhost:3000/reset-password/${resetToken}\n\n` +
        `If you did not request this, please ignore this email.\n`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Send a response after email is sent successfully
    res.status(200).json({ message: "Reset link sent to your email." });
  } catch (error) {
    console.log(`Server error: ${error}`);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

// Reset Password logic
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(400)
        .json({ message: "Token is invalid or has expired" });

    user.password = password; // Hash it again
    user.resetPasswordToken = undefined; // Clear the token
    user.resetPasswordExpires = undefined; // Clear the expiry
    await user.save();

    res.status(200).json({ message: "Password has been reset" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
