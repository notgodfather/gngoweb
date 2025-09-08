import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // adjust path

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const snap = await getDocs(collection(db, "orders"));
      setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    await updateDoc(doc(db, "orders", orderId), { status: newStatus });
    setOrders(orders =>
      orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="admin-panel">
      <h1 className="admin-title">Admin - Order Management</h1>
      {orders.map(order => (
        <div className="order-card" key={order.id}>
          <div style={{ marginBottom: 6 }}>
            <b>Order ID:</b> {order.orderId || order.id} &nbsp;&nbsp;
            <b>User:</b> {order.userEmail || order.userId}
            <span style={{ float: "right" }}>
              {order.createdAt && order.createdAt.toDate
                ? new Date(order.createdAt.seconds * 1000).toLocaleString()
                : ""}
            </span>
          </div>
          {order.items.map(i => (
            <div key={i.name}>{i.quantity} x {i.name}</div>
          ))}
          <div><b>Total:</b> ₹{order.amount}</div>
          <div style={{ marginTop: 6 }}>
            <b>Status:</b>
            &nbsp;
            <select
              value={order.status || "Pending"}
              onChange={e => handleStatusChange(order.id, e.target.value)}
              style={{ padding: 4, marginLeft: 4 }}
            >
              <option value="Pending">Pending</option>
              <option value="Preparing">Preparing</option>
              <option value="Ready for Pickup">Ready for Pickup</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};
export default AdminOrders;
