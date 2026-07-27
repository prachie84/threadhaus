'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

type Tab = 'recent' | 'all';

interface OrderItem {
  name: string;
  image: string;
  alt: string;
  price: number;
  qty: number;
}

interface Order {
  id: string;
  date: string;
  status: 'delivered' | 'shipped' | 'processing' | 'cancelled';
  total: number;
  items: OrderItem[];
  tracking: string;
  eta: string;
  steps: string[];
  currentStep: number;
}

const orders: Order[] = [
{
  id: 'TH-2026-84721',
  date: 'July 24, 2026',
  status: 'shipped',
  total: 427,
  items: [
  { name: 'Linen Blazer — Oat', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1070a870d-1772240204012.png", alt: 'Linen blazer thumbnail', price: 189, qty: 1 },
  { name: 'Merino Crew Knit', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1b465c2b1-1772208510320.png", alt: 'Merino knit thumbnail', price: 95, qty: 1 }],

  tracking: 'USPS 9400111899223456789012',
  eta: 'July 31, 2026',
  steps: ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'],
  currentStep: 2
},
{
  id: 'TH-2026-71034',
  date: 'June 15, 2026',
  status: 'delivered',
  total: 192,
  items: [
  { name: 'Canvas Mini Dress', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1ed508361-1767087158201.png", alt: 'Canvas dress thumbnail', price: 128, qty: 1 }],

  tracking: 'USPS 9400111899223456789099',
  eta: 'June 20, 2026',
  steps: ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'],
  currentStep: 4
},
{
  id: 'TH-2026-55209',
  date: 'May 3, 2026',
  status: 'delivered',
  total: 310,
  items: [
  { name: 'Wool Overcoat', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1e153fba7-1772627021511.png", alt: 'Wool overcoat thumbnail', price: 345, qty: 1 }],

  tracking: 'USPS 9400111899223456789044',
  eta: 'May 9, 2026',
  steps: ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'],
  currentStep: 4
},
{
  id: 'TH-2026-38812',
  date: 'March 20, 2026',
  status: 'delivered',
  total: 200,
  items: [
  { name: 'Silk Slip Skirt', image: "https://img.rocket.new/generatedImages/rocket_gen_img_12d19e183-1772088035632.png", alt: 'Silk slip skirt thumbnail', price: 142, qty: 1 },
  { name: 'Satin Cami Top', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1c45c6ecd-1772883574210.png", alt: 'Satin cami top thumbnail', price: 58, qty: 1 }],

  tracking: 'USPS 9400111899223456789033',
  eta: 'March 26, 2026',
  steps: ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'],
  currentStep: 4
},
{
  id: 'TH-2025-99104',
  date: 'December 8, 2025',
  status: 'delivered',
  total: 96,
  items: [
  { name: 'Kids Stripe Tee Set × 2', image: "https://images.unsplash.com/photo-1503959751433-2e212603d8ea", alt: 'Kids stripe tee set thumbnail', price: 48, qty: 2 }],

  tracking: 'USPS 9400111899223456789011',
  eta: 'December 14, 2025',
  steps: ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'],
  currentStep: 4
}];


const statusConfig: Record<string, {label: string;cls: string;icon: string;}> = {
  delivered: { label: 'Delivered', cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200', icon: 'CheckCircleIcon' },
  shipped: { label: 'Shipped', cls: 'bg-blue-50 text-blue-700 border border-blue-200', icon: 'TruckIcon' },
  processing: { label: 'Processing', cls: 'bg-amber-50 text-amber-700 border border-amber-200', icon: 'ClockIcon' },
  cancelled: { label: 'Cancelled', cls: 'bg-red-50 text-red-700 border border-red-200', icon: 'XCircleIcon' }
};

export default function OrderHistoryClient() {
  const [tab, setTab] = useState<Tab>('recent');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const recentOrders = orders.slice(0, 2);
  const displayOrders = tab === 'recent' ? recentOrders : orders;

  const toggleExpand = (id: string) => {
    setExpandedOrder((prev) => prev === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      {/* Page Header */}
      <div className="mb-8 animate-in">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/account-dashboard" className="text-muted-foreground hover:text-accent transition-colors">
            <Icon name="ArrowLeftIcon" size={18} />
          </Link>
          <span className="label-tag text-accent">ThreadHaus</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Order History</h1>
        <p className="text-muted-foreground mt-1">Track and review all your past purchases</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 animate-in-delay-1">
        {[
        { label: 'Total Orders', value: orders.length, icon: 'ShoppingBagIcon' },
        { label: 'Delivered', value: orders.filter((o) => o.status === 'delivered').length, icon: 'CheckCircleIcon' },
        { label: 'In Transit', value: orders.filter((o) => o.status === 'shipped').length, icon: 'TruckIcon' },
        { label: 'Total Spent', value: `$${orders.reduce((s, o) => s + o.total, 0)}`, icon: 'CurrencyDollarIcon' }].
        map((stat) =>
        <div key={stat.label} className="bg-card border border-border rounded-2xl p-4">
            <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center mb-3">
              <Icon name={stat.icon as any} size={18} className="text-accent" />
            </div>
            <div className="text-xl font-bold text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 animate-in-delay-2">
        {(['recent', 'all'] as Tab[]).map((t) =>
        <button
          key={t}
          onClick={() => setTab(t)}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
          tab === t ?
          'bg-accent text-white' : 'bg-secondary text-muted-foreground hover:text-foreground'}`
          }>
            {t === 'recent' ? 'Recent Purchases' : `All Orders (${orders.length})`}
          </button>
        )}
      </div>

      {/* Orders List */}
      <div className="space-y-4 animate-in-delay-2">
        {displayOrders.map((order) => {
          const sc = statusConfig[order.status];
          const isExpanded = expandedOrder === order.id;

          return (
            <div key={order.id} className="bg-card border border-border rounded-2xl overflow-hidden card-hover">
              {/* Order Header */}
              <div className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-foreground text-sm">{order.id}</span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${sc.cls}`}>
                        <Icon name={sc.icon as any} size={10} />
                        {sc.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{order.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-foreground">${order.total}</span>
                    <button
                      onClick={() => toggleExpand(order.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-foreground text-xs font-medium hover:bg-accent hover:text-white transition-all">
                      {isExpanded ? 'Hide' : 'Details'}
                      <Icon name={isExpanded ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={12} />
                    </button>
                  </div>
                </div>

                {/* Item thumbnails */}
                <div className="flex items-center gap-2">
                  {order.items.map((item, i) =>
                  <div key={i} className="w-12 h-12 rounded-xl overflow-hidden border border-border flex-shrink-0">
                      <AppImage src={item.image} alt={item.alt} width={48} height={48} className="object-cover w-full h-full" />
                    </div>
                  )}
                  <div className="ml-2">
                    <p className="text-sm font-medium text-foreground">
                      {order.items.map((i) => i.name).join(' · ')}
                    </p>
                    <p className="text-xs text-muted-foreground">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded &&
              <div className="border-t border-border p-5 bg-secondary/30 animate-scale-in">
                  {/* Tracking Progress */}
                  {order.status !== 'cancelled' &&
                <div className="mb-6">
                      <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4">Tracking Progress</h4>
                      <div className="relative">
                        <div className="flex items-center justify-between relative">
                          {/* Progress line */}
                          <div className="absolute top-3.5 left-0 right-0 h-0.5 bg-border z-0">
                            <div
                          className="h-full bg-accent transition-all duration-700"
                          style={{ width: `${order.currentStep / (order.steps.length - 1) * 100}%` }} />
                          </div>
                          {order.steps.map((step, i) =>
                      <div key={step} className="flex flex-col items-center gap-2 z-10 flex-1">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                        i <= order.currentStep ?
                        'bg-accent border-accent text-white' : 'bg-card border-border text-muted-foreground'}`
                        }>
                                {i < order.currentStep ?
                          <Icon name="CheckIcon" size={12} /> :
                          i === order.currentStep ?
                          <div className="w-2 h-2 rounded-full bg-white" /> :

                          <div className="w-2 h-2 rounded-full bg-border" />
                          }
                              </div>
                              <span className={`text-[9px] text-center font-mono-label leading-tight ${
                        i <= order.currentStep ? 'text-accent font-semibold' : 'text-muted-foreground'}`
                        }>
                                {step}
                              </span>
                            </div>
                      )}
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                        <Icon name="TruckIcon" size={14} className="text-accent" />
                        <span>{order.tracking}</span>
                        <span className="ml-auto">ETA: {order.eta}</span>
                      </div>
                    </div>
                }

                  {/* Items breakdown */}
                  <div>
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Items</h4>
                    <div className="space-y-3">
                      {order.items.map((item, i) =>
                    <div key={i} className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-xl overflow-hidden border border-border flex-shrink-0">
                            <AppImage src={item.image} alt={item.alt} width={56} height={56} className="object-cover w-full h-full" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">{item.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: {item.qty}</p>
                          </div>
                          <span className="font-bold text-foreground text-sm">${item.price}</span>
                        </div>
                    )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-border flex justify-between">
                      <span className="text-sm text-muted-foreground">Order Total</span>
                      <span className="font-bold text-foreground">${order.total}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-white text-xs font-semibold hover:bg-accent-dark transition-all">
                      <Icon name="ArrowPathIcon" size={13} />
                      Reorder
                    </button>
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-foreground text-xs font-semibold hover:border-accent hover:text-accent transition-all">
                      <Icon name="DocumentTextIcon" size={13} />
                      Invoice
                    </button>
                    {order.status === 'delivered' &&
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border text-foreground text-xs font-semibold hover:border-accent hover:text-accent transition-all">
                        <Icon name="StarIcon" size={13} />
                        Review
                      </button>
                  }
                  </div>
                </div>
              }
            </div>);

        })}
      </div>

      {/* Back to shopping */}
      <div className="mt-10 text-center animate-in-delay-4">
        <Link href="/products" className="btn-accent">
          Continue Shopping
          <Icon name="ArrowRightIcon" size={16} />
        </Link>
      </div>
    </div>);

}