import React, { useState, useEffect } from "react";
import "./Acc.css";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { FaCamera } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AccountDetails = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userName, setUserName] = useState(null); // Read-only username from profile
  const [profilePicture, setProfilePicture] = useState(null); // Profile picture
  const [name, setName] = useState(""); // Editable Name field
  const [email, setEmail] = useState(""); // Email
  // const [password, setPassword] = useState(""); // Password
  const [country, setCountry] = useState(""); // Country
  const [postalCode, setPostalCode] = useState(""); // Postal Code

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          setUserLoggedIn(true);
          setUserName(decodedToken.user.userName); // Fetched from profile
          setEmail(decodedToken.user.email); // Prefill email
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
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Save Changes
  const handleSaveChanges = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("User not logged in");
      return;
    }

    const updatedData = { name, email, country, postalCode };

    axios
      .put("http://localhost:5000/api/update", updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        toast.success("Profile updated successfully");
        console.log("Profile updated successfully:", response.data);
         // Clear input fields after save
      setName("");
      setEmail("");
      setCountry("");
      setPostalCode("");
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        toast.error("Error updating profile");
      });
  };

  // Handle Account Deletion
  const handleDeleteAccount = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("User not logged in");
      return;
    }

    if (window.confirm("Are you sure you want to delete your account?")) {
      axios
        .delete("http://localhost:5000/api/users/delete", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          toast.success("Account deleted successfully");
          localStorage.removeItem("token");
          setUserLoggedIn(false);
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error deleting account:", error);
          toast.error("Error deleting account");
        });
    }
  };

  return (
    <>
      <div className="information-container">
        <h2 className="information-title">Information</h2>

        {/* Profile Picture */}
        <div className="profile-picture-container">
          <img
            src={profilePicture || "https://via.placeholder.com/100"}
            alt="Profile"
            className="profile-picture"
          />
          <div
            className="edit-icon"
            onClick={() => document.getElementById("profile-upload").click()}
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

        {/* Information Grid */}
        <div className="information-grid">
          {/* Username (read-only) */}
          <div className="information-item">
            <label className="information-label">Username</label>
            <input
              type="text"
              className="information-value"
              value={userName}
              readOnly
            />
            <span className="information-helper">
              Appears when you add comments and/or photos.
            </span>
          </div>

          {/* Name (editable) */}
          <div className="information-item">
            <label className="information-label">Name</label>
            <input
              type="text"
              className="information-value"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <span className="information-helper">Used when we communicate with you.</span>
          </div>

          {/* Email */}
          <div className="information-item">
            <label className="information-label">Email</label>
            <input
              type="email"
              className="information-value"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="information-helper">Required for account access.</span>
          </div>

          {/* Country */}
          <div className="information-item">
            <label className="information-label">Country</label>
            <input
              type="text"
              className="information-value"
              placeholder="Enter your country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>

          {/* Postal Code */}
          <div className="information-item">
            <label className="information-label">Postal Code</label>
            <input
              type="text"
              className="information-value"
              placeholder="Enter your postal code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
            <span className="information-helper">
              We will notify you when new charging stations are registered in your area.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="save-button" onClick={handleSaveChanges}>
            Save
          </button>
          <button className="delete-account-button" onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </div>
      </div>
    </>
  );
};

export default AccountDetails;
