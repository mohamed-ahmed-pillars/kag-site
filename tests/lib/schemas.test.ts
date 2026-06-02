import { describe, expect, test } from 'bun:test';
import { contactSchema } from '@/lib/schemas';
import {
  brandsRfqSchema,
  privateLabelRfqSchema,
  contactStepSchema,
  productLineSchema,
  projectBriefSchema,
  shippingStepSchema,
} from '@/lib/schemas';

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

const validContact = {
  companyName: 'Acme Foods',
  contactName: 'Jane Doe',
  email: 'jane@acme.com',
  phone: '+44 20 1234 5678',
  country: 'United Kingdom',
  address: '',
  hp: '',
};

const validShipping = {
  shippingMethod: 'fob' as const,
  destinationPort: 'Felixstowe',
  estimatedDate: '',
  specialRequirements: '',
  exportCertifications: [],
};

describe('contactStepSchema', () => {
  test('accepts valid payload', () => {
    expect(contactStepSchema.safeParse(validContact).success).toBe(true);
  });
  test('rejects short company name', () => {
    expect(contactStepSchema.safeParse({ ...validContact, companyName: 'A' }).success).toBe(false);
  });
  test('rejects invalid email', () => {
    expect(contactStepSchema.safeParse({ ...validContact, email: 'nope' }).success).toBe(false);
  });
});

describe('productLineSchema', () => {
  test('accepts valid line', () => {
    expect(productLineSchema.safeParse({ productId: '1', quantity: 100, notes: '' }).success).toBe(true);
  });
  test('rejects zero quantity', () => {
    expect(productLineSchema.safeParse({ productId: '1', quantity: 0, notes: '' }).success).toBe(false);
  });
  test('rejects missing productId', () => {
    expect(productLineSchema.safeParse({ productId: '', quantity: 1, notes: '' }).success).toBe(false);
  });
});

describe('projectBriefSchema', () => {
  test('accepts valid brief', () => {
    expect(projectBriefSchema.safeParse({
      category: 'tomato_paste',
      packagingFormat: 'tin',
      targetVolume: '1 container/month',
      certifications: ['halal'],
      brandName: '',
      targetRetailPrice: '',
      artworkLink: '',
    }).success).toBe(true);
  });
  test('rejects unknown category', () => {
    expect(projectBriefSchema.safeParse({
      category: 'pizza',
      packagingFormat: 'tin',
      targetVolume: '1 container/month',
    }).success).toBe(false);
  });
  test('rejects malformed artwork link', () => {
    expect(projectBriefSchema.safeParse({
      category: 'jams',
      packagingFormat: 'glass',
      targetVolume: '500 cartons',
      artworkLink: 'not a url',
    }).success).toBe(false);
  });
  test('accepts empty artworkLink', () => {
    expect(projectBriefSchema.safeParse({
      category: 'jams',
      packagingFormat: 'glass',
      targetVolume: '500 cartons',
      artworkLink: '',
    }).success).toBe(true);
  });
});

describe('shippingStepSchema', () => {
  test('accepts valid shipping', () => {
    expect(shippingStepSchema.safeParse(validShipping).success).toBe(true);
  });
  test('rejects unknown method', () => {
    expect(shippingStepSchema.safeParse({ ...validShipping, shippingMethod: 'foo' }).success).toBe(false);
  });
});

describe('brandsRfqSchema', () => {
  test('accepts full payload', () => {
    const result = brandsRfqSchema.safeParse({
      ...validContact,
      ...validShipping,
      products: [{ productId: '1', quantity: 100, notes: '' }],
      hp: '',
    });
    expect(result.success).toBe(true);
  });
  test('rejects empty products', () => {
    const result = brandsRfqSchema.safeParse({
      ...validContact,
      ...validShipping,
      products: [],
      hp: '',
    });
    expect(result.success).toBe(false);
  });
});

describe('privateLabelRfqSchema', () => {
  test('accepts full payload', () => {
    const result = privateLabelRfqSchema.safeParse({
      ...validContact,
      ...validShipping,
      briefs: [{
        category: 'tomato_paste',
        packagingFormat: 'tin',
        targetVolume: '1 container/month',
        certifications: ['halal'],
        brandName: 'Al-Falah',
        targetRetailPrice: '$1.5/unit',
        artworkLink: '',
      }],
      hp: '',
    });
    expect(result.success).toBe(true);
  });
  test('rejects empty briefs', () => {
    const result = privateLabelRfqSchema.safeParse({
      ...validContact,
      ...validShipping,
      briefs: [],
      hp: '',
    });
    expect(result.success).toBe(false);
  });
});
