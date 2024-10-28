import React, { useState } from 'react';
import logo from '../legendicon.png';
import './MapSearch.css';

const locations = {
  "Nairobi Central": [-1.286389, 36.817223],
  "Westlands": [-1.2683, 36.8018],
  "Karen": [-1.3177, 36.7411],
  "Embakasi": [-1.3217, 36.9445],
  "Gigiri": [-1.2500, 36.8260],
  "Ruiru": [-1.1513, 36.9201],
  "Kikuyu": [-1.2287, 36.7215]
};

const MapSearch = ({ setMapCenter }) => {
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLocationSelect = async (e) => {
    const selectedLocation = e.target.value;
    if (locations[selectedLocation]) {
      setMapCenter(locations[selectedLocation]);
      setErrorMessage(''); // Clear error message
    } else {
      // Fetch coordinates for undefined locations using OpenCage Geocoding API
      const apiKey = process.env.REACT_APP_OPENCAGE_API_KEY; 
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          selectedLocation
        )}&key=${apiKey}`
      );
      const data = await response.json();

      if (data.results.length > 0) { // Check for any results
        const { lat, lng } = data.results[0].geometry;
        setMapCenter([lat, lng]);
        setErrorMessage(''); // Clear error message
      } else {
        setErrorMessage("Location not found");
      }
    }
  };

  return (
    <div style={styles.searchBar}>
      <div style={styles.logo} onClick={() => setShowModal(true)}>
        <img src={logo} alt="Legend" style={styles.logoImage} />
      </div>
      <input
        type="text"
        list="cities"
        placeholder="Search for an address or place"
        onChange={handleLocationSelect}
        style={styles.input}
      />
      <datalist id="cities">
        {Object.keys(locations).map((location) => (
          <option key={location} value={location} />
        ))}
      </datalist>
      {showModal && (
        <div className="modal">
          <div className="flexDiv">
            <h2>Legend</h2>
            <span className="close-button" onClick={() => setShowModal(false)}>&times;</span>
          </div>
          <div className="modal-content">
          <div className="availability-info">
  <div className="logos">
    <img src={require('./icons/locationgreen-removebg-preview.png')} alt="AVAILABLE" style={{ width: "35px", height: "40px" }} />
    <div className="available">AVAILABLE</div>
  </div>
  <div className="logos">
    <img src={require('./icons/locationblue2-removebg-preview.png')} alt="OCCUPIED" style={{ width: "55px", height: "45px",marginLeft: "0px", paddingLeft: "0px" }} />
    <div className="occupied">OCCUPIED</div>
  </div>
  <div className="logos">
    <img src={require('./icons/locationred2-removebg-preview.png')} alt="NOT WORKING" style={{ width: "60px", height: "50px" }} />
    <div className="not-working">NOT WORKING</div>
  </div>
  <div className="logos">
    <img src={require('./icons/locationgrey2-removebg-preview.png')} alt="NO INFORMATION" style={{ width: "40px", height: "45px" }} />
    <div className="no-info">NO INFORMATION</div>
  </div>
</div>

          </div>
          {errorMessage && <div style={styles.error}>{errorMessage}</div>}
        </div>
      )}
    </div>
  );
};

export default MapSearch;

const styles = {
  searchBar: {
    position: 'absolute',
    top: '100px',
    right: '40px',
    zIndex: 1000,
    display: 'flex',
  },
  input: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '250px',
    backgroundColor: '#ffffff',
    color: '#333',
  },
  logo: {
    marginRight: '5px',
    cursor: 'pointer',
  },
  logoImage: {
    width: '40px',
    height: '45px',
  },
  icon: {
    width: '25px',
    height: '41px',
  },
  error: {
    color: 'red',
    marginTop: '50px',
  },
};
