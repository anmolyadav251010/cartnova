export function calculateLineTotal(price: number, quantity: number) {
  return price * quantity;
}

export function calculateCartTotal(items: Array<{ price: number; quantity: number }>) {
  return items.reduce((sum, item) => sum + calculateLineTotal(item.price, item.quantity), 0);
}

export function validateProductQuantity(quantity: number) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
    throw new Error('Quantity must be an integer between 1 and 99.');
  }

  return quantity;
}

export function searchProducts<T extends { name: string; description?: string | null }>(
  items: T[],
  query: string,
) {
  const q = query.trim().toLowerCase();
  if (!q) {
    return items;
  }

  return items.filter((item) => item.name.toLowerCase().includes(q) || (item.description ?? '').toLowerCase().includes(q));
}

export function validateRegistrationInput(payload: { name: string; email: string; password: string }) {
  if (payload.name.trim().length < 2) {
    throw new Error('Name must be at least 2 characters.');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    throw new Error('Email is invalid.');
  }

  if (payload.password.length < 8) {
    throw new Error('Password must be at least 8 characters.');
  }

  return payload;
}

export function canAccessAdmin(role?: string | null) {
  return role === 'ADMIN';
}
