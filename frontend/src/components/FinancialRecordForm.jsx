import React, { useState } from 'react';
import api from '../api';
import DateInput from './DateInput';

export default function FinancialRecordForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    type: 'Income',
    category: 'Milk Sales',
    description: '',
    amountPKR: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const incomeCategories = ['Milk Sales', 'Livestock Sales', 'Product Sales', 'Other Income'];
  const expenseCategories = ['Feed', 'Veterinary', 'Payroll', 'Logistics', 'Equipment', 'Other Expense'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/financial', {
        ...formData,
        amountPKR: Number(formData.amountPKR),
        date: formData.date,
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <h2 className="text-2xl font-bold mb-6">Add Financial Record</h2>
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <select name="type" value={formData.type} onChange={e => setFormData(f => ({ ...f, type: e.target.value, category: e.target.value === 'Income' ? 'Milk Sales' : 'Feed' }))} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
          <select name="category" value={formData.category} onChange={e => setFormData(f => ({ ...f, category: e.target.value }))} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            {(formData.type === 'Income' ? incomeCategories : expenseCategories).map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input type="text" name="description" placeholder="Description (e.g. Weekly milk sales, Feed purchase)" value={formData.description} onChange={e => setFormData(f => ({ ...f, description: e.target.value }))} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="number" name="amountPKR" placeholder="Amount in PKR (e.g. 15000)" value={formData.amountPKR} onChange={e => setFormData(f => ({ ...f, amountPKR: e.target.value }))} required min="0" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <DateInput label="Transaction Date" name="date" value={formData.date} onChange={e => setFormData(f => ({ ...f, date: e.target.value }))} required />
          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={loading} className="flex-1 bg-primary text-white py-2 rounded-lg font-bold disabled:opacity-50">{loading ? 'Saving...' : 'Save'}</button>
            <button type="button" onClick={onCancel} className="flex-1 bg-gray-200 py-2 rounded-lg font-bold">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
