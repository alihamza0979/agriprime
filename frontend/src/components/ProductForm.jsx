import React, { useState, useEffect } from 'react';
import api from '../api';

export default function ProductForm({ productId, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Dairy',
    price: '',
    stock: '',
    sku: '',
    imageUrl: '',
    rating: 0,
    reviews: 0,
    certified: false,
    inStock: true,
    tags: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        try {
          const res = await api.get(`/products/${productId}`);
          setFormData(res.data.data);
        } catch (err) {
          setError('Failed to load product');
        }
      };
      fetchProduct();
    }
  }, [productId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (productId) {
        await api.put(`/products/${productId}`, formData);
      } else {
        await api.post('/products', formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">{productId ? 'Edit Product' : 'Add Product'}</h2>
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" rows="2"></textarea>
          
          <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="Dairy">Dairy</option>
            <option value="Livestock">Livestock</option>
            <option value="Feed">Feed</option>
            <option value="Organic">Organic</option>
            <option value="Other">Other</option>
          </select>

          <input type="number" name="price" placeholder="Price (PKR)" value={formData.price} onChange={handleChange} required step="0.01" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="number" name="stock" placeholder="Stock Quantity" value={formData.stock} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="text" name="sku" placeholder="SKU" value={formData.sku} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="text" name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />

          <div className="flex gap-4">
            <label className="flex items-center">
              <input type="checkbox" name="certified" checked={formData.certified} onChange={handleChange} className="mr-2" />
              <span>Agrezen Certified</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" name="inStock" checked={formData.inStock} onChange={handleChange} className="mr-2" />
              <span>In Stock</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={loading} className="flex-1 bg-primary text-white py-2 rounded-lg font-bold hover:bg-primary/90 disabled:opacity-50">
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={onCancel} className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-bold hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
