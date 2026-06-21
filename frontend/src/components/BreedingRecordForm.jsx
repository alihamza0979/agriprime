import React, { useState, useEffect } from 'react';
import api from '../api';
import DateInput from './DateInput';

export default function BreedingRecordForm({ recordId, onSuccess, onCancel }) {
  const [animals, setAnimals] = useState([]);
  const [formData, setFormData] = useState({
    animalId: '',
    partnerAnimalId: '',
    heatDate: '',
    breedingDate: '',
    expectedBirthDate: '',
    status: 'Heat Alert',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/animals').then(res => setAnimals(res.data.data || [])).catch(console.error);
    if (recordId) {
      api.get(`/breeding/${recordId}`).then(res => {
        const r = res.data.data;
        setFormData({
          animalId: r.animalId?._id || r.animalId || '',
          partnerAnimalId: r.partnerAnimalId?._id || r.partnerAnimalId || '',
          heatDate: r.heatDate ? new Date(r.heatDate).toISOString().split('T')[0] : '',
          breedingDate: r.breedingDate ? new Date(r.breedingDate).toISOString().split('T')[0] : '',
          expectedBirthDate: r.expectedBirthDate ? new Date(r.expectedBirthDate).toISOString().split('T')[0] : '',
          status: r.status || 'Heat Alert',
          notes: r.notes || '',
        });
      }).catch(() => setError('Failed to load record'));
    }
  }, [recordId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const payload = {
      ...formData,
      partnerAnimalId: formData.partnerAnimalId || undefined,
      heatDate: formData.heatDate || undefined,
      breedingDate: formData.breedingDate || undefined,
      expectedBirthDate: formData.expectedBirthDate || undefined,
    };
    try {
      if (recordId) {
        await api.put(`/breeding/${recordId}`, payload);
      } else {
        await api.post('/breeding', payload);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">{recordId ? 'Edit Breeding Record' : 'Add Breeding Record'}</h2>
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <select name="animalId" value={formData.animalId} onChange={e => setFormData(f => ({ ...f, animalId: e.target.value }))} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Select Animal</option>
            {animals.filter(a => a.gender === 'Female' && a.status !== 'Sold').map(a => (
              <option key={a._id} value={a._id}>{a.name} ({a.rfid}) - {a.breed}</option>
            ))}
          </select>
          <select name="partnerAnimalId" value={formData.partnerAnimalId} onChange={e => setFormData(f => ({ ...f, partnerAnimalId: e.target.value }))} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Partner Animal (optional)</option>
            {animals.filter(a => a.gender === 'Male' && a.status !== 'Sold').map(a => (
              <option key={a._id} value={a._id}>{a.name} ({a.rfid}) - {a.breed}</option>
            ))}
          </select>
          <select name="status" value={formData.status} onChange={e => setFormData(f => ({ ...f, status: e.target.value }))} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            {['Heat Alert', 'Bred', 'Pregnant', 'Delivered', 'Failed'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <DateInput label="Heat Date" name="heatDate" value={formData.heatDate} onChange={e => setFormData(f => ({ ...f, heatDate: e.target.value }))} />
          <DateInput label="Breeding Date" name="breedingDate" value={formData.breedingDate} onChange={e => setFormData(f => ({ ...f, breedingDate: e.target.value }))} />
          <DateInput label="Expected Birth Date" name="expectedBirthDate" value={formData.expectedBirthDate} onChange={e => setFormData(f => ({ ...f, expectedBirthDate: e.target.value }))} />
          <textarea name="notes" placeholder="Breeding notes and observations..." value={formData.notes} onChange={e => setFormData(f => ({ ...f, notes: e.target.value }))} rows={2} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={loading} className="flex-1 bg-primary text-white py-2 rounded-lg font-bold disabled:opacity-50">{loading ? 'Saving...' : 'Save'}</button>
            <button type="button" onClick={onCancel} className="flex-1 bg-gray-200 py-2 rounded-lg font-bold">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
