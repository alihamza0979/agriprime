import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import Toast from '../../components/Toast';
import api from '../../api';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartCount } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => setProduct(res.data.data))
      .catch(() => setToast({ message: 'Product not found', type: 'error' }))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product?.inStock || product.stock <= 0) {
      setToast({ message: 'Out of stock', type: 'error' });
      return;
    }
    for (let i = 0; i < qty; i++) addToCart(product);
    setToast({ message: `${qty} × ${product.name} added to cart`, type: 'success' });
  };

  if (loading) return (
    <>
      <Navigation cartCount={cartCount} />
      <div style={{ padding: 80, textAlign: 'center', color: '#666' }}>Loading product...</div>
    </>
  );

  if (!product) return (
    <>
      <Navigation cartCount={cartCount} />
      <div style={{ padding: 80, textAlign: 'center' }}>
        <p style={{ color: '#666', marginBottom: 16 }}>Product not found.</p>
        <Link to="/" style={{ color: '#4caf50', fontWeight: 'bold' }}>Back to Marketplace</Link>
      </div>
    </>
  );

  return (
    <>
      <Navigation cartCount={cartCount} />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#666', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 24, fontSize: 14 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span> Back
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
          <div style={{ borderRadius: 24, overflow: 'hidden', background: '#f5f5f5', aspectRatio: '1' }}>
            <img
              src={product.imageUrl || '/assets/product-placeholder.svg'}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.target.src = '/assets/product-placeholder.svg'; }}
            />
          </div>

          <div>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#4caf50', textTransform: 'uppercase', letterSpacing: 1 }}>{product.category}</span>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1b1b1b', marginTop: 8, marginBottom: 12 }}>{product.name}</h1>
            {product.certified && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#e8f5e9', color: '#2e7d32', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, marginBottom: 16 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>verified</span> AgriPrime Certified
              </span>
            )}
            <p style={{ fontSize: 28, fontWeight: 800, color: '#4caf50', marginBottom: 20 }}>₨{product.price?.toLocaleString()}</p>
            <p style={{ color: '#666', lineHeight: 1.7, marginBottom: 24 }}>{product.description || 'Premium farm-fresh product from AgriPrime certified farms.'}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
              <div style={{ background: '#f5fced', padding: 16, borderRadius: 12 }}>
                <p style={{ fontSize: 12, color: '#666' }}>Availability</p>
                <p style={{ fontWeight: 700, color: product.inStock ? '#2e7d32' : '#c62828' }}>{product.inStock ? `${product.stock} in stock` : 'Out of Stock'}</p>
              </div>
              {product.sku && (
                <div style={{ background: '#f5fced', padding: 16, borderRadius: 12 }}>
                  <p style={{ fontSize: 12, color: '#666' }}>SKU</p>
                  <p style={{ fontWeight: 700 }}>{product.sku}</p>
                </div>
              )}
            </div>

            {product.tags?.length > 0 && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
                {product.tags.map(tag => (
                  <span key={tag} style={{ background: '#f0f0f0', padding: '4px 12px', borderRadius: 20, fontSize: 12, color: '#666' }}>{tag}</span>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: 12 }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>−</button>
                <span style={{ padding: '12px 16px', fontWeight: 700 }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} style={{ padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>+</button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock || product.stock <= 0}
                style={{ flex: 1, padding: '14px 24px', background: '#4caf50', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 16, cursor: 'pointer', opacity: product.inStock ? 1 : 0.5 }}
              >
                Add to Cart
              </button>
            </div>

            {!isAuthenticated && (
              <p style={{ fontSize: 13, color: '#999', marginTop: 12 }}>
                <Link to="/login" style={{ color: '#4caf50' }}>Sign in</Link> to checkout and track orders.
              </p>
            )}
          </div>
        </div>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
