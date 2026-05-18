import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiHeart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const { addToCart } = useCart();

  function handleQuickAdd(e) {
    e.preventDefault();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0],
      selectedSize: product.sizes?.[0] || null,
      qty: 1,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative' }}
    >
      <Link to={`/product/${product.id}`}>
        {/* Image */}
        <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--dark-2)', aspectRatio: '3/4' }}>
          {product.images?.[0] && (
            <motion.img
              src={hovered && product.images?.[1] ? product.images[1] : product.images[0]}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              animate={{ scale: hovered ? 1.04 : 1 }}
              transition={{ duration: 0.5 }}
            />
          )}
          {!product.images?.[0] && (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray)' }}>
              <FiShoppingBag style={{ fontSize: '2rem' }} />
            </div>
          )}

          {/* Badges */}
          <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {product.isNew && <span className="badge badge-gold">New</span>}
            {product.isSale && <span className="badge" style={{ background: '#e74c3c', color: '#fff' }}>Sale</span>}
          </div>

          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted); }}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: 'rgba(10,10,10,0.7)',
              color: wishlisted ? '#e74c3c' : 'var(--white)',
              width: 36,
              height: 36,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.9rem',
              backdropFilter: 'blur(4px)',
              transition: 'all 0.2s',
            }}
          >
            <FiHeart style={{ fill: wishlisted ? '#e74c3c' : 'none' }} />
          </button>

          {/* Quick Add */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: hovered ? 0 : '100%' }}
            transition={{ duration: 0.3 }}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
          >
            <button
              onClick={handleQuickAdd}
              style={{
                width: '100%',
                padding: '14px',
                background: 'var(--gold)',
                color: 'var(--black)',
                fontSize: '0.75rem',
                letterSpacing: 2,
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              Quick Add
            </button>
          </motion.div>
        </div>

        {/* Info */}
        <div style={{ padding: '16px 0' }}>
          <p style={{ fontSize: '0.7rem', letterSpacing: 2, textTransform: 'uppercase', color: 'var(--gray)', marginBottom: 6 }}>
            {product.category}
          </p>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', marginBottom: 8, color: 'var(--white)', lineHeight: 1.3 }}>
            {product.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{formatCurrency(product.price)}</span>
            {product.originalPrice && (
              <span style={{ color: 'var(--gray)', fontSize: '0.85rem', textDecoration: 'line-through' }}>
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
