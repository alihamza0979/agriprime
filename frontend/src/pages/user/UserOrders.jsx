import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

const STATUS_COLORS = {
  Pending: { bg: '#fff3e0', color: '#e65100' },
  Processing: { bg: '#e3f2fd', color: '#1565c0' },
  Shipped: { bg: '#f3e5f5', color: '#6a1b9a' },
  Delivered: { bg: '#e8f5e9', color: '#2e7d32' },
  Cancelled: { bg: '#ffebee', color: '#c62828' },
};

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders')
      .then(res => setOrders(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ background: '#fff', padding: 40, borderRadius: 12, textAlign: 'center', color: '#666' }}>
        Loading your orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div style={{ background: '#fff', padding: '60px 30px', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 64, color: '#ddd', display: 'block', marginBottom: 16 }}>shopping_bag</span>
        <h2 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8, color: '#1b1b1b' }}>No orders yet</h2>
        <p style={{ color: '#666', marginBottom: 24 }}>Browse our marketplace and place your first order.</p>
        <Link to="/" style={{ padding: '12px 24px', background: '#4caf50', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 'bold' }}>
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: '#fff', padding: 30, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24, color: '#1b1b1b' }}>My Orders</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {orders.map(order => (
          <div key={order._id} style={{ border: '1px solid #eee', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <p style={{ fontWeight: 700, color: '#4caf50', fontSize: 16 }}>#{order.orderNumber}</p>
                <p style={{ fontSize: 13, color: '#999', marginTop: 2 }}>
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
                </p>
              </div>
              <span style={{
                padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                background: STATUS_COLORS[order.status]?.bg,
                color: STATUS_COLORS[order.status]?.color,
              }}>{order.status}</span>
            </div>
            <div style={{ marginBottom: 12 }}>
              {order.items?.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#555', padding: '4px 0' }}>
                  <span>{item.productName} × {item.qty}</span>
                  <span>₨{(item.qty * item.unitPriceKPR).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f0f0f0', paddingTop: 12 }}>
              <span style={{ fontSize: 13, color: '#666' }}>{order.paymentMethod} · {order.paymentStatus}</span>
              <span style={{ fontWeight: 700, fontSize: 16, color: '#1b1b1b' }}>₨{order.totalAmountPKR?.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
