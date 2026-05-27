import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiCheck, FiPackage } from 'react-icons/fi';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatCurrency';
import toast from 'react-hot-toast';

const EMPTY_FORM = {
  name: '', category: 'apparel', price: '', originalPrice: '',
  description: '', sizes: '', images: '', featured: false,
  isNew: false, isSale: false, stock: '',
};

export default function AdminProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  async function loadProducts() {
    const snap = await getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc')));
    setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setLoading(false);
  }

  useEffect(() => { loadProducts(); }, []);

  function openNew() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(product) {
    setEditing(product.id);
    setForm({
      name: product.name || '',
      category: product.category || 'apparel',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      description: product.description || '',
      sizes: (product.sizes || []).join(', '),
      images: (product.images || []).join('\n'),
      featured: product.featured || false,
      isNew: product.isNew || false,
      isSale: product.isSale || false,
      stock: product.stock || '',
    });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.name || !form.price) { toast.error('Name and price are required'); return; }
    setSaving(true);
    try {
      const data = {
        name: form.name.trim(),
        category: form.category,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
        description: form.description.trim(),
        sizes: form.sizes ? form.sizes.split(',').map((s) => s.trim()).filter(Boolean) : [],
        images: form.images ? form.images.split('\n').map((s) => s.trim()).filter(Boolean) : [],
        featured: form.featured,
        isNew: form.isNew,
        isSale: form.isSale,
        stock: parseInt(form.stock) || 0,
      };

      if (editing) {
        await updateDoc(doc(db, 'products', editing), data);
        toast.success('Product updated');
      } else {
        await addDoc(collection(db, 'products'), { ...data, createdAt: serverTimestamp() });
        toast.success('Product added');
      }
      setModalOpen(false);
      loadProducts();
    } catch (err) {
      toast.error('Save failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await deleteDoc(doc(db, 'products', id));
    toast.success('Product deleted');
    loadProducts();
  }

  const field = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', paddingTop: 100 }}>
      <div className="container" style={{ padding: '48px 24px 80px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p className="section-subtitle">Admin</p>
            <h1 className="section-title">Products</h1>
            <div className="gold-line" />
          </div>
          <button onClick={openNew} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FiPlus /> Add Product
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 40 }}>
          {[
            { label: 'Total Products', val: products.length },
            { label: 'Featured', val: products.filter((p) => p.featured).length },
            { label: 'On Sale', val: products.filter((p) => p.isSale).length },
            { label: 'New Arrivals', val: products.filter((p) => p.isNew).length },
          ].map(({ label, val }) => (
            <div key={label} style={{ background: 'var(--dark-2)', border: '1px solid #2a2a2a', padding: '20px 24px' }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: 'var(--gold)' }}>{val}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray)', letterSpacing: 1, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Array(5).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 64 }} />)}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--gray)' }}>
            <FiPackage style={{ fontSize: '3rem', marginBottom: 16 }} />
            <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: 'var(--white)', marginBottom: 16 }}>No products yet</p>
            <button onClick={openNew} className="btn-primary">Add Your First Product</button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
                  {['Product', 'Category', 'Price', 'Stock', 'Tags', 'Actions'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.7rem', letterSpacing: 2, textTransform: 'uppercase', color: 'var(--gray)', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ borderBottom: '1px solid #1a1a1a' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--dark-2)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                      {p.images?.[0] && (
                        <img src={p.images[0]} alt={p.name} style={{ width: 44, height: 56, objectFit: 'cover', background: 'var(--dark-3)', flexShrink: 0 }} />
                      )}
                      <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '0.95rem' }}>{p.name}</span>
                    </td>
                    <td style={{ padding: '16px', color: 'var(--gray)', fontSize: '0.85rem', textTransform: 'capitalize' }}>{p.category}</td>
                    <td style={{ padding: '16px', color: 'var(--gold)', fontWeight: 600 }}>
                      {formatCurrency(p.price)}
                      {p.originalPrice && <span style={{ color: 'var(--gray)', textDecoration: 'line-through', marginLeft: 8, fontSize: '0.8rem' }}>{formatCurrency(p.originalPrice)}</span>}
                    </td>
                    <td style={{ padding: '16px', color: p.stock < 5 ? '#e74c3c' : 'var(--gray-light)', fontSize: '0.85rem' }}>{p.stock ?? '—'}</td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {p.isNew && <span className="badge badge-gold" style={{ fontSize: '0.6rem' }}>New</span>}
                        {p.isSale && <span className="badge" style={{ background: '#e74c3c', color: '#fff', fontSize: '0.6rem' }}>Sale</span>}
                        {p.featured && <span className="badge badge-dark" style={{ fontSize: '0.6rem' }}>Featured</span>}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => openEdit(p)} style={{ background: 'none', color: 'var(--gold)', fontSize: '1rem', padding: 6 }}><FiEdit2 /></button>
                        <button onClick={() => handleDelete(p.id, p.name)} style={{ background: 'none', color: '#e74c3c', fontSize: '1rem', padding: 6 }}><FiTrash2 /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 400 }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              style={{
                position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                zIndex: 401, width: '90%', maxWidth: 620, maxHeight: '90vh', overflowY: 'auto',
                background: 'var(--dark-2)', border: '1px solid #2a2a2a', padding: '40px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem' }}>
                  {editing ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={() => setModalOpen(false)} style={{ background: 'none', color: 'var(--white)', fontSize: '1.2rem' }}><FiX /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-field" style={{ gridColumn: '1 / -1' }}>
                    <label>Product Name *</label>
                    <input value={form.name} onChange={field('name')} placeholder="The Royal Tee" />
                  </div>
                  <div className="form-field">
                    <label>Category</label>
                    <select value={form.category} onChange={field('category')} style={{ background: 'var(--dark-3)', border: '1px solid #333', color: 'var(--white)', padding: '12px 16px' }}>
                      <option value="apparel">Apparel</option>
                      <option value="accessories">Accessories</option>
                      <option value="footwear">Footwear</option>
                      <option value="collections">Collections</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Stock</label>
                    <input type="number" value={form.stock} onChange={field('stock')} placeholder="50" />
                  </div>
                  <div className="form-field">
                    <label>Price ($) *</label>
                    <input type="number" value={form.price} onChange={field('price')} placeholder="85.00" step="0.01" />
                  </div>
                  <div className="form-field">
                    <label>Original Price (if on sale)</label>
                    <input type="number" value={form.originalPrice} onChange={field('originalPrice')} placeholder="120.00" step="0.01" />
                  </div>
                </div>

                <div className="form-field">
                  <label>Description</label>
                  <textarea value={form.description} onChange={field('description')} placeholder="Product description..." rows={3} style={{ background: 'var(--dark-3)', border: '1px solid #333', color: 'var(--white)', padding: '12px 16px', resize: 'vertical' }} />
                </div>

                <div className="form-field">
                  <label>Sizes (comma-separated, leave blank if N/A)</label>
                  <input value={form.sizes} onChange={field('sizes')} placeholder="XS, S, M, L, XL, XXL" />
                </div>

                <div className="form-field">
                  <label>Image URLs (one per line)</label>
                  <textarea value={form.images} onChange={field('images')} placeholder="https://..." rows={3} style={{ background: 'var(--dark-3)', border: '1px solid #333', color: 'var(--white)', padding: '12px 16px', resize: 'vertical' }} />
                </div>

                {/* Toggles */}
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                  {[
                    { key: 'featured', label: 'Featured on home page' },
                    { key: 'isNew', label: 'Mark as New' },
                    { key: 'isSale', label: 'Mark as Sale' },
                  ].map(({ key, label }) => (
                    <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.85rem', color: 'var(--gray-light)' }}>
                      <div
                        onClick={() => setForm((f) => ({ ...f, [key]: !f[key] }))}
                        style={{
                          width: 44, height: 24, borderRadius: 12,
                          background: form[key] ? 'var(--gold)' : '#333',
                          position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
                        }}
                      >
                        <div style={{
                          position: 'absolute', top: 3, left: form[key] ? 23 : 3,
                          width: 18, height: 18, borderRadius: '50%',
                          background: '#fff', transition: 'left 0.2s',
                        }} />
                      </div>
                      {label}
                    </label>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '14px', gap: 8 }}>
                    <FiCheck /> {saving ? 'Saving...' : editing ? 'Update Product' : 'Add Product'}
                  </button>
                  <button onClick={() => setModalOpen(false)} className="btn-outline" style={{ padding: '14px 24px' }}>Cancel</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
