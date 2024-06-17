import React, { createContext, useState, useEffect , useContext} from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check localStorage for an existing JWT token on component mount
    const token = localStorage.getItem('token');
    if (token) {
      // You may want to decode the token and verify its validity here
      setUser({ token });
    }
  }, []);

  const loginUser = (token) => {
    setUser({ token });
    // Store token in localStorage
    localStorage.setItem('token', token);
  };

  const logoutUser = () => {
    setUser(null);
    // Clear token from localStorage on logout
    localStorage.removeItem('token');
  };

  return (
    <UserContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
