import React, { useState, useEffect } from 'react';
import api from '../api';
import AnimalForm from '../components/AnimalForm';
import Toast from '../components/Toast';

export default function LivestockManagement() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [speciesFilter, setSpeciesFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      setLoading(true);
      const response = await api.get('/animals');
      if (response.data.success) {
        setAnimals(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching animals:', error);
      setToast({ message: 'Failed to load animals', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnimal = () => {
    setEditingId(null);
    setShowForm(true);
  };

  const handleEditAnimal = (id) => {
    setEditingId(id);
    setShowForm(true);
  };

  const handleDeleteAnimal = async (id) => {
    if (window.confirm('Are you sure you want to delete this animal?')) {
      try {
        await api.delete(`/animals/${id}`);
        setToast({ message: 'Animal deleted successfully', type: 'success' });
        fetchAnimals();
      } catch (error) {
        setToast({ message: 'Failed to delete animal', type: 'error' });
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingId(null);
    setToast({ message: editingId ? 'Animal updated successfully' : 'Animal added successfully', type: 'success' });
    fetchAnimals();
  };

  const filteredAnimals = animals.filter(animal => {
    const matchSearch = animal.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.rfid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.breed?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchSpecies = !speciesFilter || animal.species === speciesFilter;
    return matchSearch && matchSpecies;
  });

  const totalAnimals = animals.length;
  const quarantineCount = animals.filter(a => a.status === 'Quarantine').length;
  const avgWeight = animals.length > 0 
    ? Math.round(animals.reduce((sum, a) => sum + (a.weightKg || 0), 0) / animals.length)
    : 0;

  return (
    <>
      <main className="w-full p-8 min-h-[calc(100vh-64px)]">
        <section className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-extrabold text-on-surface font-manrope tracking-tight mb-2">Livestock Management</h2>
            <p className="text-tertiary font-body leading-relaxed">
              Monitor individual animal health profiles, track breeding lineage, and manage movement logs within the Agrezen ecosystem.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleAddAnimal} className="px-6 py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full font-bold flex items-center gap-2 shadow-lg shadow-primary/10 hover:shadow-primary/20 transition-all active:scale-95">
              <span className="material-symbols-outlined" data-icon="add">add</span>
              <span>Add Animal</span>
            </button>
          </div>
        </section>

        <section className="mb-6 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[300px] flex items-center gap-3 px-5 py-3 bg-surface-container-low rounded-xl border border-outline-variant/10">
            <span className="material-symbols-outlined text-outline">search</span>
            <input 
              className="bg-transparent border-none focus:ring-0 text-sm w-full text-on-surface" 
              placeholder="Search by name, RFID, or breed..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select value={speciesFilter} onChange={e => setSpeciesFilter(e.target.value)} className="px-5 py-3 bg-surface-container-low rounded-xl border border-outline-variant/10 text-sm font-medium">
            <option value="">All Species</option>
            {['Cattle', 'Cow', 'Buffalo', 'Goat', 'Sheep', 'Bird', 'Chicken', 'Duck', 'Other'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </section>

        <div className="bg-surface-container-lowest/70 backdrop-blur-xl rounded-[1.5rem] shadow-sm overflow-hidden border border-outline-variant/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-6 py-5 text-xs font-bold text-outline uppercase tracking-wider font-label">Animal</th>
                  <th className="px-6 py-5 text-xs font-bold text-outline uppercase tracking-wider font-label">RFID ID</th>
                  <th className="px-6 py-5 text-xs font-bold text-outline uppercase tracking-wider font-label">Breed</th>
                  <th className="px-6 py-5 text-xs font-bold text-outline uppercase tracking-wider font-label">Gender</th>
                  <th className="px-6 py-5 text-xs font-bold text-outline uppercase tracking-wider font-label">Weight</th>
                  <th className="px-6 py-5 text-xs font-bold text-outline uppercase tracking-wider font-label">Status</th>
                  <th className="px-6 py-5 text-xs font-bold text-outline uppercase tracking-wider font-label text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {loading ? (
                  <tr><td colSpan="7" className="text-center py-8">Loading animals...</td></tr>
                ) : filteredAnimals.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-8">No animals found.</td></tr>
                ) : (
                  filteredAnimals.map(animal => (
                    <tr key={animal._id} className="group hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-outline shadow-sm">
                            <span className="material-symbols-outlined text-2xl">pets</span>
                          </div>
                          <div>
                            <div className="font-manrope font-bold text-on-surface">{animal.name}</div>
                            <div className="text-xs text-outline font-body">{animal.species}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-on-surface-variant bg-surface-container-high px-2 py-1 rounded">{animal.rfid}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface font-body">{animal.breed || '-'}</td>
                      <td className="px-6 py-4 text-sm text-on-surface font-body">{animal.gender || '-'}</td>
                      <td className="px-6 py-4 text-sm text-on-surface font-body">{animal.weightKg ? `${animal.weightKg} kg` : '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          animal.status === 'Healthy' ? 'bg-green-100 text-green-800' :
                          animal.status === 'Quarantine' ? 'bg-yellow-100 text-yellow-800' :
                          animal.status === 'Sold' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                            {animal.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => handleEditAnimal(animal._id)} className="p-2 text-outline hover:text-primary transition-colors" title="Edit">
                            <span className="material-symbols-outlined">edit</span>
                          </button>
                          <button onClick={() => handleDeleteAnimal(animal._id)} className="p-2 text-outline hover:text-red-500 transition-colors" title="Delete">
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-low p-6 rounded-[1.5rem] relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 opacity-10 text-primary group-hover:scale-110 transition-transform duration-700">
              <span className="material-symbols-outlined text-8xl" data-icon="pets">pets</span>
            </div>
            <h3 className="text-tertiary font-manrope font-bold text-sm mb-2 uppercase tracking-widest">Total Herd Size</h3>
            <div className="text-4xl font-extrabold font-manrope text-on-surface">{totalAnimals}</div>
          </div>
          <div className="bg-surface-container-low p-6 rounded-[1.5rem] relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 opacity-10 text-secondary group-hover:scale-110 transition-transform duration-700">
              <span className="material-symbols-outlined text-8xl" data-icon="medical_services">medical_services</span>
            </div>
            <h3 className="text-tertiary font-manrope font-bold text-sm mb-2 uppercase tracking-widest">Active Quarantine</h3>
            <div className="text-4xl font-extrabold font-manrope text-on-surface">{quarantineCount}</div>
            {quarantineCount > 0 && (
              <div className="mt-2 text-on-secondary-container bg-secondary-container/30 inline-block px-2 py-0.5 rounded text-xs font-bold">
                Requires Attention
              </div>
            )}
          </div>
          <div className="bg-surface-container-low p-6 rounded-[1.5rem] relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 opacity-10 text-tertiary group-hover:scale-110 transition-transform duration-700">
              <span className="material-symbols-outlined text-8xl" data-icon="monitoring">monitoring</span>
            </div>
            <h3 className="text-tertiary font-manrope font-bold text-sm mb-2 uppercase tracking-widest">Avg. Herd Weight</h3>
            <div className="text-4xl font-extrabold font-manrope text-on-surface">{avgWeight}kg</div>
          </div>
        </div>
      </main>

      {showForm && (
        <AnimalForm 
          animalId={editingId} 
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
