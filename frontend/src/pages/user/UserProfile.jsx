import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function UserProfile() {
  const { user } = useAuth();

  return (
    <div style={{
      maxWidth: '800px',
      background: '#fff',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#1b1b1b' }}>
        My Profile
      </h2>

      <div style={{ space: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', color: '#666', marginBottom: '8px' }}>
            Full Name
          </label>
          <input
            type="text"
            value={user?.name || ''}
            disabled
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              background: '#f5f5f5',
              color: '#1b1b1b',
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', color: '#666', marginBottom: '8px' }}>
            Email
          </label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              background: '#f5f5f5',
              color: '#1b1b1b',
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', color: '#666', marginBottom: '8px' }}>
            Role
          </label>
          <input
            type="text"
            value={user?.role === 'customer' ? 'Customer' : user?.role}
            disabled
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              background: '#f5f5f5',
              color: '#1b1b1b',
            }}
          />
        </div>

        <button
          style={{
            padding: '12px 24px',
            background: '#4caf50',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}
