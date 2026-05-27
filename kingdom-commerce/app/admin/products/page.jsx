'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../../lib/supabase';
import { formatCurrency } from '../../../utils/formatCurrency';
import { FiPlus, FiTrash2, FiEdit2, FiX, FiCheck, FiPackage } from 'react-icons/fi';
import toast from 'react-hot-toast';

const EMPTY = { name: '', category: 'apparel', price: '', original_price: '', description: '', sizes: '', images: '', featured: false, is_new: false, is_sale: false, stock: '' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openEdit(p) {
    setEditing(p.id);
    setForm({ ...p, sizes: (p.sizes || []).join(', '), images: (p.images || []).join('\n'), price: p.price || '', original_price: p.original_price || '', stock: p.stock || '' });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.name || !form.price) { toast.error('Name and price are required'); return; }
    setSaving(true);
    try {
      const data = { name: form.name.trim(), category: form.category, price: parseFloat(form.price), original_price: form.original_price ? parseFloat(form.original_price) : null, description: form.description.trim(), sizes: form.sizes ? form.sizes.split(',').map((s) => s.trim()).filter(Boolean) : [], images: form.images ? form.images.split('\n').map((s) => s.trim()).filter(Boolean) : [], featured: form.featured, is_new: form.is_new, is_sale: form.is_sale, stock: parseInt(form.stock) || 0 };
      if (editing) { await supabase.from('products').update(data).eq('id', editing); toast.success('Updated'); }
      else { await supabase.from('products').insert({ ...data, created_at: new Date().toISOString() }); toast.success('Product added'); }
      setModalOpen(false);
      load();
    } catch (err) { toast.error('Save failed'); }
    finally { setSaving(false); }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"?`)) return;
    await supabase.from('products').delete().eq('id', id);
    toast.success('Deleted');
    load();
  }

  const field = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  return (
    <div style={{ minHeight: '100vh', paddingTop: 100 }}>
      <div className="container" style={{ padding: '48px 24px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
          <div><p className="section-subtitle">Admin</p><h1 className="section-title">Products</h1><div className="gold-line" /></div>
          <button onClick={() => { setEditing(null); setForm(EMPTY); setModalOpen(true); }} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FiPlus /> Add Product</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 40 }}>
          {[{ label: 'Total', val: products.length }, { label: 'Featured', val: products.filter((p) => p.featured).length }, { label: 'On Sale', val: products.filter((p) => p.is_sale).length }, { label: 'New', val: products.filter((p) => p.is_new).length }].map(({ label, val }) => (
            <div key={label} style={{ background: 'var(--dark-2)', border: '1px solid #2a2a2a', padding: '20px 24px' }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: 'var(--gold)' }}>{val}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--gray)', letterSpacing: 1, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
        {loading ? <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{Array(5).fill(0).map((_, i) => <div key={i} className="skeleton" style={{ height: 64 }} />)}</div>
          : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--gray)' }}>
              <FiPackage style={{ fontSize: '3rem', marginBottom: 16 }} />
              <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', color: 'var(--white)', marginBottom: 16 }}>No products yet</p>
              <button onClick={() => { setEditing(null); setForm(EMPTY); setModalOpen(true); }} className="btn-primary">Add Your First Product</button>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
                    {['Product', 'Category', 'Price', 'Stock', 'Tags', 'Actions'].map((h) => <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.7rem', letterSpacing: 2, textTransform: 'uppercase', color: 'var(--gray)', fontWeight: 500 }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                      <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                        {p.images?.[0] && <img src={p.images[0]} alt={p.name} style={{ width: 44, height: 56, objectFit: 'cover', background: 'var(--dark-3)', flexShrink: 0 }} />}
                        <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '0.95rem' }}>{p.name}</span>
                      </td>
                      <td style={{ padding: '16px', color: 'var(--gray)', fontSize: '0.85rem', textTransform: 'capitalize' }}>{p.category}</td>
                      <td style={{ padding: '16px', color: 'var(--gold)', fontWeight: 600 }}>{formatCurrency(p.price)}</td>
                      <td style={{ padding: '16px', color: p.stock < 5 ? '#e74c3c' : 'var(--gray-light)', fontSize: '0.85rem' }}>{p.stock ?? '—'}</td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {p.is_new && <span className="badge badge-gold" style={{ fontSize: '0.6rem' }}>New</span>}
                          {p.is_sale && <span className="badge" style={{ background: '#e74c3c', color: '#fff', fontSize: '0.6rem' }}>Sale</span>}
                          {p.featured && <span className="badge badge-dark" style={{ fontSize: '0.6rem' }}>Featured</span>}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={() => openEdit(p)} style={{ background: 'none', color: 'var(--gold)', fontSize: '1rem', padding: 6 }}><FiEdit2 /></button>
                          <button onClick={() => handleDelete(p.id, p.name)} style={{ background: 'none', color: '#e74c3c', fontSize: '1rem', padding: 6 }}><FiTrash2 /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </div>

      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 400 }} />
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 401, width: '90%', maxWidth: 620, maxHeight: '90vh', overflowY: 'auto', background: 'var(--dark-2)', border: '1px solid #2a2a2a', padding: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem' }}>{editing ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={() => setModalOpen(false)} style={{ background: 'none', color: 'var(--white)', fontSize: '1.2rem' }}><FiX /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-field" style={{ gridColumn: '1 / -1' }}><label>Product Name *</label><input value={form.name} onChange={field('name')} placeholder="The Royal Tee" /></div>
                  <div className="form-field"><label>Category</label>
                    <select value={form.category} onChange={field('category')} style={{ background: 'var(--dark-3)', border: '1px solid #333', color: 'var(--white)', padding: '12px 16px' }}>
                      <option value="apparel">Apparel</option><option value="accessories">Accessories</option><option value="footwear">Footwear</option>
                    </select>
                  </div>
                  <div className="form-field"><label>Stock</label><input type="number" value={form.stock} onChange={field('stock')} placeholder="50" /></div>
                  <div className="form-field"><label>Price ($) *</label><input type="number" value={form.price} onChange={field('price')} placeholder="85.00" step="0.01" /></div>
                  <div className="form-field"><label>Original Price (sale)</label><input type="number" value={form.original_price} onChange={field('original_price')} placeholder="120.00" step="0.01" /></div>
                </div>
                <div className="form-field"><label>Description</label><textarea value={form.description} onChange={field('description')} rows={3} style={{ background: 'var(--dark-3)', border: '1px solid #333', color: 'var(--white)', padding: '12px 16px', resize: 'vertical' }} /></div>
                <div className="form-field"><label>Sizes (comma-separated)</label><input value={form.sizes} onChange={field('sizes')} placeholder="XS, S, M, L, XL" /></div>
                <div className="form-field"><label>Image URLs (one per line)</label><textarea value={form.images} onChange={field('images')} rows={3} style={{ background: 'var(--dark-3)', border: '1px solid #333', color: 'var(--white)', padding: '12px 16px', resize: 'vertical' }} /></div>
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                  {[{ key: 'featured', label: 'Featured' }, { key: 'is_new', label: 'New' }, { key: 'is_sale', label: 'Sale' }].map(({ key, label }) => (
                    <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: '0.85rem', color: 'var(--gray-light)' }}>
                      <div onClick={() => setForm((f) => ({ ...f, [key]: !f[key] }))} style={{ width: 44, height: 24, borderRadius: 12, background: form[key] ? 'var(--gold)' : '#333', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}>
                        <div style={{ position: 'absolute', top: 3, left: form[key] ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s' }} />
                      </div>
                      {label}
                    </label>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '14px', gap: 8 }}>
                    <FiCheck /> {saving ? 'Saving...' : editing ? 'Update' : 'Add Product'}
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
