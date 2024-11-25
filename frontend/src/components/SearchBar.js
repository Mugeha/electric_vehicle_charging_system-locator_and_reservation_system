import React, { useEffect, useState } from "react";
import "./MapSearch.css";
import axios from "axios";

const MapSearch = ({ setMapCenter, onStationSelect }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedStationId, setSelectedStationId] = useState(""); // Track selected station ID

  // Predefined locations with station IDs
  const locations = {
    "Nairobi Central": { coords: [-1.286389, 36.817223], stationId: "634b2f8e7b2f4c12d4b8e123" },
    "Westlands Mall": { coords: [-1.2679, 36.8044], stationId: "634b2f8e7b2f4c12d4b8e124" },
    "Karen Shopping Centre": { coords: [-1.3184, 36.7486], stationId: "634b2f8e7b2f4c12d4b8e125" },
    "Embakasi East": { coords: [-1.3217, 36.9445], stationId: "634b2f8e7b2f4c12d4b8e126" },
    "Gigiri": { coords: [-1.2500, 36.8260], stationId: "634b2f8e7b2f4c12d4b8e127" },
    "Ruiru Town": { coords: [-1.1513, 36.9201], stationId: "634b2f8e7b2f4c12d4b8e128" },
    "Kikuyu Town": { coords: [-1.2287, 36.7215], stationId: "634b2f8e7b2f4c12d4b8e129" },
    "London": { coords: [51.5074, -0.1278], stationId: null }, // Global location without a station ID
  };

  const handleLocationSelect = async (e) => {
    const selectedLocation = e.target.value;

    // Check if the selected location is predefined
    if (locations[selectedLocation]) {
      const { coords, stationId } = locations[selectedLocation];
      setMapCenter({ lat: coords[0], lng: coords[1] });
      setSelectedStationId(stationId); // Set the station ID
      onStationSelect && onStationSelect(stationId); // Pass to parent if provided
      setErrorMessage("");
    } else {
      // Use Geocoding API to find the location
      try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
          params: {
            address: selectedLocation,
            key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
          },
        });

        if (response.data.results.length > 0) {
          const { lat, lng } = response.data.results[0].geometry.location;
          setMapCenter({ lat, lng });
          setSelectedStationId(""); // Clear station ID for generic locations
          setErrorMessage("");
        } else {
          setErrorMessage("Location not found");
        }
      } catch (error) {
        console.error("Error fetching location:", error);
        setErrorMessage("Error fetching location");
      }
    }
  };

  return (
    <div style={{ position: "absolute", top: "30px", right: "40px", zIndex: 1000 }}>
      <input
        type="text"
        list="cities"
        placeholder="Search for an address or place"
        onChange={handleLocationSelect}
        style={{
          padding: "10px",
          borderRadius: "4px",
          width: "250px",
          backgroundColor: "#fff",
          color: "black",
        }}
      />
      <datalist id="cities">
        {Object.keys(locations).map((location) => (
          <option key={location} value={location} />
        ))}
      </datalist>
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
    </div>
  );
};

export default MapSearch;
