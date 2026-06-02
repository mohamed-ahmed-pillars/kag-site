import { NextResponse } from 'next/server';
import { privateLabelRfqSchema } from '@/lib/schemas';
import { sendPrivateLabelRfqEmail } from '@/lib/email';

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const parsed = privateLabelRfqSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
  }
  if (parsed.data.hp && parsed.data.hp.length > 0) {
    return new NextResponse(null, { status: 204 });
  }
  try {
    await sendPrivateLabelRfqEmail(parsed.data);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[rfq/private-label] send failed', err);
    return NextResponse.json({ ok: false, error: 'mail_failed' }, { status: 502 });
  }
}
