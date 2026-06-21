// Comprehensive E-commerce Shop Component
import React, { useState, useEffect } from 'react';
import api from '../api';
import ProductForm from '../components/ProductForm';
import Toast from '../components/Toast';

export default function AgriPrimeShopHome() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setToast({ message: 'Failed to load products', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    setCart([...cart, product]);
    setToast({ message: `${product.name} added to cart!`, type: 'success' });
  };

  const handleAddProduct = () => {
    setEditingId(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingId(null);
    setToast({ message: 'Product added successfully', type: 'success' });
    fetchProducts();
  };

  const certifiedProducts = products.filter(p => p.certified);
  const categories = ['Dairy', 'Livestock', 'Feed', 'Organic'];

  return (
    <>
      <main className="w-full">
        {/* Hero Section */}
        <header className="relative min-h-[600px] flex items-center overflow-hidden px-8 py-20 bg-gradient-to-r from-green-50 to-transparent">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-primary-fixed text-on-primary-fixed rounded-full font-label">Agrezen Certified</span>
            <h1 className="text-5xl md:text-6xl font-extrabold font-headline text-on-surface tracking-tight leading-[1.2] mb-6">
              Purely Organic, From Our Farm to Your Table
            </h1>
            <p className="text-lg text-on-surface-variant max-w-xl mb-8">
              Experience the vitality of Agrezen-certified livestock and dairy products.
            </p>
            <div className="flex gap-4">
              <button onClick={handleAddProduct} className="px-8 py-3 bg-primary text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all">
                Add Product
              </button>
              <button className="px-8 py-3 border-2 border-primary text-primary font-bold rounded-full hover:bg-primary/5 transition-all">
                Learn More
              </button>
            </div>
          </div>
        </header>

        {/* Products Grid */}
        <section className="py-16 px-8">
          <div className="max-w-screen-2xl mx-auto">
            <h2 className="text-4xl font-bold font-headline text-on-surface mb-12">Featured Products</h2>
            
            {loading ? (
              <div className="text-center py-12">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 text-on-surface-variant">
                <p className="mb-4">No products yet</p>
                <button onClick={handleAddProduct} className="px-6 py-2 bg-primary text-white rounded-lg">Add First Product</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map(product => (
                  <div key={product._id} className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all">
                    <div className="aspect-square bg-surface-container-high relative overflow-hidden flex items-center justify-center">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover hover:scale-110 transition-transform" />
                      ) : (
                        <span className="material-symbols-outlined text-6xl text-on-surface-variant">image</span>
                      )}
                      {product.certified && (
                        <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded text-xs font-bold">Certified</div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                      <p className="text-sm text-on-surface-variant mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-primary">₨{product.price.toLocaleString()}</span>
                        <button onClick={() => handleAddToCart(product)} className="p-2 bg-primary text-white rounded-lg hover:bg-primary-container transition-colors">
                          <span className="material-symbols-outlined">add_shopping_cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {showForm && (
        <ProductForm 
          productId={editingId} 
          onSuccess={handleFormSuccess} 
          onCancel={() => { setShowForm(false); setEditingId(null); }}
        />
      )}

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
