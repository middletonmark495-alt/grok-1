'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { supabase } from '../../lib/supabase';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CARD_STYLE = { style: { base: { color: '#fff', fontFamily: 'Inter, sans-serif', fontSize: '15px', '::placeholder': { color: '#666' } }, invalid: { color: '#e74c3c' } } };

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const shipping = subtotal >= 150 ? 0 : 12.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  const [form, setForm] = useState({ firstName: '', lastName: '', email: user?.email || '', address: '', city: '', state: '', zip: '', country: 'US' });
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(total * 100) }),
      });
      const { clientSecret, error: apiError } = await res.json();
      if (apiError) { toast.error(apiError); setLoading(false); return; }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement), billing_details: { name: `${form.firstName} ${form.lastName}`, email: form.email } },
      });
      if (error) { toast.error(error.message); setLoading(false); return; }

      if (paymentIntent.status === 'succeeded') {
        const { data } = await supabase.from('orders').insert({
          user_id: user?.id || null, email: form.email, items, shipping_address: form,
          subtotal, shipping, tax, total, payment_intent_id: paymentIntent.id, status: 'confirmed',
        }).select().single();
        clearCart();
        router.push(`/order-confirmation/${data.id}`);
      }
    } catch (err) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) return (
    <div style={{ textAlign: 'center', padding: '80px 0' }}>
      <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', marginBottom: 16 }}>Your bag is empty</p>
      <Link href="/shop"><button className="btn-primary">Start Shopping</button></Link>
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #2a2a2a' }}>Contact</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-field"><label>First Name</label><input value={form.firstName} onChange={update('firstName')} placeholder="Mark" required /></div>
                <div className="form-field"><label>Last Name</label><input value={form.lastName} onChange={update('lastName')} placeholder="Kingdom" required /></div>
              </div>
              <div className="form-field"><label>Email</label><input type="email" value={form.email} onChange={update('email')} placeholder="you@kingdom.com" required /></div>
            </div>
          </div>
          <div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #2a2a2a' }}>Shipping Address</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-field"><label>Street Address</label><input value={form.address} onChange={update('address')} placeholder="123 Royal Ave" required /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-field"><label>City</label><input value={form.city} onChange={update('city')} placeholder="Los Angeles" required /></div>
                <div className="form-field"><label>State</label><input value={form.state} onChange={update('state')} placeholder="CA" required /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-field"><label>ZIP</label><input value={form.zip} onChange={update('zip')} placeholder="90001" required /></div>
                <div className="form-field"><label>Country</label>
                  <select value={form.country} onChange={update('country')} style={{ background: 'var(--dark-3)', border: '1px solid #333', color: 'var(--white)', padding: '12px 16px' }}>
                    <option value="US">United States</option><option value="CA">Canada</option><option value="GB">United Kingdom</option><option value="AU">Australia</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', gap: 10 }}>Payment <FiLock style={{ fontSize: '0.9rem', color: 'var(--gold)' }} /></h3>
            <div style={{ padding: '16px', background: 'var(--dark-3)', border: '1px solid #333' }}><CardElement options={CARD_STYLE} /></div>
            <p style={{ fontSize: '0.75rem', color: 'var(--gray)', marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}><FiLock /> Encrypted & secure via Stripe</p>
          </div>
          <button type="submit" disabled={loading || !stripe} className="btn-primary" style={{ justifyContent: 'center', padding: '18px', width: '100%', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Processing...' : `Place Order — ${formatCurrency(total)}`}
          </button>
        </div>

        <div>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid #2a2a2a' }}>Order Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 24 }}>
            {items.map((item) => (
              <div key={`${item.id}-${item.selectedSize}`} style={{ display: 'flex', gap: 16 }}>
                <div style={{ width: 64, height: 80, background: 'var(--dark-3)', flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
                  {item.image && <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  <span style={{ position: 'absolute', top: -6, right: -6, background: 'var(--gold)', color: '#000', width: 20, height: 20, borderRadius: '50%', fontSize: '0.65rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.qty}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '0.9rem', marginBottom: 4 }}>{item.name}</p>
                  {item.selectedSize && <p style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>Size: {item.selectedSize}</p>}
                  <p style={{ color: 'var(--gold)', fontWeight: 600, marginTop: 4 }}>{formatCurrency(item.price * item.qty)}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[{ label: 'Subtotal', val: formatCurrency(subtotal) }, { label: 'Shipping', val: shipping === 0 ? 'Free' : formatCurrency(shipping) }, { label: 'Tax (8%)', val: formatCurrency(tax) }].map(({ label, val }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>{label}</span>
                <span style={{ color: val === 'Free' ? 'var(--gold)' : 'var(--white)' }}>{val}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid #2a2a2a', marginTop: 4 }}>
              <span style={{ fontWeight: 600, fontFamily: 'Playfair Display, serif' }}>Total</span>
              <span style={{ color: 'var(--gold)', fontWeight: 700, fontSize: '1.1rem' }}>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default function Checkout() {
  return (
    <div style={{ paddingTop: 100, minHeight: '100vh' }}>
      <div className="container" style={{ padding: '48px 24px 80px' }}>
        <div style={{ marginBottom: 48 }}>
          <p className="section-subtitle">Secure Checkout</p>
          <h1 className="section-title">Complete Your Order</h1>
          <div className="gold-line" />
        </div>
        <Elements stripe={stripePromise}><CheckoutForm /></Elements>
      </div>
    </div>
  );
}
