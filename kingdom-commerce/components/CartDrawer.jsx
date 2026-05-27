'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';

export default function CartDrawer({ open, onClose }) {
  const { items, itemCount, subtotal, removeFromCart, updateQty } = useCart();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 300 }} />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.35 }}
            style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 440, background: 'var(--dark)', zIndex: 301, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #2a2a2a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem' }}>Your Bag</h3>
                <p style={{ color: 'var(--gray)', fontSize: '0.8rem', marginTop: 2 }}>{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
              </div>
              <button onClick={onClose} style={{ background: 'none', color: 'var(--white)', fontSize: '1.3rem' }}><FiX /></button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              {items.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--gray)' }}>
                  <FiShoppingBag style={{ fontSize: '3rem', marginBottom: 16 }} />
                  <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', marginBottom: 8, color: 'var(--white)' }}>Your bag is empty</p>
                  <button onClick={onClose} className="btn-primary" style={{ margin: '16px auto 0' }}>Continue Shopping</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {items.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}`} style={{ display: 'flex', gap: 16, paddingBottom: 24, borderBottom: '1px solid #2a2a2a' }}>
                      <div style={{ width: 80, height: 100, background: 'var(--dark-3)', flexShrink: 0, overflow: 'hidden' }}>
                        {item.image && <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <h4 style={{ fontFamily: 'Playfair Display, serif', fontSize: '0.95rem', lineHeight: 1.3 }}>{item.name}</h4>
                          <button onClick={() => removeFromCart(item.id, item.selectedSize)} style={{ background: 'none', color: 'var(--gray)', fontSize: '0.9rem' }}><FiTrash2 /></button>
                        </div>
                        {item.selectedSize && <span style={{ fontSize: '0.75rem', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: 1 }}>Size: {item.selectedSize}</span>}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #333', padding: '4px 12px' }}>
                            <button onClick={() => updateQty(item.id, item.selectedSize, item.qty - 1)} style={{ background: 'none', color: 'var(--gray)', fontSize: '0.8rem' }}><FiMinus /></button>
                            <span style={{ fontSize: '0.85rem', minWidth: 16, textAlign: 'center' }}>{item.qty}</span>
                            <button onClick={() => updateQty(item.id, item.selectedSize, item.qty + 1)} style={{ background: 'none', color: 'var(--white)', fontSize: '0.8rem' }}><FiPlus /></button>
                          </div>
                          <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{formatCurrency(item.price * item.qty)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div style={{ padding: '24px', borderTop: '1px solid #2a2a2a' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>Subtotal</span>
                  <span style={{ fontWeight: 600 }}>{formatCurrency(subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                  <span style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>Shipping</span>
                  <span style={{ color: 'var(--gold)', fontSize: '0.85rem' }}>Calculated at checkout</span>
                </div>
                <Link href="/checkout" onClick={onClose}>
                  <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '16px' }}>
                    Checkout — {formatCurrency(subtotal)}
                  </button>
                </Link>
                <button onClick={onClose} style={{ width: '100%', background: 'none', color: 'var(--gray)', fontSize: '0.8rem', marginTop: 12, letterSpacing: 1 }}>
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
