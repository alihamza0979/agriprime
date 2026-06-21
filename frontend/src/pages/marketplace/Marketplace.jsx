import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import Toast from '../../components/Toast';
import api from '../../api';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import CartDrawer from '../../components/CartDrawer';
import CheckoutModal from '../../components/CheckoutModal';

const CATEGORIES = [
  { id: 'all', label: 'All Products', icon: 'storefront', desc: 'Browse our full catalog' },
  { id: 'Dairy', label: 'Dairy', icon: 'water_drop', desc: 'Fresh milk and artisanal cheeses from pasture-raised cattle.' },
  { id: 'Livestock', label: 'Livestock', icon: 'pets', desc: 'Ethically raised, grass-fed heritage breeds.' },
  { id: 'Feed', label: 'Organic Feed', icon: 'eco', desc: 'GMO-free grains and forage from pesticide-free fields.' },
  { id: 'Organic', label: 'Organic', icon: 'spa', desc: 'Certified organic farm products.' },
];

const CATEGORY_IMAGES = {
  Dairy: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&h=400&fit=crop',
  Livestock: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=600&h=400&fit=crop',
  Feed: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop',
  Organic: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=400&fit=crop',
};



export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [toast, setToast] = useState(null);
  const { addToCart, cartCount } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products');
      setProducts(res.data.data || []);
    } catch {
      setToast({ message: 'Failed to load products. Is the server running?', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter(p => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAddToCart = (product) => {
    if (!product.inStock || product.stock <= 0) {
      setToast({ message: 'This product is out of stock', type: 'error' });
      return;
    }
    addToCart(product);
    setToast({ message: `${product.name} added to cart`, type: 'success' });
  };

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubscribe = async () => {
    if (!newsletterEmail) {
      setToast({ message: 'Please enter an email', type: 'error' });
      return;
    }
    setSubscribing(true);
    try {
      const res = await api.post('/newsletter/subscribe', { email: newsletterEmail });
      setToast({ message: res.data.message || 'Thanks for subscribing!', type: 'success' });
      setNewsletterEmail('');
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to subscribe', type: 'error' });
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <>
      <Navigation cartCount={cartCount} onCartClick={() => setCartOpen(true)} />

      {/* Hero */}
      <header className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img className="w-full h-full object-cover" alt="Sustainable organic farm at sunrise" src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&h=1080&fit=crop" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a2e1a]/95 via-[#0a2e1a]/70 to-[#0a2e1a]/30" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-20 w-full">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-primary/20 text-green-300 rounded-full border border-green-500/30">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              AgriPrime Certified Farm
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 font-headline">
              Purely Organic, From Our <span className="text-green-400 italic">Farm</span> to Your Table
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-xl mb-10 leading-relaxed">
              Manage livestock, track health, and shop premium dairy, livestock, and organic feed — all from Mr. Ahmed's trusted AgriPrime platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={scrollToProducts} className="px-10 py-4 bg-gradient-to-br from-green-500 to-green-600 text-white font-bold rounded-full shadow-lg shadow-green-500/30 hover:scale-105 active:scale-95 transition-all">
                Shop Now
              </button>
              <a href="#about" className="px-10 py-4 border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-all">
                Our Story
              </a>
            </div>
            <div className="flex gap-8 mt-12 pt-8 border-t border-white/10">
              {[
                { val: '500+', label: 'Animals Tracked' },
                { val: '100%', label: 'Organic Certified' },
                { val: '24hr', label: 'Farm to Door' },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-2xl font-bold text-green-400">{s.val}</p>
                  <p className="text-sm text-white/60">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Categories */}
      <section id="categories" className="py-20 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black tracking-tight text-gray-900 font-headline mb-3">Featured Categories</h2>
            <p className="text-gray-500 text-lg">Premium products from our certified sustainable farm</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); scrollToProducts(); }}
                className={`text-left p-6 rounded-2xl border-2 transition-all hover:shadow-lg hover:-translate-y-1 ${
                  activeCategory === cat.id ? 'border-primary bg-green-50 shadow-md' : 'border-gray-100 bg-gray-50'
                }`}
              >
                <div className="w-14 h-14 mb-4 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-3xl">{cat.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{cat.label}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{cat.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="py-20 px-8 bg-[#f5fced]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <h2 className="text-4xl font-black tracking-tight text-gray-900 font-headline mb-2">Harvest Fresh Selection</h2>
              <p className="text-gray-500 text-lg">Directly from the fields to your doorstep within 24 hours.</p>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-primary focus:outline-none w-64"
                />
              </div>
              <select
                value={activeCategory}
                onChange={e => setActiveCategory(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-primary focus:outline-none"
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-56 bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-8 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">inventory_2</span>
              <p className="text-gray-500 text-lg">No products found. Try a different category or search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map(product => (
                <div key={product._id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col">
                  <Link to={`/product/${product._id}`} className="relative h-56 overflow-hidden bg-gray-100 block">
                    <img
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt={product.name}
                      src={product.imageUrl || CATEGORY_IMAGES[product.category] || '/assets/product-placeholder.svg'}
                      onError={e => { e.target.src = '/assets/product-placeholder.svg'; }}
                    />
                    {product.certified && (
                      <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">verified</span> Certified
                      </div>
                    )}
                    <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold ${
                      product.inStock && product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {product.inStock && product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </div>
                  </Link>
                  <div className="p-5 flex-1 flex flex-col">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider mb-1">{product.category}</span>
                    <Link to={`/product/${product._id}`} className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 hover:text-primary transition-colors">{product.name}</Link>
                    <p className="text-sm text-gray-500 mb-4 flex-1 line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xl font-bold text-primary">₨{product.price.toLocaleString()}</span>
                        {product.stock <= 10 && product.stock > 0 && (
                          <p className="text-xs text-orange-500">Only {product.stock} left</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.inStock || product.stock <= 0}
                        className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      >
                        <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 px-8 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-primary font-bold text-sm uppercase tracking-widest">About AgriPrime</span>
            <h2 className="text-4xl font-black text-gray-900 font-headline mt-3 mb-6">Transforming Traditional Farming into a Smart Digital Ecosystem</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Built for Mr. Ahmed's medium-scale livestock farm, AgriPrime replaces manual registers with a unified platform for animal tracking, veterinary health, workforce management, inventory, and online sales.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Every animal has a digital identity. Vaccinations are never missed. Employees stay accountable. And customers can buy premium farm products online with secure checkout.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {['Livestock Tracking', 'Vet Health Alerts', 'Employee Management', 'Online Marketplace'].map(f => (
                <div key={f} className="flex items-center gap-2 text-gray-700">
                  <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                  <span className="text-sm font-medium">{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop" alt="Farm operations" className="rounded-3xl shadow-2xl w-full h-80 object-cover" />
            <div className="absolute -bottom-6 -left-6 bg-primary text-white p-6 rounded-2xl shadow-xl">
              <p className="text-3xl font-bold">15+</p>
              <p className="text-sm text-white/80">Years of farming excellence</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-8 bg-gradient-to-br from-[#0a2e1a] to-[#0f4a2a]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4 font-headline">Join the AgriPrime Community</h2>
          <p className="text-white/60 mb-8">Get exclusive offers, farming tips, and early access to new products.</p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500" 
            />
            <button onClick={handleSubscribe} disabled={subscribing} className="px-6 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors disabled:opacity-50">
              {subscribing ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a2e1a] text-white px-8 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-green-400">eco</span> AgriPrime
            </h3>
            <p className="text-white/60 text-sm leading-relaxed">Premium organic agricultural products and smart farm management — directly from certified farms.</p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><button onClick={scrollToProducts} className="text-white/60 hover:text-white transition-colors">Products</button></li>
              <li><a href="#categories" className="text-white/60 hover:text-white transition-colors">Categories</a></li>
              <li><a href="#about" className="text-white/60 hover:text-white transition-colors">About</a></li>
              <li><Link to="/register" className="text-white/60 hover:text-white transition-colors">Create Account</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li>Help Center</li>
              <li>Shipping within 24hrs</li>
              <li>Cash & Mobile Wallet</li>
              <li>+92 300 123 4567</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Farm Management</h3>
            <p className="text-white/60 text-sm mb-4">Access the admin panel for livestock, HR, and inventory management.</p>
            <Link to="/login" className="text-green-400 font-bold hover:text-green-300 transition-colors">Admin Login →</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 text-center text-white/40 text-sm">
          <p>© 2026 AgriPrime. All rights reserved. Built for sustainable agriculture.</p>
        </div>
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
    </>
  );
}
