import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--dark)', borderTop: '1px solid #1e1e1e', marginTop: 80 }}>
      <div className="container" style={{ padding: '80px 24px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48, marginBottom: 64 }}>
          {/* Brand */}
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 700, letterSpacing: 2 }}>KINGDOM</div>
              <div style={{ fontSize: '0.6rem', letterSpacing: 6, color: 'var(--gold)', fontWeight: 500 }}>Commerce</div>
            </div>
            <p style={{ color: 'var(--gray)', fontSize: '0.85rem', lineHeight: 1.7, maxWidth: 260 }}>
              Premium products curated for those who demand excellence. Every piece tells a story of craftsmanship and distinction.
            </p>
            <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
              {[FiInstagram, FiTwitter, FiFacebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    width: 38,
                    height: 38,
                    border: '1px solid #333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--gray)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = 'var(--gray)'; }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 style={{ fontSize: '0.7rem', letterSpacing: 3, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 20 }}>Shop</h4>
            {['New Arrivals', 'Best Sellers', 'Collections', 'Sale', 'Gift Cards'].map((l) => (
              <div key={l} style={{ marginBottom: 12 }}>
                <Link to="/shop" style={{ color: 'var(--gray)', fontSize: '0.85rem', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--white)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--gray)'}
                >{l}</Link>
              </div>
            ))}
          </div>

          {/* Help */}
          <div>
            <h4 style={{ fontSize: '0.7rem', letterSpacing: 3, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 20 }}>Help</h4>
            {['FAQ', 'Shipping & Returns', 'Size Guide', 'Track Order', 'Contact Us'].map((l) => (
              <div key={l} style={{ marginBottom: 12 }}>
                <Link to="#" style={{ color: 'var(--gray)', fontSize: '0.85rem', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--white)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--gray)'}
                >{l}</Link>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ fontSize: '0.7rem', letterSpacing: 3, textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 20 }}>Stay Royal</h4>
            <p style={{ color: 'var(--gray)', fontSize: '0.85rem', marginBottom: 20, lineHeight: 1.6 }}>
              Join the Kingdom. Get early access to new arrivals and exclusive offers.
            </p>
            <div style={{ display: 'flex', gap: 0 }}>
              <input
                type="email"
                placeholder="Your email"
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: 'var(--dark-3)',
                  border: '1px solid #333',
                  borderRight: 'none',
                  color: 'var(--white)',
                  fontSize: '0.85rem',
                }}
              />
              <button className="btn-primary" style={{ padding: '12px 20px', whiteSpace: 'nowrap' }}>
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid #1e1e1e', paddingTop: 32, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <p style={{ color: 'var(--gray)', fontSize: '0.8rem' }}>
            © {new Date().getFullYear()} Kingdom Commerce. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((l) => (
              <Link key={l} to="#" style={{ color: 'var(--gray)', fontSize: '0.8rem' }}>{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
