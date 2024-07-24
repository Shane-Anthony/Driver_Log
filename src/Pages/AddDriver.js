import React, { useState } from 'react';

const AddDriver = () => {
  const [driverName, setDriverName] = useState('');
  const [pincode, setPincode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddDriver = async () => {
    try {
      // Check if required fields are empty
      if (!driverName || !pincode ) {
        setErrorMessage('Please fill out all required fields');
        return;
      }
      setErrorMessage(''); // Clear any previous error message
      setLoading(true); // Set loading state to true

      console.log('Sending request to add a user.');

      // Send data to server
      const response = await fetch('https://service-team.co.uk:8443/addDriver', {
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
        setErrorMessage(`User (${driverName}) Successfully Added`);
        setDriverName('');
        setPincode('');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add User');
      }

    } catch (error) {
      console.error('Error adding user:', error.message);
      setErrorMessage(error.message);
    } finally {
      setLoading(false); // Reset loading state regardless of success or failure
    }
  };

  // Function to handle pincode input change and sanitize it
  const handlePincodeChange = (e) => {
    // Regex to replace any non-numeric characters with an empty string
    const sanitizedPincode = e.target.value.replace(/[^0-9]/g, '');
    setPincode(sanitizedPincode);
  };

  return (
    <div className='ad-container'>
      <div className='ad-square'>
        <h2 className='ad-title'>Add a New User</h2>
        <div className='ad-inputContainer'>
          <input
            className='ad-input'
            placeholder="User's Name *"
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
            disabled={loading} // Disable input if loading
            required
          />
        </div>
        <div className='ad-inputContainer'>
          <input
            className='ad-input'
            placeholder="Pincode *"
            value={pincode}
            onChange={handlePincodeChange}
            disabled={loading}
            required
            type="text" // Use type="text" for compatibility with numeric input filtering
          />
        </div>
        <button className='ad-button' onClick={handleAddDriver} disabled={loading}>
          <span className='ad-buttonText'>{loading ? 'Adding...' : 'Add User'}</span>
        </button>
        {errorMessage && <p className='ad-errorMessage'>{errorMessage}</p>}
      </div>
    </div>
  );
};



export default AddDriver;
