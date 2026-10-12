# CartNova

CartNova is a polished e-commerce storefront built with Next.js, Prisma, and Tailwind CSS. It includes a storefront, product catalog, cart, checkout flow, account area, newsletter signup, and an admin dashboard for managing categories and products.

## Preview

Open the app locally at:

- http://localhost:3000

If you are using a forwarded port in VS Code or GitHub Codespaces, use the forwarded URL for port 3000.

## Features

- Responsive storefront landing page
- Product browsing and filtering by price, category, and search term
- Product detail pages with related products
- Cart management for guest and authenticated users
- Checkout flow with shipping, coupon handling, and order creation
- Account dashboard with order history and saved addresses
- Admin dashboard for category and product creation
- Secure session handling and password validation
- Prisma-backed data model with seed data for demo usage

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Zod validation
- bcryptjs for password hashing
- Vitest for business logic tests

## Project Structure

```bash
app/                 # App Router pages and route handlers
components/          # Reusable UI components
lib/                 # App logic, validation, auth helpers, and data access
prisma/              # Prisma schema and seed script
public/              # Static assets
```

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
cp .env.example .env
```

3. Configure PostgreSQL and populate the database URL in `.env`.

4. Generate Prisma client and apply schema:

```bash
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
```

5. Start the development server:

```bash
npm run dev
```

Then open:

- http://localhost:3000

## Admin Access

The seeded admin account is:

- Email: admin@cartnova.io
- Password: Admin123!

## Useful Commands

```bash
npm run dev
npm run build
npm run start
npx prisma generate
npx prisma db push
npx prisma studio
npx vitest run
```

## Production Notes

For a real deployment, set a secure database URL, generate a strong session secret, and use a managed Postgres service such as Supabase, Neon, or Railway.
