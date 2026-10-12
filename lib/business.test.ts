import { describe, expect, it } from 'vitest';

import {
  calculateCartTotal,
  calculateLineTotal,
  canAccessAdmin,
  searchProducts,
  validateProductQuantity,
  validateRegistrationInput,
} from './business';

describe('business logic', () => {
  it('calculates line totals and cart totals correctly', () => {
    expect(calculateLineTotal(2499, 2)).toBe(4998);
    expect(calculateCartTotal([{ price: 2499, quantity: 2 }, { price: 1000, quantity: 3 }])).toBe(7998);
  });

  it('validates quantities', () => {
    expect(validateProductQuantity(3)).toBe(3);
    expect(() => validateProductQuantity(0)).toThrow('Quantity must be an integer between 1 and 99.');
    expect(() => validateProductQuantity(100)).toThrow('Quantity must be an integer between 1 and 99.');
  });

  it('searches products by name and description', () => {
    const products = [
      { name: 'Aster Pro Speaker', description: 'Compact wireless audio' },
      { name: 'Nimbus Lamp', description: 'Soft home lighting' },
    ];

    expect(searchProducts(products, 'speaker')).toHaveLength(1);
    expect(searchProducts(products, 'lighting')).toHaveLength(1);
  });

  it('validates registration payloads', () => {
    expect(validateRegistrationInput({ name: 'Jane Doe', email: 'jane@example.com', password: 'password123' })).toMatchObject({ email: 'jane@example.com' });
    expect(() => validateRegistrationInput({ name: 'J', email: 'bad-email', password: 'short' })).toThrow();
  });

  it('checks admin permissions', () => {
    expect(canAccessAdmin('ADMIN')).toBe(true);
    expect(canAccessAdmin('CUSTOMER')).toBe(false);
    expect(canAccessAdmin(null)).toBe(false);
  });
});
