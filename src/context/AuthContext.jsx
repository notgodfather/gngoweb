import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This listener runs when the user logs in or out
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // This cleans up the listener when the component is no longer on the screen
    return unsubscribe;
  }, []);

  // This is the data we want to share with our entire app
  const value = {
    currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {/* We wait until Firebase is done loading before showing the app */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// This is a helper hook to easily get the user data in any component
export const useAuth = () => {
  return useContext(AuthContext);
};
