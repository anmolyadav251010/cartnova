import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const addressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(7),
  line1: z.string().min(4),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().optional(),
  postalCode: z.string().min(3),
  country: z.string().min(2),
});

export const checkoutSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  line1: z.string().min(4),
  line2: z.string().optional().or(z.literal('')),
  city: z.string().min(2),
  state: z.string().optional().or(z.literal('')),
  postalCode: z.string().min(3),
  country: z.string().min(2),
  shippingMethod: z.enum(['standard', 'express']),
  paymentMethod: z.enum(['demo-card']).default('demo-card'),
  couponCode: z.string().optional().or(z.literal('')),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(8),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from the current one.',
    path: ['newPassword'],
  });

export const quantitySchema = z.object({
  quantity: z.number().int().min(1).max(99),
});
