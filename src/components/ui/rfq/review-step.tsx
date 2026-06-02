'use client';

import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { products as catalog } from '@/lib/data/products';
import type { BrandsRfqInput, PrivateLabelRfqInput } from '@/lib/schemas';
import { stepVariant } from './motion';

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
  const tCon = useTranslations('rfq.contact.fields');
  const tSh = useTranslations('rfq.shipping.fields');
  const tPL = useTranslations('rfq.privateLabel.fields');
  const tCats = useTranslations('rfq.privateLabel.categories');
  const tFmt = useTranslations('rfq.privateLabel.packagingFormats');
  const tMethods = useTranslations('rfq.shipping.methods');
  const tLabels = useTranslations('rfq.review.labels');
  const tItems = useTranslations('products.items');
  const { getValues } = useFormContext<BrandsRfqInput | PrivateLabelRfqInput>();
  const v = getValues();

  const productName = (id: string) => {
    const p = catalog.find((x) => String(x.id) === id);
    return p ? tItems(`${p.slug}.name`) : `#${id}`;
  };

  return (
    <motion.section {...stepVariant} className="space-y-8">
      <header className="space-y-3">
        <h2 className="font-display text-2xl font-bold text-primary sm:text-3xl">{t('heading')}</h2>
        <motion.span initial={{ width: 0 }} animate={{ width: 96 }} transition={{ duration: 0.6, delay: 0.1 }} className="block h-1 bg-secondary" />
        <p className="text-sm text-primary/70">{t('intro')}</p>
      </header>

      <Card title={t('sections.contact')}>
        <Row label={tCon('companyName.label')} value={v.companyName} />
        <Row label={tCon('contactName.label')} value={v.contactName} />
        <Row label={tCon('email.label')}       value={v.email} />
        <Row label={tCon('phone.label')}       value={v.phone} />
        <Row label={tCon('country.label')}     value={v.country} />
        <Row label={tCon('address.label')}     value={v.address} />
      </Card>

      {flow === 'brands' ? (
        <Card title={t('sections.what')}>
          {((v as BrandsRfqInput).products ?? []).map((p, i) => (
            <Row key={i} label={`#${i + 1}`} value={`${productName(p.productId)} - qty ${p.quantity}${p.notes ? ` - ${p.notes}` : ''}`} />
          ))}
        </Card>
      ) : (
        <Card title={t('sections.what')}>
          {((v as PrivateLabelRfqInput).briefs ?? []).map((b, i) => (
            <div key={i} className={i > 0 ? 'mt-4 border-t border-primary/10 pt-4' : ''}>
              <Row label={tPL('category.label')}          value={tCats(b.category)} />
              <Row label={tPL('packagingFormat.label')}   value={tFmt(b.packagingFormat)} />
              <Row label={tPL('targetVolume.label')}      value={b.targetVolume} />
              <Row label={tPL('certifications.label')}    value={(b.certifications ?? []).join(', ') || undefined} />
              <Row label={tPL('brandName.label')}         value={b.brandName} />
              <Row label={tPL('targetRetailPrice.label')} value={b.targetRetailPrice} />
              <Row label={tPL('artworkLink.label')}       value={b.artworkLink} />
            </div>
          ))}
        </Card>
      )}

      <Card title={t('sections.shipping')}>
        <Row label={tSh('isExport.label')}            value={v.isExport ? tSh('isExport.options.export') : tSh('isExport.options.domestic')} />
        {v.isExport && (
          <Row label={tSh('method.label')}            value={v.shippingMethod ? tMethods(v.shippingMethod) : undefined} />
        )}
        <Row label={tSh('destinationPort.label')}     value={v.destinationPort} />
        <Row label={tSh('estimatedDate.label')}       value={v.estimatedDate} />
        <Row label={tSh('specialRequirements.label')} value={v.specialRequirements} />
        {v.isExport && (
          <Row label={tLabels('exportCerts')}         value={(v.exportCertifications ?? []).join(', ') || undefined} />
        )}
      </Card>
    </motion.section>
  );
}
