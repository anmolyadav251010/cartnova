import { NextResponse } from 'next/server';

import { requireAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const formData = await request.formData();
    const name = String(formData.get('name') ?? '').trim();
    const description = String(formData.get('description') ?? '').trim();

    if (!name) {
      return NextResponse.redirect(new URL('/admin?error=invalid-category', request.url));
    }

    const slug = slugify(name);
    await prisma.category.create({
      data: {
        name,
        slug,
        description,
      },
    });

    return NextResponse.redirect(new URL('/admin?success=category-created', request.url));
  } catch {
    return NextResponse.redirect(new URL('/admin?error=category-failed', request.url));
  }
}
