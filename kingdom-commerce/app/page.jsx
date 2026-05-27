'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';

const DEMO = [
  { id: 'd1', name: 'The Royal Tee', category: 'apparel', price: 85, images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80'], is_new: true },
  { id: 'd2', name: 'Kingdom Crewneck', category: 'apparel', price: 165, images: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80'] },
  { id: 'd3', name: 'Sovereign Hoodie', category: 'apparel', price: 210, original_price: 260, images: ['https://images.unsplash.com/photo-1508427953056-b00b5f3571a3?w=600&q=80'], is_sale: true },
  { id: 'd4', name: 'Crown Cap', category: 'accessories', price: 65, images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80'], is_new: true },
];

const CATEGORIES = [
  { label: 'Apparel', img: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80' },
  { label: 'Accessories', img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80' },
  { label: 'Footwear', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80' },
];

export default function Home() {
  const { products, loading } = useProducts({ featured: true, limit: 4 });
  const featured = products.length > 0 ? products : DEMO;

  return (
    <div>
      {/* Hero */}
      <section style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,10,10,0.9) 50%, rgba(10,10,10,0.3))' }} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ maxWidth: 620 }}>
            <p className="section-subtitle">New Season — 2025 Collection</p>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontWeight: 700, lineHeight: 1.05, marginBottom: 28 }}>Dress Like<br />Royalty</h1>
            <p style={{ color: 'var(--gray-light)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 480, marginBottom: 40 }}>Premium pieces crafted for those who move through the world with intention. Every stitch. Every detail. Perfected.</p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link href="/shop"><button className="btn-primary">Shop Now <FiArrowRight /></button></Link>
              <Link href="/shop?category=new"><button className="btn-outline">New Arrivals</button></Link>
            </div>
          </motion.div>
        </div>
        <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)' }}>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ width: 1, height: 50, background: 'linear-gradient(to bottom, transparent, var(--gold))' }} />
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: 'var(--dark-2)', padding: '48px 0', borderTop: '1px solid #1e1e1e', borderBottom: '1px solid #1e1e1e' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 32, textAlign: 'center' }}>
            {[{ num: '50K+', label: 'Happy Customers' }, { num: '500+', label: 'Premium Products' }, { num: '4.9★', label: 'Average Rating' }, { num: 'Free', label: 'Returns & Exchanges' }].map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', color: 'var(--gold)', marginBottom: 6 }}>{s.num}</div>
                <div style={{ fontSize: '0.75rem', letterSpacing: 2, textTransform: 'uppercase', color: 'var(--gray)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section style={{ padding: '100px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p className="section-subtitle">Hand-Picked</p>
              <h2 className="section-title">Featured Pieces</h2>
              <div className="gold-line" />
            </div>
            <Link href="/shop" style={{ color: 'var(--gold)', fontSize: '0.8rem', letterSpacing: 2, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8 }}>View All <FiArrowRight /></Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 32 }}>
            {loading
              ? Array(4).fill(0).map((_, i) => <div key={i}><div className="skeleton" style={{ aspectRatio: '3/4', marginBottom: 16 }} /><div className="skeleton" style={{ height: 16, width: '60%', marginBottom: 8 }} /></div>)
              : featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '0 0 100px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p className="section-subtitle">Browse by</p>
            <h2 className="section-title">Shop Categories</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            {CATEGORIES.map((cat) => (
              <motion.div key={cat.label} whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
                <Link href={`/shop?category=${cat.label.toLowerCase()}`}>
                  <div style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden' }}>
                    <img src={cat.img} alt={cat.label} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 60%)' }} />
                    <div style={{ position: 'absolute', bottom: 24, left: 24 }}>
                      <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', marginBottom: 4 }}>{cat.label}</h3>
                      <span style={{ fontSize: '0.7rem', letterSpacing: 2, color: 'var(--gold)', textTransform: 'uppercase' }}>Shop Now →</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner */}
      <section style={{ background: 'var(--gold)', padding: '80px 0', textAlign: 'center' }}>
        <div className="container">
          <p style={{ fontSize: '0.7rem', letterSpacing: 4, textTransform: 'uppercase', color: 'rgba(0,0,0,0.6)', marginBottom: 12 }}>The Kingdom Promise</p>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'var(--black)', maxWidth: 700, margin: '0 auto 20px' }}>Excellence Is Not a Standard.<br />It Is a Requirement.</h2>
          <p style={{ color: 'rgba(0,0,0,0.7)', maxWidth: 540, margin: '0 auto 32px', lineHeight: 1.7 }}>Every item passes through 47 quality checkpoints before it reaches your hands. We don't settle. Neither should you.</p>
          <Link href="/shop"><button style={{ padding: '14px 40px', background: 'var(--black)', color: 'var(--gold)', fontWeight: 700, fontSize: '0.8rem', letterSpacing: 2, textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>Explore Collection</button></Link>
        </div>
      </section>
    </div>
  );
}
