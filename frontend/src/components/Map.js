import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";
import MapSearch from "./SearchBar";
import axios from "axios";
import Modal from "react-modal";

import { jwtDecode } from "jwt-decode"; // Correct
import carChargingImage from "./icons/carcharging.jpeg";
import directionsIcon from "./icons/directionsicon-removebg-preview.png";
import evcharger from "./icons/evchargericon-removebg-preview.png";

const mapOptions = {
  zoom: 13,
  center: { lat: -1.286389, lng: 36.817223 }, // Default to Nairobi Central
  mapTypeId: "roadmap",
};

function Map() {
  const [mapCenter, setMapCenter] = useState(mapOptions.center);
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [filter, setFilter] = useState("All");

  const [showAddStationModal, setShowAddStationModal] = useState(false);
  // or from context: const { userId } = useContext(AuthContext);

  const [newStation, setNewStation] = useState({
    name: "",
    address: "",
    position: [0, 0],
    status: "available", // or other statuses you have
    rating: 0,
    power: 0,
    type: "g",
  }); // State for the filter

  const [userId, setUserId] = useState(null);
  // Load the Google Maps script
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    // Fetch station data from the API
    axios
      .get("http://localhost:5000/api/stations")
      .then((response) => setStations(response.data))
      .catch((error) => console.error("Error fetching stations:", error));

    // Fetch user favorites
    const token = localStorage.getItem("token");
    console.log(`token:${token}`);
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log(`decodedToken.user.id: ${decodedToken.user.id}`);
        setUserId(decodedToken.user.id);
      } catch (error) {
        console.error("Token decoding failed:", error);
      }
    }
    // if (token) {
    //   axios
    //     .get("http://localhost:5000/api/users/me", {
    //       headers: { Authorization: `Bearer ${token}` },
    //     })
    //     .then((response) => setUserId(response.data._id))
    //     .catch((error) => console.error("Error fetching user info:", error));
    // }
  }, []);

  const handleDirections = (station) => {
    const stationPosition = station.position;
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${stationPosition[0]},${stationPosition[1]}`;
    window.open(directionsUrl, "_blank"); // Open directions in a new tab
  };

  // Filtered stations based on the selected filter
  const filteredStations =
    filter === "All"
      ? stations
      : stations.filter((station) => station.status === filter);

  const handleAddStation = () => {
    axios
      .post("http://localhost:5000/api/stations", newStation)
      .then((response) => {
        setStations([...stations, response.data]);
        setShowAddStationModal(false);
        setNewStation({
          name: "",
          address: "",
          lat: "",
          lng: "",
          power: "",
          type: "",
        });
      })
      .catch((error) => console.error("Error adding station:", error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStation((prevState) => ({ ...prevState, [name]: value }));
  };
  const handleFavorite = (station) => {
    console.log(`before ${station.isFavorite}`);
    console.log(`stationId: ${station._id}`);
    const token = localStorage.getItem("token");
    console.log(`token 2:${token}`);

    axios
      .post(
        `http://localhost:5000/api/users/favorites/${userId}`,
        { stationId: station._id },
        {
          headers: { Authorization: token },
        }
      )
      .then((response) => {
        setStations(
          stations.map((s) =>
            s._id === station._id ? { ...s, isFavorite: !s.isFavorite } : s
          )
        );
      })
      .catch((error) =>
        console.error("Error updating favorite status:", error)
      );
    console.log(`after${station.isFavorite}`);
  };
  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div>
      {/* Filter Buttons */}
      <div
        style={{
          position: "absolute",
          top: "100px",
          display: "flex",
          flexDirection: "column",
          left: "10px",
          zIndex: 1000,
        }}
      >
        <button onClick={() => setFilter("All")}>All</button>
        <button onClick={() => setFilter("Available")}>Available</button>
        <button onClick={() => setFilter("Occupied")}>Occupied</button>
        <button onClick={() => setFilter("Not Working")}>Not Working</button>
        <button onClick={() => setFilter("No Information")}>
          No Information
        </button>
      </div>

      <GoogleMap
        mapContainerStyle={{ width: "100vw", height: "100vh" }}
        center={mapCenter}
        zoom={mapOptions.zoom}
        onLoad={(map) => map.setCenter(mapCenter)}
      >
        {/* Map filtered stations with markers */}
        {filteredStations.map((station, index) => (
          <Marker
            key={station._id}
            position={{ lat: station.position[0], lng: station.position[1] }}
            onClick={() => {
              const token = localStorage.getItem("token");

              // Ensure token exists and is valid
              if (!token) {
                console.error("No token found");
                return;
              }

              axios
                .get(`http://localhost:5000/api/users/favorites/${userId}`, {
                  headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                  console.log(response.data.favorites);
                  const userfavs = response.data.favorites;

                  // Update the stations list with isFavorite property
                  const updatedStations = stations.map((s) => {
                    // Check if the station is in the user's favorites
                    const isFavorite = userfavs.some(
                      (fav) => fav._id === s._id
                    );

                    // Return a new station object with the `isFavorite` property added
                    return { ...s, isFavorite };
                  });

                  console.log(`station: ${updatedStations[0].isFavorite}`);
                  // Update the stations state (or any other state that holds the list of stations)
                  setSelectedStation(updatedStations[0]);
                })
                .catch((error) =>
                  console.error("Error checking favorite status:", error)
                );
              console.log(`station: ${station.isFavorite}`);
              // Set the selected station to display details or highlight
            }}
          />
        ))}

        {/* Selected station info window */}
        {selectedStation && (
          <Modal
            isOpen={!!selectedStation}
            onRequestClose={() => setSelectedStation(null)}
            style={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: "100000",
              },
              content: {
                width: "250px",
                overflow: "hidden",
                margin: "auto",
                padding: "10px",
                backgroundColor: "#fff",
                height: "400px",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
              },
            }}
          >
            <div style={{ position: "relative", width: "100%" }}>
              <img
                src={carChargingImage}
                alt={selectedStation.name}
                style={{
                  width: "100%",
                  height: "130px",
                  objectFit: "cover",
                  borderRadius: "0px",
                }}
              />

              {/* Close button */}
              <button
                onClick={() => setSelectedStation(null)}
                style={{
                  position: "absolute",
                  top: "-15px",
                  right: "-20px",
                  backgroundColor: "transparent",
                  border: "none",
                  fontSize: "40px",
                  cursor: "pointer",
                  color: "white",
                }}
              >
                ×
              </button>

              {/* Favorite button */}
              <button
                onClick={() => handleFavorite(selectedStation)} // Call a function to handle favorite logic
                style={{
                  position: "absolute",
                  top: "0px",
                  left: "-20px",
                  backgroundColor: "transparent",
                  border: "none",
                  fontSize: "25px",
                  cursor: "pointer",
                  color: "white",
                }}
              >
                {selectedStation.isFavorite ? "❤️" : "🤍"}
              </button>
            </div>

            <h3 style={{ marginTop: "5px", color: "black", textAlign: "left" }}>
              {selectedStation.name}
            </h3>
            <p style={{ color: "#ddd", textAlign: "left", marginTop: "0px" }}>
              {selectedStation.address}
            </p>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ color: "#ffc107", marginRight: "5px" }}>
                ⭐ {selectedStation.rating} out of 5
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                marginTop: "20px",
                backgroundColor: "#ddd",
                borderRadius: "5px",
                alignItems: "center",
              }}
            >
              <img
                src={evcharger}
                alt="EVcharger"
                style={{ width: "54px", height: "48px" }}
              />
              <div style={{ color: "black" }}>
                <p>{selectedStation.power} </p>
                <p>Type {selectedStation.type}</p>
              </div>
              <button
                onClick={() => handleDirections(selectedStation)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <img
                  src={directionsIcon}
                  alt="Directions Icon"
                  style={{ width: "30px", height: "30px" }}
                />
              </button>
            </div>
            <button
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "1rem",
                marginBottom: "10px",
                marginTop: "10px",
              }}
            >
              Make Reservation
            </button>
          </Modal>
        )}
        {/* Add Station Modal */}
        <button
          onClick={() => setShowAddStationModal(true)}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "#1abc70",
            color: "white",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            fontSize: "24px",
            textAlign: "center",
            cursor: "pointer",

            border: "none",
          }}
        >
          +
        </button>
        {/* Add Station Modal */}
        <Modal
          isOpen={showAddStationModal}
          onRequestClose={() => setShowAddStationModal(false)}
          style={{
            overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
            content: {
              width: "400px",
              height: "400px",
              margin: "auto",
              padding: "20px",
              borderRadius: "8px",
              backgroundColor: "#fff",
              overflow: "hidden",
              zIndex: 100000000,
              color: "black",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
            },
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => setShowAddStationModal(false)}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              backgroundColor: "transparent",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#666",
            }}
          >
            ×
          </button>
          <h3 style={{ color: "black" }}>Add a New EV Station</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddStation();
            }}
          >
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={newStation.name}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                name="address"
                value={newStation.address}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Latitude:
              <input
                type="number"
                name="lat"
                value={newStation.lat}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Longitude:
              <input
                type="number"
                name="lng"
                value={newStation.lng}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Power (kW):
              <input
                type="number"
                name="power"
                value={newStation.power}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Type:
              <input
                type="text"
                name="type"
                value={newStation.type}
                onChange={handleInputChange}
              />
            </label>
            <button
              type="submit"
              style={{
                marginTop: "10px",
                width: "100%",
                padding: "10px",
                backgroundColor: "#1abc70",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Add Station
            </button>
          </form>
        </Modal>

        <MapSearch setMapCenter={setMapCenter} />
      </GoogleMap>
    </div>
  );
}

export default Map;
