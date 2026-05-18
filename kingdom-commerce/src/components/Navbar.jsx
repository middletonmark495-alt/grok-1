import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingBag, FiUser, FiMenu, FiX, FiSearch } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { itemCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Shop', to: '/shop' },
    { label: 'Collections', to: '/shop?category=collections' },
    { label: 'New Arrivals', to: '/shop?category=new' },
    { label: 'About', to: '/about' },
  ];

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: scrolled ? '12px 0' : '24px 0',
          background: scrolled ? 'rgba(10,10,10,0.97)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(201,168,76,0.15)' : 'none',
          transition: 'all 0.4s ease',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 700, color: '#fff', letterSpacing: 2 }}>
                KINGDOM
              </span>
              <span style={{ fontSize: '0.6rem', letterSpacing: 6, textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 500 }}>
                Commerce
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', gap: 36, alignItems: 'center' }} className="desktop-nav">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                style={({ isActive }) => ({
                  fontSize: '0.8rem',
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  color: isActive ? 'var(--gold)' : 'var(--gray-light)',
                  transition: 'color 0.2s',
                })}
              >
                {l.label}
              </NavLink>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <button
              onClick={() => navigate('/shop')}
              style={{ background: 'none', color: 'var(--gray-light)', fontSize: '1.1rem', padding: 4 }}
            >
              <FiSearch />
            </button>

            <button
              onClick={() => navigate(user ? '/account' : '/login')}
              style={{ background: 'none', color: 'var(--gray-light)', fontSize: '1.1rem', padding: 4 }}
            >
              <FiUser />
            </button>

            <button
              onClick={() => setCartOpen(true)}
              style={{ background: 'none', color: 'var(--gray-light)', fontSize: '1.1rem', padding: 4, position: 'relative' }}
            >
              <FiShoppingBag />
              {itemCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  background: 'var(--gold)',
                  color: '#000',
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {itemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="mobile-menu-btn"
              style={{ background: 'none', color: 'var(--white)', fontSize: '1.3rem', padding: 4, display: 'none' }}
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '80%',
              maxWidth: 360,
              background: 'var(--dark)',
              zIndex: 200,
              padding: '80px 40px 40px',
              display: 'flex',
              flexDirection: 'column',
              gap: 32,
            }}
          >
            <button
              onClick={() => setMenuOpen(false)}
              style={{ position: 'absolute', top: 24, right: 24, background: 'none', color: 'var(--white)', fontSize: '1.4rem' }}
            >
              <FiX />
            </button>
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: 'var(--white)' }}
              >
                {l.label}
              </Link>
            ))}
            <div style={{ marginTop: 'auto', borderTop: '1px solid #333', paddingTop: 32 }}>
              <Link to={user ? '/account' : '/login'} onClick={() => setMenuOpen(false)} style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>
                {user ? 'My Account' : 'Sign In'}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 150 }}
        />
      )}

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
