import React, { useState, useEffect } from 'react';
import api from '../../api';
import ProductForm from '../../components/ProductForm';
import Toast from '../../components/Toast';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products');
      setProducts(res.data.data || []);
    } catch {
      setToast({ message: 'Failed to load products', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setToast({ message: 'Product deleted', type: 'success' });
      fetchProducts();
    } catch {
      setToast({ message: 'Failed to delete product', type: 'error' });
    }
  };

  const filtered = products.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 'bold', color: '#1b1b1b' }}>Product Management</h2>
          <p style={{ color: '#666', marginTop: 4 }}>{products.length} products in catalog</p>
        </div>
        <button onClick={() => { setEditingId(null); setShowForm(true); }} style={{
          padding: '12px 24px', background: '#4caf50', color: '#fff',
          border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
          Add Product
        </button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #ddd', width: 300 }}
        />
      </div>

      <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5fced', borderBottom: '1px solid #eee' }}>
              {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#666', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#666' }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 40, textAlign: 'center', color: '#666' }}>No products found</td></tr>
            ) : filtered.map(p => (
              <tr key={p._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img src={p.imageUrl || '/assets/product-placeholder.svg'} alt={p.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                    <div>
                      <p style={{ fontWeight: 600, color: '#1b1b1b' }}>{p.name}</p>
                      {p.certified && <span style={{ fontSize: 11, color: '#4caf50', fontWeight: 600 }}>✓ Certified</span>}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 16px', color: '#666' }}>{p.category}</td>
                <td style={{ padding: '14px 16px', fontWeight: 700, color: '#4caf50' }}>₨{p.price?.toLocaleString()}</td>
                <td style={{ padding: '14px 16px', color: '#666' }}>{p.stock}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                    background: p.inStock ? '#e8f5e9' : '#ffebee',
                    color: p.inStock ? '#2e7d32' : '#c62828',
                  }}>{p.inStock ? 'In Stock' : 'Out of Stock'}</span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => { setEditingId(p._id); setShowForm(true); }} style={{ padding: '6px 12px', background: '#e8f5e9', color: '#4caf50', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Edit</button>
                    <button onClick={() => handleDelete(p._id)} style={{ padding: '6px 12px', background: '#ffebee', color: '#c62828', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <ProductForm
          productId={editingId}
          onSuccess={() => { setShowForm(false); setEditingId(null); setToast({ message: 'Product saved', type: 'success' }); fetchProducts(); }}
          onCancel={() => { setShowForm(false); setEditingId(null); }}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
