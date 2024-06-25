import React, { useState, useEffect } from 'react';
import { useUser } from '../Components/UserContext';
import '../App.css'; // Assuming you have a CSS file for styling

const Start = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [journeyStarted, setJourneyStarted] = useState(false);
  const [formattedTime, setFormattedTime] = useState('');
  const [isIconRotated, setIsIconRotated] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useUser();

  console.log('user: ',user);

  // Function to fetch vehicle data from the server
  const fetchVehicles = async () => {
    

    try {
      const response = await fetch('http://localhost:3000/vehicles');
      const data = await response.json();
      console.log('Fetched vehicle data:', data);

      const sortedVehicles = data.sort((a, b) => a.VEHICLE_MAKE.localeCompare(b.VEHICLE_MAKE));
      setVehicles(sortedVehicles);
    } catch (error) {
      console.error('Error fetching vehicle data:', error);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleStartJourney = () => {
    if (!selectedVehicle) {
      console.error('No vehicle selected');
      setMessage('No vehicle selected');
      return;
    }

    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${String(currentDate.getDate()).padStart(2, '0')}`;
    const formattedTime = `${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}:${String(currentDate.getSeconds()).padStart(2, '0')}`;
    setFormattedTime(formattedTime);

    const journeyData = {
      date: formattedDate,
      start_time: formattedTime,
      vehicle_reg: selectedVehicle,
      driver_name: user.token
    };

    fetch('http://localhost:3000/startjourney', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(journeyData)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Journey started:', data);
        setJourneyStarted(true);
        setIsIconRotated(true);
      })
      .catch(error => {
        setMessage('Error on Start, Please Try Again.');
        console.error('Error starting journey:', error);
      });
  };

  return (
    <div className="s-container">
      {!journeyStarted ? (
        <div className="s-content">
          <div className="s-scrollview">
            {vehicles.map((vehicle, index) => (
              <button
                key={index}
                className={`s-button ${selectedVehicle === vehicle.VEHICLE_REG ? 's-selectedbutton' : ''}`}
                onClick={() => setSelectedVehicle(vehicle.VEHICLE_REG)}
              >
                {`${vehicle.VEHICLE_MAKE} ${vehicle.VEHICLE_MODEL} (${vehicle.VEHICLE_REG})`}
              </button>
            ))}
          </div>
          <div className="startbuttoncontainer">
            <button className="s-button startbutton" onClick={handleStartJourney}>
              Start
            </button>
            <div className="s-message">{message}</div>
          </div>
        </div>
      ) : (
        <div className="journeystartedcontainer">
          <div className="s-text bold large">{`Thank you, ${user.token}`}</div>
          <img src="/confirm.png" alt="Confirmation" className={`s-icon ${isIconRotated ? 'rotate-animation' : ''}`} />
          <div>{`Started at ${formattedTime}`}</div>
        </div>
      )}
    </div>
  );
};

export default Start;
