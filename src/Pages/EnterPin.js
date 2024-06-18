import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Components/UserContext';
import '../App.css'; // Make sure this path is correct
import logo from '../Assets/Images/logo.png';

const dialPad = [1, 2, 3, 4, 5, 6, 7, 8, 9, "clear", 0, "del"];
const pinLength = 5;

const EnterPin = () => {
  const [pinCode, setPinCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const {user, loginUser} = useUser();

  useEffect(() => {
    console.log('Current user:', user);
    if (user) {
      // Redirect to dashboard if user is already logged in
      navigate('/dashboard');
    }
  }, [user, navigate]);

  
  const clearPinCode = useCallback(() => {
    setPinCode("");
  }, []);

  const signIn = useCallback(() => {
    const enteredPin = pinCode;
    fetch('http://localhost:3000/validate-pin', {
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
        loginUser(data.driverName); // Assuming data.driverName is what you want to set
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
      setIsSubmitting(false);
    });
  }, [pinCode, loginUser, navigate]);

  useEffect(() => {
    if (pinCode.length === pinLength && !isSubmitting) {
      setIsSubmitting(true);
      signIn();
    }
  }, [pinCode, signIn, isSubmitting]);

  const handleButtonClick = useCallback((item) => {
    if (item === "clear") {
      setPinCode("");
    } else if (item === "del") {
      setPinCode(prevCode => prevCode.slice(0, -1));
    } else if (typeof item === "number") {
      setPinCode(prevCode => prevCode + item);
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
            {item === "del" ? "←" : item === "clear" ? "↻" : item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EnterPin;
