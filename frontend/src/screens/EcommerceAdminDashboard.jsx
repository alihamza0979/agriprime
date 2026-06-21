import React, { useState, useEffect } from 'react';
import api from '../api';
import ProductForm from '../components/ProductForm';
import Toast from '../components/Toast';

export default function EcommerceAdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setToast({ message: 'Failed to load products', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setEditingId(null);
    setShowForm(true);
  };

  const handleEditProduct = (id) => {
    setEditingId(id);
    setShowForm(true);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        setToast({ message: 'Product deleted successfully', type: 'success' });
        fetchProducts();
      } catch (error) {
        setToast({ message: 'Failed to delete product', type: 'error' });
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingId(null);
    setToast({ message: editingId ? 'Product updated successfully' : 'Product added successfully', type: 'success' });
    fetchProducts();
  };

  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.inStock).length;
  const certifiedProducts = products.filter(p => p.certified).length;

  return (
    <>
      <main className="w-full flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="p-8 space-y-8 overflow-y-auto">
          {/* Page Header */}
          <div className="flex justify-between items-end">
            <div>
              <h2 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight">Order Management</h2>
              <p className="text-on-surface-variant mt-1">Real-time vitality tracking for your digital marketplace.</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-outline-variant/30 text-primary font-semibold hover:bg-surface-container-low transition-all">
                <span className="material-symbols-outlined text-lg">download</span>
                Export List
              </button>
              <button onClick={handleAddProduct} className="flex items-center gap-2 px-6 py-2.5 rounded-full primary-gradient text-white font-semibold shadow-md shadow-primary/10 hover:shadow-lg transition-all active:scale-95">
                <span className="material-symbols-outlined text-lg">add</span>
                Add Product
              </button>
            </div>
          </div>

          {/* Bento Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-xl border border-white/40 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-2xl" style={{"fontVariationSettings":"\"FILL\" 1"}}>inbox</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">Total Orders</p>
                  <h3 className="text-3xl font-headline font-extrabold text-on-surface">{totalOrders}</h3>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                <span>+14% from yesterday</span>
              </div>
            </div>
            
            <div className="glass-card p-6 rounded-xl border border-white/40 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary-container/10 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-secondary-container/30 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-2xl" style={{"fontVariationSettings":"\"FILL\" 1"}}>sync</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">Processing</p>
                  <h3 className="text-3xl font-headline font-extrabold text-on-surface">{processingOrders}</h3>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-secondary">
                <span className="material-symbols-outlined text-sm">schedule</span>
                <span>Avg. 4.2 hours to ship</span>
              </div>
            </div>
            
            <div className="glass-card p-6 rounded-xl border border-white/40 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-tertiary-container/10 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-tertiary-container/20 flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined text-2xl" style={{"fontVariationSettings":"\"FILL\" 1"}}>check_circle</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-on-surface-variant uppercase tracking-wider">Completed</p>
                  <h3 className="text-3xl font-headline font-extrabold text-on-surface">{completedOrders}</h3>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-tertiary">
                <span className="material-symbols-outlined text-sm">verified</span>
                <span>98.5% Success Rate</span>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="flex flex-wrap items-center gap-4 bg-surface-container-low p-2 rounded-2xl">
            <div className="flex-1 min-w-[200px] flex items-center gap-2 bg-surface-container-lowest px-4 py-2.5 rounded-xl border border-outline-variant/10">
              <span className="material-symbols-outlined text-on-surface-variant text-lg">calendar_today</span>
              <select className="bg-transparent border-none p-0 text-sm focus:ring-0 w-full font-medium text-on-surface">
                <option>All Time</option>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2.5 rounded-xl border border-outline-variant/10">
              <span className="material-symbols-outlined text-on-surface-variant text-lg">filter_list</span>
              <select className="bg-transparent border-none p-0 text-sm focus:ring-0 font-medium text-on-surface">
                <option>All Status</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
              </select>
            </div>
            <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all flex items-center gap-2">
              Apply Filters
            </button>
          </div>

          {/* Table Container */}
          <div className="glass-card rounded-2xl border border-white/40 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container/50 border-b border-outline-variant/10">
                  <th className="px-6 py-4 font-headline text-xs font-bold text-on-surface-variant uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 font-headline text-xs font-bold text-on-surface-variant uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 font-headline text-xs font-bold text-on-surface-variant uppercase tracking-wider">Items</th>
                  <th className="px-6 py-4 font-headline text-xs font-bold text-on-surface-variant uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 font-headline text-xs font-bold text-on-surface-variant uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-4 font-headline text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 font-headline text-xs font-bold text-on-surface-variant uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-on-surface-variant">Loading orders...</td>
                  </tr>
                ) : orders.map(order => (
                  <tr key={order._id} className="hover:bg-surface-container-low transition-all">
                    <td className="px-6 py-5">
                      <span className="font-bold text-primary">#{order.orderNumber}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center font-bold text-[10px] text-on-secondary-fixed">
                          {order.customer?.name ? order.customer.name.substring(0, 2).toUpperCase() : 'CU'}
                        </div>
                        <span className="font-medium text-on-surface">{order.customer?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm text-on-surface-variant">{order.items.length} item(s)</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-bold text-on-surface">₨{order.totalAmountPKR?.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-primary-fixed/30 text-on-primary-fixed-variant">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`flex items-center gap-2 text-sm font-semibold ${
                        order.status === 'Delivered' ? 'text-primary' :
                        order.status === 'Shipped' ? 'text-tertiary' : 'text-secondary'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          order.status === 'Delivered' ? 'bg-primary' :
                          order.status === 'Shipped' ? 'bg-tertiary' : 'bg-secondary animate-pulse'
                        }`}></span>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="material-symbols-outlined text-outline hover:text-primary transition-colors">more_vert</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {!loading && (
              <div className="px-6 py-4 flex items-center justify-between bg-surface-container/30 border-t border-outline-variant/10">
                <p className="text-sm text-on-surface-variant">Showing {orders.length} orders</p>
                <div className="flex gap-2">
                  <button className="px-4 py-1.5 rounded-lg border border-outline-variant/20 text-sm font-medium hover:bg-white transition-all disabled:opacity-50" disabled>Previous</button>
                  <button className="px-4 py-1.5 rounded-lg bg-white border border-outline-variant/20 text-sm font-bold text-primary">1</button>
                  <button className="px-4 py-1.5 rounded-lg border border-outline-variant/20 text-sm font-medium hover:bg-white transition-all">Next</button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Meta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
            <div className="bg-surface-container-high/40 p-8 rounded-[2rem] border border-white/40 flex items-center gap-6 group hover:bg-surface-container-high transition-all">
              <div className="w-20 h-20 rounded-full primary-gradient p-1">
                <img alt="AgriPrime Farm" className="w-full h-full rounded-full object-cover border-4 border-surface" data-alt="drone shot of perfectly aligned green crop fields with morning mist and soft sunlight" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRIi1AU6lb5ZbZSOb8kFAa8xArBgziFUwWIfjDJtB8HftMdjfQpSPs_mMLGrAn4GFQDhDOuS2tuQ3FXa4uKN0BmWaPwYRbc9yCNBSTFt8WtjrW-Veb_nGPEWogPB0TYn_5S4jBNrY90rdsEFdRHbWZsxj4irGRdCRx09GvRexh4TZPrn5-Aab0plFnGlvtUtxm92dCAbjYJK1LbmpRkxybdNCwGsi65VgxZ1PGKU_Ehi0gKCIB4nPACOKt5dP5LwFJhK6MftJCNJc"/>
              </div>
              <div>
                <h4 className="font-headline font-bold text-xl text-on-surface">Agrezen Vitality System</h4>
                <p className="text-on-surface-variant text-sm mt-1 leading-relaxed">Sustainable tracking for premium agriculture. Your dashboard is connected to 12 active local farm clusters.</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary pulse"></span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">System Online</span>
                </div>
              </div>
            </div>
            
            <div className="relative rounded-[2rem] overflow-hidden group">
              <img alt="Order Inventory" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="top down view of fresh organic vegetables in a wooden crate with warm rustic lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeIaqgwsXMREUIUsBi1z36ZBQ1n6uLq1GDgvWbj4c7oYa24t_vKoicsPm5egFoiNA81pCg1VqGCDOESBlUlH2PRI_suRtQc6mt--lKX3RLk7EYTOAmRbtovcp5d28M8iwmanFPo8Co9QyAqHBAVWDEPmwJPdYHYpu7EqpyQQhKdTTdNB07nxmb_d47anilx5l3uuxQ_DHSfqEwihVHHQaFN_Tb1kFliwbLTbxyGPaRZ1_qNq4rMaj5bGz5VPKFDnA6oxyQK0N7LWQ"/>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-8">
                <div>
                  <h4 className="text-white font-headline font-bold text-xl">Inventory Health</h4>
                  <p className="text-white/80 text-sm">Stock levels are currently at 84% capacity for seasonal harvests.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
