import React, { useState, useEffect } from 'react';
import api from '../api';

export default function InventoryForm({ itemId, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    itemName: '',
    category: 'Feed',
    quantityKg: '',
    unitPriceKPR: '',
    reorderLevel: '',
    supplier: '',
    warehouseLocation: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (itemId) {
      const fetchItem = async () => {
        try {
          const res = await api.get(`/inventory/${itemId}`);
          setFormData(res.data.data);
        } catch (err) {
          setError('Failed to load inventory item');
        }
      };
      fetchItem();
    }
  }, [itemId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (itemId) {
        await api.put(`/inventory/${itemId}`, formData);
      } else {
        await api.post('/inventory', formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving inventory item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">{itemId ? 'Edit Item' : 'Add Inventory Item'}</h2>
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="itemName" placeholder="Item Name" value={formData.itemName} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          
          <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="Feed">Feed</option>
            <option value="Medical">Medical</option>
            <option value="Equipment">Equipment</option>
            <option value="Supplements">Supplements</option>
            <option value="Maintenance">Maintenance</option>
          </select>

          <input type="number" name="quantityKg" placeholder="Quantity (kg)" value={formData.quantityKg} onChange={handleChange} required step="0.01" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="number" name="unitPriceKPR" placeholder="Unit Price (PKR)" value={formData.unitPriceKPR} onChange={handleChange} required step="0.01" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="number" name="reorderLevel" placeholder="Reorder Level (kg)" value={formData.reorderLevel} onChange={handleChange} step="0.01" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="text" name="supplier" placeholder="Supplier" value={formData.supplier} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="text" name="warehouseLocation" placeholder="Warehouse Location" value={formData.warehouseLocation} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />

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
