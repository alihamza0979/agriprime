import React, { useState, useEffect } from 'react';
import api from '../../api';

const CATEGORY_ICONS = {
  Dairy: 'water_drop',
  Livestock: 'pets',
  Feed: 'eco',
  Organic: 'spa',
  Other: 'category',
};

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products')
      .then(res => {
        const products = res.data.data || [];
        const map = {};
        products.forEach(p => {
          const cat = p.category || 'Other';
          if (!map[cat]) map[cat] = { name: cat, count: 0, totalStock: 0, products: [] };
          map[cat].count++;
          map[cat].totalStock += p.stock || 0;
          map[cat].products.push(p.name);
        });
        setCategories(Object.values(map).sort((a, b) => b.count - a.count));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#666' }}>Loading categories...</div>;

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8, color: '#1b1b1b' }}>Category Management</h2>
      <p style={{ color: '#666', marginBottom: 24 }}>Product categories are derived from your product catalog. Add products with a category to expand this list.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {categories.length === 0 ? (
          <div style={{ background: '#fff', padding: 40, borderRadius: 12, textAlign: 'center', color: '#666', gridColumn: '1/-1' }}>
            No categories yet. Add products from the Products page.
          </div>
        ) : categories.map(cat => (
          <div key={cat.name} style={{
            background: '#fff', padding: 24, borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: '1px solid #f0f0f0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: '#e8f5e9', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <span className="material-symbols-outlined" style={{ color: '#4caf50', fontSize: 24 }}>
                  {CATEGORY_ICONS[cat.name] || 'category'}
                </span>
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 'bold', color: '#1b1b1b' }}>{cat.name}</h3>
                <p style={{ fontSize: 13, color: '#666' }}>{cat.count} product{cat.count !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
              <div style={{ flex: 1, background: '#f5fced', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                <p style={{ fontSize: 20, fontWeight: 'bold', color: '#4caf50' }}>{cat.count}</p>
                <p style={{ fontSize: 11, color: '#666' }}>Products</p>
              </div>
              <div style={{ flex: 1, background: '#f5fced', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                <p style={{ fontSize: 20, fontWeight: 'bold', color: '#4caf50' }}>{cat.totalStock}</p>
                <p style={{ fontSize: 11, color: '#666' }}>Total Stock</p>
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#999' }}>
              {cat.products.slice(0, 3).join(', ')}{cat.products.length > 3 ? '...' : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
