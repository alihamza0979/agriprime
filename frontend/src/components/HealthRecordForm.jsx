import React, { useState, useEffect } from 'react';
import api from '../api';
import DateInput from './DateInput';

export default function HealthRecordForm({ recordId, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    animalId: '',
    recordType: 'Checkup',
    diagnosis: '',
    treatment: '',
    medications: '',
    status: 'Completed',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const res = await api.get('/animals');
        setAnimals(res.data.data || []);
      } catch (err) {
        console.error('Error fetching animals:', err);
      }
    };
    fetchAnimals();

    if (recordId) {
      const fetchRecord = async () => {
        try {
          const res = await api.get(`/health/${recordId}`);
          const d = res.data.data;
          setFormData({
            animalId: d.animalId?._id || d.animalId || '',
            recordType: d.recordType || 'Checkup',
            diagnosis: d.diagnosis || '',
            treatment: d.treatment || '',
            medications: d.medications || '',
            status: d.status || 'Completed',
            notes: d.notes || '',
            date: d.date ? new Date(d.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          });
        } catch (err) {
          setError('Failed to load health record');
        }
      };
      fetchRecord();
    }
  }, [recordId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (recordId) {
        await api.put(`/health/${recordId}`, formData);
      } else {
        await api.post('/health', formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving health record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">{recordId ? 'Edit Health Record' : 'Add Health Record'}</h2>
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <select name="animalId" value={formData.animalId} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Select Animal</option>
            {animals.map(animal => (
              <option key={animal._id} value={animal._id}>{animal.name} ({animal.rfid})</option>
            ))}
          </select>

          <select name="recordType" value={formData.recordType} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="Checkup">Checkup</option>
            <option value="Vaccination">Vaccination</option>
            <option value="Treatment">Treatment</option>
            <option value="Surgery">Surgery</option>
          </select>

          <DateInput label="Record Date" name="date" value={formData.date} onChange={handleChange} required />
          <input type="text" name="diagnosis" placeholder="Diagnosis (e.g. Foot Rot, Annual Vaccination)" value={formData.diagnosis} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="text" name="treatment" placeholder="Treatment given (e.g. Antibiotics, Vaccine)" value={formData.treatment} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="text" name="medications" placeholder="Medications used (optional)" value={formData.medications} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          
          <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="Completed">Completed</option>
            <option value="Under Treatment">Under Treatment</option>
            <option value="Critical">Critical</option>
            <option value="Recovered">Recovered</option>
          </select>

          <textarea name="notes" placeholder="Additional notes about this health record..." value={formData.notes} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" rows="3"></textarea>

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
