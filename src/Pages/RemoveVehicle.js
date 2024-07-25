import React, { useState } from 'react';
import { useNavigate,} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong} from '@fortawesome/free-solid-svg-icons';

const RemoveVehicle = () => {
  const navigate = useNavigate();
  const [registration, setRegistration] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Function to handle vehicle removal
  const handleRemoveVehicle = async () => {
    try {
      // Check if required fields are empty
      if (!registration) {
        setErrorMessage('Please fill out all required fields');
        return;
      }
        
      setErrorMessage(''); // Clear error message

      console.log('Sending request to remove vehicle:', registration);

      // Send DELETE request to server
      const response = await fetch(`https://service-team.co.uk:8443/removevehicle/${registration}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Handle response
      if (response.ok) {
        const data = await response.json(); // Parse response as JSON
        console.log('Server Response:', data); // Log server response
        setErrorMessage(`Vehicle Successfully Removed`);
        setRegistration('');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove vehicle'); // Throw error with message from server or default message
      }

    } catch (error) {
      console.error('Error removing vehicle:', error.message);
      setErrorMessage(error.message);
    }
  };

  const handleInputChange = (e) => {
    // Update registration state with input value
    setRegistration(e.target.value);
  };

  const handleReturnToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className='rv-container'>
      <div className='rv-square'>
        <h2 className='rv-title'>Remove Vehicle</h2>
        <div className='rv-inputContainer'>
          <input
            className='rv-input'
            placeholder="Vehicle Registration *"
            value={registration}
            onChange={handleInputChange}
            required
          />
        </div>
        <button className='rv-button' onClick={handleRemoveVehicle}>
          <span className='rv-buttonText'>Remove Vehicle</span>
        </button>
        {errorMessage && <p className='rv-errorMessage'>{errorMessage}</p>}
      </div>
      <button className='backButton' onClick={handleReturnToDashboard}>
        <FontAwesomeIcon icon={faArrowLeftLong} size="2x" />
      </button>
    </div>
  );
};

export default RemoveVehicle;
