import React, { useState } from 'react';
import './MapSearch.css';
import axios from 'axios';

const MapSearch = ({ setMapCenter }) => {
  const [errorMessage, setErrorMessage] = useState('');

  // Move locations outside of the function
  const locations = {
    "Nairobi Central": [-1.286389, 36.817223],
    "Westlands Mall": [-1.2679, 36.8044],
    "Karen Shopping Centre": [-1.3184, 36.7486],
    "Embakasi East": [-1.3217, 36.9445],
    "Gigiri": [-1.2500, 36.8260],
    "Ruiru Town": [-1.1513, 36.9201],
    "Kikuyu Town": [-1.2287, 36.7215],
    "London": [51.5074, -0.1278], // Add more specific locations as needed
    // Add other specific locations here
  };
  

  const handleLocationSelect = async (e) => {
    const selectedLocation = e.target.value;
  
    // Check if the selected location is predefined
    if (locations[selectedLocation]) {
      setMapCenter({ lat: locations[selectedLocation][0], lng: locations[selectedLocation][1] });
      setErrorMessage('');
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
          setErrorMessage('');
        } else {
          setErrorMessage("Location not found");
        }
      } catch (error) {
        console.error('Error fetching location:', error);
        setErrorMessage("Error fetching location");
      }
    }
  };
  

  return (
    <div style={{ position: 'absolute', top: '30px', right: '40px', zIndex: 1000 }}>
      <input
        type="text"
        list="cities"
        placeholder="Search for an address or place"
        onChange={handleLocationSelect}
        style={{ padding: '10px', borderRadius: '4px', width: '250px', backgroundColor: '#fff', color: 'black' }}
      />
      <datalist id="cities">
        {Object.keys(locations).map((location) => (
          <option key={location} value={location} />
        ))}
      </datalist>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
    </div>
  );
};

export default MapSearch;
