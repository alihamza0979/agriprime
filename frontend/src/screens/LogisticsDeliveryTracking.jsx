import React, { useState, useEffect } from 'react';
import api from '../api';
import OrderForm from '../components/OrderForm';
import Toast from '../components/Toast';
import { downloadCsv } from '../utils/exportCsv';

const STATUS_COLORS = {
  Pending: 'bg-orange-100 text-orange-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function LogisticsDeliveryTracking() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      setOrders(res.data.data || []);
    } catch {
      setToast({ message: 'Failed to load orders', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Delete this order?')) return;
    try {
      await api.delete(`/orders/${id}`);
      setToast({ message: 'Order deleted', type: 'success' });
      fetchOrders();
    } catch {
      setToast({ message: 'Failed to delete order', type: 'error' });
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/orders/${id}`, { status });
      setToast({ message: 'Status updated', type: 'success' });
      fetchOrders();
    } catch {
      setToast({ message: 'Failed to update status', type: 'error' });
    }
  };

  const filtered = orders.filter(o => {
    const matchStatus = !statusFilter || o.status === statusFilter;
    const matchSearch = !search ||
      o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.name?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const stats = {
    pending: orders.filter(o => o.status === 'Pending').length,
    processing: orders.filter(o => o.status === 'Processing' || o.status === 'Shipped').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
    totalRevenue: orders.filter(o => o.status === 'Delivered').reduce((s, o) => s + (o.totalAmountPKR || 0), 0),
  };

  const exportRows = filtered.map(o => ({
    orderNumber: o.orderNumber,
    customerName: o.customer?.name || '',
    amount: o.totalAmountPKR,
    status: o.status,
    payment: o.paymentMethod || '',
    date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '',
  }));

  return (
    <>
      <main className="w-full p-8 space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-4xl font-extrabold text-on-surface font-headline tracking-tight">Delivery Management</h2>
            <p className="text-on-surface-variant mt-1">Manage order deliveries and dispatch status.</p>
          </div>
          <button onClick={() => { setEditingId(null); setShowForm(true); }} className="px-6 py-3 bg-primary text-white rounded-full font-bold flex items-center gap-2 shadow-lg">
            <span className="material-symbols-outlined text-sm">add</span> New Delivery Order
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Pending Dispatch', val: stats.pending, color: '#ff9800', icon: 'pending_actions' },
            { label: 'In Transit', val: stats.processing, color: '#2196f3', icon: 'local_shipping' },
            { label: 'Delivered', val: stats.delivered, color: '#4caf50', icon: 'check_circle' },
            { label: 'Delivered Revenue', val: `₨${stats.totalRevenue.toLocaleString()}`, color: '#2e7d32', icon: 'payments' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}15` }}>
                  <span className="material-symbols-outlined" style={{ color: s.color }}>{s.icon}</span>
                </div>
                <p className="text-sm text-gray-500 font-medium">{s.label}</p>
              </div>
              <p className="text-3xl font-extrabold" style={{ color: s.color }}>{s.val}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
            <input type="text" placeholder="Search order or customer..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30">
            <option value="">All Statuses</option>
            {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button onClick={() => {
            downloadCsv('agriprime-deliveries.csv', exportRows, [
              { key: 'orderNumber', label: 'Order #' }, { key: 'customerName', label: 'Customer' },
              { key: 'amount', label: 'Amount' }, { key: 'status', label: 'Status' },
              { key: 'payment', label: 'Payment' }, { key: 'date', label: 'Date' },
            ]);
            setToast({ message: 'Export downloaded', type: 'success' });
          }} className="px-5 py-2.5 border border-gray-200 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-50">
            <span className="material-symbols-outlined text-sm">download</span> Export CSV
          </button>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-gray-500">Loading deliveries...</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-500">No orders match your filters.</div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#f5fced] text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {['Order #', 'Customer', 'Items', 'Amount', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-primary text-sm">#{order.orderNumber}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-sm">{order.customer?.name}</p>
                      <p className="text-xs text-gray-400">{order.customer?.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{order.items?.length} item(s)</td>
                    <td className="px-6 py-4 font-bold text-sm">₨{order.totalAmountPKR?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{order.paymentMethod}</td>
                    <td className="px-6 py-4">
                      <select value={order.status} onChange={e => handleStatusChange(order._id, e.target.value)} className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 cursor-pointer ${STATUS_COLORS[order.status] || ''}`}>
                        {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => { setEditingId(order._id); setShowForm(true); }} className="p-1.5 hover:bg-gray-100 rounded-lg" title="Edit"><span className="material-symbols-outlined text-sm text-gray-500">edit</span></button>
                        <button onClick={() => handleDeleteOrder(order._id)} className="p-1.5 hover:bg-red-50 rounded-lg" title="Delete"><span className="material-symbols-outlined text-sm text-red-400">delete</span></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {showForm && (
        <OrderForm orderId={editingId} onSuccess={() => { setShowForm(false); setEditingId(null); setToast({ message: 'Order saved', type: 'success' }); fetchOrders(); }} onCancel={() => { setShowForm(false); setEditingId(null); }} />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
