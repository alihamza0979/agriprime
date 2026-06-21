import React, { useState, useEffect } from 'react';
import api from '../api';

export default function AnimalForm({ animalId, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    rfid: '',
    name: '',
    species: 'Cattle',
    breed: '',
    gender: 'Male',
    weightKg: '',
    status: 'Healthy'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (animalId) {
      const fetchAnimal = async () => {
        try {
          const res = await api.get(`/animals/${animalId}`);
          setFormData(res.data.data);
        } catch (err) {
          setError('Failed to load animal data');
        }
      };
      fetchAnimal();
    }
  }, [animalId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (animalId) {
        await api.put(`/animals/${animalId}`, formData);
      } else {
        await api.post('/animals', formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving animal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <h2 className="text-2xl font-bold mb-6">{animalId ? 'Edit Animal' : 'Add Animal'}</h2>
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="rfid" placeholder="RFID Tag" value={formData.rfid} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="text" name="name" placeholder="Animal Name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          
          <select name="species" value={formData.species} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="Cattle">Cattle</option>
            <option value="Cow">Cow</option>
            <option value="Buffalo">Buffalo</option>
            <option value="Goat">Goat</option>
            <option value="Sheep">Sheep</option>
            <option value="Bird">Bird</option>
            <option value="Chicken">Chicken</option>
            <option value="Duck">Duck</option>
            <option value="Other">Other</option>
          </select>

          <input type="text" name="breed" placeholder="Breed" value={formData.breed} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          
          <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <input type="number" name="weightKg" placeholder="Weight (kg)" value={formData.weightKg} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          
          <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="Healthy">Healthy</option>
            <option value="Quarantine">Quarantine</option>
            <option value="Sold">Sold</option>
            <option value="Deceased">Deceased</option>
          </select>

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
