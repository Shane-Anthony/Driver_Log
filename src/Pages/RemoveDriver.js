import React, { useState, useEffect } from 'react';

const RemoveDriver = () => {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);


// Fetch the list of drivers when the component mounts
  const fetchDrivers = async () => {
    try {
      const response = await fetch('http://localhost:3000/drivers');
      const data = await response.json();
      setDrivers(data);
    } catch (error) {
      console.error('Error fetching Users:', error);
    }
  };

  useEffect(() => {
    
    fetchDrivers();
  }, []);

  const handleRemoveDriver = async () => {
    if (!selectedDriver) {
      setErrorMessage('Please select a User to remove');
      return;
    }

    setLoading(true);
    
    try {
      // Send DELETE request to the server
      const response = await fetch(`http://localhost:3000/removedriver/${selectedDriver}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setErrorMessage('User Successfully Removed');
        await fetchDrivers();
        setSelectedDriver('');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove driver');
      }
    } catch (error) {
      console.error('Error removing driver:', error.message);
      setErrorMessage(error.message);
    } finally {
      setLoading(false); // Reset loading state regardless of success or failure
    }
  };

  return (
    <div className='rd-container'>
      <div className='rd-square'>
        <h2 className='rd-title'>Remove User</h2>
        <div className='rd-inputContainer'>
          <select
            className='rd-input'
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
            disabled={loading}
            required
            maxMenuHeight={20}
          >
            <option value='' disabled>Select a User</option>
            {drivers.map(driver => (
              <option key={driver.id} value={driver.id}>{driver.name}</option>
            ))}
          </select>
        </div>
        <button className='rd-button' onClick={handleRemoveDriver}  disabled={!selectedDriver || loading}>
          <span className='rd-buttonText'>{loading ? 'Removing...' : 'Remove'}</span>
        </button>
        {errorMessage && <p className='rd-errorMessage'>{errorMessage}</p>}
      </div>
    </div>
  );
};

export default RemoveDriver;

