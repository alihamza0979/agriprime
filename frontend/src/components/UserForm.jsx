import React, { useState } from 'react';
import api from '../api';

export default function UserForm({ user, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'customer',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (user) {
        await api.put(`/admin/users/${user._id}`, { name: form.name, email: form.email, role: form.role });
      } else {
        if (!form.password) throw new Error('Password required for new users');
        await api.post('/admin/users', form);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error saving user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <h2 className="text-2xl font-bold mb-6">{user ? 'Edit User' : 'Add User'}</h2>
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
          {!user && (
            <input type="password" placeholder="Password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none" />
          )}
          <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none">
            {['customer', 'worker', 'veterinarian', 'manager', 'accountant', 'admin'].map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={loading} className="flex-1 bg-primary text-white py-2 rounded-lg font-bold disabled:opacity-50">{loading ? 'Saving...' : 'Save'}</button>
            <button type="button" onClick={onCancel} className="flex-1 bg-gray-200 py-2 rounded-lg font-bold">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
