import React, { useState, useEffect } from "react";
import "./Account.css";
import logo from "../ev-removebg-preview.png";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";
import AccountDetails from "./Account";
import Reservations from "./Reservations";
import FavoriteStations from "./FavoriteStations";
import MyCharges from "./MyCharges";
import { Link } from 'react-router-dom'; 
import HomePage from './Homepage';// Correct way to import jwtDecode
// Ensure this is installed: `npm install jwt-decode`
import { FaUser, FaCaretDown, FaCog, FaSignOutAlt, FaCreditCard, FaHeart, FaBolt } from "react-icons/fa";


const AccountDetailsPage = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userName, setUserName] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null); // State for profile picture
  const location = useLocation();
  const [selectedOption, setSelectedOption] = useState("account"); // Default to "account"


  const navigate = useNavigate();

  // Check if the user is logged in and decode the token to get the username
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          setUserLoggedIn(true);
          setUserName(decodedToken.user.name); // Assuming `name` is in the token payload
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

  const handleDropdownItemClick = (action) => {
    setDropdownVisible(false);
    // Implement logout and other actions here
    if (action === "logout") {
      localStorage.removeItem("token"); // Clear token on logout
      window.location.reload(); // Reload to reflect changes
    } else if (action === "favorites") {
      navigate("/favorites"); // Navigate to favorites
    } else if (action === "account") {
      navigate("/account"); // Navigate to account details
    } else if (action === "reservations") {
      navigate("/reservations"); // Navigate to reservations
    }
  };

  // Handle dropdown item clicks (logout, account details, etc.)
  // Set the selected section based on the navigation state
  useEffect(() => {
    if (location.state && location.state.selectedSection) {
      setSelectedOption(location.state.selectedSection);
    }
  }, [location.state]);

    // Handle profile picture change
    const handleProfilePictureChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setProfilePicture(reader.result); // Set preview image
          // Optionally: Send file to the backend for saving
          // uploadProfilePicture(file);
        };
        reader.readAsDataURL(file);
      }
    };

// const handleItemClick = (action) => {
//   if (action === "logout") {
//     localStorage.removeItem("token");
//     window.location.reload();
//   } else {
//     setSelectedOption(action); // Update the displayed content
//   }
// };
  return (
    <>
    <div style={styles.header}>
      <nav className="nav">
        <div style={styles.logo}>
          <img
            src={logo}
            alt="EV FIND"
            style={{ width: "150px", height: "90px" }}
          />
        </div>

        <ul className="nav-links">
          {userLoggedIn ? (
            <li>
              <span
                onClick={() => setDropdownVisible(!dropdownVisible)}
                style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
              >
                <FaUser style={{ marginRight: "5px" }} />
                {userName}
                <FaCaretDown style={{ marginLeft: "5px" }} />
              </span>
              {dropdownVisible && (
                <div className="dropdown-menu">
                  <ul>
                    <li onClick={() => handleDropdownItemClick("account")}>
                      <FaCog style={{ marginRight: "5px" }} /> Account Details
                    </li>
                    <li onClick={() => handleDropdownItemClick("reservations")}>
                      <FaCreditCard style={{ marginRight: "5px" }} /> My Reservations
                    </li>
                    <li onClick={() => handleDropdownItemClick("favorites")}>
                      <FaHeart style={{ marginRight: "5px" }} /> Favorite Stations
                    </li>
                    <li onClick={() => handleDropdownItemClick("logout")}>
                      <FaSignOutAlt style={{ marginRight: "5px" }} /> Logout
                    </li>
                  </ul>
                </div>
              )}
            </li>
          ) : (
            <>
              <li>
                <button onClick={() => navigate("/signup")}>Signup</button>
              </li>
              <li>
                <button onClick={() => navigate("/login")}>Login</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
    <div className="relative">
      <div className="bluish">
<h1>My account</h1>
<Link to="/" style={styles.linkStyle}>← Back to Homepage
</Link>
      </div>
      <div className="whitish">

      </div>
    </div>
    <div className="abs">
    <div className="links">
        <ul>
          <li onClick={() => setSelectedOption("account")}>
            <FaCog style={{ marginRight: "5px" }} /> Account Details
          </li>
          <li onClick={() => setSelectedOption("reservations")}>
            <FaCreditCard style={{ marginRight: "5px" }} /> My Reservations
          </li>
          <li onClick={() => setSelectedOption("favorites")}>
            <FaHeart style={{ marginRight: "5px" }} /> Favorite Stations
          </li>
          <li onClick={() => setSelectedOption("mycharges")}>
            <FaBolt style={{ marginRight: "5px" }} /> My charges
          </li>
        </ul>
      </div>
          <div className="content-section">
    {/* Render the selected content dynamically */}
    {selectedOption === "account" && <AccountDetails />}
    {selectedOption === "reservations" && <Reservations />}
    {selectedOption === "favorites" && <FavoriteStations />}
  </div>
    </div>
    </>
  );
};

export default AccountDetailsPage;

const styles = {
  logo: {
    display: "flex",
    alignItems: "center",
  },
  header: {
    height: "10vh",
    marginBottom: "7px",
    marginTop: "4px"
  },
  linkStyle: {
     textDecoration: 'none',
  color: '#ddd',
  paddingLeft: "40px",
  },
};
