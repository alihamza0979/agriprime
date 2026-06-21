import React, { useState, useEffect } from 'react';
import api from '../../api';

export default function AdminAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(res => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>Loading analytics...</div>;
  if (!stats) return <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>Failed to load analytics</div>;

  const cards = [
    { label: 'Total Orders', value: stats.totalOrders, icon: 'shopping_cart', color: '#4caf50' },
    { label: 'Total Revenue', value: `₨${stats.totalRevenue?.toLocaleString()}`, icon: 'payments', color: '#2196f3' },
    { label: 'Registered Users', value: stats.totalUsers, icon: 'people', color: '#9c27b0' },
    { label: 'Livestock Animals', value: stats.totalAnimals, icon: 'pets', color: '#ff9800' },
    { label: 'Products Listed', value: stats.totalProducts, icon: 'inventory_2', color: '#009688' },
    { label: 'Active Employees', value: stats.activeEmployees, icon: 'groups', color: '#795548' },
    { label: 'Net Profit', value: `₨${stats.netProfit?.toLocaleString()}`, icon: 'account_balance', color: '#2e7d32' },
  ];

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8, color: '#1b1b1b' }}>Analytics Dashboard</h2>
      <p style={{ color: '#666', marginBottom: 28 }}>Real-time overview of your farm operations</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
        {cards.map(c => (
          <div key={c.label} style={{
            background: '#fff', padding: 24, borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            display: 'flex', alignItems: 'flex-start', gap: 16,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: `${c.color}15`, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <span className="material-symbols-outlined" style={{ color: c.color, fontSize: 24 }}>{c.icon}</span>
            </div>
            <div>
              <p style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>{c.label}</p>
              <p style={{ fontSize: 28, fontWeight: 'bold', color: c.color }}>{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      {stats.recentOrders?.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#1b1b1b' }}>Recent Orders</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                {['Order', 'Customer', 'Amount', 'Status'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 12, color: '#666', fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map(o => (
                <tr key={o._id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '12px', fontWeight: 600, color: '#4caf50' }}>#{o.orderNumber}</td>
                  <td style={{ padding: '12px', color: '#333' }}>{o.customer?.name}</td>
                  <td style={{ padding: '12px', fontWeight: 600 }}>₨{o.totalAmountPKR?.toLocaleString()}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                      background: o.status === 'Delivered' ? '#e8f5e9' : '#e3f2fd',
                      color: o.status === 'Delivered' ? '#2e7d32' : '#1565c0',
                    }}>{o.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
