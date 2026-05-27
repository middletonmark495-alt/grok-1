'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try { await login(email, password); toast.success('Welcome back!'); router.push('/account'); }
    catch { toast.error('Invalid email or password'); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: 440, background: 'var(--dark-2)', border: '1px solid #2a2a2a', padding: '48px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 700, letterSpacing: 2 }}>KINGDOM</div>
          <div style={{ fontSize: '0.6rem', letterSpacing: 6, color: 'var(--gold)', fontWeight: 500, marginBottom: 24 }}>Commerce</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', marginBottom: 8 }}>Welcome Back</h1>
          <p style={{ color: 'var(--gray)', fontSize: '0.875rem' }}>Sign in to your Kingdom account</p>
        </div>
        <button onClick={loginWithGoogle} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '13px', background: 'transparent', border: '1px solid #444', color: 'var(--white)', fontSize: '0.85rem', cursor: 'pointer', marginBottom: 24 }}>
          <FcGoogle style={{ fontSize: '1.1rem' }} /> Continue with Google
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: '#2a2a2a' }} /><span style={{ color: 'var(--gray)', fontSize: '0.75rem' }}>or</span><div style={{ flex: 1, height: 1, background: '#2a2a2a' }} />
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="form-field"><label>Email Address</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required /></div>
          <div className="form-field"><label>Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required /></div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: 'center', padding: '15px', width: '100%', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--gray)', fontSize: '0.85rem' }}>
          Don't have an account? <Link href="/register" style={{ color: 'var(--gold)' }}>Create one</Link>
        </p>
      </motion.div>
    </div>
  );
}
