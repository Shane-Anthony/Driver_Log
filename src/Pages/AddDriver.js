import React, { useState } from 'react';

const AddDriver = () => {
  const [driverName, setDriverName] = useState('');
  const [pincode, setPincode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddDriver = async () => {
    try {
      console.log('Sending request to add a driver.');

      // Send data to server
      const response = await fetch('http://localhost:3000/addDriver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          driver_name: driverName,
          pincode: pincode,
        }),
      });

      // Handle response
      if (response.ok) {
        const data = await response.json();
        console.log('Server Response:', data);
        alert('Driver Added Successfully'); // Replace with a modal or toast notification
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add driver');
      }

    } catch (error) {
      console.error('Error adding driver:', error.message);
      setErrorMessage(error.message);
    }
  };

  const handlePincodeChange = (e) => {
    // Regex to replace any non-numeric characters with an empty string
    const sanitizedPincode = e.target.value.replace(/[^0-9]/g, '');
    setPincode(sanitizedPincode);
  };

  return (
    <div className='ad-container'>
      <div className='ad-square'>
        <h2 className='ad-title'>Add a New Driver</h2>
        <div className='ad-inputContainer'>
          <input
            className='ad-input'
            placeholder="Driver Name"
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
          />
        </div>
        <div className='ad-inputContainer'>
          <input
            className='ad-input'
            placeholder="Pincode"
            value={pincode}
            onChange={handlePincodeChange}
            type="text" // Use type="text" for compatibility with numeric input filtering
          />
        </div>
        <button className='ad-button' onClick={handleAddDriver}>
          <span className='ad-buttonText'>Add Driver</span>
        </button>
      </div>
    </div>
  );
};



export default AddDriver;
