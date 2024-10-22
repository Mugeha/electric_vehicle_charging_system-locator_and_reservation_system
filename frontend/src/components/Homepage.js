import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import AuthModal from "./AuthModal";
import "../Header.css";
import logo from "../ev-removebg-preview.png";

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [authType, setAuthType] = useState("login"); // Default to 'login'

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

  return (
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
          <li>
            <button onClick={() => openModal("signup")}>Signup</button>
          </li>
          <li>
            <button onClick={() => openModal("login")}>Login</button>
          </li>
        </ul>
      </nav>
      {showModal && (
        <AuthModal closeModal={closeModal}>{renderAuthComponent()}</AuthModal>
      )}
    </div>
  );
};

export default HomePage;

const styles = {
  logo: {
    display: "flex",
    alignItems: "center",
  },
};
