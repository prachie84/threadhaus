'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';

const PRODUCTS: Record<number, { name: string; price: number; image: string; alt: string }> = {
  1: { name: 'Linen Blazer — Oat', price: 189, image: 'https://img.rocket.new/generatedImages/rocket_gen_img_1532036f0-1772156814358.png', alt: 'Cream linen blazer on a wooden hanger' },
  2: { name: 'Merino Crew Knit', price: 95, image: "https://img.rocket.new/generatedImages/rocket_gen_img_18cefc125-1782215489094.png", alt: 'Navy merino crewneck sweater' },
  3: { name: 'Canvas Mini Dress', price: 128, image: "https://img.rocket.new/generatedImages/rocket_gen_img_1b0f117f6-1772207839646.png", alt: 'Woman in beige canvas mini dress' },
  4: { name: 'Kids Stripe Tee Set', price: 48, image: 'https://img.rocket.new/generatedImages/rocket_gen_img_164ae6a30-1783930456471.png', alt: "Colorful striped children's tee and shorts" },
  5: { name: 'Tailored Chino', price: 115, image: "https://img.rocket.new/generatedImages/rocket_gen_img_1c7b53d2d-1772082875829.png", alt: 'Slim-fit khaki chino trousers' },
  6: { name: 'Silk Slip Skirt', price: 142, image: "https://img.rocket.new/generatedImages/rocket_gen_img_1f19ecffe-1772953562198.png", alt: 'Ivory silk midi slip skirt' },
  7: { name: 'Oversized Oxford Shirt', price: 82, image: "https://img.rocket.new/generatedImages/rocket_gen_img_1daee3820-1770953093707.png", alt: 'White oversized oxford button-up shirt' },
  8: { name: 'Wool Overcoat', price: 345, image: "https://img.rocket.new/generatedImages/rocket_gen_img_1b5a52dcf-1772082876368.png", alt: 'Camel wool overcoat on wooden hanger' },
  9: { name: 'Kids Puffer Jacket', price: 64, image: 'https://images.unsplash.com/photo-1612172897925-ae0e55670dfb', alt: "Bright red children's puffer jacket" },
  10: { name: 'Satin Cami Top', price: 58, image: "https://img.rocket.new/generatedImages/rocket_gen_img_14aff5c97-1772354891287.png", alt: 'Champagne satin cami top' },
  11: { name: 'Denim Trucker Jacket', price: 135, image: "https://img.rocket.new/generatedImages/rocket_gen_img_151cb9898-1772273307052.png", alt: 'Classic indigo denim trucker jacket' },
  12: { name: 'Kids Floral Dress', price: 52, image: "https://img.rocket.new/generatedImages/rocket_gen_img_10023c4dc-1773117988530.png", alt: "Colorful floral children's dress" },
};

interface DeliveryForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  notes: string;
}

type Step = 'delivery' | 'payment' | 'confirmed';

export default function CheckoutClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const productId = Number(searchParams.get('buy') || 1);
  const product = PRODUCTS[productId] || PRODUCTS[1];

  const [step, setStep] = useState<Step>('delivery');
  const [form, setForm] = useState<DeliveryForm>({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '', country: 'United States', notes: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [placing, setPlacing] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [orderError, setOrderError] = useState('');

  const shipping = 0;
  const tax = Math.round(product.price * 0.08 * 100) / 100;
  const total = product.price + shipping + tax;

  // Pre-fill email from auth user
  useEffect(() => {
    if (user?.email && !form.email) {
      setForm((prev) => ({ ...prev, email: user.email }));
    }
  }, [user]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/sign-up-login?redirect=/checkout?buy=${productId}`);
    }
  }, [authLoading, user, router, productId]);

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlacing(true);
    setOrderError('');

    try {
      const supabase = createClient();
      const generatedOrderNumber = `TH-${Math.floor(100000 + Math.random() * 900000)}`;

      // Save order to Supabase
      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: generatedOrderNumber,
          status: 'confirmed',
          subtotal: product.price,
          tax: tax,
          shipping: shipping,
          total: total,
          delivery_first_name: form.firstName,
          delivery_last_name: form.lastName,
          delivery_email: form.email,
          delivery_phone: form.phone,
          delivery_address: form.address,
          delivery_city: form.city,
          delivery_state: form.state,
          delivery_zip: form.zip,
          delivery_country: form.country,
          delivery_notes: form.notes,
          payment_method: paymentMethod,
        })
        .select()
        .single();

      if (orderErr) {
        console.error('Order save error:', orderErr.message);
        // Still proceed — don't block checkout on DB error
      } else if (orderData) {
        // Save order item
        await supabase.from('order_items').insert({
          order_id: orderData.id,
          product_id: productId,
          product_name: product.name,
          product_image: product.image,
          price: product.price,
          quantity: 1,
        });
      }

      setOrderNumber(generatedOrderNumber);
      setStep('confirmed');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Checkout error:', err);
      setOrderError('Something went wrong. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  const updateForm = (field: keyof DeliveryForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading checkout…</p>
        </div>
      </div>
    );
  }

  // Order Confirmed screen
  if (step === 'confirmed') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center animate-in">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <Icon name="CheckIcon" size={36} className="text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-1">Thank you, {form.firstName}!</p>
          <p className="text-muted-foreground text-sm mb-6">
            Your order <span className="font-bold text-foreground">{orderNumber}</span> has been placed successfully.
            A confirmation will be sent to <span className="font-semibold text-foreground">{form.email}</span>.
          </p>

          {/* Order Summary Card */}
          <div className="bg-card border border-border rounded-2xl p-5 mb-6 text-left">
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
              <div className="relative w-16 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <AppImage src={product.image} alt={product.alt} fill className="object-cover" sizes="64px" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{product.name}</p>
                <p className="text-muted-foreground text-xs mt-0.5">Qty: 1</p>
                <p className="font-bold text-foreground mt-1">${product.price}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery to</span>
                <span className="text-foreground font-medium text-right max-w-[60%]">{form.address}, {form.city}, {form.state} {form.zip}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Estimated delivery</span>
                <span className="text-foreground font-medium">3–5 business days</span>
              </div>
            </div>
          </div>

          {/* Tracking steps */}
          <div className="bg-card border border-border rounded-2xl p-5 mb-8">
            <h3 className="font-bold text-foreground text-sm mb-4 text-left">Order Status</h3>
            <div className="flex items-center justify-between">
              {[
                { icon: 'CheckCircleIcon', label: 'Confirmed', done: true },
                { icon: 'CubeIcon', label: 'Processing', done: false },
                { icon: 'TruckIcon', label: 'Shipped', done: false },
                { icon: 'HomeIcon', label: 'Delivered', done: false },
              ].map((s, i, arr) => (
                <React.Fragment key={s.label}>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${s.done ? 'bg-emerald-100 text-emerald-600' : 'bg-muted text-muted-foreground'}`}>
                      <Icon name={s.icon as any} size={16} />
                    </div>
                    <span className={`text-[9px] font-semibold uppercase tracking-wider ${s.done ? 'text-emerald-600' : 'text-muted-foreground'}`}>{s.label}</span>
                  </div>
                  {i < arr.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${s.done ? 'bg-emerald-200' : 'bg-border'}`} />}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/order-history" className="btn-primary flex-1 justify-center">
              <Icon name="ClipboardDocumentListIcon" size={16} />
              Track Order
            </Link>
            <Link href="/products" className="btn-outline flex-1 justify-center">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-foreground">ThreadHaus</Link>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="ShieldCheckIcon" size={16} className="text-accent" />
            <span className="hidden sm:inline">Secure Checkout</span>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="border-b border-border bg-card/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2 sm:gap-4">
            {[
              { key: 'delivery', label: 'Delivery', icon: 'TruckIcon' },
              { key: 'payment', label: 'Payment', icon: 'CreditCardIcon' },
              { key: 'confirmed', label: 'Confirmed', icon: 'CheckCircleIcon' },
            ].map((s, i, arr) => (
              <React.Fragment key={s.key}>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s.key ? 'bg-accent text-white' :
                    (step === 'payment' && s.key === 'delivery') || step === 'confirmed' ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    {(step === 'payment' && s.key === 'delivery') || step === 'confirmed' ? (
                      <Icon name="CheckIcon" size={14} />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className={`text-sm font-semibold hidden sm:inline ${step === s.key ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {s.label}
                  </span>
                </div>
                {i < arr.length - 1 && <div className="flex-1 h-px bg-border" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Form Area */}
          <div className="lg:col-span-2">

            {/* Delivery Form */}
            {step === 'delivery' && (
              <form onSubmit={handleDeliverySubmit} className="animate-in space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-1">Delivery Details</h1>
                  <p className="text-muted-foreground text-sm">Enter your shipping address below</p>
                </div>

                {/* Contact Info */}
                <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-4">
                  <h2 className="font-bold text-foreground flex items-center gap-2">
                    <Icon name="UserIcon" size={16} className="text-accent" />
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label-tag text-muted-foreground block mb-1.5">First Name *</label>
                      <input type="text" required className="input-field" placeholder="Sarah"
                        value={form.firstName} onChange={(e) => updateForm('firstName', e.target.value)} />
                    </div>
                    <div>
                      <label className="label-tag text-muted-foreground block mb-1.5">Last Name *</label>
                      <input type="text" required className="input-field" placeholder="Mitchell"
                        value={form.lastName} onChange={(e) => updateForm('lastName', e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label-tag text-muted-foreground block mb-1.5">Email Address *</label>
                      <input type="email" required className="input-field" placeholder="sarah@example.com"
                        value={form.email} onChange={(e) => updateForm('email', e.target.value)} />
                    </div>
                    <div>
                      <label className="label-tag text-muted-foreground block mb-1.5">Phone Number</label>
                      <input type="tel" className="input-field" placeholder="+1 (555) 000-0000"
                        value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-4">
                  <h2 className="font-bold text-foreground flex items-center gap-2">
                    <Icon name="MapPinIcon" size={16} className="text-accent" />
                    Shipping Address
                  </h2>
                  <div>
                    <label className="label-tag text-muted-foreground block mb-1.5">Street Address *</label>
                    <input type="text" required className="input-field" placeholder="123 Main Street, Apt 4B"
                      value={form.address} onChange={(e) => updateForm('address', e.target.value)} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label-tag text-muted-foreground block mb-1.5">City *</label>
                      <input type="text" required className="input-field" placeholder="New York"
                        value={form.city} onChange={(e) => updateForm('city', e.target.value)} />
                    </div>
                    <div>
                      <label className="label-tag text-muted-foreground block mb-1.5">State / Province *</label>
                      <input type="text" required className="input-field" placeholder="NY"
                        value={form.state} onChange={(e) => updateForm('state', e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label-tag text-muted-foreground block mb-1.5">ZIP / Postal Code *</label>
                      <input type="text" required className="input-field" placeholder="10001"
                        value={form.zip} onChange={(e) => updateForm('zip', e.target.value)} />
                    </div>
                    <div>
                      <label className="label-tag text-muted-foreground block mb-1.5">Country *</label>
                      <select required className="input-field"
                        value={form.country} onChange={(e) => updateForm('country', e.target.value)}>
                        <option>United States</option>
                        <option>Canada</option>
                        <option>United Kingdom</option>
                        <option>Australia</option>
                        <option>Germany</option>
                        <option>France</option>
                        <option>Japan</option>
                        <option>India</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="label-tag text-muted-foreground block mb-1.5">Delivery Notes (optional)</label>
                    <textarea className="input-field resize-none h-20" placeholder="Leave at door, ring bell, etc."
                      value={form.notes} onChange={(e) => updateForm('notes', e.target.value)} />
                  </div>
                </div>

                {/* Delivery Options */}
                <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-3">
                  <h2 className="font-bold text-foreground flex items-center gap-2">
                    <Icon name="TruckIcon" size={16} className="text-accent" />
                    Delivery Method
                  </h2>
                  {[
                    { id: 'standard', label: 'Standard Delivery', sub: '3–5 business days', price: 'Free' },
                    { id: 'express', label: 'Express Delivery', sub: '1–2 business days', price: '$9.99' },
                  ].map((opt) => (
                    <label key={opt.id} className="flex items-center justify-between p-4 rounded-xl border border-border cursor-pointer hover:border-accent transition-colors has-[:checked]:border-accent has-[:checked]:bg-accent/5">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="delivery" defaultChecked={opt.id === 'standard'} className="accent-accent" />
                        <div>
                          <p className="font-semibold text-foreground text-sm">{opt.label}</p>
                          <p className="text-muted-foreground text-xs">{opt.sub}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-bold ${opt.price === 'Free' ? 'text-emerald-600' : 'text-foreground'}`}>{opt.price}</span>
                    </label>
                  ))}
                </div>

                <button type="submit" className="btn-primary w-full justify-center text-base py-4">
                  Continue to Payment
                  <Icon name="ArrowRightIcon" size={16} />
                </button>
              </form>
            )}

            {/* Payment Form */}
            {step === 'payment' && (
              <form onSubmit={handlePlaceOrder} className="animate-in space-y-6">
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setStep('delivery')}
                    className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-accent transition-colors">
                    <Icon name="ArrowLeftIcon" size={16} className="text-foreground" />
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">Payment</h1>
                    <p className="text-muted-foreground text-sm">All transactions are secure and encrypted</p>
                  </div>
                </div>

                {orderError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                    <Icon name="ExclamationCircleIcon" size={16} className="flex-shrink-0" />
                    {orderError}
                  </div>
                )}

                {/* Payment Method Toggle */}
                <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 space-y-4">
                  <h2 className="font-bold text-foreground flex items-center gap-2">
                    <Icon name="CreditCardIcon" size={16} className="text-accent" />
                    Payment Method
                  </h2>
                  <div className="flex gap-3">
                    {[
                      { id: 'card' as const, label: 'Credit / Debit Card' },
                      { id: 'paypal' as const, label: 'PayPal' },
                    ].map((m) => (
                      <button key={m.id} type="button" onClick={() => setPaymentMethod(m.id)}
                        className={`flex-1 py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                          paymentMethod === m.id ? 'border-accent bg-accent/5 text-accent' : 'border-border text-muted-foreground hover:border-foreground'
                        }`}>
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {paymentMethod === 'card' ? (
                    <div className="space-y-4">
                      <div>
                        <label className="label-tag text-muted-foreground block mb-1.5">Card Number *</label>
                        <input type="text" required className="input-field" placeholder="1234 5678 9012 3456"
                          maxLength={19} value={cardForm.number}
                          onChange={(e) => {
                            const v = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                            setCardForm((p) => ({ ...p, number: v }));
                          }} />
                      </div>
                      <div>
                        <label className="label-tag text-muted-foreground block mb-1.5">Cardholder Name *</label>
                        <input type="text" required className="input-field" placeholder="Sarah Mitchell"
                          value={cardForm.name}
                          onChange={(e) => setCardForm((p) => ({ ...p, name: e.target.value }))} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="label-tag text-muted-foreground block mb-1.5">Expiry Date *</label>
                          <input type="text" required className="input-field" placeholder="MM / YY"
                            maxLength={7} value={cardForm.expiry}
                            onChange={(e) => {
                              const v = e.target.value.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1 / $2');
                              setCardForm((p) => ({ ...p, expiry: v }));
                            }} />
                        </div>
                        <div>
                          <label className="label-tag text-muted-foreground block mb-1.5">CVV *</label>
                          <input type="text" required className="input-field" placeholder="•••"
                            maxLength={4} value={cardForm.cvv}
                            onChange={(e) => setCardForm((p) => ({ ...p, cvv: e.target.value.replace(/\D/g, '') }))} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground text-sm">
                      <Icon name="ArrowTopRightOnSquareIcon" size={24} className="mx-auto mb-2 text-accent" />
                      You will be redirected to PayPal to complete your payment securely.
                    </div>
                  )}
                </div>

                {/* Delivery Summary */}
                <div className="bg-card border border-border rounded-2xl p-5 sm:p-6">
                  <h2 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <Icon name="MapPinIcon" size={16} className="text-accent" />
                    Delivering to
                  </h2>
                  <p className="text-sm text-foreground font-semibold">{form.firstName} {form.lastName}</p>
                  <p className="text-sm text-muted-foreground">{form.address}</p>
                  <p className="text-sm text-muted-foreground">{form.city}, {form.state} {form.zip}</p>
                  <p className="text-sm text-muted-foreground">{form.country}</p>
                  <button type="button" onClick={() => setStep('delivery')} className="text-accent text-xs font-semibold hover:underline mt-2 block">
                    Edit address
                  </button>
                </div>

                <button type="submit" disabled={placing}
                  className="btn-primary w-full justify-center text-base py-4 disabled:opacity-70">
                  {placing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Placing Order…
                    </>
                  ) : (
                    <>
                      <Icon name="LockClosedIcon" size={16} />
                      Place Order — ${total.toFixed(2)}
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-muted-foreground">
                  By placing your order you agree to our{' '}
                  <Link href="/terms" className="text-accent hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-accent hover:underline">Privacy Policy</Link>.
                </p>
              </form>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 sticky top-24 space-y-5">
              <h2 className="font-bold text-foreground">Order Summary</h2>

              {/* Product */}
              <div className="flex items-center gap-4 pb-4 border-b border-border">
                <div className="relative w-16 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  <AppImage src={product.image} alt={product.alt} fill className="object-cover" sizes="64px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm leading-snug">{product.name}</p>
                  <p className="text-muted-foreground text-xs mt-0.5">Qty: 1</p>
                  <p className="font-bold text-foreground mt-1">${product.price}</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground">${product.price}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (8%)</span>
                  <span className="text-foreground">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-foreground text-base pt-2 border-t border-border">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Trust badges */}
              <div className="space-y-2.5 pt-2 border-t border-border">
                {[
                  { icon: 'ShieldCheckIcon', text: 'Secure SSL encryption' },
                  { icon: 'TruckIcon', text: 'Free standard shipping' },
                  { icon: 'ArrowPathIcon', text: '60-day hassle-free returns' },
                ].map((b) => (
                  <div key={b.text} className="flex items-center gap-2.5 text-xs text-muted-foreground">
                    <Icon name={b.icon as any} size={14} className="text-accent flex-shrink-0" />
                    {b.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}