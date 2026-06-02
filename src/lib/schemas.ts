import { z } from 'zod';

const honeypot = z.string().max(0).optional().or(z.literal(''));

export const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(10),
  hp: honeypot,
});
export type ContactInput = z.infer<typeof contactSchema>;

export const contactStepSchema = z.object({
  companyName: z.string().min(2),
  contactName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  country: z.string().min(2),
  address: z.string().optional().or(z.literal('')),
});
export type ContactStepInput = z.infer<typeof contactStepSchema>;

export const productLineSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
  notes: z.string().optional().or(z.literal('')),
});
export type ProductLineInput = z.infer<typeof productLineSchema>;

export const brandsStepSchema = z.object({
  products: z.array(productLineSchema).min(1),
});

export const projectBriefSchema = z.object({
  category: z.enum([
    'tomato_paste', 'jams', 'juices', 'fava_beans',
    'sauces', 'beans_peas', 'canned_vegetables', 'other',
  ]),
  packagingFormat: z.enum(['tin', 'glass', 'pet', 'pouch']),
  targetVolume: z.string().min(2),
  certifications: z.array(z.string()).optional(),
  brandName: z.string().optional().or(z.literal('')),
  targetRetailPrice: z.string().optional().or(z.literal('')),
  artworkLink: z.string().url().optional().or(z.literal('')),
});
export type ProjectBriefInput = z.infer<typeof projectBriefSchema>;

export const privateLabelStepSchema = z.object({
  briefs: z.array(projectBriefSchema).min(1),
});

export const shippingStepSchema = z.object({
  shippingMethod: z.enum(['fob', 'cif', 'exw', 'dap']),
  destinationPort: z.string().min(2),
  estimatedDate: z.string().optional().or(z.literal('')),
  specialRequirements: z.string().optional().or(z.literal('')),
  exportCertifications: z.array(z.string()).optional(),
});
export type ShippingStepInput = z.infer<typeof shippingStepSchema>;

export const brandsRfqSchema = contactStepSchema
  .merge(shippingStepSchema)
  .merge(brandsStepSchema)
  .extend({ hp: honeypot });
export type BrandsRfqInput = z.infer<typeof brandsRfqSchema>;

export const privateLabelRfqSchema = contactStepSchema
  .merge(shippingStepSchema)
  .merge(privateLabelStepSchema)
  .extend({ hp: honeypot });
export type PrivateLabelRfqInput = z.infer<typeof privateLabelRfqSchema>;
