import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api';
import Toast from '../../components/Toast';

export default function AdminSettings() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) setProfile({ name: user.name || '', email: user.email || '' });
  }, [user]);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/auth/profile', profile);
      localStorage.setItem('user', JSON.stringify({ ...user, name: res.data.data.name, email: res.data.data.email }));
      setToast({ message: 'Profile updated successfully', type: 'success' });
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to update profile', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirm) {
      setToast({ message: 'New passwords do not match', type: 'error' });
      return;
    }
    if (passwords.newPassword.length < 6) {
      setToast({ message: 'Password must be at least 6 characters', type: 'error' });
      return;
    }
    setSaving(true);
    try {
      await api.put('/auth/password', { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      setPasswords({ currentPassword: '', newPassword: '', confirm: '' });
      setToast({ message: 'Password changed successfully', type: 'success' });
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to change password', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8, color: '#1b1b1b' }}>Admin Settings</h2>
      <p style={{ color: '#666', marginBottom: 32 }}>Manage your admin profile and account security.</p>

      <div style={{ background: '#fff', borderRadius: 12, padding: 28, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <h3 style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 20 }}>Profile Information</h3>
        <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, color: '#666', display: 'block', marginBottom: 6 }}>Full Name</label>
            <input type="text" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} required style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: '#666', display: 'block', marginBottom: 6 }}>Email Address</label>
            <input type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} required style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: '#666', display: 'block', marginBottom: 6 }}>Role</label>
            <input type="text" value={user?.role || ''} disabled style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: 8, background: '#f5f5f5', fontSize: 14 }} />
          </div>
          <button type="submit" disabled={saving} style={{ padding: '12px 24px', background: '#4caf50', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>

      <div style={{ background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <h3 style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 20 }}>Change Password</h3>
        <form onSubmit={changePassword} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, color: '#666', display: 'block', marginBottom: 6 }}>Current Password</label>
            <input type="password" value={passwords.currentPassword} onChange={e => setPasswords(p => ({ ...p, currentPassword: e.target.value }))} required style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: '#666', display: 'block', marginBottom: 6 }}>New Password</label>
            <input type="password" value={passwords.newPassword} onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))} required minLength={6} style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: '#666', display: 'block', marginBottom: 6 }}>Confirm New Password</label>
            <input type="password" value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))} required style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }} />
          </div>
          <button type="submit" disabled={saving} style={{ padding: '12px 24px', background: '#1b1b1b', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
