import { describe, expect, test } from 'bun:test';
import { contactSchema, rfqSchema } from '@/lib/schemas';

describe('contactSchema', () => {
  test('accepts a valid payload', () => {
    const result = contactSchema.safeParse({
      name: 'Jane',
      email: 'jane@example.com',
      message: 'Hello there, this is a message.',
      hp: '',
    });
    expect(result.success).toBe(true);
  });

  test('rejects an invalid email', () => {
    const result = contactSchema.safeParse({
      name: 'Jane',
      email: 'not-an-email',
      message: 'Hello there, this is a message.',
      hp: '',
    });
    expect(result.success).toBe(false);
  });

  test('rejects a too-short message', () => {
    const result = contactSchema.safeParse({
      name: 'Jane',
      email: 'jane@example.com',
      message: 'short',
      hp: '',
    });
    expect(result.success).toBe(false);
  });

  test('rejects a filled honeypot', () => {
    const result = contactSchema.safeParse({
      name: 'Jane',
      email: 'jane@example.com',
      message: 'Hello there, this is a message.',
      hp: 'bot',
    });
    expect(result.success).toBe(false);
  });
});

describe('rfqSchema', () => {
  test('accepts a valid payload', () => {
    const result = rfqSchema.safeParse({
      name: 'Jane',
      company: 'Acme',
      email: 'jane@example.com',
      phone: '+1-555-0100',
      productInterest: 'Widgets',
      quantity: 100,
      details: 'Need bulk pricing',
      hp: '',
    });
    expect(result.success).toBe(true);
  });

  test('rejects negative quantity', () => {
    const result = rfqSchema.safeParse({
      name: 'Jane',
      company: 'Acme',
      email: 'jane@example.com',
      productInterest: 'Widgets',
      quantity: -5,
      hp: '',
    });
    expect(result.success).toBe(false);
  });

  test('rejects missing company', () => {
    const result = rfqSchema.safeParse({
      name: 'Jane',
      email: 'jane@example.com',
      productInterest: 'Widgets',
      quantity: 100,
      hp: '',
    });
    expect(result.success).toBe(false);
  });
});
