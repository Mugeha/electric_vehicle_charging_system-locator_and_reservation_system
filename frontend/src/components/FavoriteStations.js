import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for making API requests
import { FaHeart } from "react-icons/fa"; // Heart icon for favorites
import { useNavigate } from "react-router-dom";
import "./Favorite.css";

const FavoriteStations = ({ authType }) => {
  const [favoriteStations, setFavoriteStations] = useState([]);
  const [error, setError] = useState(null); // State for handling errors

  // Fetch favorite stations from the backend when the component mounts
  useEffect(() => {
    const fetchFavoriteStations = async () => {
      try {
        // const response = await axios.get("/api/favorites", {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Add auth token if needed
        //   },
        // });
        // setFavoriteStations(response.data);
      } catch (error) {
        console.error("Error fetching favorite stations:", error);
        setError("Failed to load favorite stations. Please try again later.");
      }
    };

    fetchFavoriteStations();
  }, []); // Empty dependency array ensures this runs only once on component mount

  const handleUnfavorite = async (stationId) => {
    try {
      // Send DELETE request to unfavorite the station
      await axios.delete(`/api/favorites/${stationId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      // Update local state after successful unfavorite action
      setFavoriteStations(
        favoriteStations.filter((station) => station._id !== stationId)
      );
    } catch (error) {
      console.error("Error unfavoriting station:", error);
      setError("Failed to remove favorite. Please try again.");
    }
  };

  return (
    <div className="favorite-stations-container">
      <h2 >Your Favorite EV Stations</h2>
      {error && <p className="error-message">{error}</p>}
      {favoriteStations.length === 0 ? (
        <p>You don't have any favorite stations yet.</p>
      ) : (
        <ul className="favorite-stations-list">
          {favoriteStations.map((station) => (
            <li key={station._id} className="favorite-station-item">
              <div>
                <h3>{station.name}</h3>
                <p>{station.address}</p>
                <p>Power: {station.power} kW</p>
                <p>Type: {station.type}</p>
              </div>
              <button
                onClick={() => handleUnfavorite(station._id)}
                className="unfavorite-button"
              >
                <FaHeart style={{ color: "red" }} /> Unfavorite
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavoriteStations;
