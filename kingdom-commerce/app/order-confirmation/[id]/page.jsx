'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiPackage, FiMail } from 'react-icons/fi';
import { supabase } from '../../../lib/supabase';
import { formatCurrency } from '../../../utils/formatCurrency';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (id) supabase.from('orders').select('*').eq('id', id).single().then(({ data }) => setOrder(data));
  }, [id]);

  return (
    <div style={{ paddingTop: 100, minHeight: '100vh' }}>
      <div className="container" style={{ padding: '80px 24px', maxWidth: 700, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '2px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '2rem', color: 'var(--gold)' }}>
            <FiCheckCircle />
          </div>
          <p style={{ fontSize: '0.7rem', letterSpacing: 4, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>Order Confirmed</p>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 16 }}>Thank You!</h1>
          <p style={{ color: 'var(--gray-light)', maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.7 }}>Your order is being prepared with royal care. A confirmation email is on the way.</p>

          {order && (
            <div style={{ textAlign: 'left', background: 'var(--dark-2)', border: '1px solid #2a2a2a', padding: '32px', marginBottom: 40 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <div><p style={{ fontSize: '0.7rem', letterSpacing: 2, color: 'var(--gray)', textTransform: 'uppercase', marginBottom: 4 }}>Order Number</p><p style={{ fontFamily: 'Playfair Display, serif' }}>#{id?.slice(-8).toUpperCase()}</p></div>
                <div><p style={{ fontSize: '0.7rem', letterSpacing: 2, color: 'var(--gray)', textTransform: 'uppercase', marginBottom: 4 }}>Total</p><p style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '1.1rem' }}>{formatCurrency(order.total)}</p></div>
                <div><p style={{ fontSize: '0.7rem', letterSpacing: 2, color: 'var(--gray)', textTransform: 'uppercase', marginBottom: 4 }}>Ships To</p><p>{order.shipping_address?.city}, {order.shipping_address?.state}</p></div>
              </div>
              <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: 24 }}>
                <p style={{ fontSize: '0.7rem', letterSpacing: 2, color: 'var(--gray)', textTransform: 'uppercase', marginBottom: 16 }}>Items Ordered</p>
                {order.items?.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--gray-light)' }}>{item.name} × {item.qty}{item.selectedSize ? ` (${item.selectedSize})` : ''}</span>
                    <span style={{ color: 'var(--gold)' }}>{formatCurrency(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/shop"><button className="btn-primary">Continue Shopping</button></Link>
            <Link href="/account"><button className="btn-outline">View Orders</button></Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
