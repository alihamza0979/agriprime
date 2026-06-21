import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';

export default function CheckoutModal({ onClose, onSuccess }) {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    phone: '',
    city: '',
    deliveryAddress: '',
    paymentMethod: 'Mobile Wallet',
  });

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const orderNumber = `ORD-${Date.now()}`;
      await api.post('/orders', {
        orderNumber,
        customer: {
          name: user.name,
          email: user.email,
          phone: form.phone,
          city: form.city,
        },
        items: cart.map(item => ({
          productName: item.name,
          qty: item.qty,
          unitPriceKPR: item.price,
        })),
        totalAmountPKR: cartTotal,
        status: 'Pending',
        paymentMethod: form.paymentMethod,
        paymentStatus: 'Pending',
        deliveryAddress: form.deliveryAddress,
      });
      clearCart();
      onSuccess('Order placed successfully! Track it in your dashboard.');
      onClose();
      navigate('/dashboard/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[200] p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center" onClick={e => e.stopPropagation()}>
          <span className="material-symbols-outlined text-5xl text-primary mb-4">login</span>
          <h3 className="text-xl font-bold mb-2">Sign in to checkout</h3>
          <p className="text-gray-600 mb-6">Create an account or log in to complete your purchase.</p>
          <div className="flex gap-3">
            <Link to="/login" className="flex-1 py-3 bg-primary text-white rounded-xl font-bold text-center">Login</Link>
            <Link to="/register" className="flex-1 py-3 border-2 border-primary text-primary rounded-xl font-bold text-center">Sign Up</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[200] p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <h3 className="text-2xl font-bold mb-6">Complete Your Order</h3>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}
        <div className="mb-6 p-4 bg-green-50 rounded-xl">
          <p className="text-sm text-gray-600">{cart.length} item(s)</p>
          <p className="text-2xl font-bold text-primary">₨{cartTotal.toLocaleString()}</p>
        </div>
        <form onSubmit={handleCheckout} className="space-y-4">
          <input type="tel" placeholder="Phone Number" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" />
          <input type="text" placeholder="City" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} required className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" />
          <textarea placeholder="Delivery Address" value={form.deliveryAddress} onChange={e => setForm(f => ({ ...f, deliveryAddress: e.target.value }))} required rows={3} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none" />
          <select value={form.paymentMethod} onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none">
            <option value="Mobile Wallet">Mobile Wallet (JazzCash/EasyPaisa)</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cash">Cash on Delivery</option>
            <option value="Card">Credit/Debit Card</option>
          </select>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading || cart.length === 0} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold disabled:opacity-50">
              {loading ? 'Processing...' : 'Place Order'}
            </button>
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
