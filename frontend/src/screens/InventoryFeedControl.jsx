import React, { useState, useEffect } from 'react';
import api from '../api';
import InventoryForm from '../components/InventoryForm';
import AnimalGroupForm from '../components/AnimalGroupForm';
import Toast from '../components/Toast';
import { downloadJsonAsFile } from '../utils/exportCsv';

export default function InventoryFeedControl() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [animalGroups, setAnimalGroups] = useState([]);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [adjustments, setAdjustments] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchInventory();
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await api.get('/animal-groups');
      setAnimalGroups(res.data.data || []);
    } catch (e) { console.error(e); }
  };

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await api.get('/inventory');
      if (response.data.success) {
        setInventory(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setToast({ message: 'Failed to load inventory', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = () => {
    setEditingId(null);
    setShowForm(true);
  };

  const handleEditItem = (id) => {
    setEditingId(id);
    setShowForm(true);
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      try {
        await api.delete(`/inventory/${id}`);
        setToast({ message: 'Item deleted successfully', type: 'success' });
        fetchInventory();
      } catch (error) {
        setToast({ message: 'Failed to delete item', type: 'error' });
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingId(null);
    setToast({ message: editingId ? 'Item updated successfully' : 'Item added successfully', type: 'success' });
    fetchInventory();
  };

  const filteredInventory = inventory.filter(item => {
    const matchSearch = item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = !categoryFilter || item.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const expiringCount = inventory.filter(i => i.expiryDate && new Date(i.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length;

  const handleGenerateReport = async () => {
    try {
      const res = await api.get('/animal-groups/report');
      downloadJsonAsFile(`inventory-report-${new Date().toISOString().split('T')[0]}.json`, res.data.data);
      setToast({ message: 'Inventory report downloaded', type: 'success' });
    } catch {
      setToast({ message: 'Failed to generate report', type: 'error' });
    }
  };

  const handleAutoAdjust = async () => {
    try {
      const res = await api.post('/animal-groups/auto-adjust');
      setAdjustments(res.data.data || []);
      if (res.data.data?.length === 0) {
        setToast({ message: 'All feed stocks are sufficient for current groups', type: 'success' });
      }
    } catch {
      setToast({ message: 'Failed to check feed levels', type: 'error' });
    }
  };

  const handleDeleteGroup = async (id) => {
    if (!window.confirm('Delete this animal group?')) return;
    try {
      await api.delete(`/animal-groups/${id}`);
      setToast({ message: 'Group deleted', type: 'success' });
      fetchGroups();
    } catch {
      setToast({ message: 'Failed to delete group', type: 'error' });
    }
  };

  const totalQuantity = inventory.reduce((acc, item) => acc + (item.quantityKg || 0), 0);
  const lowWarningCount = inventory.filter(item => item.quantityKg <= (item.reorderLevel || 0)).length;

  return (
    <>
      <main className="w-full min-h-full">
        <div className="p-8 space-y-8">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <h2 className="text-4xl font-extrabold font-manrope tracking-tight text-on-surface">Inventory & Feed Control</h2>
              <p className="text-tertiary font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary-fixed shadow-[0_0_12px_#94f990]"></span>
                Live system status: All monitors active
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={handleGenerateReport} className="px-6 py-2.5 rounded-full outline outline-1 outline-primary/20 text-primary font-bold text-sm hover:bg-primary/5 transition-all">
                Generate Report
              </button>
              <button onClick={handleAddItem} className="px-6 py-2.5 rounded-full signature-gradient text-white font-bold text-sm shadow-lg shadow-green-900/10 hover:opacity-90 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-sm" data-icon="add">add</span>
                Log New Stock
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-8 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                <span className="material-symbols-outlined text-9xl text-primary" data-icon="warehouse">warehouse</span>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-primary-container/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary" data-icon="grass" style={{ "fontVariationSettings": "\"FILL\" 1" }}>grass</span>
                </div>
                <div>
                  <p className="text-on-surface-variant font-medium text-sm">Total Feed Stock</p>
                  <h3 className="text-4xl font-extrabold font-manrope tracking-tight mt-1">{totalQuantity.toLocaleString()} <span className="text-lg font-bold text-on-surface-variant">kg</span></h3>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2 text-primary text-xs font-bold bg-primary/5 w-fit px-3 py-1 rounded-full">
                <span className="material-symbols-outlined text-xs" data-icon="trending_up">trending_up</span>
                Live Sync
              </div>
            </div>

            <div className="glass-card p-8 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col justify-between bg-secondary-container/10">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary-container/40 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary" data-icon="warning" style={{ "fontVariationSettings": "\"FILL\" 1" }}>warning</span>
                </div>
                <div>
                  <p className="text-on-surface-variant font-medium text-sm">Low Warning Items</p>
                  <h3 className="text-4xl font-extrabold font-manrope tracking-tight mt-1 text-secondary">{lowWarningCount < 10 ? `0${lowWarningCount}` : lowWarningCount} <span className="text-lg font-bold">SKUs</span></h3>
                </div>
              </div>
              <p className="mt-6 text-on-surface-variant text-xs leading-relaxed">Items requiring immediate reorder to prevent supply chain disruption.</p>
            </div>

            <div className="glass-card p-8 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-tertiary-container/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-tertiary" data-icon="alarm" style={{ "fontVariationSettings": "\"FILL\" 1" }}>alarm</span>
                </div>
                <div>
                  <p className="text-on-surface-variant font-medium text-sm">Medicine Expiring Soon</p>
                  <h3 className="text-4xl font-extrabold font-manrope tracking-tight mt-1">{expiringCount < 10 ? `0${expiringCount}` : expiringCount} <span className="text-lg font-bold text-on-surface-variant">batches</span></h3>
                </div>
              </div>
              <button className="mt-6 text-tertiary text-xs font-bold flex items-center hover:underline">
                View Schedule <span className="material-symbols-outlined text-xs ml-1" data-icon="arrow_forward">arrow_forward</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 glass-card rounded-xl p-8 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h4 className="text-xl font-extrabold font-manrope">Feed Inventory Status</h4>
                <div className="flex gap-2 items-center">
                  <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="px-3 py-1.5 border rounded-lg text-sm" />
                  <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-3 py-1.5 border rounded-lg text-sm">
                    <option value="">All Types</option>
                    {[...new Set(inventory.map(i => i.category))].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                      <th className="pb-6">Item Name</th>
                      <th className="pb-6">Category</th>
                      <th className="pb-6">Stock Level</th>
                      <th className="pb-6">Status</th>
                      <th className="pb-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-low">
                    {loading ? (
                      <tr><td colSpan="5" className="text-center py-8">Loading inventory...</td></tr>
                    ) : filteredInventory.length === 0 ? (
                      <tr><td colSpan="5" className="text-center py-8">No inventory items found.</td></tr>
                    ) : (
                      filteredInventory.map(item => {
                        const isLow = item.quantityKg <= item.reorderLevel;
                        const percentage = Math.min(100, Math.round((item.quantityKg / (item.reorderLevel * 3)) * 100));
                        return (
                          <tr key={item._id} className="group hover:bg-surface-container-low transition-colors duration-200">
                            <td className="py-5 pr-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg ${isLow ? 'bg-secondary-container/20' : 'bg-primary-container/10'} flex items-center justify-center`}>
                                  <span className={`material-symbols-outlined ${isLow ? 'text-secondary' : 'text-primary'}`} data-icon="eco">eco</span>
                                </div>
                                <span className="font-bold text-on-surface">{item.itemName}</span>
                              </div>
                            </td>
                            <td className="py-5 text-sm text-on-surface-variant">{item.category}</td>
                            <td className="py-5 min-w-[150px]">
                              <div className="flex flex-col gap-2">
                                <div className="flex justify-between text-[10px] font-bold text-on-surface-variant">
                                  <span>{percentage}%</span>
                                  <span>{item.quantityKg}kg</span>
                                </div>
                                <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                                  <div className={`h-full ${isLow ? 'bg-secondary' : 'bg-primary'} rounded-full`} style={{ "width": `${percentage}%` }}></div>
                                </div>
                              </div>
                            </td>
                            <td className="py-5">
                              {isLow ? (
                                <span className="bg-secondary/10 text-secondary text-[10px] font-bold px-2 py-1 rounded-full uppercase">Low</span>
                              ) : (
                                <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-full uppercase">Good</span>
                              )}
                            </td>
                            <td className="py-5 text-right">
                              <div className="flex gap-2 justify-end">
                                <button onClick={() => handleEditItem(item._id)} className="p-1 text-outline hover:text-primary transition-colors" title="Edit">
                                  <span className="material-symbols-outlined text-sm">edit</span>
                                </button>
                                <button onClick={() => handleDeleteItem(item._id)} className="p-1 text-outline hover:text-red-500 transition-colors" title="Delete">
                                  <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Diet Planning (Right/Small) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="glass-card rounded-xl p-8 shadow-sm border-l-4 border-primary">
                <h4 className="text-xl font-extrabold font-manrope mb-6">Diet Planning — Animal Groups</h4>
                <div className="space-y-4">
                  {animalGroups.length === 0 ? (
                    <p className="text-sm text-on-surface-variant">No animal groups yet. Add a group to plan feed diets.</p>
                  ) : animalGroups.map(group => (
                    <div key={group._id} className="p-4 bg-surface-container-low rounded-xl">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-sm font-bold">{group.name}</p>
                          <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">{group.species || 'Mixed'} · {group.animalCount} animals</p>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => { setEditingGroupId(group._id); setShowGroupForm(true); }} className="text-primary hover:bg-primary/5 p-1 rounded"><span className="material-symbols-outlined text-sm">edit</span></button>
                          <button onClick={() => handleDeleteGroup(group._id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><span className="material-symbols-outlined text-sm">delete</span></button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-tertiary text-lg">grain</span>
                          <span className="text-xs font-medium">{group.feedItemName || 'No feed assigned'}</span>
                        </div>
                        <span className="text-sm font-bold">{group.dailyFeedKg}kg/day</span>
                      </div>
                    </div>
                  ))}
                  <button onClick={() => { setEditingGroupId(null); setShowGroupForm(true); }} className="w-full py-3 border-2 border-dashed border-outline-variant rounded-xl text-on-surface-variant font-bold text-xs hover:bg-surface-container-high transition-all">
                    + Add Animal Group
                  </button>
                </div>
              </div>
              <div className="bg-primary text-white rounded-xl p-8 relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                  <h5 className="font-manrope font-extrabold text-lg">Feed Stock Check</h5>
                  <p className="text-sm text-primary-fixed/80 leading-relaxed">Check if current feed inventory can support all animal groups for the next 7 days.</p>
                  <button onClick={handleAutoAdjust} className="bg-white text-primary px-6 py-2 rounded-full font-bold text-xs active:scale-95 transition-all">
                    Check &amp; Adjust
                  </button>
                  {adjustments && adjustments.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {adjustments.map((a, i) => (
                        <p key={i} className="text-xs bg-white/20 p-2 rounded-lg">{a.recommendation}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* FAB for quick action */}
      <button onClick={handleAddItem} className="fixed bottom-8 right-8 signature-gradient text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform group">
        <span className="material-symbols-outlined text-3xl group-hover:rotate-90 transition-transform" data-icon="add_circle">add_circle</span>
      </button>

      {showGroupForm && (
        <AnimalGroupForm groupId={editingGroupId} onSuccess={() => { setShowGroupForm(false); setEditingGroupId(null); setToast({ message: 'Group saved', type: 'success' }); fetchGroups(); }} onCancel={() => { setShowGroupForm(false); setEditingGroupId(null); }} />
      )}

      {showForm && (
        <InventoryForm
          itemId={editingId}
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
