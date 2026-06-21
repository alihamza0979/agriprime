import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api';
import Toast from '../../components/Toast';

const STATUS_COLORS = {
  'To Do': { bg: '#fff3e0', color: '#e65100' },
  'In Progress': { bg: '#e3f2fd', color: '#1565c0' },
  'Done': { bg: '#e8f5e9', color: '#2e7d32' },
};

export default function WorkerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [taskRes, attRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/attendance'),
      ]);
      setTasks(taskRes.data.data || []);
      setAttendance(attRes.data.data || []);
    } catch {
      setToast({ message: 'Failed to load your dashboard', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const markPresent = async () => {
    try {
      await api.post('/attendance/mark', { status: 'Present' });
      setToast({ message: 'Attendance marked — Present', type: 'success' });
      fetchData();
    } catch {
      setToast({ message: 'Failed to mark attendance', type: 'error' });
    }
  };

  const updateTaskStatus = async (taskId, status, progress) => {
    try {
      await api.put(`/tasks/${taskId}/progress`, { status, progress });
      setToast({ message: status === 'Done' ? 'Task completed! Attendance recorded.' : 'Task updated', type: 'success' });
      fetchData();
    } catch {
      setToast({ message: 'Failed to update task', type: 'error' });
    }
  };

  const todayMarked = attendance.some(a => {
    const d = new Date(a.date);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  });

  const activeTasks = tasks.filter(t => t.status !== 'Done');
  const doneTasks = tasks.filter(t => t.status === 'Done');

  return (
    <div style={{ minHeight: '100vh', background: '#f5fced' }}>
      <header style={{ background: 'linear-gradient(135deg, #0a2e1a, #0f4a2a)', color: '#fff', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 'bold' }}>AgriPrime Worker Portal</h1>
          <p style={{ fontSize: 14, opacity: 0.7, marginTop: 4 }}>Welcome, {user?.name}</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => navigate('/')} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: 8, cursor: 'pointer' }}>Marketplace</button>
          <button onClick={() => { logout(); navigate('/login'); }} style={{ padding: '8px 16px', background: 'rgba(255,107,107,0.2)', border: 'none', color: '#ff6b6b', borderRadius: 8, cursor: 'pointer' }}>Logout</button>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: 32 }}>
        {/* Attendance */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>Today's Attendance</h2>
          {todayMarked ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#2e7d32' }}>
              <span className="material-symbols-outlined">check_circle</span>
              <span style={{ fontWeight: 600 }}>Present — recorded today</span>
            </div>
          ) : (
            <button onClick={markPresent} style={{ padding: '12px 24px', background: '#4caf50', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>
              Mark Present
            </button>
          )}
          <p style={{ fontSize: 13, color: '#666', marginTop: 8 }}>Completing a task also records your attendance automatically.</p>
        </div>

        {/* Active Tasks */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>My Assigned Tasks ({activeTasks.length})</h2>
          {loading ? (
            <p style={{ color: '#666' }}>Loading tasks...</p>
          ) : activeTasks.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', padding: 32 }}>No active tasks assigned. Check back later.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {activeTasks.map(task => (
                <div key={task._id} style={{ border: '1px solid #eee', borderRadius: 12, padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <h3 style={{ fontWeight: 700, fontSize: 16 }}>{task.title}</h3>
                      {task.description && <p style={{ fontSize: 13, color: '#666', marginTop: 4 }}>{task.description}</p>}
                    </div>
                    <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: STATUS_COLORS[task.status]?.bg, color: STATUS_COLORS[task.status]?.color }}>{task.status}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, fontSize: 12, color: '#999', marginBottom: 12 }}>
                    <span>Priority: {task.priority}</span>
                    {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                  </div>
                  {task.status === 'In Progress' && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ height: 6, background: '#f0f0f0', borderRadius: 3 }}>
                        <div style={{ height: 6, background: '#4caf50', borderRadius: 3, width: `${task.progress || 0}%` }} />
                      </div>
                      <p style={{ fontSize: 11, color: '#666', marginTop: 4 }}>{task.progress || 0}% complete</p>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 8 }}>
                    {task.status === 'To Do' && (
                      <button onClick={() => updateTaskStatus(task._id, 'In Progress', 25)} style={{ padding: '8px 16px', background: '#e3f2fd', color: '#1565c0', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>Start Task</button>
                    )}
                    {task.status === 'In Progress' && (
                      <>
                        <button onClick={() => updateTaskStatus(task._id, 'In Progress', Math.min((task.progress || 0) + 25, 75))} style={{ padding: '8px 16px', background: '#fff3e0', color: '#e65100', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>Update Progress</button>
                        <button onClick={() => updateTaskStatus(task._id, 'Done', 100)} style={{ padding: '8px 16px', background: '#4caf50', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>Mark Complete</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed */}
        {doneTasks.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Completed ({doneTasks.length})</h2>
            {doneTasks.slice(0, 5).map(task => (
              <div key={task._id} style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#666' }}>{task.title}</span>
                <span style={{ fontSize: 12, color: '#2e7d32' }}>✓ Done</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
