import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import { type Product, type Category } from '@prisma/client';

const fallbackCategories: Array<Pick<Category, 'id' | 'name' | 'slug' | 'description'>> = [
  { id: 'electronics', name: 'Electronics', slug: 'electronics', description: 'Smart devices and everyday tech' },
  { id: 'home', name: 'Home Essentials', slug: 'home', description: 'Comfort and utility for modern living' },
  { id: 'lifestyle', name: 'Lifestyle', slug: 'lifestyle', description: 'Wellness and elevated routine upgrades' },
  { id: 'accessories', name: 'Accessories', slug: 'accessories', description: 'Small details that complete the setup' },
];

const fallbackProducts: Array<Product & { category?: { id: string; name: string; slug: string; description?: string | null } }> = [
  {
    id: '1',
    name: 'Aster Pro Smart Speaker',
    slug: 'aster-pro-smart-speaker',
    description: 'A compact speaker with room-filling audio, voice assistant support, and an ambient light ring for modern home setups.',
    shortDescription: 'Wireless speaker with premium sound.',
    price: 14999,
    compareAtPrice: 19999,
    sku: 'AST-PRO-001',
    stock: 18,
    categoryId: 'electronics',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
    gallery: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80'],
    featured: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Nimbus Wireless Headphones',
    slug: 'nimbus-wireless-headphones',
    description: 'Adaptive noise canceling, all-day battery life, and plush memory foam ear cups to keep your focus locked in.',
    shortDescription: 'Noise-canceling wireless headphones.',
    price: 21999,
    compareAtPrice: 26999,
    sku: 'NIMB-HP-002',
    stock: 12,
    categoryId: 'electronics',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
    gallery: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80'],
    featured: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Sora Ceramic Lamp',
    slug: 'sora-ceramic-lamp',
    description: 'Warm ambient lighting, tactile ceramic finish, and a minimalist silhouette designed to elevate bedtime routines.',
    shortDescription: 'Soft lighting for every room.',
    price: 8999,
    compareAtPrice: 11999,
    sku: 'SORA-LAMP-003',
    stock: 22,
    categoryId: 'home',
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    gallery: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80'],
    featured: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function withFallback<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await operation();
  } catch {
    return fallback;
  }
}

export async function getCategories() {
  return withFallback(
    () =>
      prisma.category.findMany({
        orderBy: { name: 'asc' },
      }),
    fallbackCategories as unknown as Awaited<ReturnType<typeof prisma.category.findMany>>,
  );
}

export async function getCategoriesWithCounts() {
  const categories = await getCategories();
  const products = await getProducts({ page: 1, pageSize: 200 });

  return categories.map((category: (typeof categories)[number]) => ({
    ...category,
    productCount: products.items.filter((product: (typeof products.items)[number]) => product.categoryId === category.id).length,
  }));
}

export async function getProducts({
  search,
  category,
  minPrice,
  maxPrice,
  sort = 'featured',
  page = 1,
  pageSize = 12,
}: {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'featured' | 'newest' | 'price_asc' | 'price_desc' | 'popularity';
  page?: number;
  pageSize?: number;
}) {
  const skip = (page - 1) * pageSize;

  return withFallback(async () => {
    const where: Record<string, unknown> = {
      active: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = { slug: category };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {} as Record<string, number>;
      if (minPrice !== undefined) (where.price as Record<string, number>).gte = minPrice;
      if (maxPrice !== undefined) (where.price as Record<string, number>).lte = maxPrice;
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      sort === 'newest'
        ? { createdAt: 'desc' }
        : sort === 'price_asc'
          ? { price: 'asc' }
          : sort === 'price_desc'
            ? { price: 'desc' }
            : sort === 'popularity'
              ? { featured: 'desc' }
              : { featured: 'desc', createdAt: 'desc' };

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy,
        skip,
        take: pageSize,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      pageCount: Math.ceil(total / pageSize) || 1,
    };
  }, {
    items: fallbackProducts.filter((product: (typeof fallbackProducts)[number]) => {
      const matchesSearch = !search || product.name.toLowerCase().includes(search.toLowerCase()) || product.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !category || product.categoryId === category;
      const matchesMin = minPrice === undefined || product.price >= minPrice;
      const matchesMax = maxPrice === undefined || product.price <= maxPrice;
      return matchesSearch && matchesCategory && matchesMin && matchesMax;
    }),
    total: 3,
    page,
    pageCount: 1,
  });
}

export async function getProductBySlug(slug: string) {
  return withFallback(
    () =>
      prisma.product.findUnique({
        where: { slug },
        include: { category: true },
      }),
    fallbackProducts.find((product) => product.slug === slug) ?? null,
  );
}

export async function getCategoryBySlug(slug: string) {
  return withFallback(
    () =>
      prisma.category.findUnique({
        where: { slug },
      }),
    fallbackCategories.find((category) => category.slug === slug) ?? null,
  );
}

export async function getFeaturedProducts() {
  return withFallback(
    () =>
      prisma.product.findMany({
        where: { active: true, featured: true },
        include: { category: true },
        take: 4,
      }),
    fallbackProducts.filter((product) => product.featured),
  );
}

export async function getNewArrivals() {
  return withFallback(
    () =>
      prisma.product.findMany({
        where: { active: true },
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        take: 4,
      }),
    fallbackProducts,
  );
}

export async function getRelatedProducts(productId: string, categoryId: string) {
  return withFallback(
    () =>
      prisma.product.findMany({
        where: {
          active: true,
          categoryId,
          NOT: { id: productId },
        },
        include: { category: true },
        take: 4,
      }),
    fallbackProducts.filter((product) => product.categoryId === categoryId && product.id !== productId).slice(0, 4),
  );
}

export async function getCartCountForCurrentUser() {
  try {
    return await prisma.cartItem.count();
  } catch {
    return 0;
  }
}
