import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Tabs from "../Components/Tabs";
import '../App.css';

const AdminView = () => {
  const [dailyJourneys, setDailyJourneys] = useState([]);
  const [weeklyJourneys, setWeeklyJourneys] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchDailyJourneys = async (date) => {
    try {
      const response = await axios.get('http://localhost:3000/dailyjourneys', { params: { date } });
      setDailyJourneys(response.data);
    } catch (error) {
      setErrorMessage('Error fetching daily journeys data');
      console.error(error);
    }
  };

  const fetchWeeklyJourneys = async (startDate, endDate) => {
    try {
      const response = await axios.get('http://localhost:3000/weeklyjourneys', { params: { startDate, endDate } });
      setWeeklyJourneys(response.data);
    } catch (error) {
      setErrorMessage('Error fetching weekly journeys data');
      console.error(error);
    }
  };

  useEffect(() => {
    const formattedDate = selectedDate.toISOString().split('T')[0];
    fetchDailyJourneys(formattedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (startDate && endDate) {
      fetchWeeklyJourneys(startDate, endDate);
    }
  }, [startDate, endDate]);

  const getStartOfWeek = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const goToPreviousWeek = () => {
    const previousDate = new Date(selectedDate);
    previousDate.setDate(previousDate.getDate() - 7);
    setSelectedDate(previousDate);
    const startOfWeek = getStartOfWeek(previousDate);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    setStartDate(startOfWeek.toISOString().split('T')[0]);
    setEndDate(endOfWeek.toISOString().split('T')[0]);
  };

  const goToNextWeek = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 7);
    setSelectedDate(nextDate);
    const startOfWeek = getStartOfWeek(nextDate);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    setStartDate(startOfWeek.toISOString().split('T')[0]);
    setEndDate(endOfWeek.toISOString().split('T')[0]);
  };

  const goToPreviousDay = () => {
    const previousDate = new Date(selectedDate);
    previousDate.setDate(previousDate.getDate() - 1);
    setSelectedDate(previousDate);
  };

  const goToNextDay = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setSelectedDate(nextDate);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB').replace(/\//g, '/');
  };

  const renderContent = (activeTab) => {
    switch (activeTab) {
      case 0:
        return (
          <div>
            <h2>Daily Journeys</h2>
            <div className="navigation-bar">
              <button onClick={goToPreviousDay}>Previous Day</button>
              <span>{formatDate(selectedDate)}</span>
              <button onClick={goToNextDay}>Next Day</button>
            </div>
            {errorMessage && <p>{errorMessage}</p>}
            <ul>
              {dailyJourneys.map((journey, index) => (
                <li key={index}>
                  {journey.DATE} - {journey.DRIVER_NAME} - {journey.START_TIME} - {journey.VEHICLE_MAKE} - {journey.VEHICLE_MODEL} - {journey.VEHICLE_REG} - {journey.END_TIME}
                </li>
              ))}
            </ul>
          </div>
        );
      case 1:
        return (
          <div>
            <h2>Weekly Journeys</h2>
            <div className="navigation-bar">
              <button onClick={goToPreviousWeek}>Previous Week</button>
              <span>{`${formatDate(startDate)} - ${formatDate(endDate)}`}</span>
              <button onClick={goToNextWeek}>Next Week</button>
            </div>
            {errorMessage && <p>{errorMessage}</p>}
            <ul>
              {weeklyJourneys.map((journey, index) => (
                <li key={index}>
                  {journey.DATE} - {journey.DRIVER_NAME} - {journey.START_TIME} - {journey.VEHICLE_MAKE} - {journey.VEHICLE_MODEL} - {journey.VEHICLE_REG} - {journey.END_TIME}
                </li>
              ))}
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="AdminView">
      <h1 className="geeks">GeeksforGeeks</h1>
      <h1>React Tabs Example</h1>
      <Tabs tabs={[{label: "Daily"}, {label: "Weekly"}]} renderContent={renderContent} />
    </div>
  );
};

export default AdminView;
