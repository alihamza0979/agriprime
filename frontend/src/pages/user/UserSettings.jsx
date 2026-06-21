import React from 'react';

export default function UserSettings() {
  return (
    <div style={{
      background: '#fff',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#1b1b1b' }}>
        Settings
      </h2>

      <div style={{ maxWidth: '600px' }}>
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#1b1b1b' }}>
            Notifications
          </h3>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <input type="checkbox" defaultChecked />
            <span style={{ color: '#666' }}>Email notifications for order updates</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <input type="checkbox" defaultChecked />
            <span style={{ color: '#666' }}>Email notifications for new products</span>
          </label>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#1b1b1b' }}>
            Privacy
          </h3>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <input type="checkbox" />
            <span style={{ color: '#666' }}>Make my profile public</span>
          </label>
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
          Save Settings
        </button>
      </div>
    </div>
  );
}
