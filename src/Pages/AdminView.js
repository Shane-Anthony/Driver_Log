import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Tabs from "../Components/Tabs";
import '../App.css';

// DailyJourneys Component
const DailyJourneys = () => {
  const [dailyJourneys, setDailyJourneys] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  

  useEffect(() => {
    fetchJourneys(); // Fetch journeys data when component mounts
  }, [selectedDate]); // Fetch journeys data when selectedDate changes

  // Function to fetch daily journeys data from the server
  const fetchJourneys = async () => {
    try {
      // Format selectedDate for API request
      const formattedDate = selectedDate.toISOString().split('T')[0]; // Format selectedDate for API request

      // Fetch daily journeys from the server
      const response = await axios.get(`https://service-team.co.uk:8443/dailyjourneys?date=${formattedDate}`);
      if (response.status === 200) {
        setDailyJourneys(response.data);
      } else {
        console.error('Failed to fetch journeys data');
      }
    } catch (error) {
      console.error('Error fetching journeys:', error);
    }
  };

  // Function to format date to 'dd/mm/yyyy' format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB').replace(/\//g, '/');
  };

  // Function to navigate to the previous day
  const goToPreviousDay = () => {
    const previousDate = new Date(selectedDate);
    previousDate.setDate(previousDate.getDate() - 1);
    setSelectedDate(previousDate);
  };

  // Function to navigate to the next day
  const goToNextDay = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setSelectedDate(nextDate);
  };



  return (
    <div>
      
      <div className="navigation-bar">
        <FontAwesomeIcon icon={faArrowLeft} onClick={goToPreviousDay} className="arrow-icon" />
        <span>{formatDate(selectedDate)}</span>
        <FontAwesomeIcon icon={faArrowRight} onClick={goToNextDay} className="arrow-icon" />
      </div>
      <table>
        <thead>
          <tr>
            
            <th>Driver Name</th>
            <th>Start Time</th>
            <th>Vehicle Make</th>
            <th>Vehicle Reg</th>
            <th>End Time</th>
          </tr>
        </thead>
        <tbody>
          {dailyJourneys.map((journey, index) => (
            <tr key={index}>
              
              <td>{journey.DRIVER_NAME}</td>
              <td>{journey.START_TIME}</td>
              <td>{journey.VEHICLE_MAKE}</td>
              <td>{journey.VEHICLE_REG}</td>
              <td>{journey.END_TIME}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// WeeklyJourneys Component
const WeeklyJourneys = () => {
  const [weeklyJourneys, setWeeklyJourneys] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  

  useEffect(() => {
    // Fetch weekly journeys when selectedDate changes
    fetchWeeklyJourneys();
  }, [selectedDate]);


  // Function to fetch weekly journeys data from the server
  const fetchWeeklyJourneys = async () => {
    try {
      // Calculate start and end dates for the current week
      const startOfWeek = getStartOfWeek(selectedDate);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      // Format dates for API request
      const formattedStartDate = startOfWeek.toISOString().split('T')[0];
      const formattedEndDate = endOfWeek.toISOString().split('T')[0];

      // Fetch weekly journeys from the server
      const response = await axios.get(`https://service-team.co.uk:8443/weeklyjourneys?startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
      if (response.status === 200) {
        const journeysWithDay = response.data.map(journey => ({
          ...journey,
          DAY: getDayofWeek(journey.DATE) // Add day name to each journey
        }));
        setWeeklyJourneys(journeysWithDay); // Set weekly journeys data if response is successful
      } else {
        console.error('Failed to fetch journeys data');
      }
    } catch (error) {
      console.error('Error fetching journeys:', error);
    }
  };

  // Function to get the day of the week for a given date
  const getDayofWeek= dateString => {
    const date = new Date(dateString);
    const options = { weekday: 'short' }; 
    return date.toLocaleDateString('en-GB', options);
  }
  
  // Function to calculate the start of the week for a given date
  const getStartOfWeek = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  // Function to navigate to the previous week
  const goToPreviousWeek = () => {
    const previousDate = new Date(selectedDate);
    previousDate.setDate(previousDate.getDate() - 7);
    setSelectedDate(previousDate);
  };

  // Function to navigate to the next week
  const goToNextWeek = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 7);
    setSelectedDate(nextDate);
  };

  // Function to format date to 'dd/mm/yyyy' format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB').replace(/\//g, '/');
  };

  const startOfWeek = getStartOfWeek(selectedDate); // Calculate start of the current week
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Calculate end of the current week

  return (
    <div>
      
      <div className="navigation-bar">
        <FontAwesomeIcon icon={faArrowLeft} onClick={goToPreviousWeek} className="arrow-icon" />
        <span>{`${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`}</span>
        <FontAwesomeIcon icon={faArrowRight} onClick={goToNextWeek} className="arrow-icon" />
      </div>
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Driver Name</th>
            <th>Start Time</th>
            <th>Vehicle Make</th>
            <th>Vehicle Reg</th>
            <th>End Time</th>
          </tr>
        </thead>
        <tbody>
          {weeklyJourneys.map((journey, index) => (
            <tr key={index}>
              <td>{journey.DAY}</td>
              <td>{journey.DRIVER_NAME}</td>
              <td>{journey.START_TIME}</td>
              <td>{journey.VEHICLE_MAKE}</td>
              <td>{journey.VEHICLE_REG}</td>
              <td>{journey.END_TIME}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// AdminView Component
const AdminView = () => {
  
  // Function to render content based on active tab
  const renderContent = (activeTab) => {
    switch (activeTab) {
      case 0:
        return (
          <DailyJourneys/> // Render DailyJourneys component for tab 0
        );
      case 1:
        return (
          <WeeklyJourneys/> // Render WeeklyJourneys component for tab 1
        );
      default:
        return null; // Return null for any other tab
    }
  };

  return (
    <div className="AdminView">    
      <Tabs tabs={[{label: "Daily"}, {label: "Weekly"}]} renderContent={renderContent} />
    </div>
  );
};

export default AdminView;
