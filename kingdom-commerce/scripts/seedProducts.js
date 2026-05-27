/**
 * Run once to seed demo products into Firestore:
 *   node scripts/seedProducts.js
 *
 * Requires: GOOGLE_APPLICATION_CREDENTIALS env var pointing to your
 * Firebase service account JSON, and FIREBASE_PROJECT_ID set.
 */

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp } = require('firebase-admin/firestore');

initializeApp({
  credential: cert(process.env.GOOGLE_APPLICATION_CREDENTIALS),
  projectId: process.env.FIREBASE_PROJECT_ID,
});

const db = getFirestore();

const PRODUCTS = [
  {
    name: 'The Royal Tee',
    category: 'apparel',
    price: 85,
    originalPrice: null,
    description: 'The signature Kingdom tee. Crafted from 100% premium Pima cotton with a boxy, oversized silhouette. Screen-printed Kingdom crest on the chest.',
    details: ['100% Premium Pima Cotton', 'Oversized boxy fit', 'Screen-printed Kingdom crest', 'Ribbed collar', 'Pre-washed & garment-dyed', 'Made in Los Angeles, USA'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
    isNew: true,
    isSale: false,
    featured: true,
    stock: 50,
  },
  {
    name: 'Kingdom Crewneck',
    category: 'apparel',
    price: 165,
    originalPrice: null,
    description: 'Heavyweight French terry crewneck with embroidered Kingdom wordmark. Built for comfort without sacrificing style.',
    details: ['400gsm French Terry', 'Embroidered wordmark', 'Dropped shoulders', 'Ribbed cuffs and hem', '80% Cotton / 20% Polyester'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    images: ['https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80'],
    isNew: false,
    isSale: false,
    featured: true,
    stock: 35,
  },
  {
    name: 'Sovereign Hoodie',
    category: 'apparel',
    price: 210,
    originalPrice: 260,
    description: 'Our flagship hoodie. Garment-dyed for a vintage feel, with a relaxed fit and kangaroo pocket.',
    details: ['500gsm heavyweight fleece', 'Garment-dyed finish', 'Kangaroo pocket', 'Adjustable drawcord', 'Unisex fit'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    images: ['https://images.unsplash.com/photo-1508427953056-b00b5f3571a3?w=800&q=80'],
    isNew: false,
    isSale: true,
    featured: true,
    stock: 20,
  },
  {
    name: 'Crown Cap',
    category: 'accessories',
    price: 65,
    originalPrice: null,
    description: 'Six-panel structured cap with embroidered Kingdom crown logo. One size fits all with adjustable strap.',
    details: ['100% Cotton twill', 'Structured 6-panel', 'Embroidered crown logo', 'Adjustable strap', 'One size fits most'],
    sizes: [],
    images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80'],
    isNew: true,
    isSale: false,
    featured: true,
    stock: 60,
  },
  {
    name: 'Empire Joggers',
    category: 'apparel',
    price: 145,
    originalPrice: null,
    description: 'Technical fleece joggers with tapered fit and side seam pockets. The perfect balance of comfort and structure.',
    details: ['360gsm technical fleece', 'Tapered fit', 'Elastic waistband', 'Side seam pockets', 'Ankle zip'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    images: ['https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=800&q=80'],
    isNew: false,
    isSale: false,
    featured: false,
    stock: 40,
  },
  {
    name: 'Royal Chain',
    category: 'accessories',
    price: 450,
    originalPrice: null,
    description: 'Cuban link chain in 18k gold-plated brass. Heavy, bold, and built to last.',
    details: ['18k gold-plated brass', '10mm link width', '24 inch length', 'Lobster claw clasp', 'Tarnish-resistant coating'],
    sizes: [],
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80'],
    isNew: true,
    isSale: false,
    featured: false,
    stock: 15,
  },
  {
    name: 'Kingdom Track Jacket',
    category: 'apparel',
    price: 295,
    originalPrice: null,
    description: 'Retro-inspired track jacket in moisture-wicking performance fabric. Full zip with side pockets.',
    details: ['100% Recycled Polyester', 'Full-zip front', 'Side seam pockets', 'Moisture-wicking', 'Relaxed fit'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'],
    isNew: false,
    isSale: false,
    featured: false,
    stock: 25,
  },
  {
    name: 'Kingdom Tote',
    category: 'accessories',
    price: 120,
    originalPrice: 160,
    description: 'Heavy-duty canvas tote with leather handles and screen-printed Kingdom crest. Spacious and built to last.',
    details: ['16oz heavy canvas', 'Full-grain leather handles', 'Interior zip pocket', 'Screen-printed crest', '18" × 16" × 4"'],
    sizes: [],
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80'],
    isNew: false,
    isSale: true,
    featured: false,
    stock: 30,
  },
];

async function seed() {
  console.log('Seeding Kingdom Commerce products...\n');
  const batch = db.batch();

  for (const product of PRODUCTS) {
    const ref = db.collection('products').doc();
    batch.set(ref, { ...product, createdAt: Timestamp.now() });
    console.log(`  + ${product.name} ($${product.price})`);
  }

  await batch.commit();
  console.log(`\n✓ ${PRODUCTS.length} products seeded successfully.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
