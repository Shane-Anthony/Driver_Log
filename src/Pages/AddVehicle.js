import React, { useState } from 'react';

const AddVehicle = () => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [registration, setRegistration] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddVehicle = async () => {
    try {
      // Check if required fields are empty
      if (!make || !model || !registration) {
        setErrorMessage('Please fill out all required fields');
        return;
      }

      // Send data to server
      const response = await fetch('http://localhost:3000/addVehicle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          make: make,
          model: model,
          registration: registration,
        }),
        });

        // Handle response
        if (response.ok) {
            const data = await response.json();
            console.log('Server Response:', data);
            alert('Vehicle Added Successfully'); // Replace with a modal or toast notification
            // Clear input fields after successful submission
            setMake('');
            setModel('');
            setRegistration('');
        } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add vehicle');
        }

    } catch (error) {
      console.error('Error adding vehicle:', error.message);
      setErrorMessage(error.message);
    }
  };

  const handleInputChange = (setter, value) => {
    // Regex to replace any non-alphanumeric characters with an empty string
    const sanitizedValue = value.replace(/[^a-zA-Z0-9 ]/g, '');
    setter(sanitizedValue);
  };

  const handleRegistrationChange = (event) => {
    // Convert text to uppercase and replace non-alphanumeric characters with ''
    const sanitizedText = event.target.value.toUpperCase().replace(/[^A-Z0-9 ]/g, '');

    // Check if there's more than one space or leading space
    const spaceCount = (sanitizedText.match(/ /g) || []).length;
    const hasText = sanitizedText.replace(/\s/g, '').length > 0;

    if (spaceCount > 1 || (spaceCount === 1 && !hasText)) {
      return; // Prevent more than one space or a leading space
    }

    // Update state with sanitized text
    setRegistration(sanitizedText);
  };

  return (
    <div className='av-container'>
      <div className='av-square'>
        <h2 className='av-title'>Add a New Vehicle</h2>
        <div className='av-inputContainer'>
          <input
            className='av-input'
            placeholder="Make *"
            value={make}
            onChange={(e) => handleInputChange(setMake, e.target.value)}
            required
          />
        </div>
        <div className='av-inputContainer'>
          <input
            className='av-input'
            placeholder="Model *"
            value={model}
            onChange={(e) => handleInputChange(setModel, e.target.value)}
            required
          />
        </div>
        <div className='av-inputContainer'>
          <input
            className='av-input'
            placeholder="Registration *"
            value={registration}
            onChange={handleRegistrationChange}
            required
          />
        </div>
        <button className='av-button' onClick={handleAddVehicle}>
          <span className='av-buttonText'>Add Vehicle</span>
        </button>
        {errorMessage && <p className='av-errorMessage'>{errorMessage}</p>}
      </div>
    </div>
  );

};

export default AddVehicle;
