import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import Toast from '../../components/Toast';
import api from '../../api';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import CartDrawer from '../../components/CartDrawer';
import CheckoutModal from '../../components/CheckoutModal';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartCount } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    api.get(`/products/${id}`)
      .then(res => {
        const prod = res.data.data;
        setProduct(prod);
        // Fetch similar products
        api.get('/products').then(allRes => {
          const all = allRes.data.data || [];
          setSimilarProducts(all.filter(p => p.category === prod.category && p._id !== prod._id).slice(0, 4));
        }).catch(err => console.error("Could not load similar products", err));
      })
      .catch(() => setToast({ message: 'Product not found', type: 'error' }))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = (item = product, itemQty = qty) => {
    if (!item?.inStock || item.stock <= 0) {
      setToast({ message: 'Out of stock', type: 'error' });
      return;
    }
    for (let i = 0; i < itemQty; i++) addToCart(item);
    setToast({ message: `${itemQty} × ${item.name} added to cart`, type: 'success' });
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation cartCount={cartCount} />
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation cartCount={cartCount} />
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">inventory_2</span>
        <p className="text-gray-500 text-lg mb-6">Product not found.</p>
        <Link to="/" className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-green-700 transition-colors">
          Back to Marketplace
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfdfa]">
      <Navigation cartCount={cartCount} onCartClick={() => setCartOpen(true)} />
      
      <main className="flex-1 py-12 px-6 lg:px-12 max-w-7xl mx-auto w-full">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-8 font-medium"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span> Back to shopping
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 lg:gap-16">
            {/* Image Gallery */}
            <div className="bg-gray-50 p-8 md:p-12 flex items-center justify-center min-h-[400px]">
              <img
                src={product.imageUrl || '/assets/product-placeholder.svg'}
                alt={product.name}
                className="w-full max-w-md h-auto object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
                onError={e => { e.target.src = '/assets/product-placeholder.svg'; }}
              />
            </div>

            {/* Product Info */}
            <div className="p-8 md:p-12 md:pl-0 flex flex-col justify-center">
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider mb-4 w-max">
                {product.category}
              </span>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight font-headline">
                {product.name}
              </h1>
              
              {product.certified && (
                <div className="flex items-center gap-1.5 text-green-700 bg-green-50 px-3 py-1.5 rounded-full text-sm font-bold w-max mb-6 border border-green-200">
                  <span className="material-symbols-outlined text-base">verified</span> 
                  AgriPrime Certified
                </div>
              )}
              
              <p className="text-3xl font-black text-primary mb-6">
                ₨{product.price?.toLocaleString()}
              </p>
              
              <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                {product.description || 'Premium farm-fresh product organically sourced from AgriPrime certified farms.'}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-green-50/50 border border-green-100 p-4 rounded-2xl">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-bold mb-1">Availability</p>
                  <div className={`font-bold flex items-center gap-1.5 ${product.inStock ? 'text-green-700' : 'text-red-600'}`}>
                    <span className="material-symbols-outlined text-sm">{product.inStock ? 'check_circle' : 'cancel'}</span>
                    {product.inStock ? `${product.stock} in stock` : 'Out of Stock'}
                  </div>
                </div>
                {product.sku && (
                  <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-bold mb-1">SKU</p>
                    <p className="font-bold text-gray-900">{product.sku}</p>
                  </div>
                )}
              </div>

              {product.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {product.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <div className="flex items-center justify-between border-2 border-gray-200 rounded-2xl p-1 bg-white w-full sm:w-32">
                  <button 
                    onClick={() => setQty(q => Math.max(1, q - 1))} 
                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <span className="font-bold text-lg w-8 text-center">{qty}</span>
                  <button 
                    onClick={() => setQty(q => Math.min(product.stock, q + 1))} 
                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>
                <button
                  onClick={() => handleAddToCart(product, qty)}
                  disabled={!product.inStock || product.stock <= 0}
                  className="flex-1 flex items-center justify-center gap-2 py-4 px-8 bg-primary text-white border-none rounded-2xl font-bold text-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/30 transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined">shopping_cart</span>
                  Add to Cart
                </button>
              </div>

              {!isAuthenticated && (
                <p className="text-sm text-gray-500 mt-6 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">info</span>
                  <span><Link to="/login" className="text-primary font-bold hover:underline">Sign in</Link> to checkout and track orders.</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-black text-gray-900 font-headline mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-4xl">recommend</span>
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map(item => (
                <div key={item._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group flex flex-col">
                  <Link to={`/product/${item._id}`} className="relative h-48 overflow-hidden bg-gray-50 block p-4">
                    <img
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      alt={item.name}
                      src={item.imageUrl || '/assets/product-placeholder.svg'}
                      onError={e => { e.target.src = '/assets/product-placeholder.svg'; }}
                    />
                  </Link>
                  <div className="p-5 flex-1 flex flex-col border-t border-gray-50">
                    <Link to={`/product/${item._id}`} className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 hover:text-primary transition-colors">{item.name}</Link>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">{item.description}</p>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-lg font-black text-primary">₨{item.price.toLocaleString()}</span>
                      <button
                        onClick={() => handleAddToCart(item, 1)}
                        disabled={!item.inStock || item.stock <= 0}
                        className="w-10 h-10 flex items-center justify-center bg-primary/10 text-primary rounded-xl font-bold hover:bg-primary hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      >
                        <span className="material-symbols-outlined text-xl">add_shopping_cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      
      {/* Footer minimal version for product page */}
      <footer className="bg-white border-t border-gray-100 py-8 text-center mt-auto">
        <p className="text-gray-500 text-sm">© 2026 AgriPrime. All rights reserved.</p>
      </footer>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }} />
      {checkoutOpen && <CheckoutModal onClose={() => setCheckoutOpen(false)} onSuccess={msg => setToast({ message: msg, type: 'success' })} />}

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          style={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 150,
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg, #4caf50, #2e7d32)',
            color: '#fff', border: 'none', cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(76,175,80,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 28 }}>shopping_cart</span>
          <span style={{
            position: 'absolute', top: -4, right: -4,
            background: '#fff', color: '#4caf50',
            borderRadius: '50%', width: 24, height: 24,
            fontSize: 12, fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}>{cartCount}</span>
        </button>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
