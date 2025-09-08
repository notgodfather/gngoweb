import React, { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar"; // Make sure you have this!

const MyOrders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);

    const fetchOrders = async () => {
      const q = query(
        collection(db, "orders"),
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const orderList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(orderList);
      setLoading(false);
    };

    fetchOrders();
  }, [currentUser]);

  if (!currentUser) return <div>Please log in to view your orders.</div>;

  return (
    <div className="orders-bg">
      <Navbar />
      <div className="orders-container">
        <h1 className="orders-title">Your Order History</h1>
        {loading && (
          <div className="empty-orders">Loading...</div>
        )}
        {!loading && orders.length === 0 && (
          <div className="empty-orders">No orders found.</div>
        )}
        {orders.map((order) => (
          <div key={order.id} className="order-card-cool">
            <div className="order-card-header">
              <span className="order-id">
                Order #{order.orderId?.slice(-8) || order.id.slice(-8)}
              </span>
              <span
                className="order-status"
                style={getOrderStatusColorStyle(order.status)}
              >
                {getOrderStatusLabel(order.status)}
              </span>
            </div>
            <div className="order-date">
              {order.createdAt && order.createdAt.toDate
                ? order.createdAt.toDate().toLocaleString()
                : ""}
            </div>
            {order.items?.map((item, idx) => (
              <div
                key={item.id || item.name || idx}
                className="order-item-row"
              >
                <img
                  src={item.imageUrl || "https://via.placeholder.com/40"}
                  alt={item.name}
                  className="order-item-img"
                />
                <div>
                  <div>{item.name}</div>
                  <div className="order-item-qty">x{item.quantity}</div>
                </div>
                <span style={{ marginLeft: "auto", fontWeight: 500 }}>
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
            <div className="order-total-line">
              <span>Total:</span>
              <span className="order-total-bold">₹{order.amount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function getOrderStatusLabel(status) {
  if (!status) return "Pending";
  const s = status.toLowerCase();
  if (s === "paid" || s === "completed") return "Completed";
  if (s === "pending") return "Pending";
  if (s === "ready" || s === "ready for pickup") return "Ready for Pickup";
  if (s === "preparing") return "Preparing";
  return status.charAt(0).toUpperCase() + status.slice(1);
}
function getOrderStatusColorStyle(status) {
  if (!status) return { background: "#facc15", color: "#6d4c00" };
  const s = status.toLowerCase();
  if (s === "paid" || s === "completed") return { background: "#22c55e", color: "#fff" };
  if (s === "pending") return { background: "#facc15", color: "#6d4c00" };
  if (s === "ready" || s === "ready for pickup") return { background: "#f59e42", color: "#fff" };
  if (s === "preparing") return { background: "#3b82f6", color: "#fff" };
  return { background: "#e5e7eb", color: "#444" };
}

export default MyOrders;
