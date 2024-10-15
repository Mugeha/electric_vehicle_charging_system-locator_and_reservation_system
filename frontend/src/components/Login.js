import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          email,
          password,
        }
      );
      setMessage("Login successful!");
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard"); // or any protected route
    } catch (error) {
      setMessage("Login failed. Please try again.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
      <p style={styles.container}>
        Don't have an account? <Link to="/signup">Signup</Link>
      </p>
      <p>
        Forgot your password? <Link to="/forgot-password">Reset Password</Link>
      </p>
    </div>
  );
};
const styles = {
  container: {
    color: "white", // Use quotes around 'white'
  },
};

export default Login;
