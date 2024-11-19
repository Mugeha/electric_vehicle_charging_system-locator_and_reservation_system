import React, { useState, useEffect } from "react";
import './Acc.css';
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { FaCamera } from "react-icons/fa";

const AccountDetails = () => {
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [userName, setUserName] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null); // State for profile picture
    const [email, setEmail] = useState(""); // Email state
  const [password, setPassword] = useState(""); // Password state
  const [country, setCountry] = useState(""); // Country state
  const [postalCode, setPostalCode] = useState(""); // Postal code state
  
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          if (decodedToken.exp * 1000 > Date.now()) {
            setUserLoggedIn(true);
            setUserName(decodedToken.user.name);
            setEmail(decodedToken.user.email);
          } else {
            localStorage.removeItem("token");
            setUserLoggedIn(false);
          }
        } catch (error) {
          console.error("Token decoding failed:", error);
          setUserLoggedIn(false);
        }
      }
    }, []);
  
    // Handle profile picture change
    const handleProfilePictureChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setProfilePicture(reader.result); // Set preview image
          // Optionally, send the file to the backend
          // uploadProfilePicture(file);
        };
        reader.readAsDataURL(file);
      }
    };
   // Handle save changes
  const handleSaveChanges = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User not logged in");
      return;
    }

    const updatedData = { email, password, country, postalCode };

    axios
      .put("http://localhost:5000/api/users/update", updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        console.log("Profile updated successfully:", response.data);
        alert("Profile updated successfully");
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  // Handle account deletion
  const handleDeleteAccount = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User not logged in");
      return;
    }

    if (window.confirm("Are you sure you want to delete your account?")) {
      axios
        .delete("http://localhost:5000/api/users/delete", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log("Account deleted successfully:", response.data);
          localStorage.removeItem("token");
          setUserLoggedIn(false);
          alert("Account deleted successfully");
          window.location.reload(); // Optionally reload or redirect the user
        })
        .catch((error) => {
          console.error("Error deleting account:", error);
        });
    }
  };
 

  return (
    <>
    <div class="information-container">
    <h2 class="information-title">Information</h2>
    <div className="profile-picture-container">
          <img
            src={profilePicture || "https://via.placeholder.com/100"} // Default profile picture
            alt="Profile"
            className="profile-picture"
          />
          <div
            className="edit-icon"
            onClick={() => document.getElementById("profile-upload").click()} // Trigger file input click
          >
            🖊️
          </div>
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            style={{ display: "none" }}
          />
   
  </div>

  
  <div class="information-grid">
    
    <div class="information-item">
      <label class="information-label">Username</label>
      <input
            type="text"
            className="information-value"
            value={userName}
            readOnly // Username is not editable
          />
      <span class="information-helper">Appears when you add comments and/or photos.</span>
    </div>

    
    <div class="information-item">
      <label class="information-label">Name</label>
      <input
            type="email"
            className="information-value"
            placeholder="Enter your name"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
      <span class="information-helper">Used when we communicate with you.</span>
    </div>

    
    <div class="information-item">
      <label class="information-label">Country</label>
      <input
            type="text"
            className="information-value"
            placeholder="Enter your country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
      <span class="information-helper2"></span>
    </div>

    
    <div class="information-item">
      <label class="information-label">Postal code</label>
      <input
            type="number"
            className="information-value"
            placeholder="Enter your postal code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
      <span class="information-helper">
        We will notify you when new charging stations are registered in the area.
      </span>
    </div>
  </div>
  {/* Buttons for Save and Delete */}
  <div className="action-buttons">
        <button className="save-button" onClick={handleSaveChanges}>
          Save
        </button>
        <button
          className="delete-account-button"
          onClick={handleDeleteAccount}
        >
          Delete Account
        </button>
        <p>yfeuiybgfbuerugbllllllllllllllllllerguierfhuilerhguiehlrgegfyfeugfubeeefuiergfhgdrjlgueulrgfulsegfgeyuegofobuilderhnfiulegir</p>
      </div>
</div>
</>
  );
};

export default AccountDetails;  
