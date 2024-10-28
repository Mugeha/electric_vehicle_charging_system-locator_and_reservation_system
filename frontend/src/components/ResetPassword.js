import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const ResetPassword = ({ onChangeAuthType }) => {
  const [email, setEmail] = useState(""); // Email input for OTP identification
  const [otp, setOtp] = useState(""); // OTP input
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      // Send email, OTP, and new password to backend
      const response = await axios.post(
        `http://localhost:5000/api/users/verify-otp`, // Backend API for OTP validation
        { email, otp, newPassword: password }
      );
      setMessage("Password reset successful! Redirecting to login...");
      setError("");
      setTimeout(() => onChangeAuthType("login"), 3000); // Redirect after 3 seconds
    } catch (error) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="auth-container">
      <h2>Reset Password with OTP</h2>
      <form onSubmit={handleResetPassword}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email"
          required
        />
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          aria-label="OTP"
          required
        />
        <input
          type={passwordVisible ? "text" : "password"}
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-label="New Password"
          minLength={8} // Password length validation
          required
        />
        <input
          type={passwordVisible ? "text" : "password"}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          aria-label="Confirm Password"
          minLength={8}
          required
        />
        <div className="password-toggle" onClick={togglePasswordVisibility}>
          {passwordVisible ? "Hide Password" : "Show Password"}
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
    </div>
  );
};

export default ResetPassword;
