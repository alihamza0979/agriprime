import React, { useState, useEffect } from 'react';
import api from '../api';

export default function AnimalGroupForm({ groupId, onSuccess, onCancel }) {
  const [inventory, setInventory] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    species: '',
    feedItemId: '',
    feedItemName: '',
    dailyFeedKg: '',
    animalCount: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/inventory').then(res => setInventory(res.data.data || [])).catch(console.error);
    if (groupId) {
      api.get(`/animal-groups`).then(res => {
        const g = (res.data.data || []).find(x => x._id === groupId);
        if (g) {
          setForm({
            name: g.name || '',
            description: g.description || '',
            species: g.species || '',
            feedItemId: g.feedItemId?._id || g.feedItemId || '',
            feedItemName: g.feedItemName || '',
            dailyFeedKg: g.dailyFeedKg || '',
            animalCount: g.animalCount || '',
            notes: g.notes || '',
          });
        }
      });
    }
  }, [groupId]);

  const handleFeedChange = (id) => {
    const item = inventory.find(i => i._id === id);
    setForm(f => ({ ...f, feedItemId: id, feedItemName: item?.itemName || '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        dailyFeedKg: Number(form.dailyFeedKg) || 0,
        animalCount: Number(form.animalCount) || 0,
        feedItemId: form.feedItemId || undefined,
      };
      if (groupId) await api.put(`/animal-groups/${groupId}`, payload);
      else await api.post('/animal-groups', payload);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <h2 className="text-2xl font-bold mb-6">{groupId ? 'Edit Animal Group' : 'Add Animal Group'}</h2>
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Group Name (e.g. Dairy Herd A)" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="text" placeholder="Group description (optional)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="text" placeholder="Species (e.g. Cow, Goat)" value={form.species} onChange={e => setForm(f => ({ ...f, species: e.target.value }))} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="number" placeholder="Animal Count" value={form.animalCount} onChange={e => setForm(f => ({ ...f, animalCount: e.target.value }))} min="0" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <select value={form.feedItemId} onChange={e => handleFeedChange(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Select Feed Item</option>
            {inventory.map(i => (
              <option key={i._id} value={i._id}>{i.itemName} ({i.quantityKg}kg in stock)</option>
            ))}
          </select>
          <input type="number" placeholder="Daily Feed (kg/day)" value={form.dailyFeedKg} onChange={e => setForm(f => ({ ...f, dailyFeedKg: e.target.value }))} min="0" step="0.1" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <textarea placeholder="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={loading} className="flex-1 bg-primary text-white py-2 rounded-lg font-bold disabled:opacity-50">{loading ? 'Saving...' : 'Save'}</button>
            <button type="button" onClick={onCancel} className="flex-1 bg-gray-200 py-2 rounded-lg font-bold">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
