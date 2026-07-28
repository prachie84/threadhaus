'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';

interface StatsData {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total: number;
  created_at: string;
  delivery_first_name: string;
  delivery_last_name: string;
  delivery_email: string;
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  is_premium: boolean;
  created_at: string;
  city: string;
  country: string;
}

type ActiveTab = 'overview' | 'orders' | 'users' | 'content';

const STATUS_COLORS: Record<string, string> = {
  confirmed: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  processing: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
  shipped: 'bg-purple-500/15 text-purple-400 border border-purple-500/20',
  delivered: 'bg-green-500/15 text-green-400 border border-green-500/20',
  cancelled: 'bg-red-500/15 text-red-400 border border-red-500/20',
};

export default function AdminDashboardClient() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [stats, setStats] = useState<StatsData>({ totalUsers: 0, totalOrders: 0, totalRevenue: 0, pendingOrders: 0 });
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [contentCounts, setContentCounts] = useState({ helpCategories: 0, helpArticles: 0, sizeCharts: 0, productHighlights: 0 });
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const isAdmin = user?.user_metadata?.role === 'admin' || user?.app_metadata?.role === 'admin';

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/sign-up-login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchAllData();
    } else if (user && !isAdmin && !loading) {
      setDataLoading(false);
    }
  }, [user, isAdmin, loading]);

  const fetchAllData = async () => {
    setDataLoading(true);
    setError(null);
    try {
      const [usersRes, ordersRes, helpCatRes, helpArtRes, sizeRes, highlightsRes] = await Promise.all([
        supabase.from('user_profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('help_categories').select('id', { count: 'exact', head: true }),
        supabase.from('help_articles').select('id', { count: 'exact', head: true }),
        supabase.from('size_charts').select('id', { count: 'exact', head: true }),
        supabase.from('product_highlights').select('id', { count: 'exact', head: true }),
      ]);

      const allUsers: UserProfile[] = usersRes.data || [];
      const allOrders: Order[] = ordersRes.data || [];

      const totalRevenue = allOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
      const pendingOrders = allOrders.filter(o => ['confirmed', 'processing'].includes(o.status)).length;

      setStats({
        totalUsers: allUsers.length,
        totalOrders: allOrders.length,
        totalRevenue,
        pendingOrders,
      });
      setUsers(allUsers);
      setOrders(allOrders);
      setContentCounts({
        helpCategories: helpCatRes.count || 0,
        helpArticles: helpArtRes.count || 0,
        sizeCharts: sizeRes.count || 0,
        productHighlights: highlightsRes.count || 0,
      });
    } catch (err: any) {
      setError('Failed to load dashboard data. Please ensure you have admin privileges.');
    } finally {
      setDataLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
      if (!updateError) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
        const pendingOrders = updatedOrders.filter(o => ['confirmed', 'processing'].includes(o.status)).length;
        setStats(prev => ({ ...prev, pendingOrders }));
      }
    } catch {
      // silently fail
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const filteredOrders = orderStatusFilter === 'all'
    ? orders
    : orders.filter(o => o.status === orderStatusFilter);

  const formatCurrency = (val: number) => `$${val.toFixed(2)}`;
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading admin dashboard…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Icon name="ShieldExclamationIcon" size={32} className="text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground text-sm mb-6">You need admin privileges to access this dashboard.</p>
          <button onClick={() => router.push('/')} className="btn-primary bg-green-600 hover:bg-green-700 text-sm px-6 py-2.5">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: 'UsersIcon', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Total Orders', value: stats.totalOrders, icon: 'ShoppingBagIcon', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: 'BanknotesIcon', color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Pending Orders', value: stats.pendingOrders, icon: 'ClockIcon', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  ];

  const tabs: { id: ActiveTab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: 'Squares2X2Icon' },
    { id: 'orders', label: 'Orders', icon: 'ShoppingBagIcon' },
    { id: 'users', label: 'Users', icon: 'UsersIcon' },
    { id: 'content', label: 'Content', icon: 'DocumentTextIcon' },
  ];

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-green-500/15 rounded-lg flex items-center justify-center">
              <Icon name="ShieldCheckIcon" size={18} className="text-green-400" />
            </div>
            <span className="text-xs font-semibold text-green-400 uppercase tracking-widest">Admin</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">ThreadHaus store management & analytics</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-2">
            <Icon name="ExclamationCircleIcon" size={16} />
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-muted/40 p-1 rounded-xl w-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab.icon} size={15} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((card) => (
                <div key={card.label} className="bg-card border border-border rounded-2xl p-5">
                  <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
                    <Icon name={card.icon} size={20} className={card.color} />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{card.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{card.label}</div>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-border">
                <h2 className="font-semibold text-foreground">Recent Orders</h2>
                <button onClick={() => setActiveTab('orders')} className="text-xs text-accent hover:underline">
                  View all
                </button>
              </div>
              {orders.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">No orders yet</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Order</th>
                        <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Customer</th>
                        <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground">Status</th>
                        <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map(order => (
                        <tr key={order.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="px-5 py-3 font-mono text-xs text-foreground">{order.order_number}</td>
                          <td className="px-5 py-3 text-muted-foreground">
                            {order.delivery_first_name} {order.delivery_last_name}
                          </td>
                          <td className="px-5 py-3">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[order.status] || STATUS_COLORS.confirmed}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right font-medium text-foreground">{formatCurrency(Number(order.total))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Content Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Help Categories', value: contentCounts.helpCategories, icon: 'FolderIcon' },
                { label: 'Help Articles', value: contentCounts.helpArticles, icon: 'DocumentTextIcon' },
                { label: 'Size Charts', value: contentCounts.sizeCharts, icon: 'TableCellsIcon' },
                { label: 'Product Highlights', value: contentCounts.productHighlights, icon: 'SparklesIcon' },
              ].map(item => (
                <div key={item.label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
                  <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name={item.icon} size={18} className="text-accent" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground">{item.value}</div>
                    <div className="text-xs text-muted-foreground">{item.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              {['all', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                <button
                  key={status}
                  onClick={() => setOrderStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                    orderStatusFilter === status
                      ? 'bg-accent text-white' :'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {status === 'all' ? `All (${orders.length})` : status}
                </button>
              ))}
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              {filteredOrders.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground text-sm">No orders found</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground">Order #</th>
                        <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground">Customer</th>
                        <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground">Date</th>
                        <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground">Status</th>
                        <th className="text-right px-5 py-3.5 text-xs font-semibold text-muted-foreground">Total</th>
                        <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground">Update</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map(order => (
                        <tr key={order.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                          <td className="px-5 py-3.5 font-mono text-xs text-foreground">{order.order_number}</td>
                          <td className="px-5 py-3.5">
                            <div className="text-foreground font-medium">{order.delivery_first_name} {order.delivery_last_name}</div>
                            <div className="text-xs text-muted-foreground">{order.delivery_email}</div>
                          </td>
                          <td className="px-5 py-3.5 text-muted-foreground text-xs">{formatDate(order.created_at)}</td>
                          <td className="px-5 py-3.5">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[order.status] || STATUS_COLORS.confirmed}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-right font-semibold text-foreground">{formatCurrency(Number(order.total))}</td>
                          <td className="px-5 py-3.5">
                            <select
                              value={order.status}
                              disabled={updatingOrderId === order.id}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="text-xs bg-muted border border-border rounded-lg px-2 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
                            >
                              {['confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {users.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground text-sm">No users found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground">User</th>
                      <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground">Location</th>
                      <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground">Joined</th>
                      <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground">Plan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-accent/15 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-accent">
                                {(u.full_name || u.email || '?').charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{u.full_name || '—'}</div>
                              <div className="text-xs text-muted-foreground">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground text-xs">
                          {[u.city, u.country].filter(Boolean).join(', ') || '—'}
                        </td>
                        <td className="px-5 py-3.5 text-muted-foreground text-xs">{formatDate(u.created_at)}</td>
                        <td className="px-5 py-3.5">
                          {u.is_premium ? (
                            <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-500/15 text-yellow-400 border border-yellow-500/20 font-medium">Premium</span>
                          ) : (
                            <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium">Free</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* CONTENT TAB */}
        {activeTab === 'content' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                title: 'Help Center',
                items: [
                  { label: 'Categories', value: contentCounts.helpCategories, icon: 'FolderIcon' },
                  { label: 'Articles', value: contentCounts.helpArticles, icon: 'DocumentTextIcon' },
                ],
                link: '/help-center',
                linkLabel: 'View Help Center',
              },
              {
                title: 'Product Content',
                items: [
                  { label: 'Size Charts', value: contentCounts.sizeCharts, icon: 'TableCellsIcon' },
                  { label: 'Product Highlights', value: contentCounts.productHighlights, icon: 'SparklesIcon' },
                ],
                link: '/products',
                linkLabel: 'View Products',
              },
            ].map(section => (
              <div key={section.title} className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-semibold text-foreground mb-4">{section.title}</h3>
                <div className="space-y-3 mb-5">
                  {section.items.map(item => (
                    <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-border/50">
                      <div className="flex items-center gap-2.5">
                        <Icon name={item.icon} size={16} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                      </div>
                      <span className="text-sm font-semibold text-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>
                <a
                  href={section.link}
                  className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline font-medium"
                >
                  {section.linkLabel}
                  <Icon name="ArrowRightIcon" size={12} />
                </a>
              </div>
            ))}

            {/* Quick Links */}
            <div className="md:col-span-2 bg-card border border-border rounded-2xl p-6">
              <h3 className="font-semibold text-foreground mb-4">Quick Navigation</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Products', href: '/products', icon: 'ShoppingBagIcon' },
                  { label: 'Help Center', href: '/help-center', icon: 'QuestionMarkCircleIcon' },
                  { label: 'Order History', href: '/order-history', icon: 'ClockIcon' },
                  { label: 'My Account', href: '/account-dashboard', icon: 'UserIcon' },
                ].map(link => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/40 hover:bg-muted transition-colors text-center"
                  >
                    <Icon name={link.icon} size={20} className="text-accent" />
                    <span className="text-xs font-medium text-foreground">{link.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
