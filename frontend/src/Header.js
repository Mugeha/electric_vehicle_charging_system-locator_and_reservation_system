import React, { useState } from 'react';
import AuthModal from './components/AuthModal'; 
// Assuming AuthModal is handling the login/signup/forgot password flow
import logo from './ev-removebg-preview.png';
import './Header.css';

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authType, setAuthType] = useState('login'); // Can be 'login' or 'signup'

  const openModal = (type) => {
    setAuthType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <header className="header">
      <nav className="nav">
      <div style={styles.logo}>
                <img src={logo} alt="EV FIND" style={{ width: '150px', height: '90px' }} />
            </div>
        <ul className="nav-links">
          <li>
            <button onClick={() => openModal('signup')}>Sign Up</button>
          </li>
          <li>
            <button onClick={() => openModal('login')}>Log in</button>
          </li>
        </ul>
      </nav>

      {/* Auth Modal: This will open when either Login or Signup is clicked */}
      {isModalOpen && (
        <AuthModal authType={authType} onClose={closeModal} />
      )}
    </header>
  );
};

export default Header;
const styles = {
 
    logo: {
        display: 'flex',
        alignItems: 'center',
    },
};
