import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MapSearch from './SearchBar'; // Ensure the correct path for your MapSearch component
import axios from 'axios';
import Modal from 'react-modal';

// Custom icons for each station type
const icons = {
  Available: new L.Icon({
    iconUrl: require('./icons/locationgreen-removebg-preview.png'),
    iconSize: [30, 40],
  }),
  Occupied: new L.Icon({
    iconUrl: require('./icons/locationblue2-removebg-preview.png'),
    iconSize: [40, 40],
  }),
  "Not Working": new L.Icon({
    iconUrl: require('./icons/locationred2-removebg-preview.png'),
    iconSize: [50, 50],
  }),
  "No Information": new L.Icon({
    iconUrl: require('./icons/locationgrey2-removebg-preview.png'),
    iconSize: [30, 40],
  }),
};

// Functional component to update the map center
const MapUpdater = ({ center }) => {
  const map = useMap();
  map.setView(center, 13);
  return null;
};

function Map() {
  const [mapCenter, setMapCenter] = useState([-1.286389, 36.817223]); // Default to Nairobi Central
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  useEffect(() => {
    // Fetch station data from the API
    fetch('http://localhost:5000/api/stations')
      .then(response => response.json())
      .then(data => setStations(data))
      .catch(error => console.error('Error fetching stations:', error));
  }, []);
  /*const handleClose = () => {
    setIsPopupOpen(false); // Close the popup
  };*/

  const handleFavorite = async (station) => {
    try {
      await axios.post('http://localhost:5000/api/favoriteStations', { stationId: station.id });
      console.log(`Station ${station.id} added to favorites.`);
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  const handleDirections = (station) => {
    // Center the map on the selected station for a basic "directions" effect
    setMapCenter(station.position);
  };

  return (
    <>
      <MapContainer center={mapCenter} zoom={13} style={{ height: '100vh', width: '100vw' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapUpdater center={mapCenter} />

        {/* Map the stations to Marker components with customized Popup content */}
        {stations.map((station, index) => (
          <Marker
            key={index}
            position={station.position}
            icon={icons[station.status] || icons['No Information']}
            eventHandlers={{
                click: () => setSelectedStation(station),
              }}
          >
            {selectedStation && (
           <Modal isOpen={!!selectedStation}
          onRequestClose={() => setSelectedStation(null)} style={{overlay: {
            backgroundColor: 'none',width: '500px',zIndex: '1000' // Semi-transparent black overlay
          },
          content: {
            maxWidth: '250px', // Width of the modal
            margin: 'auto',     // Centers the modal horizontally
            /*borderRadius: '10px',
            padding: '20px',*/
            backgroundColor: 'none',
            textAlign: 'left',
            height: '400px',
          },}}>
  <div style={{
    width: '250px',
    backgroundColor: '#f3f3f3',
    /*borderRadius: '10px',*/
    overflow: 'hidden',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    color: '#333',
    fontFamily: 'Arial, sans-serif'
  }}>
    <div style={{ position: 'relative' }}>
      {/* Top Image */}
      <img src={require('./icons/carcharging.jpeg')} alt={selectedStation.name} style={{
        width: '100%',
        height: '130px',
        objectFit: 'cover',
      }} />
      
      {/* Favorite Icon */}
      <img onClick={() => handleFavorite(selectedStation)} src={require('./icons/hearticon.png')} alt="Favorite" style={{
        width: '24px',
        position: 'absolute',
        top: '10px',
        left: '10px',
        cursor: 'pointer'
      }} />

      {/* Close Icon */}
      <img onClick={() => setSelectedStation(null)} src={require('./icons/closebtn.png')} alt="Close" style={{
        width: '24px',
        position: 'absolute',
        top: '10px',
        right: '10px',
        cursor: 'pointer'
      }} />
    </div>

    {/* Content Section */}
    <div style={{ padding: '10px' }}>
      <h3 style={{
        fontSize: '16px',
        margin: '5px 0',
        color: '#333',
        fontWeight: 'bold'
      }}>{selectedStation.name}</h3>
      
      <p style={{
        fontSize: '14px',
        color: '#555',
        margin: '5px 0'
      }}>{selectedStation.address}</p>
      
      <p style={{
        fontSize: '14px',
        color: '#555',
        margin: '5px 0'
      }}>
        <span style={{ color: 'gold' }}>⭐ {selectedStation.rating} out of 5 ratings</span>
      </p>

      {/* Power and Type Section */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        borderRadius: '5px',
        padding: '5px 10px',
        marginTop: '10px',
        padding: '15px'
      }}>
        
          <img src={require('./icons/evchargericon-removebg-preview.png')} alt="Power Icon" style={{ width: '45px', marginRight: '5px' }} />
          <div style={{display: 'flex', flexDirection: 'column'}}>
          <div style={{ fontSize: '14px', fontWeight: '500' }}>{selectedStation.power}</div>
        <div style={{ fontSize: '14px', color: '#777' }}>Type {selectedStation.type}</div>
          </div>
          
      

      {/* Directions Icon */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '10px'
      }}>
        <img onClick={() => handleDirections(selectedStation)} src={require('./icons/directionsicon-removebg-preview.png')} alt="Directions" style={{
          width: '30px',
          cursor: 'pointer'
        }} />
      </div>
    </div>
    
        <button style={{ marginTop: "30px", marginBottom: "10px", justifyContent: "center", left: "20px", backgroundColor: "#1abc70", marginLeft: "20px" }}>Make Reservation</button>
    
  </div>
  </div>
</Modal>

    )}
          </Marker>
        ))}
      </MapContainer>
      <MapSearch setMapCenter={setMapCenter} />
    </>
  );
}


export default Map;
