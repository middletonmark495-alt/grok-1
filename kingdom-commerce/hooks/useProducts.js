'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useProducts(filters = {}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      try {
        let query = supabase.from('products').select('*').order('created_at', { ascending: false });
        if (filters.category) query = query.eq('category', filters.category);
        if (filters.featured) query = query.eq('featured', true);
        if (filters.limit) query = query.limit(filters.limit);
        const { data, error } = await query;
        if (error) throw error;
        setProducts(data || []);
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
    supabase.from('products').select('*').eq('id', id).single()
      .then(({ data, error }) => {
        if (error) setError(error); else setProduct(data);
        setLoading(false);
      });
  }, [id]);

  return { product, loading, error };
}
