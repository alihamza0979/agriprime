import React, { useState, useEffect } from 'react';
import api from '../api';
import DateInput from './DateInput';

export default function OrderForm({ orderId, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    orderNumber: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerCity: '',
    items: [{ productName: '', qty: 1, unitPriceKPR: 0 }],
    totalAmountPKR: 0,
    status: 'Pending',
    paymentMethod: 'Cash',
    paymentStatus: 'Pending',
    deliveryAddress: '',
    orderDate: new Date().toISOString().split('T')[0]
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data.data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();

    if (orderId) {
      const fetchOrder = async () => {
        try {
          const res = await api.get(`/orders/${orderId}`);
          const order = res.data.data;
          setFormData({
            orderNumber: order.orderNumber || '',
            customerName: order.customer?.name || '',
            customerEmail: order.customer?.email || '',
            customerPhone: order.customer?.phone || '',
            customerCity: order.customer?.city || '',
            items: order.items?.length ? order.items : [{ productName: '', qty: 1, unitPriceKPR: 0 }],
            totalAmountPKR: order.totalAmountPKR || 0,
            status: order.status || 'Pending',
            paymentMethod: order.paymentMethod || 'Cash',
            paymentStatus: order.paymentStatus || 'Pending',
            deliveryAddress: order.deliveryAddress || '',
            orderDate: order.orderDate ? new Date(order.orderDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
          });
        } catch (err) {
          setError('Failed to load order');
        }
      };
      fetchOrder();
    }
  }, [orderId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = field === 'qty' || field === 'unitPriceKPR' ? Number(value) : value;
    const total = newItems.reduce((sum, item) => sum + (Number(item.qty || 0) * Number(item.unitPriceKPR || 0)), 0);
    setFormData(prev => ({ ...prev, items: newItems, totalAmountPKR: total }));
  };

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { productName: '', qty: 1, unitPriceKPR: 0 }]
    }));
  };

  const handleRemoveItem = (index) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    const total = newItems.reduce((sum, item) => sum + (Number(item.qty || 0) * Number(item.unitPriceKPR || 0)), 0);
    setFormData(prev => ({ ...prev, items: newItems, totalAmountPKR: total }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      orderNumber: formData.orderNumber,
      customer: {
        name: formData.customerName,
        email: formData.customerEmail,
        phone: formData.customerPhone,
        city: formData.customerCity
      },
      items: formData.items,
      totalAmountPKR: formData.totalAmountPKR,
      status: formData.status,
      paymentMethod: formData.paymentMethod,
      paymentStatus: formData.paymentStatus,
      deliveryAddress: formData.deliveryAddress,
      orderDate: formData.orderDate
    };

    try {
      if (orderId) {
        await api.put(`/orders/${orderId}`, payload);
      } else {
        await api.post('/orders', payload);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">{orderId ? 'Edit Order' : 'Add Order'}</h2>
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="orderNumber" placeholder="Order Number (e.g. ORD-2024-001)" value={formData.orderNumber} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="text" name="customerName" placeholder="Customer Full Name" value={formData.customerName} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="email" name="customerEmail" placeholder="Customer Email (e.g. customer@email.com)" value={formData.customerEmail} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="tel" name="customerPhone" placeholder="Customer Phone (e.g. 0300-1234567)" value={formData.customerPhone} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="text" name="customerCity" placeholder="Customer City (e.g. Lahore)" value={formData.customerCity} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <textarea name="deliveryAddress" placeholder="Full delivery address including street and area..." value={formData.deliveryAddress} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" rows="2"></textarea>
          <DateInput label="Order Date" name="orderDate" value={formData.orderDate} onChange={handleChange} required />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Order Items</h3>
              <button type="button" onClick={handleAddItem} className="text-primary font-bold">Add Item</button>
            </div>
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 p-4 border rounded-xl bg-surface-container-lowest">
                <input type="text" name="productName" placeholder="Product Name" value={item.productName} onChange={(e) => handleItemChange(index, 'productName', e.target.value)} required className="col-span-5 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                <input type="number" name="qty" placeholder="Qty" value={item.qty} onChange={(e) => handleItemChange(index, 'qty', e.target.value)} min="1" required className="col-span-2 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                <input type="number" name="unitPriceKPR" placeholder="Unit Price" value={item.unitPriceKPR} onChange={(e) => handleItemChange(index, 'unitPriceKPR', e.target.value)} min="0" step="0.01" required className="col-span-3 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                <button type="button" onClick={() => handleRemoveItem(index)} className="col-span-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg">Remove</button>
              </div>
            ))}
          </div>

          <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Card">Card</option>
            <option value="Mobile Wallet">Mobile Wallet</option>
          </select>

          <select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="Pending">Payment Pending</option>
            <option value="Paid">Paid</option>
            <option value="Failed">Failed</option>
          </select>

          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-bold mb-3">Total Amount: ₨{formData.totalAmountPKR.toLocaleString()}</h3>
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
