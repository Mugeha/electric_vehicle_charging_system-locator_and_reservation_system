import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "./Login";
import "./Auth.css";
import "../Header.css";

const Signup = ({ authType, onClose, onChangeAuthType }) => {
  const [isLogin, setIsLogin] = useState(authType === "login");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("null");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!userName || !name || !email || !password) {
      setMessage("All fields are required.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/signup",
        { userName, name, email, password },
        {
          headers: {
            "Content-Type": "application/json", // Ensure the content type is correct
          },
        }
      );
  
      console.log(response.data)
      setMessage("Signup successful!");
      localStorage.setItem("token", response.data.token);
      navigate("/");
      
      onClose();
    } catch (error) {
      setMessage("Signup failed. Please try again.");
      console.log(error)
    }
  };
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setIsForgotPassword(false);
  };
  useEffect(() => {
    setIsLogin(authType === "login");
  }, [authType]);
  const goToLogin = () => {
    onChangeAuthType("login");
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="UserName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
         <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign Up</button>
      </form>
      <p className="p" onClick={goToLogin}>
        {" "}
        Have an account?
        <i
          style={{
            color: "#007bff",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          Login here
        </i>
      </p>
      <p className="p">{message}</p>
    </div>
  );
};

export default Signup;
