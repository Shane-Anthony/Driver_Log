import React from 'react';
import { useNavigate,} from 'react-router-dom';
import { useUser } from '../Components/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import logo from '../Assets/Images/logo.png';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logoutUser} = useUser();
  
  console.log('user: ',user);

  // Function to handle user logout
  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  // Function to navigate to PickVan screen
  const handleStartJourney = () => {
    navigate('/pick-van'); // Navigate to PickVan screen
  };

  // Function to navigate to End screen
  const handleEndJourney = () => {
    navigate('/end');
  };

  // Function to navigate to AddVehicle screen
  const handleAddVehicle = () => {
    navigate('/add-vehicle'); // Navigate to AddVehicle screen
  };

  // Function to navigate to AddDriver screen
  const handleAddDriver = () => {
    navigate('/add-driver');
  };

  // Function to navigate to RemoveVehicle screen
  const handleDelVehicle = () => {
    navigate('/remove-vehicle');
  };

  // Function to navigate to RemoveDriver screen
  const handleDelDriver = () => {
    navigate('/remove-driver');
  };

  // Function to navigate to AdminView screen
  const handleAdminView = () => {
    navigate('/admin-view');
  };

  // Check if the user is an admin
  const isAdmin = user && user.driverName === 'Admin';

  return (
    <div className='dashboard-container'>
       {/* Header Section */}
      <div className='dashboard-header'>
        <img src={logo} className='dashboard-logo' alt="Logo" />
        <p className='welcome-text'>Welcome, {user}!</p>
      </div>

       {/* Button Container */}
      <div className='button-container'>
        <button className='user-button green-button button-text' onClick={handleStartJourney}>
          Start
        </button>
        <button className='user-button button-text' onClick={handleEndJourney}>
          End
        </button>
      </div>

      {/* Logout Button */}
      <div className='logout-container'>
        <button className= 'logout' onClick={handleLogout}><FontAwesomeIcon icon={faSignOutAlt} color="white" /></button>
      </div>

      {/* Admin Actions */}
      {isAdmin && (
        <div className='admin-container'>
          <button className='button green-button button-text' onClick={handleAddVehicle}>
            Add Vehicle
          </button>
          <button className='button button-text' onClick={handleDelVehicle}>
            Remove Vehicle
          </button>
          <button className='button green-button button-text' onClick={handleAddDriver}>
            Add Driver
          </button>
          <button className='button button-text' onClick={handleDelDriver}>
            Remove Driver
          </button>
          <button className='view-button button-text' onClick={handleAdminView}>
            View Data
          </button>
        </div>
      )}
    </div>
  );
};



export default Dashboard;
