'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

type Section = 'overview' | 'orders' | 'wishlist' | 'history' | 'profile';

const user = {
  name: 'Sarah Mitchell',
  email: 'sarah.mitchell@example.com',
  avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_108ed02a8-1772083195755.png",
  memberSince: 'March 2025',
  isPremium: true
};

const orders = [
{
  id: 'TH-2026-84721',
  date: 'July 24, 2026',
  status: 'shipped',
  total: 427,
  items: [
  { name: 'Linen Blazer — Oat', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1070a870d-1772240204012.png", alt: 'Linen blazer thumbnail' },
  { name: 'Merino Crew Knit', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1b465c2b1-1772208510320.png", alt: 'Merino knit thumbnail' }],

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
  { name: 'Canvas Mini Dress', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1ed508361-1767087158201.png", alt: 'Canvas dress thumbnail' }],

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
  { name: 'Wool Overcoat', image: "https://img.rocket.new/generatedImages/rocket_gen_img_1e7d0a39a-1766848179010.png", alt: 'Wool overcoat thumbnail' }],

  tracking: 'USPS 9400111899223456789044',
  eta: 'May 9, 2026',
  steps: ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'],
  currentStep: 4
}];


const wishlistItems = [
{ id: 5, name: 'Tailored Chino', price: 115, image: "https://img.rocket.new/generatedImages/rocket_gen_img_10ad1d344-1780235561222.png", alt: 'Khaki chino trousers flat-laid on white surface' },
{ id: 8, name: 'Wool Overcoat', price: 345, image: "https://img.rocket.new/generatedImages/rocket_gen_img_1b5a52dcf-1772082876368.png", alt: 'Camel wool overcoat on wooden hanger' },
{ id: 7, name: 'Oversized Oxford Shirt', price: 82, image: "https://img.rocket.new/generatedImages/rocket_gen_img_1dd8b5e14-1773073473101.png", alt: 'White oversized oxford shirt against white wall' },
{ id: 10, name: 'Satin Cami Top', price: 58, image: "https://img.rocket.new/generatedImages/rocket_gen_img_19a4c2324-1772324673218.png", alt: 'Champagne satin cami top on white hanger' }];


const purchaseHistory = [
{ id: 'TH-2026-71034', date: 'June 15, 2026', items: 'Canvas Mini Dress', total: 192, status: 'delivered' },
{ id: 'TH-2026-55209', date: 'May 3, 2026', items: 'Wool Overcoat', total: 310, status: 'delivered' },
{ id: 'TH-2026-38812', date: 'March 20, 2026', items: 'Silk Slip Skirt · Satin Cami', total: 200, status: 'delivered' },
{ id: 'TH-2025-99104', date: 'December 8, 2025', items: 'Kids Stripe Tee Set × 2', total: 96, status: 'delivered' }];


const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    pending: 'order-status-pending',
    processing: 'order-status-processing',
    shipped: 'order-status-shipped',
    delivered: 'order-status-delivered',
    cancelled: 'order-status-cancelled'
  };
  return map[status] || 'order-status-processing';
};

const navItems: {key: Section;label: string;icon: string;}[] = [
{ key: 'overview', label: 'Overview', icon: 'Squares2X2Icon' },
{ key: 'orders', label: 'My Orders', icon: 'ShoppingBagIcon' },
{ key: 'wishlist', label: 'Wishlist', icon: 'HeartIcon' },
{ key: 'history', label: 'Purchase History', icon: 'ClockIcon' },
{ key: 'profile', label: 'Edit Profile', icon: 'UserIcon' }];


export default function DashboardClient() {
  const [section, setSection] = useState<Section>('overview');
  const [trackingOrder, setTrackingOrder] = useState<string | null>(null);
  const [savedWishlist, setSavedWishlist] = useState(wishlistItems.map((i) => i.id));
  const [profileForm, setProfileForm] = useState({
    firstName: 'Sarah',
    lastName: 'Mitchell',
    email: 'sarah.mitchell@example.com',
    phone: '(212) 555-0148'
  });
  const [profileSaved, setProfileSaved] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const removeWishlist = (id: number) => setSavedWishlist((prev) => prev.filter((x) => x !== id));

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const trackingOrderData = orders.find((o) => o.id === trackingOrder);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="flex md:hidden items-center gap-2 mb-6 text-sm font-semibold text-foreground">
        
        <Icon name="Bars3Icon" size={20} />
        Menu
      </button>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className={`
          fixed md:relative inset-y-0 left-0 z-40 w-64 bg-background md:bg-transparent
          border-r md:border-r-0 border-border
          transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          flex-shrink-0 pt-20 md:pt-0 px-4 md:px-0
        `}>
          {/* User card */}
          <div className="bg-card border border-border rounded-2xl p-5 mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-accent">
                <AppImage
                  src={user.avatar}
                  alt="Sarah Mitchell profile photo, smiling woman with warm skin tone, soft studio background"
                  fill
                  className="object-cover"
                  sizes="48px" />
                
              </div>
              <div className="min-w-0">
                <p className="font-bold text-foreground text-sm truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
            {user.isPremium &&
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-accent/10 border border-accent/20">
                <Icon name="SparklesIcon" size={14} className="text-accent" />
                <span className="text-xs font-bold text-accent">Premium Member</span>
              </div>
            }
          </div>

          <nav className="space-y-1">
            {navItems.map((item) =>
            <button
              key={item.key}
              onClick={() => {setSection(item.key);setSidebarOpen(false);}}
              className={`sidebar-nav-item w-full text-left ${section === item.key ? 'active' : ''}`}>
              
                <Icon name={item.icon as any} size={18} />
                {item.label}
              </button>
            )}
            <div className="pt-4 border-t border-border mt-4">
              <Link href="/sign-up-login" className="sidebar-nav-item text-red-500 hover:bg-red-50 hover:text-red-600 w-full">
                <Icon name="ArrowRightOnRectangleIcon" size={18} />
                Sign Out
              </Link>
            </div>
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen &&
        <div
          className="fixed inset-0 z-30 bg-primary/40 md:hidden"
          onClick={() => setSidebarOpen(false)} />

        }

        {/* Main Content */}
        <main className="flex-1 min-w-0">

          {/* OVERVIEW */}
          {section === 'overview' &&
          <div className="space-y-6 animate-in">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Good morning, Sarah 👋</h1>
                <p className="text-muted-foreground text-sm mt-1">Here's what's happening with your account.</p>
              </div>

              {/* Premium card */}
              {user.isPremium &&
            <div className="relative rounded-2xl overflow-hidden bg-primary px-6 py-6">
                  <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-accent/20 blur-2xl pointer-events-none" />
                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="SparklesIcon" size={16} className="text-accent" />
                        <span className="label-tag text-accent">Premium Member</span>
                      </div>
                      <p className="text-primary-foreground font-bold text-lg">Your benefits are active</p>
                      <p className="text-primary-foreground/60 text-sm">15% off every order · Free express shipping · Early access</p>
                    </div>
                    <div className="text-right">
                      <p className="label-tag text-primary-foreground/40">Member since</p>
                      <p className="text-primary-foreground font-semibold">{user.memberSince}</p>
                    </div>
                  </div>
                </div>
            }

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
              { label: 'Total Orders', value: orders.length, icon: 'ShoppingBagIcon' },
              { label: 'Wishlist Items', value: savedWishlist.length, icon: 'HeartIcon' },
              { label: 'Total Spent', value: '$929', icon: 'CurrencyDollarIcon' },
              { label: 'Reward Points', value: '2,340', icon: 'StarIcon' }].
              map((stat) =>
              <div key={stat.label} className="bg-card border border-border rounded-2xl p-4 space-y-2">
                    <Icon name={stat.icon as any} size={20} className="text-accent" />
                    <p className="text-xl font-bold text-foreground">{stat.value}</p>
                    <p className="label-tag text-muted-foreground">{stat.label}</p>
                  </div>
              )}
              </div>

              {/* Recent order */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-foreground">Recent Order</h2>
                  <button onClick={() => setSection('orders')} className="text-sm text-accent hover:underline font-medium">
                    View all
                  </button>
                </div>
                <div className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-bold text-foreground text-sm">{orders[0].id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusBadge(orders[0].status)}`}>
                          {orders[0].status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{orders[0].date} · ${orders[0].total}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {orders[0].items.map((item, i) =>
                      <div key={i} className="w-10 h-12 rounded-lg border-2 border-card overflow-hidden">
                            <AppImage src={item.image} alt={item.alt} width={40} height={48} className="object-cover w-full h-full" />
                          </div>
                      )}
                      </div>
                      <button
                      onClick={() => setTrackingOrder(orders[0].id)}
                      className="btn-outline text-xs py-2 px-4">
                      
                        Track
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }

          {/* ORDERS */}
          {section === 'orders' &&
          <div className="space-y-4 animate-in">
              <h1 className="text-2xl font-bold text-foreground mb-6">My Orders</h1>
              {orders.map((order) =>
            <div key={order.id} className="bg-card border border-border rounded-2xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-bold text-foreground text-sm">{order.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{order.date} · ${order.total}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {order.items.map((item, i) =>
                    <div key={i} className="w-10 h-12 rounded-lg border-2 border-card overflow-hidden">
                            <AppImage src={item.image} alt={item.alt} width={40} height={48} className="object-cover w-full h-full" />
                          </div>
                    )}
                      </div>
                      <button
                    onClick={() => setTrackingOrder(order.id)}
                    className="btn-outline text-xs py-2 px-4">
                    
                        <Icon name="MapPinIcon" size={12} />
                        Track
                      </button>
                    </div>
                  </div>

                  {/* Mini tracking bar */}
                  <div className="overflow-x-auto scrollbar-hide">
                    <div className="flex items-center gap-0 min-w-max">
                      {order.steps.map((stepLabel, i) =>
                  <React.Fragment key={stepLabel}>
                          <div className="flex flex-col items-center gap-1">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${
                      i <= order.currentStep ? 'bg-primary text-primary-foreground' : 'bg-secondary border border-border text-muted-foreground'}`
                      }>
                              {i < order.currentStep ? <Icon name="CheckIcon" size={10} /> : i + 1}
                            </div>
                            <span className={`text-[9px] font-medium whitespace-nowrap ${i <= order.currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {stepLabel}
                            </span>
                          </div>
                          {i < order.steps.length - 1 &&
                    <div className={`w-8 sm:w-12 h-px mb-4 flex-shrink-0 ${i < order.currentStep ? 'bg-primary' : 'bg-border'}`} />
                    }
                        </React.Fragment>
                  )}
                    </div>
                  </div>
                </div>
            )}
            </div>
          }

          {/* WISHLIST */}
          {section === 'wishlist' &&
          <div className="animate-in">
              <h1 className="text-2xl font-bold text-foreground mb-6">
                Wishlist ({savedWishlist.length})
              </h1>
              {savedWishlist.length === 0 ?
            <div className="text-center py-20">
                  <Icon name="HeartIcon" size={48} className="text-muted mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
                  <Link href="/products" className="btn-primary">Browse Products</Link>
                </div> :

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {wishlistItems.filter((item) => savedWishlist.includes(item.id)).map((item) =>
              <div key={item.id} className="group relative bg-card border border-border rounded-2xl overflow-hidden card-hover">
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <AppImage
                    src={item.image}
                    alt={item.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="25vw" />
                  
                        <button
                    onClick={() => removeWishlist(item.id)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full glass-card flex items-center justify-center z-10">
                    
                          <Icon name="HeartIcon" variant="solid" size={14} className="text-red-500" />
                        </button>
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-foreground text-sm mb-1">{item.name}</h3>
                        <p className="font-bold text-foreground text-sm mb-2">${item.price}</p>
                        <Link
                    href={`/product-detail?id=${item.id}`}
                    className="btn-primary w-full justify-center text-xs py-2">
                    
                          View Item
                        </Link>
                      </div>
                    </div>
              )}
                </div>
            }
            </div>
          }

          {/* PURCHASE HISTORY */}
          {section === 'history' &&
          <div className="animate-in">
              <h1 className="text-2xl font-bold text-foreground mb-6">Purchase History</h1>
              <div className="space-y-3">
                {purchaseHistory.map((order) =>
              <div key={order.id} className="bg-card border border-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap mb-1">
                        <span className="font-bold text-foreground text-sm">{order.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{order.items}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{order.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-foreground">${order.total}</span>
                      <Link
                    href="/cart-checkout"
                    className="btn-outline text-xs py-2 px-4">
                    
                        Reorder
                      </Link>
                    </div>
                  </div>
              )}
              </div>
            </div>
          }

          {/* PROFILE */}
          {section === 'profile' &&
          <div className="animate-in max-w-lg">
              <h1 className="text-2xl font-bold text-foreground mb-6">Edit Profile</h1>

              {/* Avatar */}
              <div className="flex items-center gap-5 mb-8 p-5 bg-card border border-border rounded-2xl">
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-accent flex-shrink-0">
                  <AppImage
                  src={user.avatar}
                  alt="Sarah Mitchell profile photo, smiling woman with warm skin tone"
                  fill
                  className="object-cover"
                  sizes="64px" />
                
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground mb-2">Member since {user.memberSince}</p>
                  <button className="text-xs text-accent font-semibold hover:underline">
                    Change Photo
                  </button>
                </div>
                {user.isPremium &&
              <div className="ml-auto">
                    <span className="badge-premium">Premium</span>
                  </div>
              }
              </div>

              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-tag text-muted-foreground block mb-1">First Name</label>
                    <input
                    className="input-field"
                    value={profileForm.firstName}
                    onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })} />
                  
                  </div>
                  <div>
                    <label className="label-tag text-muted-foreground block mb-1">Last Name</label>
                    <input
                    className="input-field"
                    value={profileForm.lastName}
                    onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })} />
                  
                  </div>
                </div>

                <div>
                  <label className="label-tag text-muted-foreground block mb-1">Email Address</label>
                  <input
                  type="email"
                  className="input-field"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} />
                
                </div>

                <div>
                  <label className="label-tag text-muted-foreground block mb-1">Phone Number</label>
                  <input
                  type="tel"
                  className="input-field"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
                
                </div>

                <div className="pt-2 border-t border-border">
                  <p className="text-sm font-semibold text-foreground mb-3">Change Password</p>
                  <div className="space-y-3">
                    <div>
                      <label className="label-tag text-muted-foreground block mb-1">Current Password</label>
                      <input type="password" className="input-field" placeholder="••••••••" />
                    </div>
                    <div>
                      <label className="label-tag text-muted-foreground block mb-1">New Password</label>
                      <input type="password" className="input-field" placeholder="Min. 8 characters" />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn-primary">
                  {profileSaved ?
                <>
                      <Icon name="CheckIcon" size={16} />
                      Saved!
                    </> :

                <>
                      <Icon name="CheckIcon" size={16} />
                      Save Changes
                    </>
                }
                </button>
              </form>
            </div>
          }
        </main>
      </div>

      {/* Tracking Modal */}
      {trackingOrder && trackingOrderData &&
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/50 backdrop-blur-sm animate-fade-in"
        onClick={() => setTrackingOrder(null)}>
        
          <div
          className="bg-background border border-border rounded-3xl p-6 w-full max-w-md animate-scale-in"
          onClick={(e) => e.stopPropagation()}>
          
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-bold text-foreground text-lg">Track Order</h2>
                <p className="label-tag text-muted-foreground">{trackingOrderData.id}</p>
              </div>
              <button
              onClick={() => setTrackingOrder(null)}
              className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center transition-colors">
              
                <Icon name="XMarkIcon" size={18} className="text-foreground" />
              </button>
            </div>

            {/* Tracking number */}
            <div className="bg-secondary rounded-xl p-4 mb-6">
              <p className="label-tag text-muted-foreground mb-1">Tracking Number</p>
              <p className="font-mono text-sm text-foreground">{trackingOrderData.tracking}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Estimated delivery: <span className="font-semibold text-foreground">{trackingOrderData.eta}</span>
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              {trackingOrderData.steps.map((stepLabel, i) =>
            <div key={stepLabel} className="flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                i <= trackingOrderData.currentStep ?
                'bg-primary text-primary-foreground' :
                'bg-secondary border border-border text-muted-foreground'}`
                }>
                      {i < trackingOrderData.currentStep ?
                  <Icon name="CheckIcon" size={14} /> :
                  <span className="text-xs font-bold">{i + 1}</span>
                  }
                    </div>
                    {i < trackingOrderData.steps.length - 1 &&
                <div className={`w-px h-6 mt-1 ${i < trackingOrderData.currentStep ? 'bg-primary' : 'bg-border'}`} />
                }
                  </div>
                  <div className="pb-3">
                    <p className={`text-sm font-semibold ${i <= trackingOrderData.currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {stepLabel}
                    </p>
                    {i === trackingOrderData.currentStep &&
                <p className="text-xs text-accent font-medium">In progress</p>
                }
                  </div>
                </div>
            )}
            </div>
          </div>
        </div>
      }
    </div>);

}