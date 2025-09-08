import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import MyOrders from "./pages/MyOrders";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminMenuItems from "./pages/admin/AdminMenuItems";
import LoginPage from "./features/auth/LoginPage";
import "./App.css";
const ADMINS = ["YOUR_ADMIN_EMAIL@gmail.com", "ankitranjan.cs24@bmsce.ac.in"];

function App() {
  const { currentUser } = useAuth();
  const isAdmin = ADMINS.includes(currentUser?.email);

  return (
    <Routes>
      <Route path="/home" element={currentUser ? <HomePage/> : <Navigate to="/login"/>}/>
      <Route path="/login" element={!currentUser ? <LoginPage/> : <Navigate to="/home"/>}/>
      <Route path="/orders" element={currentUser ? <MyOrders/> : <Navigate to="/login"/>}/>
      <Route path="/admin/orders" element={isAdmin ? <AdminOrders/> : <Navigate to="/home"/>}/>
      <Route path="/admin/items" element={isAdmin ? <AdminMenuItems/> : <Navigate to="/home"/>}/>
      <Route path="*" element={<Navigate to="/home" />} />
    </Routes>
  );
}
export default App;
