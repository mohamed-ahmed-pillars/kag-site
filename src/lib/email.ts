import { Resend } from 'resend';
import { products } from '@/lib/data/products';
import type { BrandsRfqInput, ContactInput, PrivateLabelRfqInput } from './schemas';

function getClient(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('RESEND_API_KEY is required in production');
    }
    console.warn('[email] RESEND_API_KEY is not set - emails will fail');
    return new Resend('re_placeholder');
  }
  return new Resend(key);
}

function getAddresses() {
  const from = process.env.MAIL_FROM;
  const to = process.env.MAIL_TO;
  if (!from || !to) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('MAIL_FROM and MAIL_TO must be set');
    }
    console.warn('[email] MAIL_FROM and/or MAIL_TO not set - using placeholders, emails will fail');
    return { from: from ?? 'dev@placeholder.local', to: to ?? 'dev@placeholder.local' };
  }
  return { from, to };
}

export async function sendContactEmail(data: ContactInput): Promise<void> {
  const { from, to } = getAddresses();
  const body = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    '',
    'Message:',
    data.message,
  ].join('\n');
  const { error } = await getClient().emails.send({
    from,
    to,
    subject: `[Contact] ${data.name}`,
    text: body,
    replyTo: data.email,
  });
  if (error) throw new Error(`Resend failed: ${error.message ?? 'unknown'}`);
}

function productNameById(id: string): string {
  const numeric = Number(id);
  const found = products.find((p) => p.id === numeric);
  return found ? found.nameEn : `Unknown product (id ${id})`;
}

function renderContactBlock(data: { companyName: string; contactName: string; email: string; phone: string; country: string; address?: string }): string {
  return [
    `Company: ${data.companyName}`,
    `Contact: ${data.contactName}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Country: ${data.country}`,
    `Address: ${data.address || '-'}`,
  ].join('\n');
}

function renderShippingBlock(data: { shippingMethod: string; destinationPort: string; estimatedDate?: string; specialRequirements?: string; exportCertifications?: string[] }): string {
  const lines = [
    `Method: ${data.shippingMethod.toUpperCase()}`,
    `Destination: ${data.destinationPort}`,
    `Estimated date: ${data.estimatedDate || '-'}`,
    `Special requirements: ${data.specialRequirements || '-'}`,
  ];
  if (data.exportCertifications && data.exportCertifications.length > 0) {
    lines.push(`Required certifications: ${data.exportCertifications.join(', ')}`);
  }
  return lines.join('\n');
}

export async function sendBrandsRfqEmail(data: BrandsRfqInput): Promise<void> {
  const { from, to } = getAddresses();
  const productLines = data.products.map((p, i) =>
    `${i + 1}. ${productNameById(p.productId)} - qty ${p.quantity}${p.notes ? ` - ${p.notes}` : ''}`
  ).join('\n');
  const body = [
    'CONTACT',
    renderContactBlock(data),
    '',
    'PRODUCTS',
    productLines,
    '',
    'SHIPPING',
    renderShippingBlock(data),
  ].join('\n');
  const { error } = await getClient().emails.send({
    from,
    to,
    subject: `[Brands RFQ] ${data.companyName} - ${data.products.length} product(s)`,
    text: body,
    replyTo: data.email,
  });
  if (error) throw new Error(`Resend failed: ${error.message ?? 'unknown'}`);
}

export async function sendPrivateLabelRfqEmail(data: PrivateLabelRfqInput): Promise<void> {
  const { from, to } = getAddresses();
  const briefBlocks = data.briefs.map((b, i) => [
    `--- Brief ${i + 1} ---`,
    `Category: ${b.category}`,
    `Packaging: ${b.packagingFormat}`,
    `Target volume: ${b.targetVolume}`,
    `Certifications: ${(b.certifications ?? []).join(', ') || '-'}`,
    `Brand name: ${b.brandName || '-'}`,
    `Target retail price: ${b.targetRetailPrice || '-'}`,
    `Artwork link: ${b.artworkLink || '-'}`,
  ].join('\n')).join('\n\n');
  const categories = data.briefs.map((b) => b.category).join(', ');
  const body = [
    'CONTACT',
    renderContactBlock(data),
    '',
    'BRIEFS',
    briefBlocks,
    '',
    'SHIPPING',
    renderShippingBlock(data),
  ].join('\n');
  const { error } = await getClient().emails.send({
    from,
    to,
    subject: `[Private Label RFQ] ${data.companyName} - ${categories}`,
    text: body,
    replyTo: data.email,
  });
  if (error) throw new Error(`Resend failed: ${error.message ?? 'unknown'}`);
}
