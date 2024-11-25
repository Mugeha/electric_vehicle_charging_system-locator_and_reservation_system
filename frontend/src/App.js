import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Reservation from './Reservations'; 
import HomePage from "./components/Homepage"; // Adjust the path based on your file structure
import AccountDetailsPage from "./components/AccountDetailsPage";

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
      </Routes>
    </div>
  );
}

export default App;
