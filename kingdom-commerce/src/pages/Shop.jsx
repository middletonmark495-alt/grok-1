import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFilter, FiChevronDown } from 'react-icons/fi';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';

const DEMO_PRODUCTS = [
  { id: 'd1', name: 'The Royal Tee', category: 'apparel', price: 85, images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80'], isNew: true },
  { id: 'd2', name: 'Kingdom Crewneck', category: 'apparel', price: 165, images: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80'] },
  { id: 'd3', name: 'Sovereign Hoodie', category: 'apparel', price: 210, originalPrice: 260, images: ['https://images.unsplash.com/photo-1508427953056-b00b5f3571a3?w=600&q=80'], isSale: true },
  { id: 'd4', name: 'Crown Cap', category: 'accessories', price: 65, images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80'], isNew: true },
  { id: 'd5', name: 'Kingdom Track Jacket', category: 'apparel', price: 295, images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'] },
  { id: 'd6', name: 'Royal Chain', category: 'accessories', price: 450, images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80'], isNew: true },
  { id: 'd7', name: 'Empire Joggers', category: 'apparel', price: 145, images: ['https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600&q=80'] },
  { id: 'd8', name: 'Kingdom Tote', category: 'accessories', price: 120, originalPrice: 160, images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80'], isSale: true },
];

const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
];

export default function Shop() {
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState('featured');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [filterOpen, setFilterOpen] = useState(false);

  const { products, loading } = useProducts({});
  const allProducts = products.length > 0 ? products : DEMO_PRODUCTS;

  const filtered = useMemo(() => {
    let list = [...allProducts];
    if (activeCategory !== 'all') list = list.filter((p) => p.category === activeCategory);
    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price);
    return list;
  }, [allProducts, activeCategory, sortBy, priceRange]);

  const categories = ['all', ...new Set(allProducts.map((p) => p.category))];

  return (
    <div style={{ paddingTop: 100, minHeight: '100vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ padding: '48px 0 32px' }}>
          <p className="section-subtitle">Kingdom Commerce</p>
          <h1 className="section-title">The Shop</h1>
          <div className="gold-line" />
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                style={{
                  padding: '8px 20px',
                  fontSize: '0.75rem',
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  background: activeCategory === c ? 'var(--gold)' : 'transparent',
                  color: activeCategory === c ? 'var(--black)' : 'var(--gray)',
                  border: `1px solid ${activeCategory === c ? 'var(--gold)' : '#333'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {c}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>{filtered.length} products</span>
            <div style={{ position: 'relative' }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  appearance: 'none',
                  background: 'var(--dark-2)',
                  border: '1px solid #333',
                  color: 'var(--white)',
                  padding: '10px 36px 10px 16px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <FiChevronDown style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)', pointerEvents: 'none' }} />
            </div>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 32 }}>
            {Array(8).fill(0).map((_, i) => (
              <div key={i}>
                <div className="skeleton" style={{ aspectRatio: '3/4', marginBottom: 16 }} />
                <div className="skeleton" style={{ height: 16, width: '60%', marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 14, width: '40%' }} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--gray)' }}>
            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', color: 'var(--white)', marginBottom: 8 }}>No products found</p>
            <p>Try adjusting your filters</p>
          </div>
        ) : (
          <motion.div
            layout
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 32, paddingBottom: 80 }}
          >
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </motion.div>
        )}
      </div>
    </div>
  );
}
