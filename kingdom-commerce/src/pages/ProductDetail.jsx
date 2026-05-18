import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiHeart, FiShare2, FiChevronDown, FiChevronUp, FiTruck, FiRefreshCw, FiShield } from 'react-icons/fi';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';

const DEMO = {
  id: 'd1',
  name: 'The Royal Tee',
  category: 'Apparel',
  price: 85,
  description: 'The signature Kingdom tee. Crafted from 100% premium Pima cotton with a boxy, oversized silhouette. Screen-printed Kingdom crest on the chest. Pre-washed for a lived-in feel from day one.',
  details: ['100% Premium Pima Cotton', 'Oversized boxy fit', 'Screen-printed Kingdom crest', 'Ribbed collar', 'Pre-washed & garment-dyed', 'Made in Los Angeles, USA'],
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  images: [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
  ],
  isNew: true,
};

export default function ProductDetail() {
  const { id } = useParams();
  const { product: fetched, loading } = useProduct(id);
  const product = fetched || DEMO;
  const { addToCart } = useCart();

  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [openSection, setOpenSection] = useState('details');
  const [wishlisted, setWishlisted] = useState(false);

  function handleAddToCart() {
    if (product.sizes?.length && !selectedSize) {
      setSizeError(true);
      return;
    }
    addToCart({ id: product.id, name: product.name, price: product.price, image: product.images?.[0], selectedSize, qty });
    setSizeError(false);
  }

  if (loading) {
    return (
      <div style={{ paddingTop: 120 }} className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
          <div className="skeleton" style={{ aspectRatio: '3/4' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="skeleton" style={{ height: 40, width: '70%' }} />
            <div className="skeleton" style={{ height: 24, width: '30%' }} />
            <div className="skeleton" style={{ height: 120 }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 100 }}>
      <div className="container" style={{ padding: '48px 24px 80px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 40, fontSize: '0.78rem', color: 'var(--gray)' }}>
          <Link to="/" style={{ color: 'var(--gray)' }}>Home</Link>
          <span>/</span>
          <Link to="/shop" style={{ color: 'var(--gray)' }}>Shop</Link>
          <span>/</span>
          <span style={{ color: 'var(--white)' }}>{product.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 64 }}>
          {/* Images */}
          <div>
            <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--dark-2)', aspectRatio: '3/4', marginBottom: 16 }}>
              <motion.img
                key={activeImg}
                src={product.images?.[activeImg]}
                alt={product.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {product.isNew && <span className="badge badge-gold" style={{ position: 'absolute', top: 16, left: 16 }}>New</span>}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {product.images?.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  style={{
                    width: 80,
                    height: 96,
                    overflow: 'hidden',
                    border: `2px solid ${activeImg === i ? 'var(--gold)' : 'transparent'}`,
                    padding: 0,
                    background: 'none',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <p style={{ fontSize: '0.7rem', letterSpacing: 3, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>{product.category}</p>
              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginBottom: 16 }}>{product.name}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: '1.5rem', color: 'var(--gold)', fontWeight: 600 }}>{formatCurrency(product.price)}</span>
                {product.originalPrice && (
                  <span style={{ color: 'var(--gray)', textDecoration: 'line-through' }}>{formatCurrency(product.originalPrice)}</span>
                )}
              </div>
            </div>

            <p style={{ color: 'var(--gray-light)', lineHeight: 1.8, fontSize: '0.95rem' }}>{product.description}</p>

            {/* Size */}
            {product.sizes?.length > 0 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: '0.75rem', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 500 }}>
                    Size {selectedSize && `— ${selectedSize}`}
                  </span>
                  <button style={{ fontSize: '0.75rem', color: 'var(--gold)', background: 'none', textDecoration: 'underline' }}>Size Guide</button>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setSelectedSize(s); setSizeError(false); }}
                      style={{
                        width: 48,
                        height: 48,
                        border: `1px solid ${selectedSize === s ? 'var(--gold)' : '#333'}`,
                        background: selectedSize === s ? 'var(--gold)' : 'transparent',
                        color: selectedSize === s ? 'var(--black)' : 'var(--white)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {sizeError && <p style={{ color: 'var(--error)', fontSize: '0.8rem', marginTop: 8 }}>Please select a size</p>}
              </div>
            )}

            {/* Qty */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.75rem', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 500, marginRight: 8 }}>Qty</span>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #333' }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ background: 'none', color: 'var(--white)', padding: '10px 16px', fontSize: '1rem' }}>−</button>
                <span style={{ padding: '10px 20px', minWidth: 40, textAlign: 'center' }}>{qty}</span>
                <button onClick={() => setQty(qty + 1)} style={{ background: 'none', color: 'var(--white)', padding: '10px 16px', fontSize: '1rem' }}>+</button>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={handleAddToCart}
                className="btn-primary"
                style={{ flex: 1, justifyContent: 'center', padding: '16px' }}
              >
                <FiShoppingBag /> Add to Bag
              </button>
              <button
                onClick={() => setWishlisted(!wishlisted)}
                style={{
                  width: 52,
                  height: 52,
                  border: '1px solid #333',
                  background: 'transparent',
                  color: wishlisted ? '#e74c3c' : 'var(--white)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  transition: 'all 0.2s',
                }}
              >
                <FiHeart style={{ fill: wishlisted ? '#e74c3c' : 'none' }} />
              </button>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: 24, padding: '20px 0', borderTop: '1px solid #2a2a2a', borderBottom: '1px solid #2a2a2a' }}>
              {[
                { icon: FiTruck, label: 'Free shipping over $150' },
                { icon: FiRefreshCw, label: 'Free 30-day returns' },
                { icon: FiShield, label: 'Authentic guarantee' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1, textAlign: 'center' }}>
                  <Icon style={{ color: 'var(--gold)', fontSize: '1.1rem' }} />
                  <span style={{ fontSize: '0.7rem', color: 'var(--gray)', lineHeight: 1.3 }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Accordion */}
            {[
              { key: 'details', label: 'Product Details', content: product.details?.map((d, i) => <li key={i} style={{ color: 'var(--gray-light)', marginBottom: 8 }}>{d}</li>) },
              { key: 'shipping', label: 'Shipping & Returns', content: <p style={{ color: 'var(--gray-light)', lineHeight: 1.7, fontSize: '0.9rem' }}>Free standard shipping on orders over $150. Express options available at checkout. Free returns within 30 days of delivery.</p> },
            ].map((s) => (
              <div key={s.key} style={{ borderBottom: '1px solid #2a2a2a' }}>
                <button
                  onClick={() => setOpenSection(openSection === s.key ? null : s.key)}
                  style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', background: 'none', color: 'var(--white)', fontSize: '0.85rem', fontWeight: 500, letterSpacing: 1 }}
                >
                  {s.label}
                  {openSection === s.key ? <FiChevronUp style={{ color: 'var(--gold)' }} /> : <FiChevronDown style={{ color: 'var(--gray)' }} />}
                </button>
                {openSection === s.key && (
                  <div style={{ paddingBottom: 16 }}>
                    <ul style={{ listStyle: 'none', paddingLeft: 0 }}>{s.content}</ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
