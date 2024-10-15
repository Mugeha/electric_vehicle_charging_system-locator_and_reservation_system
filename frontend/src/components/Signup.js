import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Make sure to import Link

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setMessage("All fields are required.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/users/signup', {
        name,
        email,
        password,
      });
      setMessage('Signup successful!');
      localStorage.setItem('token', response.data.token);
      navigate('/login');
    } catch (error) {
      setMessage('Signup failed. Please try again.');
      console.error('Error:', error.response.data);  // Log the error details for debugging
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
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
        <button type="submit">Signup</button>
      </form>
      <p>{message}</p>
      <p style={styles.container}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

const styles = {
  container: {
    color: "white", // Use quotes around 'white'
  },
};

export default Signup;
