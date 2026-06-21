import React, { useState, useEffect } from 'react';
import api from '../api';
import EmployeeForm from '../components/EmployeeForm';
import TaskForm from '../components/TaskForm';
import Toast from '../components/Toast';

const COLUMNS = ['To Do', 'In Progress', 'Done'];

export default function HRWorkerProfileDashboard() {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [toast, setToast] = useState(null);
  const [credentials, setCredentials] = useState(null);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [empRes, taskRes] = await Promise.all([api.get('/employees'), api.get('/tasks')]);
      setEmployees(empRes.data.data || []);
      setTasks(taskRes.data.data || []);
    } catch {
      setToast({ message: 'Failed to load HR data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm('Delete this employee?')) return;
    try {
      await api.delete(`/employees/${id}`);
      setToast({ message: 'Employee deleted', type: 'success' });
      fetchAll();
    } catch {
      setToast({ message: 'Failed to delete employee', type: 'error' });
    }
  };

  const handleGenerateCredentials = async (emp) => {
    if (!emp.email) {
      setToast({ message: 'Add an email address to this employee before generating login credentials', type: 'error' });
      setEditingId(emp._id);
      setShowForm(true);
      return;
    }
    try {
      const res = await api.post(`/employees/${emp._id}/credentials`, {});
      if (!res.data?.data?.password) {
        throw new Error('Invalid response from server');
      }
      setCredentials(res.data.data);
      setToast({ message: 'Login credentials generated', type: 'success' });
      fetchAll();
    } catch (err) {
      setToast({ message: err.response?.data?.message || err.message || 'Failed to generate credentials', type: 'error' });
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      setToast({ message: 'Task deleted', type: 'success' });
      fetchAll();
    } catch {
      setToast({ message: 'Failed to delete task', type: 'error' });
    }
  };

  const moveTask = async (taskId, newStatus) => {
    try {
      const progress = newStatus === 'Done' ? 100 : newStatus === 'In Progress' ? 50 : 0;
      await api.put(`/tasks/${taskId}/progress`, { status: newStatus, progress });
      fetchAll();
    } catch {
      setToast({ message: 'Failed to update task', type: 'error' });
    }
  };

  return (
    <>
      <main className="w-full min-h-full">
        <div className="p-10 space-y-12">
          {/* Credentials modal */}
          {credentials && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full">
                <h3 className="text-xl font-bold mb-4">Employee Login Credentials</h3>
                <div className="bg-green-50 p-4 rounded-xl space-y-2 mb-6 font-mono text-sm">
                  <p><strong>Email:</strong> {credentials.email}</p>
                  <p><strong>Password:</strong> {credentials.password}</p>
                  <p><strong>Role:</strong> {credentials.role}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(`Email: ${credentials.email}\nPassword: ${credentials.password}`);
                    setToast({ message: 'Credentials copied to clipboard', type: 'success' });
                  }}
                  className="w-full py-2 mb-3 border border-primary text-primary rounded-xl font-semibold text-sm hover:bg-primary/5"
                >
                  Copy Credentials
                </button>
                <p className="text-sm text-gray-500 mb-4">Share these credentials securely with the employee. They can log in at /login and access their worker portal.</p>
                <button onClick={() => setCredentials(null)} className="w-full py-3 bg-primary text-white rounded-xl font-bold">Close</button>
              </div>
            </div>
          )}

          {/* Employee Directory */}
          <section>
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight">All Personnel</h2>
                <p className="text-tertiary mt-1 font-medium">Managing {employees.length} contributors.</p>
              </div>
              <button onClick={() => { setEditingId(null); setShowForm(true); }} className="bg-gradient-to-br from-primary to-primary-container text-white px-6 py-3 rounded-full font-headline font-bold flex items-center gap-2 shadow-lg">
                <span className="material-symbols-outlined">person_add</span> Add Employee
              </button>
            </div>
            {loading ? (
              <div className="text-center py-10">Loading personnel...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {employees.map(emp => (
                  <div key={emp._id} className="glass-card p-6 rounded-xl border border-outline-variant/10 group hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center font-bold text-2xl text-primary shrink-0">
                        {emp.imageUrl ? (
                          <img src={emp.imageUrl} alt={emp.name} className="w-full h-full object-cover" />
                        ) : (
                          emp.name?.charAt(0) || 'E'
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => { setEditingId(emp._id); setShowForm(true); }} className="p-1 text-outline hover:text-primary" title="Edit"><span className="material-symbols-outlined text-sm">edit</span></button>
                        <button onClick={() => handleDeleteEmployee(emp._id)} className="p-1 text-outline hover:text-red-500" title="Delete"><span className="material-symbols-outlined text-sm">delete</span></button>
                      </div>
                    </div>
                    <h3 className="text-lg font-headline font-bold text-on-surface">{emp.name}</h3>
                    <p className="text-on-surface-variant text-sm mb-1">{emp.role} · {emp.department}</p>
                    {emp.hasLogin ? (
                      <span className="text-xs text-green-600 font-semibold">✓ Login active</span>
                    ) : (
                      <button onClick={() => handleGenerateCredentials(emp)} className="text-xs text-primary font-bold hover:underline mt-1">
                        Generate Login
                      </button>
                    )}
                    <div className="space-y-2 pt-4 mt-3 border-t border-outline-variant/10">
                      {emp.email && <p className="text-xs text-on-surface-variant">{emp.email}</p>}
                      {emp.phone && <p className="text-xs text-on-surface-variant">{emp.phone}</p>}
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${emp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{emp.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Task Board */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <h2 className="text-3xl font-headline font-extrabold text-on-surface tracking-tight">Task Assignment Board</h2>
                <div className="h-px flex-1 bg-surface-container-highest hidden lg:block"></div>
              </div>
              <button onClick={() => { setEditingTaskId(null); setShowTaskForm(true); }} className="px-5 py-2.5 bg-primary text-white rounded-full font-bold text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">add</span> Assign Task
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {COLUMNS.map(col => {
                const colTasks = tasks.filter(t => t.status === col);
                return (
                  <div key={col} className="space-y-4">
                    <div className="flex items-center justify-between px-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${col === 'Done' ? 'bg-green-500' : col === 'In Progress' ? 'bg-blue-500' : 'bg-orange-500'}`}></span>
                        <h3 className="font-headline font-bold text-on-surface-variant uppercase tracking-widest text-xs">{col}</h3>
                      </div>
                      <span className="bg-surface-container-high px-2 py-0.5 rounded text-[10px] font-bold">{colTasks.length}</span>
                    </div>
                    <div className="space-y-3">
                      {colTasks.map(task => (
                        <div key={task._id} className="bg-surface-container-low p-5 rounded-2xl border-l-4 border-primary/30 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-headline font-bold text-on-surface text-sm">{task.title}</h4>
                            <button onClick={() => handleDeleteTask(task._id)} className="text-outline hover:text-red-500"><span className="material-symbols-outlined text-sm">delete</span></button>
                          </div>
                          {task.description && <p className="text-xs text-on-surface-variant mb-2">{task.description}</p>}
                          <p className="text-xs text-on-surface-variant mb-3">
                            {task.assignedTo?.name || 'Unassigned'} · {task.priority}
                            {task.dueDate && ` · Due ${new Date(task.dueDate).toLocaleDateString()}`}
                          </p>
                          {col === 'In Progress' && (
                            <div className="w-full bg-surface-container-high h-1.5 rounded-full mb-3">
                              <div className="bg-primary h-full rounded-full" style={{ width: `${task.progress || 0}%` }}></div>
                            </div>
                          )}
                          <div className="flex gap-2">
                            {col !== 'To Do' && (
                              <button onClick={() => moveTask(task._id, col === 'Done' ? 'In Progress' : 'To Do')} className="text-xs text-gray-500 hover:text-primary font-semibold">← Back</button>
                            )}
                            {col !== 'Done' && (
                              <button onClick={() => moveTask(task._id, col === 'To Do' ? 'In Progress' : 'Done')} className="text-xs text-primary font-semibold hover:underline">
                                {col === 'To Do' ? 'Start →' : 'Complete ✓'}
                              </button>
                            )}
                            <button onClick={() => { setEditingTaskId(task._id); setShowTaskForm(true); }} className="text-xs text-gray-400 hover:text-primary ml-auto">Edit</button>
                          </div>
                        </div>
                      ))}
                      {colTasks.length === 0 && (
                        <p className="text-xs text-on-surface-variant text-center py-6">No tasks</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <button onClick={() => { setEditingId(null); setShowForm(true); }} className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-container text-white shadow-2xl flex items-center justify-center z-50">
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

      {showForm && (
        <EmployeeForm employeeId={editingId} onSuccess={() => { setShowForm(false); setEditingId(null); setToast({ message: 'Employee saved', type: 'success' }); fetchAll(); }} onCancel={() => { setShowForm(false); setEditingId(null); }} />
      )}
      {showTaskForm && (
        <TaskForm taskId={editingTaskId} onSuccess={() => { setShowTaskForm(false); setEditingTaskId(null); setToast({ message: 'Task saved', type: 'success' }); fetchAll(); }} onCancel={() => { setShowTaskForm(false); setEditingTaskId(null); }} />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
