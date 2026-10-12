import type { Metadata } from 'next';
import './globals.css';

import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'CartNova | Thoughtful essentials for everyday life',
  description: 'Premium storefront for modern essentials and lifestyle upgrades.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-slate-50 text-slate-900">
        <SiteHeader />
        <main className="min-h-[70vh]">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
