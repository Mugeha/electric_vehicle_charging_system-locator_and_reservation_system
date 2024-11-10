import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css"; // Assuming you save the above CSS in a file named Auth.css
import "../Header.css";

const Login = ({ authType, onClose, onChangeAuthType }) => {
  const [isLogin, setIsLogin] = useState(authType === "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setIsLogin(authType === "login");
  }, [authType]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        { email, password }
      );
      setMessage("Login successful!");
      localStorage.setItem("token", response.data.token);
      navigate("/");
      onClose();
    } catch (error) {
      setMessage(
        `Login failed. Please try again. ${
          error.response.data.message || error.message
        }`
      );
    }
  };

  const goToSignup = () => {
    onChangeAuthType("signup"); // Open signup modal
  };

  const goToForgotPassword = () => {
    onChangeAuthType("forgot-password"); // Open forgot password modal
  };

  return (
    <>
      <div className="auth-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        {message && <p className="p">{message}</p>}
        <p className="p" onClick={goToSignup}>
          Don't have an account?
          <i
            style={{
              color: "#007bff",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            {" "}
            Signup here
          </i>
        </p>
        <p className="p" onClick={goToForgotPassword}>
          Forgot your password?
          <i
            style={{
              color: "#007bff",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            {" "}
            Reset Password
          </i>
        </p>
      </div>
    </>
  );
};

export default Login;
