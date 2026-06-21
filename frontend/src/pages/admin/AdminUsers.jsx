import React, { useState, useEffect } from 'react';
import api from '../../api';
import UserForm from '../../components/UserForm';
import Toast from '../../components/Toast';

const ROLE_COLORS = {
  admin: '#c62828', customer: '#1565c0', manager: '#6a1b9a',
  veterinarian: '#00838f', worker: '#ef6c00', accountant: '#2e7d32',
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchUsers = () => {
    api.get('/admin/users')
      .then(res => setUsers(res.data.data || []))
      .catch(() => setToast({ message: 'Failed to load users', type: 'error' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setToast({ message: 'User deleted', type: 'success' });
      fetchUsers();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to delete', type: 'error' });
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#1b1b1b' }}>User Management</h2>
          <p style={{ color: '#666', marginTop: 4 }}>{users.length} registered users</p>
        </div>
        <button onClick={() => { setEditingUser(null); setShowForm(true); }} style={{
          padding: '12px 24px', background: '#4caf50', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold',
        }}>+ Add User</button>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5fced' }}>
              {['Name', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#666', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#666' }}>Loading...</td></tr>
            ) : users.map(u => (
              <tr key={u._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '14px 16px', fontWeight: 600 }}>{u.name}</td>
                <td style={{ padding: '14px 16px', color: '#666' }}>{u.email}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                    background: `${ROLE_COLORS[u.role] || '#666'}15`, color: ROLE_COLORS[u.role] || '#666', textTransform: 'capitalize',
                  }}>{u.role}</span>
                </td>
                <td style={{ padding: '14px 16px', color: '#999', fontSize: 13 }}>
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => { setEditingUser(u); setShowForm(true); }} style={{ padding: '6px 12px', background: '#e8f5e9', color: '#4caf50', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Edit</button>
                    <button onClick={() => handleDelete(u._id)} style={{ padding: '6px 12px', background: '#ffebee', color: '#c62828', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <UserForm
          user={editingUser}
          onSuccess={() => { setShowForm(false); setEditingUser(null); setToast({ message: 'User saved', type: 'success' }); fetchUsers(); }}
          onCancel={() => { setShowForm(false); setEditingUser(null); }}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
