import { Resend } from 'resend';
import type { ContactInput, RfqInput } from './schemas';

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
    throw new Error('MAIL_FROM and MAIL_TO must be set');
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

export async function sendRfqEmail(data: RfqInput): Promise<void> {
  const { from, to } = getAddresses();
  const body = [
    `Name: ${data.name}`,
    `Company: ${data.company}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone ?? '-'}`,
    `Product interest: ${data.productInterest}`,
    `Quantity: ${data.quantity}`,
    '',
    'Details:',
    data.details ?? '-',
  ].join('\n');
  const { error } = await getClient().emails.send({
    from,
    to,
    subject: `[RFQ] ${data.company} - ${data.productInterest}`,
    text: body,
    replyTo: data.email,
  });
  if (error) throw new Error(`Resend failed: ${error.message ?? 'unknown'}`);
}
