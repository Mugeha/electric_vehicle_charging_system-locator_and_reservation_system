import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Reservation from './Reservations'; 
import HomePage from "./components/Homepage"; // Adjust the path based on your file structure
import AccountDetailsPage from "./components/AccountDetailsPage";
import Login from "./components/Login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div>
      <Routes>
        {/* Default route for HomePage */}
        <Route path="/" element={<HomePage />} />
        {/* Route for FavoriteStations */}
        {/* <Route path="/favorites" element={<FavoriteStations />} /> */}
        <Route path="/account" element={<AccountDetailsPage />} />
        {/* <Route path="/reservations" element={<Reservation />} /> */}
        <Route path="/login" element={<Login />} />

      </Routes>
      <ToastContainer />
    </div>
    
  );
}

export default App;
