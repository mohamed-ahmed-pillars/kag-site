'use client';

import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { products as catalog } from '@/lib/data/products';

const stepVariant = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: { duration: 0.25, ease: 'easeOut' as const },
};

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-3 gap-3 border-b border-primary/5 py-2 text-sm last:border-0">
      <dt className="text-xs uppercase tracking-wider text-primary/60">{label}</dt>
      <dd className="col-span-2 text-primary">{value}</dd>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-primary/10 bg-card/60 p-6">
      <h3 className="mb-3 font-display text-base font-bold text-primary">{title}</h3>
      <dl>{children}</dl>
    </section>
  );
}

export function ReviewStep({ flow }: { flow: 'brands' | 'privateLabel' }) {
  const t = useTranslations('rfq.review');
  const tCats = useTranslations('rfq.privateLabel.categories');
  const tFmt = useTranslations('rfq.privateLabel.packagingFormats');
  const tMethods = useTranslations('rfq.shipping.methods');
  const { getValues } = useFormContext();
  const v = getValues();

  const productName = (id: string) => catalog.find((p) => String(p.id) === id)?.nameEn ?? `#${id}`;

  return (
    <motion.section {...stepVariant} className="space-y-8">
      <header className="space-y-3">
        <h2 className="font-display text-2xl font-bold text-primary sm:text-3xl">{t('heading')}</h2>
        <motion.span initial={{ width: 0 }} animate={{ width: 96 }} transition={{ duration: 0.6, delay: 0.1 }} className="block h-1 bg-secondary" />
        <p className="text-sm text-primary/70">{t('intro')}</p>
      </header>

      <Card title={t('sections.contact')}>
        <Row label="Company"  value={v.companyName} />
        <Row label="Contact"  value={v.contactName} />
        <Row label="Email"    value={v.email} />
        <Row label="Phone"    value={v.phone} />
        <Row label="Country"  value={v.country} />
        <Row label="Address"  value={v.address} />
      </Card>

      {flow === 'brands' ? (
        <Card title={t('sections.what')}>
          {(v.products ?? []).map((p: { productId: string; quantity: number; notes?: string }, i: number) => (
            <Row key={i} label={`#${i + 1}`} value={`${productName(p.productId)} - qty ${p.quantity}${p.notes ? ` - ${p.notes}` : ''}`} />
          ))}
        </Card>
      ) : (
        <Card title={t('sections.what')}>
          {(v.briefs ?? []).map((b: { category: string; packagingFormat: string; targetVolume: string; certifications?: string[]; brandName?: string; targetRetailPrice?: string; artworkLink?: string }, i: number) => (
            <div key={i} className={i > 0 ? 'mt-4 border-t border-primary/10 pt-4' : ''}>
              <Row label="Category"        value={tCats(b.category)} />
              <Row label="Packaging"       value={tFmt(b.packagingFormat)} />
              <Row label="Target volume"   value={b.targetVolume} />
              <Row label="Certifications"  value={(b.certifications ?? []).join(', ') || undefined} />
              <Row label="Brand name"      value={b.brandName} />
              <Row label="Target price"    value={b.targetRetailPrice} />
              <Row label="Artwork link"    value={b.artworkLink} />
            </div>
          ))}
        </Card>
      )}

      <Card title={t('sections.shipping')}>
        <Row label="Method"               value={v.shippingMethod ? tMethods(v.shippingMethod) : undefined} />
        <Row label="Destination"          value={v.destinationPort} />
        <Row label="Estimated date"       value={v.estimatedDate} />
        <Row label="Special requirements" value={v.specialRequirements} />
        <Row label="Export certs"         value={(v.exportCertifications ?? []).join(', ') || undefined} />
      </Card>
    </motion.section>
  );
}
