import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { slug: 'electronics', name: 'Electronics', description: 'Smart devices and everyday tech' },
    { slug: 'home', name: 'Home Essentials', description: 'Comfort and utility for modern living' },
    { slug: 'lifestyle', name: 'Lifestyle', description: 'Wellness and elevated routine upgrades' },
    { slug: 'accessories', name: 'Accessories', description: 'Small details that complete the setup' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  const electronics = await prisma.category.findUnique({ where: { slug: 'electronics' } });
  const home = await prisma.category.findUnique({ where: { slug: 'home' } });
  const lifestyle = await prisma.category.findUnique({ where: { slug: 'lifestyle' } });
  const accessories = await prisma.category.findUnique({ where: { slug: 'accessories' } });

  const defaultProducts = [
    {
      name: 'Aster Pro Smart Speaker',
      slug: 'aster-pro-smart-speaker',
      description:
        'A compact speaker with room-filling audio, voice assistant support, and an ambient light ring for modern home setups.',
      shortDescription: 'Wireless speaker with premium sound.',
      price: 14999,
      compareAtPrice: 19999,
      sku: 'AST-PRO-001',
      stock: 18,
      categoryId: electronics!.id,
      imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=900&q=80',
      ],
      featured: true,
    },
    {
      name: 'Nimbus Wireless Headphones',
      slug: 'nimbus-wireless-headphones',
      description:
        'Adaptive noise canceling, all-day battery life, and plush memory foam ear cups to keep your focus locked in.',
      shortDescription: 'Noise-canceling wireless headphones.',
      price: 21999,
      compareAtPrice: 26999,
      sku: 'NIMB-HP-002',
      stock: 12,
      categoryId: electronics!.id,
      imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=900&q=80',
      ],
      featured: true,
    },
    {
      name: 'Sora Ceramic Lamp',
      slug: 'sora-ceramic-lamp',
      description:
        'Warm ambient lighting, tactile ceramic finish, and a minimalist silhouette designed to elevate bedtime routines.',
      shortDescription: 'Soft lighting for every room.',
      price: 8999,
      compareAtPrice: 11999,
      sku: 'SORA-LAMP-003',
      stock: 22,
      categoryId: home!.id,
      imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
      ],
      featured: true,
    },
    {
      name: 'Haven Cotton Throw',
      slug: 'haven-cotton-throw',
      description:
        'A brushed cotton throw with a soft hand-feel and elevated neutral palette for cozy and layered interiors.',
      shortDescription: 'Layered warmth and texture.',
      price: 4999,
      compareAtPrice: 7999,
      sku: 'HAVEN-THROW-004',
      stock: 31,
      categoryId: home!.id,
      imageUrl: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
      ],
      featured: false,
    },
    {
      name: 'Drift Daily Water Bottle',
      slug: 'drift-daily-water-bottle',
      description:
        'Insulated stainless steel construction keeps drinks at the ideal temperature while moving through your day with ease.',
      shortDescription: 'Everyday hydration in a travel-ready form.',
      price: 3499,
      compareAtPrice: 5499,
      sku: 'DRIFT-BTL-005',
      stock: 27,
      categoryId: lifestyle!.id,
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
      ],
      featured: true,
    },
    {
      name: 'Lane Leather Watch',
      slug: 'lane-leather-watch',
      description:
        'A polished timepiece with a clean dial, premium leather strap, and understated silhouette made for everyday wear.',
      shortDescription: 'Minimal everyday watch.',
      price: 18999,
      compareAtPrice: 24999,
      sku: 'LANE-WATCH-006',
      stock: 10,
      categoryId: lifestyle!.id,
      imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=900&q=80',
      ],
      featured: false,
    },
    {
      name: 'Summit Travel Backpack',
      slug: 'summit-travel-backpack',
      description:
        'Weather-resistant, organized, and easy to carry with a structured profile for workdays, weekends, and quick getaways.',
      shortDescription: 'A versatile carry-all for active routines.',
      price: 12999,
      compareAtPrice: 16999,
      sku: 'SUMMIT-BPK-007',
      stock: 16,
      categoryId: accessories!.id,
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80',
      ],
      featured: true,
    },
    {
      name: 'Horizon Wireless Charger',
      slug: 'horizon-wireless-charger',
      description:
        'Qi-compatible charging pad with soft-touch finish and low-profile design that complements your workspace and bedside.',
      shortDescription: 'Minimal charging with a clean finish.',
      price: 5999,
      compareAtPrice: 8999,
      sku: 'HORIZON-CHR-008',
      stock: 42,
      categoryId: accessories!.id,
      imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=80',
      ],
      featured: false,
    },
  ];

  for (const product of defaultProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        ...product,
        active: true,
      },
    });
  }

  const adminPassword = await bcrypt.hash('Admin123!', 10);
  await prisma.user.upsert({
    where: { email: 'admin@cartnova.io' },
    update: { role: Role.ADMIN, passwordHash: adminPassword },
    create: {
      email: 'admin@cartnova.io',
      name: 'CartNova Admin',
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });

  console.log('Seeded CartNova categories, products, and admin user.');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
