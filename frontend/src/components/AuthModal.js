import React from 'react';
import './Auth.css';


const AuthModal = ({ closeModal, children }) => {
  return (
    <div className="modal-background">
      <div className="modal-content">
  <span onClick={closeModal}>X</span>
  {children}
      </div>
    </div>
  );
};

export default AuthModal;
