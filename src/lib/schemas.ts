import { z } from 'zod';

const honeypot = z.string().max(0).optional().or(z.literal(''));

export const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(10),
  hp: honeypot,
});

export type ContactInput = z.infer<typeof contactSchema>;

export const rfqSchema = z.object({
  name: z.string().min(1),
  company: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  productInterest: z.string().min(1),
  quantity: z.number().int().positive(),
  details: z.string().optional(),
  hp: honeypot,
});

export type RfqInput = z.infer<typeof rfqSchema>;
