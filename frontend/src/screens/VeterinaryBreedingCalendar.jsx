import React, { useState, useEffect } from 'react';
import api from '../api';
import HealthRecordForm from '../components/HealthRecordForm';
import BreedingRecordForm from '../components/BreedingRecordForm';
import Toast from '../components/Toast';
import { downloadCsv } from '../utils/exportCsv';

export default function VeterinaryBreedingCalendar() {
  const [healthRecords, setHealthRecords] = useState([]);
  const [breedingRecords, setBreedingRecords] = useState([]);
  const [breedingStats, setBreedingStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showBreedingForm, setShowBreedingForm] = useState(false);
  const [showVetModal, setShowVetModal] = useState(false);
  const [vetReason, setVetReason] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingBreedingId, setEditingBreedingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [healthRes, breedingRes, statsRes] = await Promise.all([
        api.get('/health'),
        api.get('/breeding'),
        api.get('/breeding/stats'),
      ]);
      setHealthRecords(healthRes.data.data || []);
      setBreedingRecords(breedingRes.data.data || []);
      setBreedingStats(statsRes.data.data || {});
    } catch (error) {
      console.error('Error fetching records:', error);
      setToast({ message: 'Failed to load records', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = () => {
    setEditingId(null);
    setShowForm(true);
  };

  const handleEditRecord = (id) => {
    setEditingId(id);
    setShowForm(true);
  };

  const handleDeleteRecord = async (id) => {
    if (window.confirm('Are you sure you want to delete this health record?')) {
      try {
        await api.delete(`/health/${id}`);
        setToast({ message: 'Health record deleted successfully', type: 'success' });
        fetchAll();
      } catch (error) {
        setToast({ message: 'Failed to delete health record', type: 'error' });
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingId(null);
    setToast({ message: editingId ? 'Health record updated successfully' : 'Health record added successfully', type: 'success' });
    fetchAll();
  };

  const handleBreedingFormSuccess = () => {
    setShowBreedingForm(false);
    setEditingBreedingId(null);
    setToast({ message: 'Breeding record saved successfully', type: 'success' });
    fetchAll();
  };

  const handleDeleteBreeding = async (id) => {
    if (window.confirm('Delete this breeding record?')) {
      try {
        await api.delete(`/breeding/${id}`);
        setToast({ message: 'Breeding record deleted', type: 'success' });
        fetchAll();
      } catch {
        setToast({ message: 'Failed to delete breeding record', type: 'error' });
      }
    }
  };

  const criticalRecords = healthRecords.filter(r => r.status === 'Critical').length;
  const pendingCheckups = healthRecords.filter(r => r.status === 'Under Treatment').length;
  const vaccinationsDue = healthRecords.filter(r => r.recordType === 'Vaccination' && r.status !== 'Completed').length;

  const handleDownloadMedicalHistory = async () => {
    try {
      const res = await api.get('/health/export');
      const rows = res.data.data || [];
      downloadCsv(`medical-history-${new Date().toISOString().split('T')[0]}.csv`, rows, [
        { key: 'date', label: 'Date' }, { key: 'animal', label: 'Animal' },
        { key: 'rfid', label: 'RFID' }, { key: 'species', label: 'Species' },
        { key: 'recordType', label: 'Type' }, { key: 'diagnosis', label: 'Diagnosis' },
        { key: 'treatment', label: 'Treatment' }, { key: 'status', label: 'Status' },
        { key: 'veterinarian', label: 'Veterinarian' }, { key: 'notes', label: 'Notes' },
      ]);
      setToast({ message: 'Medical history downloaded', type: 'success' });
    } catch {
      setToast({ message: 'Failed to export medical history', type: 'error' });
    }
  };

  const handleRequestVet = async (e) => {
    e.preventDefault();
    if (!vetReason) return;
    try {
      // Assuming you have an endpoint or just mock it
      await new Promise(r => setTimeout(r, 500));
      setToast({ message: 'Vet visit requested successfully. They will contact you shortly.', type: 'success' });
      setShowVetModal(false);
      setVetReason('');
    } catch {
      setToast({ message: 'Failed to request vet', type: 'error' });
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const days = getDaysInMonth(currentDate);

  const getEventsForDay = (day) => {
    if (!day) return [];
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
    
    const events = [];
    
    healthRecords.forEach(r => {
      if (r.date && new Date(r.date).toDateString() === checkDate) {
        events.push({ type: 'health', text: `${r.recordType}: ${r.animalId?.name}` });
      }
    });

    breedingRecords.forEach(r => {
      if (r.expectedBirthDate && new Date(r.expectedBirthDate).toDateString() === checkDate) {
        events.push({ type: 'birth', text: `Delivery Due: ${r.animalId?.name}` });
      }
    });

    return events;
  };

  return (
    <>
      <main className="w-full min-h-full">
        <div className="p-8 space-y-8 ">
          {/* Hero Data Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-surface-container-low p-6 rounded-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-6xl" data-icon="event_note">event_note</span>
              </div>
              <p className="text-sm font-label text-tertiary font-semibold uppercase tracking-wider">Active Cycles</p>
              <h3 className="text-3xl font-headline font-extrabold mt-1">{breedingStats.activeCycles ?? 0}</h3>
              <p className="text-xs text-on-surface-variant mt-2 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-primary" data-icon="trending_up">trending_up</span>
                +2 from last month
              </p>
            </div>
            <div className="bg-surface-container-low p-6 rounded-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-6xl" data-icon="medical_information">medical_information</span>
              </div>
              <p className="text-sm font-label text-tertiary font-semibold uppercase tracking-wider">Upcoming Births</p>
              <h3 className="text-3xl font-headline font-extrabold mt-1">{breedingStats.upcomingBirths ?? 0}</h3>
              <p className="text-xs text-on-surface-variant mt-2">
                {breedingStats.nextDueAnimal ? `Next: ${breedingStats.nextDueAnimal}` : 'No upcoming births'}
              </p>
            </div>
            <div className="bg-surface-container-low p-6 rounded-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-6xl" data-icon="vaccines">vaccines</span>
              </div>
              <p className="text-sm font-label text-tertiary font-semibold uppercase tracking-wider">Vaccinations Due</p>
              <h3 className="text-3xl font-headline font-extrabold mt-1">{vaccinationsDue}</h3>
              <div className="w-full bg-surface-container-highest h-1.5 rounded-full mt-4">
                <div className="bg-primary w-[65%] h-full rounded-full"></div>
              </div>
            </div>
            <div className="bg-surface-container-low p-6 rounded-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-6xl" data-icon="stethoscope">stethoscope</span>
              </div>
              <p className="text-sm font-label text-tertiary font-semibold uppercase tracking-wider">Pending Checkups</p>
              <h3 className="text-3xl font-headline font-extrabold mt-1">{pendingCheckups}</h3>
              {criticalRecords > 0 && (
                <p className="text-xs text-error font-medium mt-2">⚠ {criticalRecords} Critical issues</p>
              )}
            </div>
          </div>

          {/* Main Interactive Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar View */}
            <div className="lg:col-span-2 glass-card rounded-[1.5rem] p-8 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h4 className="font-headline text-2xl font-bold">
                    {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
                  </h4>
                  <p className="text-on-surface-variant text-sm">Breeding &amp; Health Calendar</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={prevMonth} className="p-2 hover:bg-surface-container transition-colors rounded-full material-symbols-outlined" data-icon="chevron_left">chevron_left</button>
                  <button onClick={nextMonth} className="p-2 hover:bg-surface-container transition-colors rounded-full material-symbols-outlined" data-icon="chevron_right">chevron_right</button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-px bg-outline-variant/10 rounded-xl overflow-hidden border border-outline-variant/10">
                {/* Days Header */}
                <div className="bg-surface-container-low p-3 text-center text-xs font-bold uppercase text-on-surface-variant">Sun</div>
                <div className="bg-surface-container-low p-3 text-center text-xs font-bold uppercase text-on-surface-variant">Mon</div>
                <div className="bg-surface-container-low p-3 text-center text-xs font-bold uppercase text-on-surface-variant">Tue</div>
                <div className="bg-surface-container-low p-3 text-center text-xs font-bold uppercase text-on-surface-variant">Wed</div>
                <div className="bg-surface-container-low p-3 text-center text-xs font-bold uppercase text-on-surface-variant">Thu</div>
                <div className="bg-surface-container-low p-3 text-center text-xs font-bold uppercase text-on-surface-variant">Fri</div>
                <div className="bg-surface-container-low p-3 text-center text-xs font-bold uppercase text-on-surface-variant">Sat</div>
                {/* Calendar Grid Dynamic */}
                {days.map((day, idx) => {
                  if (!day) return <div key={`empty-${idx}`} className="bg-white p-4 h-32"></div>;
                  const events = getEventsForDay(day);
                  return (
                    <div key={`day-${day}`} className={`bg-white p-2 h-32 overflow-y-auto ${events.length > 0 ? 'bg-primary-container/5' : ''}`}>
                      <div className="text-xs font-bold mb-1">{day}</div>
                      {events.map((e, i) => (
                        <div key={i} className={`mb-1 p-1 rounded text-[10px] leading-tight border-l-2 ${
                          e.type === 'birth' ? 'bg-primary-container text-on-primary-container border-primary' :
                          'bg-secondary-container text-on-secondary-container border-secondary'
                        }`}>
                          {e.text}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Side Column */}
            <div className="space-y-6">
              <div className="bg-surface-container-low rounded-[1.5rem] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-headline text-xl font-bold">Vaccination Reminders</h4>
                  <span className="material-symbols-outlined text-primary" data-icon="notifications_active">notifications_active</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-white/50 rounded-xl hover:bg-white transition-colors cursor-pointer group">
                    <div className="w-6 h-6 rounded border-2 border-primary mt-0.5 flex items-center justify-center group-hover:bg-primary/10">
                      <span className="material-symbols-outlined text-xs text-primary hidden group-hover:block" data-icon="check">check</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm">Bovine Viral Diarrhea (BVD)</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">Target: Herd A • Due Today</p>
                    </div>
                  </div>
                </div>
              <button onClick={handleAddRecord} className="w-full mt-6 py-2 text-primary font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary-container/10 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-sm" data-icon="add">add</span> Add Health Record
                </button>
              </div>

              {/* Quick Action Card */}
              <div className="bg-gradient-to-br from-primary to-primary-container p-6 rounded-[1.5rem] text-white shadow-lg">
                <h5 className="font-headline font-bold text-lg leading-tight">Need an urgent vet consultation?</h5>
                <p className="text-xs text-primary-fixed-dim mt-2 leading-relaxed">Instantly book a certified specialist for on-site diagnosis.</p>
                <button onClick={() => setShowVetModal(true)} className="mt-6 w-full py-3 bg-white text-primary rounded-xl font-bold text-sm hover:shadow-xl transition-all active:scale-95">
                  Request Vet Visit
                </button>
              </div>
            </div>
          </div>

          {/* Breeding Records */}
          <div className="bg-surface-container-low rounded-[1.5rem] p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h4 className="font-headline text-2xl font-bold">Breeding Records</h4>
                <p className="text-on-surface-variant text-sm">Heat cycles, pregnancy tracking, and offspring registration</p>
              </div>
              <button onClick={() => { setEditingBreedingId(null); setShowBreedingForm(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full text-sm font-bold hover:opacity-90">
                <span className="material-symbols-outlined text-sm">add</span> Add Breeding Record
              </button>
            </div>
            {loading ? (
              <div className="py-8 text-center text-on-surface-variant">Loading breeding records...</div>
            ) : breedingRecords.length === 0 ? (
              <div className="py-8 text-center text-on-surface-variant">No breeding records yet. Add one to start tracking.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      <th className="pb-4 px-4">Animal</th>
                      <th className="pb-4 px-4">Partner</th>
                      <th className="pb-4 px-4">Status</th>
                      <th className="pb-4 px-4">Expected Birth</th>
                      <th className="pb-4 px-4">Notes</th>
                      <th className="pb-4 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {breedingRecords.map(r => (
                      <tr key={r._id} className="hover:bg-white/60 transition-colors">
                        <td className="py-4 px-4 font-bold text-primary border-t border-outline-variant/10">{r.animalId?.name || '—'}</td>
                        <td className="py-4 px-4 border-t border-outline-variant/10">{r.partnerAnimalId?.name || '—'}</td>
                        <td className="py-4 px-4 border-t border-outline-variant/10">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            r.status === 'Pregnant' ? 'bg-green-100 text-green-800' :
                            r.status === 'Heat Alert' ? 'bg-orange-100 text-orange-800' :
                            r.status === 'Delivered' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>{r.status}</span>
                        </td>
                        <td className="py-4 px-4 border-t border-outline-variant/10">
                          {r.expectedBirthDate ? new Date(r.expectedBirthDate).toLocaleDateString() : '—'}
                        </td>
                        <td className="py-4 px-4 border-t border-outline-variant/10 text-on-surface-variant">{r.notes || '—'}</td>
                        <td className="py-4 px-4 border-t border-outline-variant/10">
                          <div className="flex gap-2">
                            <button onClick={() => { setEditingBreedingId(r._id); setShowBreedingForm(true); }} className="material-symbols-outlined hover:text-primary text-sm">edit</button>
                            <button onClick={() => handleDeleteBreeding(r._id)} className="material-symbols-outlined hover:text-red-500 text-sm">delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Treatment Logs Table */}
          <div className="bg-surface-container-low rounded-[1.5rem] p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h4 className="font-headline text-2xl font-bold">Treatment Logs</h4>
                <p className="text-on-surface-variant text-sm">Historical record of medical interventions</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-surface rounded-full text-sm font-bold text-primary border border-primary/20 hover:bg-primary-container/10 transition-colors">
                <span className="material-symbols-outlined text-sm" data-icon="filter_list">filter_list</span> Filter Logs
              </button>
            </div>

            {loading ? (
              <div className="py-8 text-center text-on-surface-variant">Loading health records...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      <th className="pb-4 px-4 font-bold">Date</th>
                      <th className="pb-4 px-4 font-bold">Animal</th>
                      <th className="pb-4 px-4 font-bold">Type</th>
                      <th className="pb-4 px-4 font-bold">Diagnosis</th>
                      <th className="pb-4 px-4 font-bold">Status</th>
                      <th className="pb-4 px-4 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {healthRecords.map((record) => (
                      <tr key={record._id} className="hover:bg-white/60 transition-colors group">
                        <td className="py-4 px-4 font-medium border-t border-outline-variant/10">
                          {record.date ? new Date(record.date).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="py-4 px-4 font-bold text-primary border-t border-outline-variant/10">
                          {record.animalId?.name || 'Unknown'}
                        </td>
                        <td className="py-4 px-4 border-t border-outline-variant/10">
                          {record.recordType || 'Checkup'}
                        </td>
                        <td className="py-4 px-4 border-t border-outline-variant/10">
                          {record.diagnosis || '-'}
                        </td>
                        <td className="py-4 px-4 border-t border-outline-variant/10">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            record.status === 'Critical' ? 'bg-red-100 text-red-800' :
                            record.status === 'Under Treatment' ? 'bg-yellow-100 text-yellow-800' :
                            record.status === 'Recovered' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 border-t border-outline-variant/10">
                          <div className="flex gap-2">
                            <button onClick={() => handleEditRecord(record._id)} className="material-symbols-outlined hover:text-primary text-sm" title="Edit">edit</button>
                            <button onClick={() => handleDeleteRecord(record._id)} className="material-symbols-outlined hover:text-red-500 text-sm" title="Delete">delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <button onClick={handleDownloadMedicalHistory} className="px-6 py-2 bg-primary text-white font-bold rounded-full text-sm shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 mx-auto">
                <span className="material-symbols-outlined text-sm">download</span>
                Download Full Medical History
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Contextual FAB */}
      <button onClick={handleAddRecord} className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-green-800 to-green-600 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-95 duration-150 z-50">
        <span className="material-symbols-outlined" data-icon="add">add</span>
      </button>

      {showBreedingForm && (
        <BreedingRecordForm
          recordId={editingBreedingId}
          onSuccess={handleBreedingFormSuccess}
          onCancel={() => { setShowBreedingForm(false); setEditingBreedingId(null); }}
        />
      )}

      {showForm && (
        <HealthRecordForm 
          recordId={editingId} 
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

      {showVetModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-primary to-primary-container p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-headline font-bold text-xl">Request Vet Visit</h3>
                <p className="text-sm opacity-80 mt-1">Book an expert for on-site checkup</p>
              </div>
              <button onClick={() => setShowVetModal(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors material-symbols-outlined">close</button>
            </div>
            <form onSubmit={handleRequestVet} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Veterinarian</label>
                <select className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option value="">Any Available Specialist</option>
                  <option value="dr_smith">Dr. Smith (Livestock)</option>
                  <option value="dr_jones">Dr. Jones (Poultry)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for visit</label>
                <textarea 
                  required
                  value={vetReason}
                  onChange={(e) => setVetReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50" 
                  rows="4" 
                  placeholder="Describe the symptoms or reason for the visit..."
                ></textarea>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowVetModal(false)} className="flex-1 py-3 text-gray-700 bg-gray-100 rounded-xl font-bold hover:bg-gray-200 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
