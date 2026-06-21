import React from 'react';

export default function UserWishlist() {
  return (
    <div style={{
      background: '#fff',
      padding: '30px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#1b1b1b' }}>
        My Wishlist
      </h2>
      <p style={{ color: '#666', textAlign: 'center', padding: '40px 0' }}>
        Your wishlist is empty. <a href="/" style={{ color: '#4caf50', textDecoration: 'none' }}>Browse products</a>
      </p>
    </div>
  );
}
