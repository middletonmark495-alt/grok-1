import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error("Passwords don't match"); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form.email, form.password, form.name);
      toast.success('Welcome to the Kingdom!');
      navigate('/account');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    try {
      await loginWithGoogle();
      navigate('/account');
    } catch {
      toast.error('Google sign-up failed');
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 60px' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: 440, background: 'var(--dark-2)', border: '1px solid #2a2a2a', padding: '48px 40px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>KINGDOM</div>
          <div style={{ fontSize: '0.6rem', letterSpacing: 6, color: 'var(--gold)', fontWeight: 500, marginBottom: 24 }}>Commerce</div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', marginBottom: 8 }}>Join the Kingdom</h1>
          <p style={{ color: 'var(--gray)', fontSize: '0.875rem' }}>Create your account today</p>
        </div>

        <button
          onClick={handleGoogle}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '13px', background: 'transparent', border: '1px solid #444', color: 'var(--white)', fontSize: '0.85rem', cursor: 'pointer', marginBottom: 24 }}
        >
          <FcGoogle style={{ fontSize: '1.1rem' }} /> Continue with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: '#2a2a2a' }} />
          <span style={{ color: 'var(--gray)', fontSize: '0.75rem' }}>or</span>
          <div style={{ flex: 1, height: 1, background: '#2a2a2a' }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[
            { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Mark Kingdom' },
            { key: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
            { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
            { key: 'confirm', label: 'Confirm Password', type: 'password', placeholder: '••••••••' },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key} className="form-field">
              <label>{label}</label>
              <input type={type} value={form[key]} onChange={update(key)} placeholder={placeholder} required />
            </div>
          ))}
          <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: 'center', padding: '15px', width: '100%', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--gray)', fontSize: '0.85rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--gold)' }}>Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
