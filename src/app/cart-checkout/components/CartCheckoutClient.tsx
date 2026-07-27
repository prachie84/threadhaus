'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

const initialCart = [
{ id: 1, name: 'Linen Blazer — Oat', size: 'S', color: 'Oat', price: 189, qty: 1, image: "https://img.rocket.new/generatedImages/rocket_gen_img_12d9f7a89-1772550274617.png", alt: 'Cream linen blazer product thumbnail' },
{ id: 2, name: 'Merino Crew Knit', size: 'M', color: 'Navy', price: 95, qty: 2, image: "https://img.rocket.new/generatedImages/rocket_gen_img_18cefc125-1782215489094.png", alt: 'Navy merino crewneck sweater product thumbnail' },
{ id: 4, name: 'Kids Stripe Tee Set', size: '4T', color: 'Multi', price: 48, qty: 1, image: "https://img.rocket.new/generatedImages/rocket_gen_img_1d6e8d191-1765390236020.png", alt: 'Colorful striped children\'s tee set product thumbnail' }];


type Step = 'cart' | 'shipping' | 'payment' | 'confirmed';

export default function CartCheckoutClient() {
  const [cart, setCart] = useState(initialCart);
  const [step, setStep] = useState<Step>('cart');
  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '',
    cardNumber: '', cardExpiry: '', cardCVV: '', cardName: '',
    paymentMethod: 'card'
  });

  const updateQty = (id: number, delta: number) => {
    setCart((prev) => prev.map((item) =>
    item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ).filter((item) => item.qty > 0));
  };

  const removeItem = (id: number) => setCart((prev) => prev.filter((item) => item.id !== id));

  const subtotal = cart.reduce((s, item) => s + item.price * item.qty, 0);
  const discount = promoApplied ? Math.round(subtotal * 0.15) : 0;
  const shipping = subtotal - discount >= 75 ? 0 : 8;
  const total = subtotal - discount + shipping;

  const steps: {key: Step;label: string;}[] = [
  { key: 'cart', label: 'Cart' },
  { key: 'shipping', label: 'Shipping' },
  { key: 'payment', label: 'Payment' },
  { key: 'confirmed', label: 'Confirmed' }];


  const stepIndex = steps.findIndex((s) => s.key === step);

  if (step === 'confirmed') {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6 animate-scale-in">
          <Icon name="CheckIcon" size={40} className="text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-3">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-2">Thank you for shopping with ThreadHaus.</p>
        <p className="label-tag text-accent mb-8">Order #TH-2026-84721</p>
        <div className="bg-card border border-border rounded-2xl p-6 text-left space-y-4 mb-8">
          <div className="flex items-center gap-3">
            <Icon name="TruckIcon" size={20} className="text-accent" />
            <div>
              <p className="text-sm font-semibold text-foreground">Estimated Delivery</p>
              <p className="text-sm text-muted-foreground">July 31 – August 3, 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Icon name="EnvelopeIcon" size={20} className="text-accent" />
            <div>
              <p className="text-sm font-semibold text-foreground">Confirmation Sent</p>
              <p className="text-sm text-muted-foreground">Check your email for tracking details</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/account-dashboard" className="btn-primary">
            Track Order
          </Link>
          <Link href="/products" className="btn-outline">
            Continue Shopping
          </Link>
        </div>
      </div>);

  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-0 mb-10">
        {steps.filter((s) => s.key !== 'confirmed').map((s, i) =>
        <React.Fragment key={s.key}>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
            i <= stepIndex ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground border border-border'}`
            }>
                {i < stepIndex ? <Icon name="CheckIcon" size={14} /> : i + 1}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${i <= stepIndex ? 'text-foreground' : 'text-muted-foreground'}`}>
                {s.label}
              </span>
            </div>
            {i < 2 && <div className={`w-12 sm:w-20 h-px mx-2 transition-colors ${i < stepIndex ? 'bg-primary' : 'bg-border'}`} />}
          </React.Fragment>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          {step === 'cart' &&
          <>
              <h1 className="text-2xl font-bold text-foreground mb-6">Your Cart ({cart.length} items)</h1>
              {cart.map((item) =>
            <div key={item.id} className="bg-card border border-border rounded-2xl p-4 flex gap-4 animate-in">
                  <div className="relative w-20 h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <AppImage src={item.image} alt={item.alt} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm mb-1">{item.name}</h3>
                    <p className="label-tag text-muted-foreground mb-3">
                      {item.color} · Size {item.size}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-border rounded-full overflow-hidden">
                        <button onClick={() => updateQty(item.id, -1)} className="px-3 py-1 hover:bg-muted transition-colors">
                          <Icon name="MinusIcon" size={12} className="text-foreground" />
                        </button>
                        <span className="px-3 py-1 text-sm font-semibold text-foreground">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="px-3 py-1 hover:bg-muted transition-colors">
                          <Icon name="PlusIcon" size={12} className="text-foreground" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-foreground">${item.price * item.qty}</span>
                        <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-red-500 transition-colors">
                          <Icon name="TrashIcon" size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
            )}
            </>
          }

          {step === 'shipping' &&
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-bold text-foreground mb-2">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-tag text-muted-foreground block mb-1">First Name</label>
                  <input className="input-field" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="Sarah" />
                </div>
                <div>
                  <label className="label-tag text-muted-foreground block mb-1">Last Name</label>
                  <input className="input-field" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Mitchell" />
                </div>
              </div>
              <div>
                <label className="label-tag text-muted-foreground block mb-1">Email</label>
                <input type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="sarah@example.com" />
              </div>
              <div>
                <label className="label-tag text-muted-foreground block mb-1">Phone</label>
                <input type="tel" className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(555) 000-0000" />
              </div>
              <div>
                <label className="label-tag text-muted-foreground block mb-1">Street Address</label>
                <input className="input-field" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="123 Maple Street, Apt 4B" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="label-tag text-muted-foreground block mb-1">City</label>
                  <input className="input-field" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Brooklyn" />
                </div>
                <div>
                  <label className="label-tag text-muted-foreground block mb-1">State</label>
                  <input className="input-field" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="NY" />
                </div>
                <div>
                  <label className="label-tag text-muted-foreground block mb-1">ZIP</label>
                  <input className="input-field" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} placeholder="11201" />
                </div>
              </div>
            </div>
          }

          {step === 'payment' &&
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-bold text-foreground mb-2">Payment</h2>
              <div className="flex gap-3 mb-4">
                {[
              { value: 'card', label: 'Credit Card', icon: 'CreditCardIcon' },
              { value: 'upi', label: 'PayPal', icon: 'DevicePhoneMobileIcon' }].
              map((method) =>
              <button
                key={method.value}
                onClick={() => setForm({ ...form, paymentMethod: method.value })}
                className={`flex-1 flex items-center gap-2 p-3 rounded-xl border text-sm font-semibold transition-all ${
                form.paymentMethod === method.value ?
                'border-accent bg-accent/5 text-foreground' :
                'border-border text-muted-foreground hover:border-foreground'}`
                }>
                
                    <Icon name={method.icon as any} size={16} />
                    {method.label}
                  </button>
              )}
              </div>
              {form.paymentMethod === 'card' &&
            <div className="space-y-4">
                  <div>
                    <label className="label-tag text-muted-foreground block mb-1">Card Number</label>
                    <input className="input-field" placeholder="4242 4242 4242 4242" value={form.cardNumber} onChange={(e) => setForm({ ...form, cardNumber: e.target.value })} />
                  </div>
                  <div>
                    <label className="label-tag text-muted-foreground block mb-1">Name on Card</label>
                    <input className="input-field" placeholder="Sarah Mitchell" value={form.cardName} onChange={(e) => setForm({ ...form, cardName: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label-tag text-muted-foreground block mb-1">Expiry</label>
                      <input className="input-field" placeholder="MM / YY" value={form.cardExpiry} onChange={(e) => setForm({ ...form, cardExpiry: e.target.value })} />
                    </div>
                    <div>
                      <label className="label-tag text-muted-foreground block mb-1">CVV</label>
                      <input className="input-field" placeholder="•••" value={form.cardCVV} onChange={(e) => setForm({ ...form, cardCVV: e.target.value })} />
                    </div>
                  </div>
                </div>
            }
              <div className="flex items-center gap-2 p-3 bg-secondary rounded-xl">
                <Icon name="ShieldCheckIcon" size={16} className="text-emerald-600" />
                <span className="text-xs text-muted-foreground">Your payment is encrypted and secure</span>
              </div>
            </div>
          }
        </div>

        {/* Order Summary */}
        <aside className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-foreground">Order Summary</h2>

            {cart.map((item) =>
            <div key={item.id} className="flex items-center gap-3">
                <div className="relative w-12 h-14 rounded-lg overflow-hidden flex-shrink-0">
                  <AppImage src={item.image} alt={item.alt} fill className="object-cover" sizes="48px" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[9px] rounded-full flex items-center justify-center font-bold">
                    {item.qty}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{item.name}</p>
                  <p className="text-[10px] text-muted-foreground">Size {item.size}</p>
                </div>
                <span className="text-sm font-bold text-foreground">${item.price * item.qty}</span>
              </div>
            )}

            <div className="border-t border-border pt-4 space-y-2">
              {/* Promo */}
              <div className="flex gap-2">
                <input
                  className="input-field text-sm py-2"
                  placeholder="Promo code"
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)} />
                
                <button
                  onClick={() => {if (promo === 'THREAD15') setPromoApplied(true);}}
                  className="btn-outline text-xs px-3 py-2 flex-shrink-0">
                  
                  Apply
                </button>
              </div>
              {promoApplied &&
              <p className="text-xs text-emerald-600 font-medium">✓ THREAD15 applied — 15% off</p>
              }
            </div>

            <div className="border-t border-border pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>
              {discount > 0 &&
              <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>-${discount}</span>
                </div>
              }
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
              </div>
              <div className="flex justify-between font-bold text-foreground text-base pt-2 border-t border-border">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => {
              if (step === 'cart') setStep('shipping');else
              if (step === 'shipping') setStep('payment');else
              if (step === 'payment') setStep('confirmed');
            }}
            className="btn-primary w-full justify-center">
            
            {step === 'cart' && 'Proceed to Shipping'}
            {step === 'shipping' && 'Continue to Payment'}
            {step === 'payment' && 'Place Order'}
            <Icon name="ArrowRightIcon" size={16} />
          </button>

          {step !== 'cart' &&
          <button
            onClick={() => {
              if (step === 'shipping') setStep('cart');else
              if (step === 'payment') setStep('shipping');
            }}
            className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors py-2">
            
              ← Back
            </button>
          }
        </aside>
      </div>
    </div>);

}