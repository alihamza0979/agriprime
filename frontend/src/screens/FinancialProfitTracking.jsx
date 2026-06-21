import React, { useState, useEffect } from 'react';
import api from '../api';
import FinancialRecordForm from '../components/FinancialRecordForm';
import Toast from '../components/Toast';
import { downloadCsv } from '../utils/exportCsv';

export default function FinancialProfitTracking() {
  const [financialRecords, setFinancialRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ revenue: 0, expenses: 0, profit: 0 });
  const [filterType, setFilterType] = useState('All');
  const [toast, setToast] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchFinance();
  }, []);

  const fetchFinance = async () => {
    try {
      setLoading(true);
      const response = await api.get('/financial');
      const records = response.data.data || [];
      setFinancialRecords(records);
      
      let rev = 0;
      let exp = 0;
      records.forEach(record => {
        if (record.type === 'Income') rev += record.amountPKR;
        else if (record.type === 'Expense') exp += record.amountPKR;
      });
      setSummary({ revenue: rev, expenses: exp, profit: rev - exp });
    } catch (error) {
      console.error('Error fetching financial records:', error);
      setToast({ message: 'Failed to load financial records', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecord = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await api.delete(`/financial/${id}`);
        setToast({ message: 'Record deleted successfully', type: 'success' });
        fetchFinance();
      } catch (error) {
        setToast({ message: 'Failed to delete record', type: 'error' });
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumSignificantDigits: 3 }).format(amount);
  };

  const filteredRecords = filterType === 'All' 
    ? financialRecords 
    : financialRecords.filter(r => r.type === filterType);

  const categoryBreakdown = financialRecords.reduce((acc, r) => {
    const cat = r.category || 'Other';
    if (!acc[cat]) acc[cat] = { income: 0, expense: 0 };
    if (r.type === 'Income') acc[cat].income += r.amountPKR;
    else acc[cat].expense += r.amountPKR;
    return acc;
  }, {});

  const handleExport = () => {
    downloadCsv('agriprime-financial-report.csv', filteredRecords.map(r => ({
      date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '',
      description: r.description || '',
      type: r.type,
      category: r.category || '',
      amount: r.amountPKR,
    })), [
      { key: 'date', label: 'Date' }, { key: 'description', label: 'Description' },
      { key: 'type', label: 'Type' }, { key: 'category', label: 'Category' }, { key: 'amount', label: 'Amount (PKR)' },
    ]);
    setToast({ message: 'Financial report exported', type: 'success' });
  };

  return (
    <>
      <main className="w-full min-h-full">
        <div className="px-8 py-8 space-y-8 ">
          {/* Summary Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-2">
            <div>
              <h2 className="text-4xl font-extrabold font-headline text-emerald-900 tracking-tight">Financial Pulse</h2>
              <p className="text-tertiary font-medium">Fiscal Year 2024 Performance Overview</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:opacity-90 transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">add</span>
                Add Record
              </button>
              <button onClick={handleExport} className="px-4 py-2 bg-primary/10 text-primary text-sm font-bold rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">file_download</span>
                Export CSV
              </button>
            </div>
          </div>

          {/* Top Section: Summary Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Revenue */}
            <div className="bg-glass rounded-xl p-8 border-none shadow-sm flex flex-col justify-between group hover:translate-y-[-4px] transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined" data-icon="trending_up">trending_up</span>
                </div>
                <span className="text-primary text-xs font-bold px-2 py-1 bg-primary/10 rounded-full">{financialRecords.filter(r => r.type === 'Income').length} records</span>
              </div>
              <div>
                <p className="text-on-surface-variant text-sm font-semibold mb-1">Total Revenue</p>
                <h3 className="text-4xl font-extrabold font-headline text-on-surface">{formatCurrency(summary.revenue)}</h3>
              </div>
              <div className="mt-4 pt-4 border-t border-outline-variant/10">
                <p className="text-[11px] text-on-surface-variant">{financialRecords.filter(r => r.type === 'Income').length} income entries recorded</p>
              </div>
            </div>

            {/* Operating Expenses */}
            <div className="bg-glass rounded-xl p-8 border-none shadow-sm flex flex-col justify-between group hover:translate-y-[-4px] transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined" data-icon="payments">payments</span>
                </div>
                <span className="text-secondary text-xs font-bold px-2 py-1 bg-secondary/10 rounded-full">{financialRecords.filter(r => r.type === 'Expense').length} records</span>
              </div>
              <div>
                <p className="text-on-surface-variant text-sm font-semibold mb-1">Operating Expenses</p>
                <h3 className="text-4xl font-extrabold font-headline text-on-surface">{formatCurrency(summary.expenses)}</h3>
              </div>
              <div className="mt-4 pt-4 border-t border-outline-variant/10">
                <p className="text-[11px] text-on-surface-variant">{financialRecords.filter(r => r.type === 'Expense').length} expense entries recorded</p>
              </div>
            </div>

            {/* Net Profit */}
            <div className="agri-gradient rounded-xl p-8 border-none shadow-xl shadow-primary/10 flex flex-col justify-between text-white group hover:translate-y-[-4px] transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-black">
                  <span className="material-symbols-outlined" data-icon="account_balance_wallet" style={{"fontVariationSettings":"\"FILL\" 2"}}>account_balance_wallet</span>
                </div>
                <span className="text-white text-xs font-bold px-2 py-1 bg-black/20 rounded-full">{filteredRecords.length} total</span>
              </div>
              <div>
                <p className="text-on-surface-variant text-sm font-semibold mb-1">Net Profit</p>
                <h3 className="text-4xl font-extrabold font-headline text-on-surface">{formatCurrency(summary.profit)}</h3>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-[11px] text-black/70">Based on {financialRecords.length} recorded transactions</p>
              </div>
            </div>
          </section>

          {/* Category Breakdown */}
          <section className="bg-glass rounded-xl p-8 shadow-sm">
            <h4 className="text-lg font-bold font-headline text-on-surface mb-6">Income & Expense by Category</h4>
            {Object.keys(categoryBreakdown).length === 0 ? (
              <p className="text-on-surface-variant text-sm">No records yet. Add financial records to see breakdown.</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(categoryBreakdown).map(([cat, vals]) => {
                  const net = vals.income - vals.expense;
                  const maxVal = Math.max(vals.income, vals.expense, 1);
                  return (
                    <div key={cat} className="space-y-2">
                      <div className="flex justify-between text-sm font-bold">
                        <span>{cat}</span>
                        <span className="text-primary">Net: {formatCurrency(net)}</span>
                      </div>
                      <div className="flex gap-2 h-3">
                        <div className="bg-primary rounded-full" style={{ width: `${(vals.income / maxVal) * 100}%`, minWidth: vals.income ? 4 : 0 }} title={`Income: ${vals.income}`}></div>
                        <div className="bg-secondary rounded-full" style={{ width: `${(vals.expense / maxVal) * 100}%`, minWidth: vals.expense ? 4 : 0 }} title={`Expense: ${vals.expense}`}></div>
                      </div>
                      <div className="flex gap-4 text-xs text-on-surface-variant">
                        <span>Income: {formatCurrency(vals.income)}</span>
                        <span>Expense: {formatCurrency(vals.expense)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Transactions Table */}
          <section className="bg-glass rounded-xl overflow-hidden shadow-sm">
            <div className="px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center">
              <h4 className="text-xl font-bold font-headline text-on-surface">Recent Transactions</h4>
              <div className="flex gap-3">
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-4 py-2 bg-surface-container rounded-lg text-sm font-bold border border-outline-variant/20 focus:outline-none">
                  <option value="All">All Types</option>
                  <option value="Income">Income Only</option>
                  <option value="Expense">Expenses Only</option>
                </select>
                <button onClick={handleExport} className="text-primary text-sm font-bold hover:underline">Export All</button>
              </div>
            </div>
            
            {loading ? (
              <div className="p-8 text-center text-on-surface-variant">Loading transactions...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface-container-low/50">
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Date</th>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Description</th>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Type</th>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Category</th>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-right">Amount</th>
                      <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {filteredRecords.map(record => (
                      <tr key={record._id} className="hover:bg-surface-container-low transition-colors group">
                        <td className="px-8 py-5 text-sm text-on-surface-variant font-medium">
                          {record.createdAt ? new Date(record.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                              <span className="material-symbols-outlined text-sm">
                                {record.type === 'Income' ? 'check_circle' : 'receipt_long'}
                              </span>
                            </div>
                            <span className="text-sm font-bold text-on-surface">{record.description || '-'}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`text-xs font-bold ${record.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                            {record.type}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                            record.type === 'Income' ? 'bg-primary-container/20 text-primary' : 'bg-secondary-container text-on-secondary-container'
                          }`}>
                            {record.category || '-'}
                          </span>
                        </td>
                        <td className={`px-8 py-5 text-sm font-extrabold text-right ${
                          record.type === 'Income' ? 'text-primary' : 'text-error'
                        }`}>
                          {record.type === 'Income' ? '+' : '-'}{formatCurrency(record.amountPKR)}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button onClick={() => handleDeleteRecord(record._id)} className="p-1 text-outline hover:text-red-500 transition-colors" title="Delete">
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>

      {showForm && (
        <FinancialRecordForm
          onSuccess={() => { setShowForm(false); setToast({ message: 'Record added successfully', type: 'success' }); fetchFinance(); }}
          onCancel={() => setShowForm(false)}
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
