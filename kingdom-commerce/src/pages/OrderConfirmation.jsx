import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiPackage, FiMail } from 'react-icons/fi';
import { db } from '../firebase/config';
import { formatCurrency } from '../utils/formatCurrency';

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!id) return;
    getDoc(doc(db, 'orders', id)).then((snap) => {
      if (snap.exists()) setOrder({ id: snap.id, ...snap.data() });
    });
  }, [id]);

  return (
    <div style={{ paddingTop: 100, minHeight: '100vh' }}>
      <div className="container" style={{ padding: '80px 24px', maxWidth: 700, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center' }}
        >
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '2px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '2rem', color: 'var(--gold)' }}>
            <FiCheckCircle />
          </div>
          <p style={{ fontSize: '0.7rem', letterSpacing: 4, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>Order Confirmed</p>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 16 }}>Thank You!</h1>
          <p style={{ color: 'var(--gray-light)', fontSize: '1rem', maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Your order has been placed and is being prepared with royal care. You'll receive a confirmation email shortly.
          </p>

          {order && (
            <div style={{ textAlign: 'left', background: 'var(--dark-2)', border: '1px solid #2a2a2a', padding: '32px', marginBottom: 40 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <p style={{ fontSize: '0.7rem', letterSpacing: 2, color: 'var(--gray)', textTransform: 'uppercase', marginBottom: 4 }}>Order Number</p>
                  <p style={{ fontFamily: 'Playfair Display, serif' }}>#{id?.slice(-8).toUpperCase()}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.7rem', letterSpacing: 2, color: 'var(--gray)', textTransform: 'uppercase', marginBottom: 4 }}>Total</p>
                  <p style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '1.1rem' }}>{formatCurrency(order.total)}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.7rem', letterSpacing: 2, color: 'var(--gray)', textTransform: 'uppercase', marginBottom: 4 }}>Ships To</p>
                  <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                </div>
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24, marginBottom: 40 }}>
            {[
              { icon: FiMail, title: 'Confirmation Email', desc: 'Sent to your inbox' },
              { icon: FiPackage, title: 'Processing', desc: '1–2 business days' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ background: 'var(--dark-2)', border: '1px solid #2a2a2a', padding: '24px', textAlign: 'center' }}>
                <Icon style={{ fontSize: '1.5rem', color: 'var(--gold)', marginBottom: 12 }} />
                <p style={{ fontFamily: 'Playfair Display, serif', marginBottom: 4 }}>{title}</p>
                <p style={{ color: 'var(--gray)', fontSize: '0.8rem' }}>{desc}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/shop"><button className="btn-primary">Continue Shopping</button></Link>
            <Link to="/account"><button className="btn-outline">View Orders</button></Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
