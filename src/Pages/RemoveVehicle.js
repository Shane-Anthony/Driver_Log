import React, { useState } from 'react';

const RemoveVehicle = () => {
  const [registration, setRegistration] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRemoveVehicle = async () => {
    try {

        // Check if required fields are empty
      if (!registration) {
        setErrorMessage('Please fill out all required fields');
        return;
      }
        
      setErrorMessage('');

      console.log('Sending request to remove vehicle:', registration);

      // Send DELETE request to server
      const response = await fetch(`http://localhost:3000/removevehicle/${registration}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Handle response
      if (response.ok) {
        const data = await response.json();
        console.log('Server Response:', data);
        setErrorMessage(`Vehicle Successfully Removed`);
        setRegistration('');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove vehicle');
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
    </div>
  );
};

export default RemoveVehicle;
