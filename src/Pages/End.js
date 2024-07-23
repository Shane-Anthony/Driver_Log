import React, {useState, useEffect} from 'react';
import { useNavigate,} from 'react-router-dom';
import { useUser } from '../Components/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import '../App.css';
import icon from '../Assets/Images/confirm.png';

const End = ({}) => {
    const [formattedTime, setFormattedTime] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [message, setMessage] = useState('');
    const [startTime, setStartTime] = useState('');
    const navigate = useNavigate();
    const {user} = useUser();
    

    // Function to get the last journey of the current day for the specified driver
    const fetchLastJourney = async () => {
        try {
        // Make a fetch request to your server to get the last journey of the day
        const response = await fetch(`https://92.205.234.119:3000/lastjourney?driver_name=${user.token}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Last journey data:', data); // Log the data received from the server
        setStartTime(data.START_TIME);

        if (data && data.END_TIME !== null) {
            // If end time exists, set it to formattedTime state
            console.log(data.END_TIME);
        setFormattedTime(data.END_TIME);
        const messageDeny = 'Journey Already Ended'
        setMessage(messageDeny);
        } else {
            // If end time doesn't exist, update the last journey with the current time
            updateJourney();
        }
        } catch (error) {
        console.error('Error fetching last journey:', error);
        }
    };

    // Function to update the last journey with the current time
    const updateJourney = async () => {
        try {
        // Make a POST request to update the last journey with the current time
        const currentDate = new Date();
        const currentTime = `${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}:${String(currentDate.getSeconds()).padStart(2, '0')}`;
        setFormattedTime(currentTime);    
        const journeyData = {
            driver_name: user.token,
            end_time: currentTime
        };
        const response = await fetch('https://92.205.234.119:3000/updatejourney', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(journeyData)
        });
        if (response.ok) {
            setUpdateSuccess(true);
            const messageOk = 'Journey Successfully Ended'
            setMessage(messageOk);

        }
        } catch (error) {
        console.error('Error updating last journey:', error);
        }
    };

    // Call fetchLastJourney when the component mounts
    useEffect(() => {
        fetchLastJourney();
    }, []);

    const handleReturnToDashboard = () => {
        navigate('/dashboard');
      };

    return (
        <div className="end-container">
          <div className="end-text bold large">{message}</div>
          {updateSuccess && (
            <img
              src={icon}
              alt="Confirmation"
              className="end-icon"
            />
          )}
          <div className="end-text">{`Driver Name: ${user.token}`}</div>
          <div className="end-text">{`Start Time: ${startTime}`}</div>
          <div className="end-text">{`End Time: ${formattedTime}`}</div>


          <button className="s-back" onClick={handleReturnToDashboard}>
            <FontAwesomeIcon icon={faArrowLeft} /> 
          </button>
        </div>
    );
};


export default End;