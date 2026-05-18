import { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/config';

export function useProducts(filters = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true);
        let q = collection(db, 'products');
        const constraints = [orderBy('createdAt', 'desc')];

        if (filters.category) constraints.push(where('category', '==', filters.category));
        if (filters.featured) constraints.push(where('featured', '==', true));
        if (filters.limit) constraints.push(limit(filters.limit));

        const snap = await getDocs(query(q, ...constraints));
        setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [filters.category, filters.featured, filters.limit]);

  return { products, loading, error };
}

export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    async function fetch() {
      try {
        const snap = await getDoc(doc(db, 'products', id));
        if (snap.exists()) setProduct({ id: snap.id, ...snap.data() });
        else setError(new Error('Product not found'));
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [id]);

  return { product, loading, error };
}
