import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.jpeg';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../constants';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Search,
  Plus,
  Bell,
  LogOut,
  ExternalLink,
  Edit2,
  Trash2,
  Image as ImageIcon,
  X,
  CreditCard,
  ChevronLeft,
  TrendingUp,
  ArrowUpRight,
  MoreVertical,
  Menu
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Auth states
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Form states
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Tops');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  const resetForm = () => {
    setNewName('');
    setNewCategory('Tops');
    setNewPrice('');
    setNewStock('');
    setNewImageUrl('');
    setSelectedFile(null);
    setSelectedFileName(null);
    setImagePreview(null);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || (!selectedFile && !newImageUrl)) {
      alert('Product name and image are required');
      return;
    }

    try {
      setIsSubmitting(true);
      let finalImageUrl = newImageUrl;

      // 1. Upload image if file is selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('product-images')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrl;
      }

      // 2. Insert into products table
      const { error: insertError } = await supabase
        .from('products')
        .insert([
          {
            name: newName,
            category: newCategory,
            price: parseFloat(newPrice) || 0,
            image_url: finalImageUrl,
            stock_quantity: parseInt(newStock) || 0,
          },
        ]);

      if (insertError) throw insertError;

      alert('Product dropped successfully!');
      setIsAddModalOpen(false);
      resetForm();
      fetchProducts();
    } catch (error: any) {
      console.error('Error adding product:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts(MOCK_PRODUCTS);
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (!newName) {
      alert('Product name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      let finalImageUrl = newImageUrl || editingProduct.image_url || editingProduct.image;

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrl;
      }

      const { error: updateError } = await supabase
        .from('products')
        .update({
          name: newName,
          category: newCategory,
          price: parseFloat(newPrice) || 0,
          image_url: finalImageUrl,
          stock_quantity: parseInt(newStock) || 0,
        })
        .eq('id', editingProduct.id);

      if (updateError) throw updateError;

      alert('Product updated successfully!');
      setIsEditModalOpen(false);
      resetForm();
      setEditingProduct(null);
      fetchProducts();
    } catch (error: any) {
      console.error('Error updating product:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string | number) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('Product deleted successfully');
      fetchProducts();
    } catch (error: any) {
      console.error('Error deleting product:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    await Promise.all([fetchProducts(), fetchOrders()]);
    setLoading(false);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchDashboardData();
    }
  }, [isLoggedIn]);

  const handleSignOut = async () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput === 'gohard' && passwordInput === 'gohard44') {
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
      setAuthError(null);
    } else {
      setAuthError('Access Denied: Invalid Credentials');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setSelectedFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const sidebarItems = [
    { id: 'Overview', icon: LayoutDashboard, label: 'OVERVIEW' },
    { id: 'Products', icon: Package, label: 'PRODUCTS' },
    { id: 'Orders', icon: ShoppingCart, label: 'ORDERS' },
    // { id: 'Analytics', icon: TrendingUp, label: 'ANALYTICS' },
  ];

  const renderOverview = () => {
    const totalRevenue = orders.reduce((acc, order) => acc + (order.total_amount || 0), 0);
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
    const totalVisits = products.length * 127; // Semi-dynamic placeholder

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Revenue', value: `₦${totalRevenue.toLocaleString()}`, change: '+12.5%', color: 'text-emerald-500' },
            { label: 'Avg Order', value: `₦${avgOrderValue.toLocaleString()}`, change: '+2.1%', color: 'text-emerald-500' },
            { label: 'Live Inventory', value: products.length.toString(), change: '+18.1%', color: 'text-emerald-500' },
            { label: 'Total Sales', value: orders.length.toString(), change: '+3.2%', color: 'text-emerald-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-zinc-950 border border-zinc-900 p-6 space-y-2 rounded-sm shadow-xl shadow-black/20">
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{stat.label}</p>
                <ArrowUpRight className={`w-3 h-3 ${stat.color}`} />
              </div>
              <p className="text-4xl md:text-5xl font-heading font-black tracking-tighter">{stat.value}</p>
              <p className={`text-[10px] font-black uppercase tracking-widest ${stat.color}`}>{stat.change} <span className="text-zinc-600 ml-1">real-time</span></p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-heading font-black text-xs md:text-sm uppercase tracking-[0.2em] text-white">Recent Sales Activity</h3>
              <button className="text-[10px] font-black text-zinc-500 hover:text-[#D4AF37] uppercase tracking-[0.2em] transition-colors">View All</button>
            </div>
            <div className="space-y-6">
              {orders.slice(0, 5).map(order => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-zinc-900/50 last:border-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-[10px] font-black">
                      {(order.customer_name || '??').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-tight">{order.customer_name}</p>
                      <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Order #GHR-{order.id.substring(0, 4)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black">₦{(order.total_amount || 0).toLocaleString()}</p>
                    <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <p className="text-[10px] text-zinc-500 uppercase font-black text-center py-8">No sales activity yet.</p>
              )}
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-heading font-black text-xs md:text-sm uppercase tracking-[0.2em] text-white">Top Selling Drops</h3>
              <div className="p-2 bg-zinc-900 rounded-sm">
                <Search className="w-3 h-3 text-zinc-500" />
              </div>
            </div>
            <div className="space-y-4">
              {products.slice(0, 4).map(product => (
                <div key={product.id} className="group relative overflow-hidden bg-zinc-900/30 p-4 border border-zinc-900 hover:border-[#D4AF37]/30 transition-all flex items-center space-x-4">
                  <img src={product.image_url || product.image} className="w-12 h-12 object-cover rounded-sm grayscale group-hover:grayscale-0 transition-all" alt="" />
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest">{product.name}</p>
                    <div className="w-full bg-zinc-800 h-1 mt-2 rounded-full overflow-hidden">
                      <div className="bg-[#D4AF37] h-full" style={{ width: `${Math.random() * 60 + 40}%` }}></div>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-[#D4AF37]">Live</p>
                </div>
              ))}
              {products.length === 0 && (
                <p className="text-[10px] text-zinc-500 uppercase font-black text-center py-8">No drops released yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProducts = () => (
    <div className="bg-zinc-950 border border-zinc-900 rounded-sm animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-zinc-900 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 className="font-heading font-black text-sm uppercase tracking-widest">Inventory Management</h3>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-none px-4 py-2 text-xs focus:outline-none focus:border-[#D4AF37]"
          />
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-zinc-600" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-zinc-900 bg-zinc-900/30">
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Item Details</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Category</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Price</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Stock</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-zinc-900/20 transition-colors group">
                <td className="p-6">
                  <div className="flex items-center space-x-4">
                    <img src={product.image_url || product.image} className="w-12 h-12 object-cover border border-zinc-800" alt={product.name} />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-tight group-hover:text-[#D4AF37] transition-colors">{product.name}</p>
                      <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-[0.2em] mt-1">SKU-GHR-{product.id}00</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-zinc-900 text-zinc-400 border border-zinc-800">
                    {product.category}
                  </span>
                </td>
                <td className="p-6">
                  <p className="text-sm font-bold">₦{product.price.toLocaleString()}</p>
                </td>
                <td className="p-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Active</span>
                  </div>
                </td>
                <td className="p-6 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setNewName(product.name);
                        setNewCategory(product.category);
                        setNewPrice(product.price.toString());
                        setNewStock(product.stock_quantity?.toString() || '0');
                        setNewImageUrl(product.image_url || product.image || '');
                        setImagePreview(product.image_url || product.image || '');
                        setIsEditModalOpen(true);
                      }}
                      className="p-2 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-500 hover:text-white transition-all rounded-lg border border-zinc-800"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 bg-zinc-900/50 hover:bg-[#D4AF37]/10 text-zinc-500 hover:text-[#D4AF37] transition-all rounded-lg border border-zinc-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center border-b border-zinc-900 pb-6">
        <h3 className="font-heading font-black text-sm uppercase tracking-widest">Fulfillment Queue</h3>
        <div className="flex space-x-2">
          {['All', 'Pending', 'Shipped', 'Delivered'].map(status => (
            <button key={status} className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border transition-all ${status === 'All' ? 'bg-[#D4AF37] border-[#D4AF37] text-black' : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}>{status}</button>
          ))}
        </div>
      </div>
      <div className="bg-zinc-950 border border-zinc-900">
        {orders.map(order => (
          <div key={order.id} className="p-6 border-b border-zinc-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-zinc-900/10 transition-colors">
            <div className="flex items-center space-x-6">
              <div className="text-center bg-zinc-900 p-2 min-w-[60px] border border-zinc-800">
                <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-tighter">ORDER</p>
                <p className="text-xs font-black">#GHR-{order.id.substring(0, 4)}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase">{order.customer_name}</p>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                  {order.items ? (Array.isArray(order.items) ? order.items.length : '1') : '0'} Items • ₦{(order.total_amount || 0).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-8 w-full md:w-auto justify-between">
              <div className="flex flex-col items-start md:items-center">
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Status</p>
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border ${order.status === 'shipped'
                  ? 'bg-emerald-600/10 text-emerald-600 border-emerald-600/20'
                  : 'bg-yellow-600/10 text-yellow-600 border-yellow-600/20'
                  }`}>
                  {order.status || 'Pending'}
                </span>
              </div>
              <div className="flex flex-col items-start md:items-center">
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Date</p>
                <p className="text-[10px] font-bold">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedOrder(order);
                  setIsOrderModalOpen(true);
                }}
                className="text-white bg-zinc-900 border border-zinc-800 p-2 hover:border-[#D4AF37] transition-colors rounded-sm"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="p-20 text-center">
            <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em]">Fulfillment Queue Empty.</p>
          </div>
        )}
      </div>
    </div>
  );

  /*
  const renderAnalytics = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-sm">
          <div className="flex justify-between items-center mb-12">
            <h3 className="font-heading font-black text-sm uppercase tracking-widest">Growth Performance</h3>
            <select className="bg-zinc-900 text-[10px] font-black uppercase tracking-widest border border-zinc-800 p-2 focus:outline-none">
              <option>Last 30 Days</option>
              <option>Last 6 Months</option>
              <option>Year to Date</option>
            </select>
          </div>
          <div className="aspect-[2/1] bg-gradient-to-t from-[#D4AF37]/5 to-transparent border-l border-b border-zinc-900 relative">
            <div className="absolute inset-x-0 bottom-0 h-[60%] border-t border-[#D4AF37]/20 border-dashed"></div>
            <div className="absolute inset-x-0 bottom-0 h-[30%] border-t border-[#D4AF37]/20 border-dashed"></div>
            <div className="absolute bottom-0 left-0 right-0 h-full flex items-end justify-between px-4">
              {[40, 60, 45, 80, 55, 90, 75, 95, 85, 100, 95, 110].map((h, i) => (
                <div key={i} className="w-[4%] bg-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)]" style={{ height: `${h}%` }}></div>
              ))}
            </div>
          </div>
          <div className="flex justify-between mt-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest">
            <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-sm text-center">
          <h3 className="font-heading font-black text-sm uppercase tracking-widest mb-8">Audience Insight</h3>
          <div className="w-48 h-48 rounded-full border-8 border-zinc-900 mx-auto relative flex items-center justify-center">
            <div className="w-full h-full rounded-full border-8 border-[#D4AF37] border-t-transparent border-r-transparent animate-spin-slow absolute"></div>
            <div className="text-center">
              <p className="text-3xl font-heading font-black">74%</p>
              <p className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">Retention Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  */


  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <div className="inline-block bg-white p-6 mb-8 rounded-sm shadow-[0_0_50px_rgba(255,255,255,0.1)]">
              <img src={logo} alt="GOHARDREPUBLIC" className="h-16 w-auto" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase text-white mb-2">Admin Command</h1>
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em]">Authorized Access Only.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {authError && (
              <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 p-4 text-[#D4AF37] text-xs font-bold uppercase tracking-widest text-center italic">
                {authError}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Admin Username</label>
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 p-4 text-sm font-black focus:border-[#D4AF37] outline-none transition-colors text-white"
                placeholder="e.g. gohard"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Security Key</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 p-4 text-sm font-black focus:border-[#D4AF37] outline-none transition-colors text-white"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#D4AF37] hover:bg-[#C9A84C] text-black font-black py-5 text-[12px] tracking-[0.4em] uppercase shadow-2xl shadow-[#D4AF37]/20 transition-all active:scale-[0.98]"
            >
              Enter Dashboard
            </button>
          </form>

          <div className="mt-12 text-center">
            <Link to="/" className="text-[10px] font-black text-zinc-600 hover:text-white uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
              <ChevronLeft className="w-3 h-3" />
              Return to Public Site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#030303] text-zinc-100 font-sans selection:bg-[#D4AF37] selection:text-black overflow-hidden font-heading">
      {/* Mobile Top Header (Dashboard Specific) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-20 bg-black border-b border-zinc-900 z-[60] flex items-center justify-between px-6">
        <div className="flex items-center space-x-3">
          {/* <div className="bg-white px-3 py-1.5 rounded-sm shadow-[0_0_20px_rgba(255,255,255,0.1)]"> */}
          <img src={logo} alt="GOHARDREPUBLIC" className="h-10 w-[100px] object-contain" />
          {/* </div> */}

        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-white bg-zinc-900 border border-zinc-800 rounded-md"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed md:static inset-y-0 left-0 w-[300px] bg-black border-r border-zinc-900 flex flex-col z-[70] transition-transform duration-500 ease-in-out transform
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <div className="p-8">
          <div className="flex items-center space-x-4 mb-16">
            {/* <div className="bg-white px-5 py-3 rounded-sm shadow-[0_0_30px_rgba(255,255,255,0.15)]"> */}
            <img src={logo} alt="GOHARDREPUBLIC" className="h-14 w-[100px] object-contain" />
            {/* </div> */}
            <div className="space-y-0.5">
              <span className="font-black text-base tracking-tighter uppercase block leading-none text-white">GOHARDREPUBLIC</span>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.15em]">BRAND ADMIN</span>
            </div>
          </div>

          <nav className="space-y-4">
            {sidebarItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-5 px-6 py-5 transition-all relative group overflow-hidden ${activeTab === item.id
                  ? 'bg-[#D4AF37] text-black rounded-xl border-2 border-white/20 shadow-[0_15px_35px_rgba(212,175,55,0.4)] scale-[1.02]'
                  : 'text-zinc-500 hover:text-white hover:bg-zinc-900/50 rounded-xl'
                  }`}
              >
                <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === item.id ? 'text-white' : 'text-zinc-600'}`} />
                <span className="text-xs font-black uppercase tracking-[0.2em]">{item.label}</span>
                {activeTab === item.id && (
                  <div className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 space-y-6">
          <Link to="/" className="flex items-center space-x-4 px-6 py-4 text-zinc-600 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors group">
            <ExternalLink className="w-4 h-4 group-hover:rotate-45 transition-transform" />
            <span>Go to Site</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-4 px-6 py-4 text-zinc-600 hover:text-[#D4AF37] text-[10px] font-black uppercase tracking-widest transition-colors border-t border-zinc-900/50 mt-4"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto bg-[#030303] md:pt-0 pt-20">
        <div className="p-8 md:p-12 max-w-[1400px] mx-auto">
          {/* Dashboard Specific Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-16 gap-8">
            <div className="space-y-2">
              <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-2">
                <span>REPUBLIC</span>
                <span>/</span>
                <span className="text-[#D4AF37]">{activeTab}</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-none">{activeTab}</h1>
            </div>

            <div className="flex items-center space-x-5">
              <button className="bg-zinc-900 border border-zinc-800 p-4 text-white hover:border-[#D4AF37] transition-colors relative rounded-lg">
                <Bell className="w-5 h-5" />
                <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-[#D4AF37] rounded-full border-2 border-black"></div>
              </button>

              {activeTab === 'Products' && (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-[#D4AF37] hover:bg-[#C9A84C] text-black font-black px-10 py-5 text-xs tracking-[0.2em] flex items-center space-x-3 transition-all uppercase rounded-xl shadow-xl shadow-[#D4AF37]/20"
                >
                  <Plus className="w-5 h-5" />
                  <span>New Drop</span>
                </button>
              )}

              {activeTab === 'Orders' && (
                <button className="bg-white text-black font-black px-10 py-5 text-xs tracking-[0.2em] flex items-center space-x-3 transition-all uppercase rounded-xl hover:bg-zinc-200">
                  <CreditCard className="w-5 h-5" />
                  <span>Export List</span>
                </button>
              )}
            </div>
          </div>

          {/* Tab Content Render */}
          <div className="relative z-10 pb-20">
            {activeTab === 'Overview' && renderOverview()}
            {activeTab === 'Products' && renderProducts()}
            {activeTab === 'Orders' && renderOrders()}
            {/* {activeTab === 'Analytics' && renderAnalytics()} */}
          </div>
        </div>
      </main>

      {isAddModalOpen && (
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            resetForm();
          }}
          newName={newName}
          setNewName={setNewName}
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          newPrice={newPrice}
          setNewPrice={setNewPrice}
          newStock={newStock}
          setNewStock={setNewStock}
          newImageUrl={newImageUrl}
          setNewImageUrl={setNewImageUrl}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          selectedFileName={selectedFileName}
          setSelectedFileName={setSelectedFileName}
          setSelectedFile={setSelectedFile}
          handleFileChange={handleFileChange}
          handleAddProduct={handleAddProduct}
          isSubmitting={isSubmitting}
        />
      )}

      {isEditModalOpen && (
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            resetForm();
            setEditingProduct(null);
          }}
          newName={newName}
          setNewName={setNewName}
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          newPrice={newPrice}
          setNewPrice={setNewPrice}
          newStock={newStock}
          setNewStock={setNewStock}
          newImageUrl={newImageUrl}
          setNewImageUrl={setNewImageUrl}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          selectedFileName={selectedFileName}
          setSelectedFileName={setSelectedFileName}
          setSelectedFile={setSelectedFile}
          handleFileChange={handleFileChange}
          handleEditProduct={handleEditProduct}
          isSubmitting={isSubmitting}
          product={editingProduct}
        />
      )}
      {isOrderModalOpen && (
        <OrderDetailsModal
          isOpen={isOrderModalOpen}
          order={selectedOrder}
          onClose={() => {
            setIsOrderModalOpen(false);
            setSelectedOrder(null);
          }}
          onStatusUpdate={async (newStatus: string) => {
            if (!selectedOrder) return;
            const { error } = await supabase
              .from('orders')
              .update({ status: newStatus })
              .eq('id', selectedOrder.id);

            if (error) {
              alert('Failed to update status');
            } else {
              setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus } : o));
              setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
          }}
        />
      )}

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/90 backdrop-blur-md z-[65] animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <style>{`
        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        /* Dashboard scrollbar styling */
        ::-webkit-scrollbar {
          width: 5px;
        }
        ::-webkit-scrollbar-track {
          background: #000;
        }
        ::-webkit-scrollbar-thumb {
          background: #222;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #D4AF37;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  newName: string;
  setNewName: (val: string) => void;
  newCategory: string;
  setNewCategory: (val: string) => void;
  newPrice: string;
  setNewPrice: (val: string) => void;
  newStock: string;
  setNewStock: (val: string) => void;
  newImageUrl: string;
  setNewImageUrl: (val: string) => void;
  imagePreview: string | null;
  setImagePreview: (val: string | null) => void;
  selectedFileName: string | null;
  setSelectedFileName: (val: string | null) => void;
  setSelectedFile: (file: File | null) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddProduct: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  newName,
  setNewName,
  newCategory,
  setNewCategory,
  newPrice,
  setNewPrice,
  newStock,
  setNewStock,
  newImageUrl,
  setNewImageUrl,
  imagePreview,
  setImagePreview,
  selectedFileName,
  setSelectedFileName,
  setSelectedFile,
  handleFileChange,
  handleAddProduct,
  isSubmitting
}) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div
      className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    />
    <div className="relative bg-zinc-950 border border-zinc-900 w-full max-w-xl p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto scrollbar-hide">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="mb-6">
        <h2 className="text-2xl font-heading font-black tracking-tighter uppercase mb-2 text-white">Initialize New Drop</h2>
        <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.2em]">Enter technical specs for release.</p>
      </div>

      <form className="space-y-4" onSubmit={handleAddProduct}>
        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Product Name</label>
          <input
            type="text"
            required
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full bg-black border border-zinc-900 p-3 text-[11px] font-black uppercase tracking-tight focus:border-[#D4AF37] outline-none transition-colors text-white"
            placeholder="e.g. Republic Heavyweight Hoodie"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Category</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full bg-black border border-zinc-900 p-3 text-[11px] font-black uppercase tracking-tight focus:border-[#D4AF37] outline-none transition-colors appearance-none text-white"
            >
              <option>Tops</option>
              <option>Shorts</option>
              <option>Caps</option>
              <option>Jackets</option>
              <option>Apparel</option>
              <option>Accessories</option>
              <option>Unisex</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Price (₦)</label>
            <input
              type="number"
              required
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="w-full bg-black border border-zinc-900 p-3 text-[11px] font-black focus:border-[#D4AF37] outline-none transition-colors text-white"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Initial Stock</label>
          <input
            type="number"
            value={newStock}
            onChange={(e) => setNewStock(e.target.value)}
            className="w-full bg-black border border-zinc-900 p-3 text-[11px] font-black focus:border-[#D4AF37] outline-none transition-colors text-white"
            placeholder="100"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Product Image Assets</label>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <input
                  type="file"
                  id="product-image-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="product-image-upload"
                  className="flex items-center justify-between bg-black border border-zinc-900 p-3 group hover:border-[#D4AF37] transition-colors cursor-pointer"
                >
                  <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest truncate max-w-[120px]">
                    {selectedFileName || "Upload Asset"}
                  </span>
                  <Plus className="w-3.5 h-3.5 text-zinc-600 group-hover:text-[#D4AF37] transition-colors" />
                </label>
              </div>
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="bg-black border border-zinc-900 p-3 text-[11px] font-black uppercase tracking-tight focus:border-[#D4AF37] outline-none transition-colors text-white"
                placeholder="or paste url"
              />
            </div>

            {imagePreview && (
              <div className="relative aspect-video w-full bg-black border border-zinc-900 overflow-hidden group">
                <img src={imagePreview} className="w-full h-full object-cover opacity-80" alt="Preview" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                  <p className="text-[8px] font-black text-white uppercase tracking-widest">Preview: {selectedFileName || 'Asset URL'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setImagePreview(null); setSelectedFileName(null); setSelectedFile(null); setNewImageUrl(''); }}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 text-white hover:text-[#D4AF37] transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#D4AF37] hover:bg-[#C9A84C] text-black font-black py-4 text-[11px] tracking-[0.3em] uppercase shadow-xl shadow-[#D4AF37]/20 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Processing Drop...' : 'Confirm Drop'}
          </button>
        </div>
      </form>
    </div>
  </div>
);

const EditProductModal: React.FC<any> = ({
  isOpen,
  onClose,
  newName,
  setNewName,
  newCategory,
  setNewCategory,
  newPrice,
  setNewPrice,
  newStock,
  setNewStock,
  newImageUrl,
  setNewImageUrl,
  imagePreview,
  setImagePreview,
  selectedFileName,
  setSelectedFileName,
  setSelectedFile,
  handleFileChange,
  handleEditProduct,
  isSubmitting,
  product
}) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div
      className="absolute inset-0 bg-black/95 backdrop-blur-xl animate-in fade-in duration-500"
      onClick={onClose}
    />
    <div className="relative bg-zinc-950 border border-zinc-900 w-full max-w-2xl p-0 shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-hidden rounded-sm flex flex-col md:flex-row">
      {/* Left side - Product Image Preview/Status */}
      <div className="w-full md:w-5/12 bg-zinc-900/50 border-b md:border-b-0 md:border-r border-zinc-900 p-8 flex flex-col items-center justify-center text-center">
        <div className="relative group w-full aspect-square bg-black border border-zinc-800 shrink-0 overflow-hidden mb-6 shadow-2xl">
          {imagePreview ? (
            <img src={imagePreview} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Preview" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700">
              <ImageIcon className="w-12 h-12 mb-2 opacity-20" />
              <p className="text-[10px] font-black uppercase tracking-widest">No Asset Loaded</p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
            <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">ID: {product?.id?.toString().substring(0, 8)}</span>
          </div>
        </div>
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-1">Live Drop Update</h4>
          <p className="text-xl font-heading font-black text-white italic tracking-tighter uppercase leading-none truncate max-w-[200px]">
            {newName || "Unnamed Drop"}
          </p>
        </div>
      </div>

      {/* Right side - Edit Form */}
      <div className="flex-1 p-8 md:p-10 overflow-y-auto bg-black/20">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white transition-colors bg-zinc-900/50 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-10">
          <h2 className="text-3xl font-heading font-black tracking-tighter uppercase mb-2 text-white italic">Edit Drop Specs</h2>
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em]">Adjust technical details for release.</p>
        </div>

        <form className="space-y-6" onSubmit={handleEditProduct}>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Product Designation</label>
            <input
              type="text"
              required
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-900 p-4 text-xs font-black uppercase focus:border-[#D4AF37] outline-none transition-colors text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Category Tag</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 p-4 text-xs font-black uppercase focus:border-[#D4AF37] outline-none transition-colors appearance-none text-white"
              >
                <option>Tops</option>
                <option>Shorts</option>
                <option>Caps</option>
                <option>Jackets</option>
                <option>Apparel</option>
                <option>Accessories</option>
                <option>Unisex</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Price (₦)</label>
              <input
                type="number"
                required
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-900 p-4 text-xs font-black focus:border-[#D4AF37] outline-none transition-colors text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Inventory Supply</label>
            <input
              type="number"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-900 p-4 text-xs font-black focus:border-[#D4AF37] outline-none transition-colors text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Update Asset Source</label>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="file"
                    id="edit-product-image-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="edit-product-image-upload"
                    className="flex items-center justify-between bg-zinc-950 border border-zinc-900 p-4 group hover:border-[#D4AF37] transition-colors cursor-pointer"
                  >
                    <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest truncate max-w-[120px]">
                      {selectedFileName || "Upload New"}
                    </span>
                    <Plus className="w-4 h-4 text-zinc-600 group-hover:text-[#D4AF37] transition-colors" />
                  </label>
                </div>
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="bg-zinc-950 border border-zinc-900 p-4 text-xs font-black focus:border-[#D4AF37] outline-none transition-colors text-white"
                  placeholder="or paste url"
                />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#D4AF37] hover:bg-[#C9A84C] text-black font-black py-5 text-[12px] tracking-[0.4em] uppercase shadow-2xl shadow-[#D4AF37]/20 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed italic"
            >
              {isSubmitting ? 'Updating Core Logic...' : 'Synchronize Drop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
);

const OrderDetailsModal: React.FC<{
  isOpen: boolean;
  order: any;
  onClose: () => void;
  onStatusUpdate: (status: string) => void;
}> = ({ isOpen, order, onClose, onStatusUpdate }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/95 backdrop-blur-xl animate-in fade-in duration-500"
        onClick={onClose}
      />
      <div className="relative bg-zinc-950 border border-zinc-900 w-full max-w-4xl p-0 shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-hidden rounded-sm flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-zinc-900 flex justify-between items-center bg-black">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em]">Operational Intel</span>
              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 border ${order.status === 'Shipped' ? 'bg-emerald-600/10 text-emerald-600 border-emerald-600/20' : 'bg-yellow-600/10 text-yellow-600 border-yellow-600/20'
                }`}>
                {order.status}
              </span>
            </div>
            <h2 className="text-3xl font-heading font-black tracking-tighter uppercase text-white italic">Order #GHR-{order.id.substring(0, 8)}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors bg-zinc-900/50 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column: Customer & Shipping */}
            <div className="space-y-10">
              <section>
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-6 pb-2 border-b border-zinc-900">Customer Profile</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Full Name</p>
                    <p className="text-sm font-black text-white uppercase">{order.customer_name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Email Source</p>
                      <p className="text-xs font-bold text-zinc-300">{order.email}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Comm Line</p>
                      <p className="text-xs font-bold text-zinc-300">{order.phone}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-green-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                      <div className="w-1 h-1 bg-green-500 rounded-full"></div> WhatsApp Verified
                    </p>
                    <p className="text-xs font-bold text-zinc-300">{order.whatsapp}</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-6 pb-2 border-b border-zinc-900">Drop Location</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Destination Address</p>
                    <p className="text-xs font-bold text-zinc-300 uppercase leading-relaxed">{order.address}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">State Sector</p>
                    <p className="text-xs font-black text-white uppercase italic">{order.state}</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-6 pb-2 border-b border-zinc-900">Operational Controls</h3>
                <div className="flex flex-wrap gap-3">
                  {['Pending', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => onStatusUpdate(status)}
                      className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border transition-all ${order.status === status
                        ? 'bg-[#D4AF37] border-[#D4AF37] text-black'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                        }`}
                    >
                      Set {status}
                    </button>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column: Order Items */}
            <div className="bg-zinc-900/30 border border-zinc-900 p-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-8 pb-2 border-b border-zinc-800">Arsenal Manifest</h3>
              <div className="space-y-6">
                {(Array.isArray(order.items) ? order.items : []).map((item: any, idx: number) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-black border border-zinc-800 shrink-0 overflow-hidden">
                      <img src={item.image_url || item.image} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-black uppercase text-white">{item.name}</p>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                        Qty: {item.quantity} • ₦{item.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-white">₦{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}

                <div className="mt-10 pt-6 border-t border-zinc-800">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Subtotal Asset Value</span>
                    <span className="text-lg font-black text-white">₦{order.total_amount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Logistics Fee</span>
                    <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">Calculated on Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-zinc-900/50 border-t border-zinc-900 text-center">
          <p className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.5em]">GOHARDREPUBLIC SECURE FULFILLMENT SYSTEMS v2.0</p>
        </div>
      </div>
    </div>
  );
};
