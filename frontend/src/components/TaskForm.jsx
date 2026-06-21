import React, { useState, useEffect } from 'react';
import api from '../api';
import DateInput from './DateInput';

export default function TaskForm({ taskId, onSuccess, onCancel }) {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    assignedTo: '',
    dueDate: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/employees').then(res => setEmployees(res.data.data || [])).catch(console.error);
    if (taskId) {
      api.get(`/tasks/${taskId}`).then(res => {
        const t = res.data.data;
        setForm({
          title: t.title || '',
          description: t.description || '',
          status: t.status || 'To Do',
          priority: t.priority || 'Medium',
          assignedTo: t.assignedTo?._id || t.assignedTo || '',
          dueDate: t.dueDate ? new Date(t.dueDate).toISOString().split('T')[0] : '',
          notes: t.notes || '',
        });
      }).catch(() => setError('Failed to load task'));
    }
  }, [taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = { ...form, dueDate: form.dueDate || undefined };
      if (taskId) await api.put(`/tasks/${taskId}`, payload);
      else await api.post('/tasks', payload);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">{taskId ? 'Edit Task' : 'Assign Task'}</h2>
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Task Title (e.g. Morning Milking Shift)" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <textarea placeholder="Task description and instructions..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <select value={form.assignedTo} onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">Assign to Employee</option>
            {employees.filter(e => e.status === 'Active').map(e => (
              <option key={e._id} value={e._id}>{e.name} — {e.role}</option>
            ))}
          </select>
          <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
          <DateInput label="Due Date" name="dueDate" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
          {taskId && (
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          )}
          <textarea placeholder="Additional notes or reminders..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={loading} className="flex-1 bg-primary text-white py-2 rounded-lg font-bold disabled:opacity-50">{loading ? 'Saving...' : 'Save'}</button>
            <button type="button" onClick={onCancel} className="flex-1 bg-gray-200 py-2 rounded-lg font-bold">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
