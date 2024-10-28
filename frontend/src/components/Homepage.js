import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Correct
import Login from "./Login";
import Signup from "./Signup";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import AuthModal from "./AuthModal";
import Map from "./Map";
import "../Header.css";
import logo from "../ev-removebg-preview.png";
import {
  FaUser,
  FaCaretDown,
  FaCog,
  FaCreditCard,
  FaHeart,
  FaSignOutAlt,
} from "react-icons/fa"; // Import icons from react-icons

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [authType, setAuthType] = useState("login"); // Default to 'login'
  const [dropdownVisible, setDropdownVisible] = useState(false); // Manage dropdown visibility
  const [userLoggedIn, setUserLoggedIn] = useState(false); // New state to track login

  const openModal = (type) => {
    setAuthType(type);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const renderAuthComponent = () => {
    switch (authType) {
      case "login":
        return (
          <Login
            authType={authType}
            onClose={closeModal}
            onChangeAuthType={setAuthType}
          />
        );
      case "signup":
        return (
          <Signup
            authType={authType}
            onClose={closeModal}
            onChangeAuthType={setAuthType}
          />
        );
      case "forgot-password":
        return (
          <ForgotPassword
            authType={authType}
            onClose={closeModal}
            onChangeAuthType={setAuthType}
          />
        );
      case "reset-password":
        return (
          <ResetPassword
            authType={authType}
            onClose={closeModal}
            onChangeAuthType={setAuthType}
          />
        );
      default:
        return null;
    }
  };

  // Function to check if the user is logged in and return the user's name
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          setUserLoggedIn(true); // User is logged in
        } else {
          localStorage.removeItem("token");
          setUserLoggedIn(false); // Token expired
        }
      } catch (error) {
        console.error("Token decoding failed:", error);
        setUserLoggedIn(false);
      }
    }
  }, [])
  const getUserName = () => {
   
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        return decodedToken.user.name; // Assuming 'name' is in the token payload
      } catch (error) {
        console.error("Token decoding failed:", error);
      }
    }
    return null;
  };

  const userName = getUserName(); // Get the user's name from the token

  // Handle dropdown item click (implement as needed)
  const handleDropdownItemClick = (action) => {
    setDropdownVisible(false);
    // Implement logout and other actions here
    if (action === "logout") {
      localStorage.removeItem("token"); // Clear token on logout
      window.location.reload(); // Reload to reflect changes
    }
  };
   // Function to trigger auth modal when necessary
   const handleAccessProtectedFeature = () => {
    if (!userLoggedIn) {
      openModal("login"); // Show login modal if user is not logged in
    }
  };

  return (
    <>
      <div className="header">
        <nav className="nav">
          <div style={styles.logo}>
            <img
              src={logo}
              alt="EV FIND"
              style={{ width: "150px", height: "90px" }}
            />
          </div>

          <ul className="nav-links">
            {userName ? ( // Check if userName exists
              <li>
                <span
                  onClick={() => setDropdownVisible(!dropdownVisible)}
                  style={{ cursor: "pointer" }} // Add cursor style
                >
                  <FaUser style={{ marginRight: "9px", marginTop: "2px" }} /> {/* User Icon */}
                  Welcome {userName.toUpperCase()}
                  <FaCaretDown style={{ marginLeft: "5px" }} />{" "}
                  {/* Dropdown Icon */}
                </span>
                {dropdownVisible && (
                  <>
                
                  <div className="dropdown-menu">
                  <h4 style={{color: "black", marginLeft: "15px", opacity: "0.4"}}>PERSONAL AREA</h4>
                    <ul>
                      <li onClick={() => handleDropdownItemClick("account")}>
                        <FaCog style={{ marginRight: "5px" }} /> Account Details
                      </li>
                      <li onClick={() => handleDropdownItemClick("payment")}>
                        <FaCreditCard style={{ marginRight: "5px" }} /> Payment
                        Methods
                      </li>
                      <li onClick={() => handleDropdownItemClick("favorites")}>
                        <FaHeart style={{ marginRight: "5px" }} /> Favorite
                        Stations
                      </li>
                      <li onClick={() => handleDropdownItemClick("logout")}>
                        <FaSignOutAlt style={{ marginRight: "5px" }} /> Logout
                      </li>
                    </ul>
                  </div>
                  </>
                  
                )}
              </li>
            ) : (
              <>
                <li>
                  <button onClick={() => openModal("signup")}>Signup</button>
                </li>
                <li>
                  <button onClick={() => openModal("login")}>Login</button>
                </li>
              </>
            )}
          </ul>
        </nav>
        {showModal && (
          <AuthModal closeModal={closeModal}>{renderAuthComponent()}</AuthModal>
        )}
      </div>
      <Map onAccessProtectedFeature={handleAccessProtectedFeature}/>
    </>
  );
};

export default HomePage;

const styles = {
  logo: {
    display: "flex",
    alignItems: "center",
  },
};
