import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const MyOrders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);

    const fetchOrders = async () => {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const orderList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(orderList);
      setLoading(false);
    };

    fetchOrders();
  }, [currentUser]);

  if (loading) return <div>Loading...</div>;
  if (!currentUser) return <div>Please log in to view your orders.</div>;
  if (orders.length === 0) return <div>No orders found.</div>;

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: 20 }}>
      <h2 style={{ fontWeight: 'bold', fontSize: 28 }}>Your Order History</h2>
      {orders.map(order => (
        <div
          key={order.id}
          style={{
            margin: '25px 0',
            padding: '20px 24px',
            background: 'white',
            borderRadius: 15,
            boxShadow: '0 2px 10px #e5e7eb',
          }}
        >
          <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 10 }}>
            Order #{order.orderId?.slice(-8)}
            <span
              style={{
                float: 'right',
                fontSize: 13,
                background: getOrderStatusColor(order.status),
                color: 'white',
                padding: '2px 14px',
                borderRadius: 8,
                marginLeft: 15,
              }}
            >
              {getOrderStatusLabel(order.status)}
            </span>
          </div>
          <div style={{ color: '#666', fontSize: 13, marginBottom: 8 }}>
            {order.createdAt && order.createdAt.toDate
              ? order.createdAt.toDate().toLocaleString()
              : ''}
          </div>
          {order.items?.map(item => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 8, gap: 12 }}>
              <img src={item.imageUrl || 'https://via.placeholder.com/40'} alt={item.name} style={{ width: 40, height: 40, borderRadius: 8 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500 }}>{item.name}</div>
                <div style={{ color: '#999', fontSize: 12 }}>x{item.quantity}</div>
              </div>
              <div style={{ fontWeight: 600 }}>₹{item.price * item.quantity}</div>
            </div>
          ))}
          <div style={{ marginTop: 12, textAlign: 'right', fontWeight: 700, fontSize: 16 }}>
            Total: ₹{order.amount}
          </div>
        </div>
      ))}
    </div>
  );
};

// Helper to display status with color
function getOrderStatusLabel(status) {
  if (status === 'paid') return 'Completed';
  if (status === 'pending') return 'Pending';
  if (status === 'ready') return 'Ready for Pickup';
  return status || 'Pending';
}
function getOrderStatusColor(status) {
  if (status === 'paid') return '#22c55e';
  if (status === 'pending') return '#eab308';
  if (status === 'ready') return '#3b82f6';
  return '#eab308';
}

export default MyOrders;
