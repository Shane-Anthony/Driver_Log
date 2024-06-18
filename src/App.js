import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './Components/UserContext';

import EnterPin from './Pages/EnterPin';
import Dashboard from './Pages/Dashboard';
import AddDriver from './Pages/AddDriver';


const PrivateRoute = ({ element, ...rest }) => {
  const { user } = useUser();

  return user ? element : <Navigate to="/" />;
};


const App = () => {
  return (
    <Router>
      <UserProvider>
        <Routes>

          <Route path="/" element={<EnterPin/>} />
          <Route path="/dashboard"  element={<PrivateRoute element={<Dashboard />} />} />
          <Route path='/add-driver' element ={<PrivateRoute element={<AddDriver />} />} />
        
        </Routes>
        
      </UserProvider>
    </Router>
  );
};

export default App;