import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import EnterPin from './Pages/EnterPin';
import Dashboard from './Pages/Dashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EnterPin/>} />
        <Route path="/enter-pin" element={<EnterPin/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        
      </Routes>
    </Router>
  );
};

export default App;