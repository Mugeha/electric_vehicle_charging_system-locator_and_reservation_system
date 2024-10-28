import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = ({ onClose, onChangeAuthType }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("http://localhost:5000/api/users/forgot-password", {
        email,
      });
      setMessage("Password reset link sent to your email.");
      setTimeout(() => onChangeAuthType("reset-password"), 3000); 
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send reset link.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleForgotPassword}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email"
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
      <p className="p">{message}</p>
      <p className="p" onClick={() => onChangeAuthType("login")}>
        <i
          style={{
            color: "#007bff",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          Back to Login
        </i>
      </p>
    </div>
  );
};

export default ForgotPassword;
