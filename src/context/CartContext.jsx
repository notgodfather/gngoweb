import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);

      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
    console.log("Added to cart:", item.name);
  };
const removeFromCart = (itemId) => {
  setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
};

const updateQuantity = (itemId, amount) => {
  setCartItems(prevItems => 
    prevItems.map(item => 
      item.id === itemId
        ? { ...item, quantity: Math.max(0, item.quantity + amount) }
        : item
    ).filter(item => item.quantity > 0)
  );
};

const clearCart = () => {
  setCartItems([]);
};

  const value = {
  cartItems,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
};


  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
