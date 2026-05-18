import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { FiPackage, FiUser, FiLogOut, FiShoppingBag } from 'react-icons/fi';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatCurrency';
import toast from 'react-hot-toast';

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('orders');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    async function fetchOrders() {
      try {
        const q = query(collection(db, 'orders'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch {} finally { setLoading(false); }
    }
    fetchOrders();
  }, [user, navigate]);

  async function handleLogout() {
    await logout();
    toast.success('Signed out');
    navigate('/');
  }

  if (!user) return null;

  return (
    <div style={{ paddingTop: 100, minHeight: '100vh' }}>
      <div className="container" style={{ padding: '48px 24px 80px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p className="section-subtitle">My Account</p>
            <h1 className="section-title">Welcome, {user.displayName?.split(' ')[0] || 'Royal'}</h1>
            <div className="gold-line" />
          </div>
          <button
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', color: 'var(--gray)', fontSize: '0.85rem', border: '1px solid #333', padding: '10px 20px', cursor: 'pointer' }}
          >
            <FiLogOut /> Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 40, borderBottom: '1px solid #2a2a2a' }}>
          {[
            { key: 'orders', label: 'Orders', icon: FiPackage },
            { key: 'profile', label: 'Profile', icon: FiUser },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '14px 28px',
                background: 'none',
                color: tab === key ? 'var(--gold)' : 'var(--gray)',
                borderBottom: `2px solid ${tab === key ? 'var(--gold)' : 'transparent'}`,
                fontSize: '0.8rem', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 500,
                cursor: 'pointer', transition: 'all 0.2s', marginBottom: -1,
              }}
            >
              <Icon /> {label}
            </button>
          ))}
        </div>

        {tab === 'orders' && (
          <div>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {Array(3).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 100 }} />)}
              </div>
            ) : orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--gray)' }}>
                <FiShoppingBag style={{ fontSize: '3rem', marginBottom: 16 }} />
                <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: 'var(--white)', marginBottom: 8 }}>No orders yet</p>
                <p style={{ marginBottom: 24 }}>Your order history will appear here</p>
                <button onClick={() => navigate('/shop')} className="btn-primary">Shop Now</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ background: 'var(--dark-2)', border: '1px solid #2a2a2a', padding: '24px' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                      <div>
                        <p style={{ fontSize: '0.7rem', letterSpacing: 2, color: 'var(--gray)', textTransform: 'uppercase', marginBottom: 4 }}>Order #{order.id.slice(-8).toUpperCase()}</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--gray-light)' }}>
                          {order.createdAt?.toDate?.()?.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) || 'Recent'}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ background: 'rgba(201,168,76,0.15)', color: 'var(--gold)', padding: '4px 14px', fontSize: '0.7rem', letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600 }}>
                          {order.status}
                        </span>
                        <p style={{ color: 'var(--gold)', fontWeight: 600, marginTop: 8 }}>{formatCurrency(order.total)}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {order.items?.map((item, i) => (
                        <div key={i} style={{ fontSize: '0.8rem', color: 'var(--gray-light)', background: 'var(--dark-3)', padding: '4px 12px' }}>
                          {item.name} × {item.qty}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'profile' && (
          <div style={{ maxWidth: 480, background: 'var(--dark-2)', border: '1px solid #2a2a2a', padding: '32px' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', marginBottom: 24 }}>Account Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="form-field">
                <label>Display Name</label>
                <input value={user.displayName || ''} readOnly style={{ opacity: 0.7 }} />
              </div>
              <div className="form-field">
                <label>Email Address</label>
                <input value={user.email || ''} readOnly style={{ opacity: 0.7 }} />
              </div>
              <div className="form-field">
                <label>Member Since</label>
                <input value={user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : '—'} readOnly style={{ opacity: 0.7 }} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
