import React from "react";
import { useState, useEffect } from "react"
import { signOutUser } from "../services/authService";
import { getMenu } from "../services/menuService";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Link } from 'react-router-dom';
import CartDrawer from "../features/cart/CartDrawer";
const HomePage=()=> {
    const {currentUser}=useAuth();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const[menuItems,setMenuItems]=useState([]);
    const {addToCart,cartItems}=useCart();
    useEffect(()=> {
        const unsubscribe=getMenu((items)=> {
            console.log("Fetched Menu Items:", items);
            setMenuItems(items);
        });
        return unsubscribe;
    },[]);
    return (
    <div>
      <h1>Hello, {currentUser.displayName}!</h1>
      <button onClick={signOutUser}>Sign Out</button> <button onClick={() => setIsCartOpen(true)}>Cart ({cartItems.length})</button> <Link to="/orders">
  <button>My Orders</button>
</Link>
      <hr />
      <h2>Menu</h2>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {menuItems.map(item => (
          <div key={item.id} style={{ border: '1px solid #ccc', padding: '16px', borderRadius: '8px', width: '250px' }}>
            <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <h4>₹{item.price.toFixed(2)}</h4>
            <button onClick={()=>addToCart(item)}>Add to Cart</button>
          </div>
        ))}
      </div>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default HomePage;
