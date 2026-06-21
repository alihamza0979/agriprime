import React, { useState, useEffect } from 'react';
import api from '../../api';
import OrderForm from '../../components/OrderForm';
import Toast from '../../components/Toast';

const STATUS_COLORS = {
  Pending: { bg: '#fff3e0', color: '#e65100' },
  Processing: { bg: '#e3f2fd', color: '#1565c0' },
  Shipped: { bg: '#f3e5f5', color: '#6a1b9a' },
  Delivered: { bg: '#e8f5e9', color: '#2e7d32' },
  Cancelled: { bg: '#ffebee', color: '#c62828' },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => { fetchOrders(); }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = statusFilter ? { status: statusFilter } : {};
      const res = await api.get('/orders', { params });
      setOrders(res.data.data || []);
    } catch {
      setToast({ message: 'Failed to load orders', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/orders/${id}`, { status });
      setToast({ message: 'Order status updated', type: 'success' });
      fetchOrders();
    } catch {
      setToast({ message: 'Failed to update order', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this order?')) return;
    try {
      await api.delete(`/orders/${id}`);
      setToast({ message: 'Order deleted', type: 'success' });
      fetchOrders();
    } catch {
      setToast({ message: 'Failed to delete order', type: 'error' });
    }
  };

  const stats = {
    total: orders.length,
    processing: orders.filter(o => o.status === 'Processing').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
    revenue: orders.reduce((s, o) => s + (o.totalAmountPKR || 0), 0),
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#1b1b1b' }}>Order Management</h2>
          <p style={{ color: '#666', marginTop: 4 }}>Track and manage customer orders</p>
        </div>
        <button onClick={() => { setEditingId(null); setShowForm(true); }} style={{
          padding: '12px 24px', background: '#4caf50', color: '#fff',
          border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold',
        }}>+ New Order</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Orders', val: stats.total, color: '#4caf50' },
          { label: 'Processing', val: stats.processing, color: '#2196f3' },
          { label: 'Delivered', val: stats.delivered, color: '#2e7d32' },
          { label: 'Revenue', val: `₨${stats.revenue.toLocaleString()}`, color: '#ff9800' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>{s.label}</p>
            <p style={{ fontSize: 28, fontWeight: 'bold', color: s.color }}>{s.val}</p>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 16 }}>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #ddd' }}>
          <option value="">All Statuses</option>
          {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5fced' }}>
              {['Order #', 'Customer', 'Items', 'Amount', 'Payment', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#666', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#666' }}>Loading orders...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: '#666' }}>No orders found</td></tr>
            ) : orders.map(order => (
              <tr key={order._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '14px 16px', fontWeight: 700, color: '#4caf50' }}>#{order.orderNumber}</td>
                <td style={{ padding: '14px 16px' }}>
                  <p style={{ fontWeight: 600 }}>{order.customer?.name}</p>
                  <p style={{ fontSize: 12, color: '#999' }}>{order.customer?.email}</p>
                </td>
                <td style={{ padding: '14px 16px', color: '#666' }}>{order.items?.length} item(s)</td>
                <td style={{ padding: '14px 16px', fontWeight: 700 }}>₨{order.totalAmountPKR?.toLocaleString()}</td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: '#666' }}>{order.paymentMethod}</td>
                <td style={{ padding: '14px 16px' }}>
                  <select
                    value={order.status}
                    onChange={e => handleStatusChange(order._id, e.target.value)}
                    style={{
                      padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, border: 'none',
                      background: STATUS_COLORS[order.status]?.bg,
                      color: STATUS_COLORS[order.status]?.color,
                    }}
                  >
                    {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => { setEditingId(order._id); setShowForm(true); }} style={{ padding: '6px 12px', background: '#e8f5e9', color: '#4caf50', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>Edit</button>
                    <button onClick={() => handleDelete(order._id)} style={{ padding: '6px 12px', background: '#ffebee', color: '#c62828', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <OrderForm
          orderId={editingId}
          onSuccess={() => { setShowForm(false); setEditingId(null); setToast({ message: 'Order saved', type: 'success' }); fetchOrders(); }}
          onCancel={() => { setShowForm(false); setEditingId(null); }}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
