import { NextResponse } from 'next/server';

import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const formData = await request.formData();
    const name = String(formData.get('name') ?? '').trim();
    const sku = String(formData.get('sku') ?? '').trim();
    const price = Number(formData.get('price') ?? 0);
    const stock = Number(formData.get('stock') ?? 0);
    const description = String(formData.get('description') ?? '').trim();
    const categoryId = String(formData.get('categoryId') ?? '');

    if (!name || !sku || !categoryId || !description || price <= 0) {
      return NextResponse.redirect(new URL('/admin?error=invalid-product', request.url));
    }

    const slug = slugify(name);
    await prisma.product.create({
      data: {
        name,
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        sku,
        price,
        stock,
        description,
        categoryId,
        imageUrl: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
        shortDescription: description.slice(0, 120),
        featured: false,
        active: true,
      },
    });

    return NextResponse.redirect(new URL('/admin?success=product-created', request.url));
  } catch {
    return NextResponse.redirect(new URL('/admin?error=product-failed', request.url));
  }
}
