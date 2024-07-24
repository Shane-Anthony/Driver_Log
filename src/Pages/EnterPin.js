import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Components/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '../App.css'; // Make sure this path is correct
import logo from '../Assets/Images/logo.jpg';

const dialPad = [1, 2, 3, 4, 5, 6, 7, 8, 9, "clear", 0, "del"]; // Dial pad buttons
const pinLength = 5; // Length of the PIN code

const EnterPin = () => {
  const [pinCode, setPinCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const {user, loginUser} = useUser();

  // Effect to redirect to dashboard if already logged in
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      // Redirect to dashboard if user is already logged in
      navigate('/dashboard');
    }
  }, [navigate]);

  // Function to clear the PIN code
  const clearPinCode = useCallback(() => {
    setPinCode("");
  }, []);

  // Function to sign in using the entered PIN code
  const signIn = useCallback(() => {
    const enteredPin = pinCode;
    fetch('https://service-team.co.uk:8443/validate-pin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pincode: enteredPin }),
    })
    .then(response => {
      console.log("Response received:", response);
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Failed to validate PIN');
      }
    })
    .then(data => {
      console.log("Response data:", data);
      if (data.isValid) {
        localStorage.setItem('authToken', 'true'); //persist login status
        loginUser(data.driverName); // Log in user with driver name
        alert("Successfully logged in!");
        navigate('/dashboard');
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
      setIsSubmitting(false);// Reset submission status
    });
  }, [pinCode, loginUser, navigate]);

  // Effect to trigger sign-in when PIN code reaches required length
  useEffect(() => {
    if (pinCode.length === pinLength && !isSubmitting) {
      setIsSubmitting(true);
      signIn(); // Call sign-in function
    }
  }, [pinCode, signIn, isSubmitting]);

   // Function to handle dial pad button clicks
  const handleButtonClick = useCallback((item) => {
    if (item === "clear") {
      setPinCode(""); // Clear the PIN code
    } else if (item === "del") {
      setPinCode(prevCode => prevCode.slice(0, -1)); // Delete the last character
    } else if (typeof item === "number") {
      setPinCode(prevCode => prevCode + item); // Append the clicked number to the PIN code
    }
  }, []);

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
      <div className="dial-pad">
        {dialPad.map((item, index) => (
          <button
            key={index}
            onClick={() => handleButtonClick(item)}
            disabled={isSubmitting}
            className="dial-pad-button"
          >
            {item === "del" ? <FontAwesomeIcon icon={faArrowLeft} /> : item === "clear" ? <FontAwesomeIcon icon={faUndo} /> : item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EnterPin;
