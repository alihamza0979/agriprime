import React, { useState, useEffect } from 'react';
import api from '../api';
import DateInput from './DateInput';

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

export default function EmployeeForm({ employeeId, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Worker',
    department: 'Livestock',
    cnic: '',
    salaryPKR: '',
    joiningDate: '',
    status: 'Active',
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (employeeId) {
      const fetchEmployee = async () => {
        try {
          const res = await api.get(`/employees/${employeeId}`);
          const emp = res.data.data;
          setFormData({
            name: emp.name || '',
            email: emp.email || '',
            phone: emp.phone || '',
            role: emp.role || 'Worker',
            department: emp.department || 'Livestock',
            cnic: emp.cnic || '',
            salaryPKR: emp.salaryPKR || '',
            joiningDate: emp.joiningDate ? new Date(emp.joiningDate).toISOString().split('T')[0] : '',
            status: emp.status || 'Active',
            imageUrl: emp.imageUrl || '',
          });
        } catch {
          setError('Failed to load employee data');
        }
      };
      fetchEmployee();
    }
  }, [employeeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, or WebP)');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError('Image must be smaller than 2 MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ ...prev, imageUrl: reader.result }));
      setError('');
    };
    reader.onerror = () => setError('Failed to read image file');
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      ...formData,
      salaryPKR: Number(formData.salaryPKR),
      joiningDate: formData.joiningDate || undefined,
      imageUrl: formData.imageUrl || undefined,
    };

    try {
      if (employeeId) {
        await api.put(`/employees/${employeeId}`, payload);
      } else {
        await api.post('/employees', payload);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">{employeeId ? 'Edit Employee' : 'Add Employee'}</h2>
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center gap-3 pb-2">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center border-2 border-dashed border-primary/30">
              {formData.imageUrl ? (
                <img src={formData.imageUrl} alt="Employee preview" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-4xl text-primary/60">person</span>
              )}
            </div>
            <div className="flex gap-2">
              <label className="cursor-pointer px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-semibold hover:bg-primary/20 transition-colors">
                Upload Photo
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="hidden" />
              </label>
              {formData.imageUrl && (
                <button type="button" onClick={handleRemoveImage} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-200">
                  Remove
                </button>
              )}
            </div>
            <p className="text-xs text-gray-400">JPG, PNG or WebP · Max 2 MB</p>
          </div>

          <input type="text" name="name" placeholder="Full Name (e.g. Ali Hassan)" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="email" name="email" placeholder="Work Email (required for login access)" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="tel" name="phone" placeholder="Phone Number (e.g. 0300-1234567)" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="text" name="cnic" placeholder="CNIC / ID Number (e.g. 35202-1234567-1)" value={formData.cnic} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />

          <select name="role" value={formData.role} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="Worker">Worker</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Manager">Manager</option>
            <option value="Veterinarian">Veterinarian</option>
            <option value="Chief Veterinarian">Chief Veterinarian</option>
            <option value="Driver">Driver</option>
            <option value="Analyst">Analyst</option>
          </select>

          <select name="department" value={formData.department} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="Livestock">Livestock</option>
            <option value="Veterinary">Veterinary</option>
            <option value="Logistics">Logistics</option>
            <option value="Agronomy">Agronomy</option>
            <option value="General">General</option>
          </select>

          <input type="number" name="salaryPKR" placeholder="Monthly Salary in PKR (e.g. 45000)" value={formData.salaryPKR} onChange={handleChange} required min="0" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
          <DateInput label="Joining Date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} />

          <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Terminated">Terminated</option>
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
