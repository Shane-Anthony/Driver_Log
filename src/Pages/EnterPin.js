// EnterPin.js

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Create a CSS file for styling
import logo from '../Assets/Images/logo.png';

// Array representing the dial pad
const dialPad = [1, 2, 3, 4, 5, 6, 7, 8, 9, "clear", 0, "del"];
const pinLength = 5; // Length of the PIN

const EnterPin = () => {
  const [pinCode, setPinCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const debugMode = true; // Set this to false for production

  // Callback to clear PIN code
  const clearPinCode = useCallback(() => {
    setPinCode("");
  }, []);

  // Function to sign in
  const signIn = useCallback(() => {
    if (debugMode) {
      setTimeout(() => {
        navigate('/dashboard', { state: { driverName: "Admin", clearPinCode } });
      }, 1000);
      setIsSubmitting(false);
      return;
    }

    const enteredPin = pinCode.join('');
    // Fetch PIN codes from the server
    fetch('http://localhost:3000/validate-pin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pincode: enteredPin }),
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to validate PIN');
      }
    })
    .then(data => {
      if (data.isValid) {
        setTimeout(() => {
          navigate('/dashboard', { state: { driverName: data.driverName, clearPinCode } });
        }, 1000);
      } else {
        alert("Invalid pin. Please try again.");
        setPinCode("");
      }
    })
    .catch(error => {
      console.error('Error validating PIN:', error);
      alert("Failed to validate PIN. Please try again.");
      setPinCode("");
    })
    .finally(() => {
      setIsSubmitting(false);
    });
  }, [pinCode, navigate, clearPinCode, debugMode]);

  // Effect hook to handle PIN code submission
  useEffect(() => {
    if (pinCode.length === pinLength) {
      setIsSubmitting(true);
      signIn();
    }
  }, [pinCode, signIn]);

  // Component for the dial pad buttons
  const DialPad = ({ onPress }) => (
    <div className="dial-pad">
      {dialPad.map((item, index) => (
        <button
          key={index}
          onClick={() => onPress(item)}
          disabled={isSubmitting}
          className="dial-pad-button"
        >
          {item === "del" ? "←" : item === "clear" ? "↻" : item}
        </button>
      ))}
    </div>
  );

  return (
    <div className="enter-pin-container">
      {isSubmitting && <div className="loading-spinner">Loading...</div>}
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <h1 className="title">Enter Pin</h1>
      <div className="pin-display">
        {[...Array(pinLength)].map((_, index) => (
          <div
            key={index}
            className={`pin-dot ${pinCode.length > index ? 'filled' : ''}`}
          />
        ))}
      </div>
      <DialPad onPress={(item) => {
        if (item === "clear") {
          setPinCode("");
        } else if (item === "del") {
          setPinCode(prevCode => prevCode.slice(0, -1));
        } else if (typeof item === "number") {
          setPinCode(prevCode => prevCode + item);
        }
      }} />
    </div>
  );
};

export default EnterPin;
