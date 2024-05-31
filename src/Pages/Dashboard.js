import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../Assets/Images/logo.png';

const Dashboard = ({ location }) => {
  const navigate = useNavigate();
  // Destructuring driverName and logout function from route params
  const { driverName, logout, clearPinCode } = location.state;

  // Function to handle user logout
  const handleLogout = () => {
    clearPinCode();
    navigate.push('/enter-pin');
  };

  // Function to navigate to PickVan screen
  const handleStartJourney = () => {
    navigate.push('/pick-van', { driverName: driverName }); // Navigate to PickVan screen
  };

  // Function to navigate to End screen
  const handleEndJourney = () => {
    navigate.push('/end', { driverName: driverName });
  };

  // Function to navigate to AddVehicle screen
  const handleAddVehicle = () => {
    navigate.push('/add-vehicle'); // Navigate to AddVehicle screen
  };

  // Function to navigate to AddDriver screen
  const handleAddDriver = () => {
    navigate.push('/add-driver');
  };

  // Function to navigate to RemoveVehicle screen
  const handleDelVehicle = () => {
    navigate.push('/remove-vehicle');
  };

  // Function to navigate to RemoveDriver screen
  const handleDelDriver = () => {
    navigate.push('/remove-driver');
  };

  // Function to navigate to AdminView screen
  const handleAdminView = () => {
    navigate.push('/admin-view');
  };

  // Check if the user is an admin
  const isAdmin = driverName === 'Admin';

  return (
    <div style={styles.container}>
       {/* Header Section */}
      <div style={styles.header}>
        <img src={logo} style={styles.logo} alt="Logo" />
        <p style={styles.welcomeText}>Welcome, {driverName}!</p>
      </div>

       {/* Button Container */}
      <div style={styles.buttonContainer}>
        <button style={[styles.userButton, styles.greenButton]} onClick={handleStartJourney}>
          Start
        </button>
        <button style={styles.userButton} onClick={handleEndJourney}>
          End
        </button>
      </div>

      {/* Logout Button */}
      <div style={styles.logoutContainer}>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* Admin Actions */}
      {isAdmin && (
        <div style={styles.adminContainer}>
          <button style={[styles.button, styles.greenButton]} onClick={handleAddVehicle}>
            Add Vehicle
          </button>
          <button style={styles.button} onClick={handleDelVehicle}>
            Remove Vehicle
          </button>
          <button style={[styles.button, styles.greenButton]} onClick={handleAddDriver}>
            Add Driver
          </button>
          <button style={styles.button} onClick={handleDelDriver}>
            Remove Driver
          </button>
          <button style={styles.viewButton} onClick={handleAdminView}>
            View Data
          </button>
        </div>
      )}
    </div>
  );
};

// Styles for Dashboard component
const styles = {
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    backgroundColor: '#777',
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 23,
    padding: 40,
    color: '#fff',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  userButton:{
    backgroundColor: '#D9D9D9', 
    width: '40%', 
    height: 120, 
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    borderRadius: 10,
    textAlign: 'center',
    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
  },
  button: {
    backgroundColor: '#D9D9D9', 
    width: '40%', 
    height: 120, 
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    textAlign: 'center',
    marginVertical: 15,
    marginHorizontal: 20, 
    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
  },
  buttonText: {
    color: '#1E321C',
    fontSize: 16,
    textAlign: 'center',
  },
  logoutContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  adminContainer: {
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'center',
    marginTop: 15, 
  },
  viewButton:{
    backgroundColor: '#D9D9D9',
    width: '88%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    borderRadius: 10,
    textAlign: 'center',
    boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
  },
  greenButton:{
    backgroundColor: '#A8BE93',
  },
};

export default Dashboard;
