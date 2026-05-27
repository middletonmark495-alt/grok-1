'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { FiPackage, FiUser, FiLogOut, FiShoppingBag } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Account() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('orders');

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => { setOrders(data || []); setLoading(false); });
  }, [user, router]);

  async function handleLogout() { await logout(); toast.success('Signed out'); router.push('/'); }

  if (!user) return null;

  return (
    <div style={{ paddingTop: 100, minHeight: '100vh' }}>
      <div className="container" style={{ padding: '48px 24px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p className="section-subtitle">My Account</p>
            <h1 className="section-title">Welcome, {user.user_metadata?.display_name?.split(' ')[0] || 'Royal'}</h1>
            <div className="gold-line" />
          </div>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', color: 'var(--gray)', fontSize: '0.85rem', border: '1px solid #333', padding: '10px 20px', cursor: 'pointer' }}>
            <FiLogOut /> Sign Out
          </button>
        </div>
        <div style={{ display: 'flex', gap: 0, marginBottom: 40, borderBottom: '1px solid #2a2a2a' }}>
          {[{ key: 'orders', label: 'Orders', icon: FiPackage }, { key: 'profile', label: 'Profile', icon: FiUser }].map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: 'none', color: tab === key ? 'var(--gold)' : 'var(--gray)', borderBottom: `2px solid ${tab === key ? 'var(--gold)' : 'transparent'}`, fontSize: '0.8rem', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 500, cursor: 'pointer', marginBottom: -1 }}>
              <Icon /> {label}
            </button>
          ))}
        </div>
        {tab === 'orders' && (
          loading ? <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{Array(3).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 100 }} />)}</div>
          : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--gray)' }}>
              <FiShoppingBag style={{ fontSize: '3rem', marginBottom: 16 }} />
              <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: 'var(--white)', marginBottom: 16 }}>No orders yet</p>
              <button onClick={() => router.push('/shop')} className="btn-primary">Shop Now</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {orders.map((order) => (
                <motion.div key={order.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'var(--dark-2)', border: '1px solid #2a2a2a', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                    <div>
                      <p style={{ fontSize: '0.7rem', letterSpacing: 2, color: 'var(--gray)', textTransform: 'uppercase', marginBottom: 4 }}>Order #{order.id.slice(-8).toUpperCase()}</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--gray-light)' }}>{new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ background: 'rgba(201,168,76,0.15)', color: 'var(--gold)', padding: '4px 14px', fontSize: '0.7rem', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600 }}>{order.status}</span>
                      <p style={{ color: 'var(--gold)', fontWeight: 600, marginTop: 8 }}>{formatCurrency(order.total)}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {order.items?.map((item, i) => <div key={i} style={{ fontSize: '0.8rem', color: 'var(--gray-light)', background: 'var(--dark-3)', padding: '4px 12px' }}>{item.name} × {item.qty}</div>)}
                  </div>
                </motion.div>
              ))}
            </div>
          )
        )}
        {tab === 'profile' && (
          <div style={{ maxWidth: 480, background: 'var(--dark-2)', border: '1px solid #2a2a2a', padding: '32px' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', marginBottom: 24 }}>Account Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="form-field"><label>Display Name</label><input value={user.user_metadata?.display_name || ''} readOnly style={{ opacity: 0.7 }} /></div>
              <div className="form-field"><label>Email Address</label><input value={user.email || ''} readOnly style={{ opacity: 0.7 }} /></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
