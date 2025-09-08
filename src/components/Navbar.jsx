import React from "react";
import { Link } from "react-router-dom";
import { signOutUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { currentUser } = useAuth();

  return (
    <nav className="navbar-flex">
      <span className="brand">GrabNGo</span>
      <div>
        <Link to="/home" className="nav-link">Menu</Link>
        <Link to="/orders" className="nav-link">My Orders</Link>
        {currentUser && (
          <button className="logout-btn" onClick={signOutUser}>Logout</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
