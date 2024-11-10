import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FavoriteStations from "./components/FavoriteStations";
import HomePage from "./components/Homepage"; // Adjust the path based on your file structure

function App() {
  return (
    <div>
      <Routes>
        {/* Default route for HomePage */}
        <Route path="/" element={<HomePage />} />
        {/* Route for FavoriteStations */}
        <Route path="/favorites" element={<FavoriteStations />} />
      </Routes>
    </div>
  );
}

export default App;
