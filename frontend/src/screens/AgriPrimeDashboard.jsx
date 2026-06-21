import React, { useState, useEffect } from 'react';
import api from '../api';

const recentActivity = [
  { icon: 'local_shipping', color: '#75584d', title: 'Feed delivery arrived', desc: '2.5 tons of organic corn fodder', time: '14 mins ago', urgent: false },
  { icon: 'medical_information', color: '#006e1c', title: 'Vet checked Barn 4', desc: 'Regular vaccination cycle complete', time: '2 hours ago', urgent: false },
  { icon: 'warning', color: '#ba1a1a', title: 'Gate sensor malfunction', desc: 'Sector 7 entrance unresponsive', time: '5 hours ago', urgent: true },
  { icon: 'inventory', color: '#4e6535', title: 'Inventory restocked', desc: 'Medical supplies & sanitizers', time: 'Yesterday', urgent: false },
  { icon: 'water_drop', color: '#1565C0', title: 'Irrigation system ON', desc: 'Sector A & B scheduled watering', time: 'Yesterday', urgent: false },
];

const barData = [
  { day: 'Mon', h: 60, peak: false },
  { day: 'Tue', h: 75, peak: false },
  { day: 'Wed', h: 92, peak: true },
  { day: 'Thu', h: 65, peak: false },
  { day: 'Fri', h: 78, peak: false },
  { day: 'Sat', h: 55, peak: false },
  { day: 'Sun', h: 50, peak: false },
];

export default function AgriPrimeDashboard() {
  const [chartPeriod, setChartPeriod] = useState('weekly');
  const [liveStats, setLiveStats] = useState({
    totalLivestock: '...', healthAlerts: '...', revenue: '...',
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [animalsRes, healthRes, finRes] = await Promise.all([
          api.get('/animals'),
          api.get('/health'),
          api.get('/financial'),
        ]);
        const totalAnimals = animalsRes.data.count || 0;
        const urgentAlerts = (healthRes.data.data || []).filter(h =>
          h.status === 'Critical' || h.status === 'Under Treatment'
        ).length;
        const records = finRes.data.data || [];
        const totalRevenue = records
          .filter(r => r.type === 'Income')
          .reduce((sum, r) => sum + r.amountPKR, 0);
        const revDisplay = totalRevenue >= 1_000_000
          ? `₨${(totalRevenue / 1_000_000).toFixed(2)}M`
          : `₨${totalRevenue.toLocaleString()}`;
        setLiveStats({
          totalLivestock: totalAnimals.toLocaleString(),
          healthAlerts: String(urgentAlerts).padStart(2, '0'),
          revenue: revDisplay,
        });
      } catch (err) {
        console.error('Dashboard stats error:', err);
      }
    };
    fetchStats();
  }, []);



  return (
    <div style={{ width: '100%', background: '#f5fced', minHeight: '100%' }}>

      {/* ══════════════════════════════════════════
          HERO SECTION with Pakistani Farm BG
      ══════════════════════════════════════════ */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: 340,
        overflow: 'hidden',
      }}>
        {/* Background image */}
        <img
          src="/farm-hero.png"
          alt="Pakistani Farm"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 60%' }}
        />
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(10,46,26,0.72) 0%, rgba(0,80,20,0.45) 50%, rgba(0,0,0,0.25) 100%)',
        }} />

        {/* Hero text */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 40px 36px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(76,175,80,0.25)', backdropFilter: 'blur(8px)',
                border: '1px solid rgba(76,175,80,0.35)',
                borderRadius: 20, padding: '4px 14px', marginBottom: 12,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#69f0ae', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                <span style={{ color: '#b9f6ca', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em' }}>LIVE MONITORING ACTIVE</span>
              </div>
              <h1 style={{
                color: '#fff', fontSize: 42, fontWeight: 900,
                fontFamily: 'Manrope, sans-serif', lineHeight: 1.1,
                textShadow: '0 2px 20px rgba(0,0,0,0.3)', margin: 0, letterSpacing: '-0.5px',
              }}>Ecosystem Overview</h1>
              <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: 15, marginTop: 8, fontWeight: 500 }}>
                Monitoring growth and health across all sectors · Punjab, Pakistan
              </p>
            </div>
            {/* Weather card */}
            <div style={{
              background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 20, padding: '16px 24px',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 36, color: '#ffd54f', fontVariationSettings: '"FILL" 1' }}>wb_sunny</span>
              <div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Today's Weather</div>
                <div style={{ color: '#fff', fontSize: 22, fontWeight: 800, marginTop: 2, fontFamily: 'Manrope, sans-serif' }}>Sunny, 28°C</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 2 }}>Ideal for grazing — Lahore</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          STAT CARDS ROW (overlapping hero)
      ══════════════════════════════════════════ */}
      <div style={{ padding: '0 40px', marginTop: -32, position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {/* Total Livestock */}
          {[
            { label: 'Total Livestock', value: liveStats.totalLivestock, change: '+2.4%', icon: 'pets', color: '#4caf50', bg: 'rgba(76,175,80,0.12)' },
            { label: 'Health Alerts', value: liveStats.healthAlerts, change: 'Urgent', icon: 'emergency', color: '#ba1a1a', bg: 'rgba(186,26,26,0.10)' },
            { label: 'Daily Tasks', value: '18/24', change: '75%', icon: 'task_alt', color: '#4e6535', bg: 'rgba(78,101,53,0.12)' },
            { label: 'Revenue (MTD)', value: liveStats.revenue, change: '+12%', icon: 'payments', color: '#006e1c', bg: 'rgba(0,110,28,0.12)' },
          ].map((s, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)',
              borderRadius: 20, padding: '24px 24px 20px',
              boxShadow: '0 8px 32px rgba(0,40,15,0.10)',
              border: '1px solid rgba(255,255,255,0.8)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'default',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,40,15,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,40,15,0.10)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ color: s.color, fontSize: 22, fontVariationSettings: '"FILL" 1' }}>{s.icon}</span>
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                  background: s.color === '#ba1a1a' ? 'rgba(186,26,26,0.1)' : 'rgba(0,110,28,0.1)',
                  color: s.color === '#ba1a1a' ? '#ba1a1a' : '#006e1c',
                }}>{s.change}</span>
              </div>
              <div style={{ color: '#6f7a6b', fontSize: 12, fontWeight: 600, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
              <div style={{ color: '#0d3b22', fontSize: 30, fontWeight: 900, fontFamily: 'Manrope, sans-serif', lineHeight: 1 }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          MAIN CONTENT GRID
      ══════════════════════════════════════════ */}
      <div style={{ padding: '32px 40px 48px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>

        {/* LEFT — Milk Production Chart */}
        <div style={{ background: '#fff', borderRadius: 24, padding: '28px 32px', boxShadow: '0 4px 24px rgba(0,40,15,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#0d3b22', fontFamily: 'Manrope, sans-serif' }}>Milk Production Trends</h3>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#6f7a6b' }}>Weekly yield performance across all barns</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['weekly', 'monthly'].map(p => (
                <button key={p} onClick={() => setChartPeriod(p)} style={{
                  padding: '6px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
                  background: chartPeriod === p ? 'linear-gradient(135deg,#2e7d32,#4caf50)' : '#f1f8e9',
                  color: chartPeriod === p ? '#fff' : '#4e6535',
                  transition: 'all 0.2s',
                }}>{p.charAt(0).toUpperCase() + p.slice(1)}</button>
              ))}
            </div>
          </div>

          {/* Bar chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, height: 180, padding: '0 8px' }}>
            {barData.map((b, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ width: '100%', flex: 1, display: 'flex', alignItems: 'flex-end', position: 'relative' }}>
                  <div style={{
                    width: '100%', height: `${b.h}%`, borderRadius: '8px 8px 0 0',
                    background: b.peak
                      ? 'linear-gradient(180deg, #4caf50, #2e7d32)'
                      : 'linear-gradient(180deg, rgba(76,175,80,0.35), rgba(76,175,80,0.15))',
                    position: 'relative', overflow: 'hidden', transition: 'opacity 0.2s',
                    boxShadow: b.peak ? '0 -4px 20px rgba(76,175,80,0.3)' : 'none',
                  }}>
                    {b.peak && (
                      <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', background: '#fff', color: '#2e7d32', fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 10 }}>PEAK</div>
                    )}
                  </div>
                </div>
                <span style={{ fontSize: 11, fontWeight: b.peak ? 800 : 500, color: b.peak ? '#2e7d32' : '#9ea89a' }}>{b.day}</span>
              </div>
            ))}
          </div>

          {/* Stats footer */}
          <div style={{ display: 'flex', gap: 40, marginTop: 24, paddingTop: 20, borderTop: '1px solid #e9f0e1' }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#9ea89a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Avg. Daily Yield</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#2e7d32', fontFamily: 'Manrope, sans-serif', marginTop: 4 }}>4,120 Liters</div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#9ea89a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Peak Output</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#0d3b22', fontFamily: 'Manrope, sans-serif', marginTop: 4 }}>5,480 L (Wed)</div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#9ea89a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Weekly Total</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#0d3b22', fontFamily: 'Manrope, sans-serif', marginTop: 4 }}>29,540 L</div>
            </div>
          </div>
        </div>

        {/* RIGHT — Recent Activity */}
        <div style={{ background: '#fff', borderRadius: 24, padding: '28px 24px', boxShadow: '0 4px 24px rgba(0,40,15,0.07)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0d3b22', fontFamily: 'Manrope, sans-serif' }}>Recent Activity</h3>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4caf50', fontSize: 12, fontWeight: 700 }}>View All →</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, flex: 1 }}>
            {recentActivity.map((item, i) => (
              <div key={i} style={{
                display: 'flex', gap: 14, padding: '14px 0',
                borderBottom: i < recentActivity.length - 1 ? '1px solid #f1f8e9' : 'none',
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                  background: item.urgent ? 'rgba(186,26,26,0.08)' : 'rgba(76,175,80,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: item.color }}>{item.icon}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: item.urgent ? '#ba1a1a' : '#171d14', marginBottom: 3 }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: '#6f7a6b', lineHeight: 1.4 }}>{item.desc}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#9ea89a', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.time}</div>
                </div>
              </div>
            ))}
          </div>

          <button style={{
            marginTop: 20, width: '100%', padding: '12px 0', borderRadius: 14,
            background: '#f1f8e9', border: 'none', color: '#2e7d32', fontWeight: 700,
            fontSize: 13, cursor: 'pointer', transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#dcedc8'}
            onMouseLeave={e => e.currentTarget.style.background = '#f1f8e9'}
          >
            View Full Audit Log
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          BOTTOM ROW — Farm Photo + Efficiency
      ══════════════════════════════════════════ */}
      <div style={{ padding: '0 40px 48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* Pasture Health - image card */}
        <div style={{ borderRadius: 24, overflow: 'hidden', height: 220, position: 'relative', boxShadow: '0 8px 32px rgba(0,40,15,0.12)' }}>
          <img
            src="/farm-hero.png"
            alt="Pasture Health"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%', transform: 'scale(1.05)', transition: 'transform 0.5s ease' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.10)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1.05)'}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(5,30,15,0.8) 0%, rgba(5,30,15,0.2) 60%, transparent 100%)',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 28,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#69f0ae' }} />
              <span style={{ color: '#b9f6ca', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Optimal Conditions</span>
            </div>
            <h4 style={{ color: '#fff', fontSize: 24, fontWeight: 800, fontFamily: 'Manrope, sans-serif', margin: 0 }}>Pasture Health Index</h4>
            <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 13, margin: '6px 0 0' }}>Optimal grazing conditions in Sector A & B · Punjab</p>
          </div>
        </div>

        {/* Efficiency Score */}
        <div style={{ background: '#fff', borderRadius: 24, padding: '32px', boxShadow: '0 4px 24px rgba(0,40,15,0.07)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 28 }}>
            {/* Circular progress */}
            <div style={{ position: 'relative', width: 90, height: 90, flexShrink: 0 }}>
              <svg viewBox="0 0 90 90" style={{ width: 90, height: 90, transform: 'rotate(-90deg)' }}>
                <circle cx="45" cy="45" r="38" fill="none" stroke="#e9f0e1" strokeWidth="8" />
                <circle cx="45" cy="45" r="38" fill="none" stroke="url(#grad)" strokeWidth="8" strokeDasharray="238.8" strokeDashoffset="28.6" strokeLinecap="round" />
                <defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#2e7d32" /><stop offset="100%" stopColor="#81c784" /></linearGradient></defs>
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 20, color: '#2e7d32', fontFamily: 'Manrope, sans-serif' }}>88%</div>
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#0d3b22', fontFamily: 'Manrope, sans-serif' }}>Efficiency Score</h4>
              <p style={{ margin: '6px 0 0', fontSize: 13, color: '#6f7a6b', lineHeight: 1.5 }}>Your farm is performing <strong style={{ color: '#2e7d32' }}>12% above</strong> the regional average this month.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[['Energy', '94%', '#4caf50'], ['Water', '82%', '#1565C0'], ['Waste', '91%', '#4e6535']].map(([label, val, color]) => (
              <div key={label} style={{ background: '#f5fced', borderRadius: 14, padding: '14px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#9ea89a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 20, fontWeight: 900, color, fontFamily: 'Manrope, sans-serif' }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
