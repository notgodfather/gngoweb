// src/features/cart/CartDrawer.jsx

import React from 'react';
import { useCart } from '../../context/CartContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

// Import Firestore modules
import { db } from '../../firebaseConfig.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, clearCart } = useCart();
  const { currentUser } = useAuth();

  const handlePlaceOrder = async () => {
    if (!currentUser) {
      alert("Please sign in to place an order.");
      return;
    }
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    try {
      const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const orderId = 'order_' + Date.now();

      // Prepare user & cart details
      const userDetails = {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
        phoneNumber: currentUser.phoneNumber || "9999999999",
      };
      const cartDetails = cartItems.map(({ id, name, price, quantity,imageUrl }) => ({
        id, name, price, quantity,imageUrl
      }));

      // Call backend API to create order and get paymentSessionId & envMode
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: cartDetails, user: userDetails }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Create order failed");

      const { paymentSessionId, envMode, orderId: backendOrderId } = data;

      // Ensure Cashfree SDK is loaded
      if (!window.Cashfree) throw new Error("Cashfree SDK not loaded");

      // Use Cashfree v3 SDK for checkout
      const mode = import.meta.env.PROD ? "production" : envMode || "sandbox";
      const cashfree = window.Cashfree({ mode });

      await cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_modal",
      });

      // Verify order after checkout closes
      const vresp = await fetch(`${import.meta.env.VITE_API_URL}/api/verify-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: backendOrderId }),
      });
      const vdata = await vresp.json();
      if (!vresp.ok) throw new Error(vdata.error || "Verify failed");

      if (vdata.status === "PAID" || vdata.status === "SUCCESS") {
        // Save order to Firestore here
        await addDoc(collection(db, "orders"), {
          userId: currentUser.uid,
          orderId: backendOrderId,
          items: cartItems.map(({ id, name, price, quantity,imageUrl }) => ({ id, name, price, quantity,imageUrl })),
          amount: total,
          currency: "INR",
          status: "paid",
          createdAt: serverTimestamp(),
        });

        alert("Payment successful! Your order is placed and saved.");
        clearCart();
        onClose();
      } else {
        alert(`Payment status: ${vdata.status}. Order not saved.`);
      }
    } catch (error) {
      alert("Failed to place order: " + error.message);
      console.error(error);
    }
  };

  return (
    <>
      {isOpen && <div style={styles.backdrop} onClick={onClose} />}
      <div
        style={{
          ...styles.drawer,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
        }}
      >
        <div style={styles.header}>
          <h2>Your Cart</h2>
          <button style={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div style={styles.itemList}>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            cartItems.map(item => (
              <div key={item.id} style={styles.item}>
                <img
                  src={item.imageUrl || "https://via.placeholder.com/60"}
                  alt={item.name}
                  style={styles.itemImage}
                />
                <div style={styles.leftSection}>
                  <p style={styles.itemName}>{item.name}</p>
                  <p style={styles.itemPrice}>₹{item.price}</p>
                </div>
                <div style={styles.quantityControl}>
                  <button
                    style={styles.quantityControlButton}
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity === 1}
                  >
                    -
                  </button>
                  <span style={styles.quantityControlSpan}>{item.quantity}</span>
                  <button
                    style={styles.quantityControlButton}
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div style={styles.footer}>
          <div style={styles.total}>
            <span>Total</span>
            <span>₹{cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)}</span>
          </div>
          <button style={styles.placeOrderButton} onClick={handlePlaceOrder} disabled={cartItems.length === 0}>
            Place Order
          </button>
        </div>
      </div>
    </>
  );
};

const styles = {
  backdrop: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 100,
  },
  drawer: {
    position: 'fixed',
    top: 0, right: 0,
    width: '400px',
    height: '100%',
    backgroundColor: 'white',
    boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
    zIndex: 101,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #eee',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
  },
  itemList: {
    flexGrow: 1,
    overflowY: 'auto',
    padding: '20px',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
    gap: '8px',
  },
  itemImage: {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginRight: '8px',
  },
  leftSection: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '70px',
    flex: '1 1 auto',
  },
  itemName: {
    margin: 0,
    fontWeight: 'bold',
  },
  itemPrice: {
    margin: 0,
    color: '#666',
    fontSize: '15px',
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #ccc',
    borderRadius: '8px',
    overflow: 'hidden',
    width: '90px',
    justifyContent: 'flex-end',
  },
  quantityControlButton: {
    background: 'none',
    border: 'none',
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  quantityControlSpan: {
    padding: '0 12px',
    fontSize: '14px',
    textAlign: 'center',
    width: '100%',
  },
  footer: {
    padding: '20px',
    borderTop: '1px solid #eee',
  },
  total: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: '18px',
    marginBottom: '20px',
  },
  placeOrderButton: {
    width: '100%',
    padding: '15px',
    backgroundColor: '#F97316',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
  },
};

export default CartDrawer;
