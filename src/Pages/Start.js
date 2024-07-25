import React, { useState, useEffect } from 'react';
import { useNavigate,} from 'react-router-dom';
import { useUser } from '../Components/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowLeftLong} from '@fortawesome/free-solid-svg-icons';
import '../App.css'; 
const icon = require('../Assets/Images/confirm.png')

const Start = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [journeyStarted, setJourneyStarted] = useState(false);
  const [formattedTime, setFormattedTime] = useState('');
  const [isIconRotated, setIsIconRotated] = useState(false);
  const [message, setMessage] = useState('');
  const { user } = useUser();

  console.log('user: ',user); // Log user data for debugging

  // Function to fetch vehicle data from the server
  const fetchVehicles = async () => {
    

    try {
      const response = await fetch('https://service-team.co.uk:8443/vehicles'); // Fetch vehicle data from server
      const data = await response.json();// Parse response as JSON
      console.log('Fetched vehicle data:', data); // Log fetched data

      // Sort vehicles by make and update state
      const sortedVehicles = data.sort((a, b) => a.VEHICLE_MAKE.localeCompare(b.VEHICLE_MAKE));
      setVehicles(sortedVehicles);
    } catch (error) {
      console.error('Error fetching vehicle data:', error);
    }
  };

  // useEffect to fetch vehicle data when component mounts
  useEffect(() => {
    fetchVehicles();
  }, []);

  // Function to handle the start of the journey
  const handleStartJourney = () => {
    if (!selectedVehicle) { // Check if a vehicle is selected
      console.error('No vehicle selected');
      setMessage('No vehicle selected');
      return;
    }

    // Get and format current date and time
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${String(currentDate.getDate()).padStart(2, '0')}`;
    const formattedTime = `${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}:${String(currentDate.getSeconds()).padStart(2, '0')}`;
    setFormattedTime(formattedTime);

     // Create journey data object
    const journeyData = {
      date: formattedDate,
      start_time: formattedTime,
      vehicle_reg: selectedVehicle,
      driver_name: user.token
    };

    // Send journey data to server
    fetch('https://service-team.co.uk:8443/startjourney', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(journeyData)
    })
      .then(response => response.json())
      .then(data => {
        console.log('Journey started:', data); // Log server response
        setJourneyStarted(true); // Update journey started state
        setIsIconRotated(true); // Trigger icon rotation
      })
      .catch(error => {
        setMessage('Error on Start, Please Try Again.');
        console.error('Error starting journey:', error);
      });
  };

  const handleReturnToDashboard = () => {
    navigate('/dashboard');
  };

  

  return (
    <div className="s-container">
      
      {!journeyStarted ? ( // Conditional rendering based on journeyStarted state
      
        <div className="s-content">
          <button onClick={handleReturnToDashboard} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '20px'}}>
            <FontAwesomeIcon icon={faArrowLeftLong} size="2x" />
          </button>
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
      ) : ( // If journey started, display confirmation message
        <div className="journeystartedcontainer">
          <div className="s-text bold large">{`Thank you, ${user.token}`}</div>
          <img src={icon} alt="Confirmation" className={`s-icon ${isIconRotated ? 'rotate-animation' : ''}`} />
          <div>{`Started at ${formattedTime}`}</div>
          <button className="s-back" onClick={handleReturnToDashboard}>
            <FontAwesomeIcon icon={faArrowLeft} /> 
          </button>
        </div>
      )}
    </div>
  );
};

export default Start;
