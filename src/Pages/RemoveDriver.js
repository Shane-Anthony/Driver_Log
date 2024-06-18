import React, { useState, useEffect } from 'react';

const RemoveDriver = () => {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fetch the list of drivers when the component mounts
    const fetchDrivers = async () => {
      try {
        const response = await fetch('http://localhost:3000/drivers');
        const data = await response.json();
        setDrivers(data);
      } catch (error) {
        console.error('Error fetching drivers:', error);
      }
    };

    fetchDrivers();
  }, []);

  const handleRemoveDriver = async () => {
    if (!selectedDriver) {
      setErrorMessage('Please select a driver to remove');
      return;
    }

    try {
      // Send DELETE request to the server
      const response = await fetch(`http://localhost:3000/removedriver/${selectedDriver}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Driver removed successfully');
        // Refresh the list of drivers after removal
        setDrivers(drivers.filter(driver => driver.id !== selectedDriver));
        setSelectedDriver('');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove driver');
      }
    } catch (error) {
      console.error('Error removing driver:', error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className='rd-container'>
      <div className='rd-square'>
        <h2 className='rd-title'>Remove a Driver</h2>
        <div className='rd-inputContainer'>
          <select
            className='rd-input'
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
            required
          >
            <option value='' disabled>Select a driver</option>
            {drivers.map(driver => (
              <option key={driver.id} value={driver.id}>{driver.name}</option>
            ))}
          </select>
        </div>
        <button className='rd-button' onClick={handleRemoveDriver}>
          <span className='rd-buttonText'>Remove Driver</span>
        </button>
        {errorMessage && <p className='rd-errorMessage'>{errorMessage}</p>}
      </div>
    </div>
  );
};

export default RemoveDriver;

