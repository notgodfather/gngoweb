import React from 'react';
import LoginPage from './features/auth/LoginPage'; 
import { useAuth } from './context/AuthContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MyOrders from './pages/MyOrders';
function App() {
  const { currentUser } = useAuth();
  return (
    <Routes>
      <Route path="/" element={currentUser? <HomePage/>: <Navigate to="/login"/>}/>
      <Route path="/login" element={!currentUser ? <LoginPage/> : <Navigate to="/"/>}/>
      <Route path='/orders' element={currentUser ? <MyOrders/> : <Navigate to="/login"/>}/>
    </Routes>
  );
}

export default App
