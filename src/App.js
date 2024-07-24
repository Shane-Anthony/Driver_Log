import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './Components/UserContext';

import EnterPin from './Pages/EnterPin';
import Dashboard from './Pages/Dashboard';
import AddDriver from './Pages/AddDriver';
import AddVehicle from './Pages/AddVehicle';
import RemoveVehicle from './Pages/RemoveVehicle';
import RemoveDriver from './Pages/RemoveDriver';
import AdminView from './Pages/AdminView';
import Start from './Pages/Start';
import End from './Pages/End';

// PrivateRoute component to protect routes that require authentication
const PrivateRoute = ({ element, ...rest }) => {
  const { user } = useUser();

  return user ? element : <Navigate to="/" />; // Redirect to EnterPin if not authenticated
};


const App = () => {
  return (
    <Router basename='/driver-log'>
      <UserProvider>
        <Routes>

          <Route path="/" element={<EnterPin/>} />
          <Route path="/dashboard"  element={<PrivateRoute element={<Dashboard />} />} />
          <Route path='/add-driver' element ={<PrivateRoute element={<AddDriver />} />} />
          <Route path='/add-vehicle' element ={<PrivateRoute element={<AddVehicle />} />} />
          <Route path='/remove-vehicle' element={<PrivateRoute element={<RemoveVehicle />} />} />
          <Route path='/remove-driver' element={<PrivateRoute element={<RemoveDriver />} />} />
          <Route path='/admin-view' element={<PrivateRoute element={<AdminView />} />} />
          <Route path='/start' element={<PrivateRoute element={<Start />} />} />
          <Route path='/end' element={<PrivateRoute element={<End />} />} />
        </Routes>
        
      </UserProvider>
    </Router>
  );
};

export default App;