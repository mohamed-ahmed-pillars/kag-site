'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import type { ShippingStepInput } from '@/lib/schemas';
import { TextField } from './text-field';
import { Chip } from './chip';
import { stepVariant } from './motion';

const METHODS = ['fob', 'cif', 'exw', 'dap'] as const;
const EXPORT_CERTS = ['halal', 'euOrganic', 'sfda', 'fda', 'jas', 'nsf', 'other'] as const;

export function ShippingStep() {
  const t = useTranslations('rfq.shipping');
  const tMethods = useTranslations('rfq.shipping.methods');
  const tCerts = useTranslations('rfq.shipping.exportCerts.chips');
  const tErrors = useTranslations('rfq.errors');
  const { register, setValue, formState: { errors } } = useFormContext<ShippingStepInput>();
  const isExport = useWatch({ name: 'isExport' }) as boolean | undefined;
  const method = useWatch({ name: 'shippingMethod' });
  const selectedCerts = (useWatch({ name: 'exportCertifications' }) as string[] | undefined) ?? [];

  const toggleCert = (id: string) => {
    if (selectedCerts.includes(id)) {
      setValue('exportCertifications', selectedCerts.filter((c) => c !== id), { shouldDirty: true });
    } else {
      setValue('exportCertifications', [...selectedCerts, id], { shouldDirty: true });
    }
  };

  const setExport = (value: boolean) => {
    setValue('isExport', value, { shouldDirty: true, shouldValidate: true });
    if (!value) {
      setValue('shippingMethod', undefined, { shouldDirty: true });
      setValue('exportCertifications', [], { shouldDirty: true });
    }
  };

  return (
    <motion.section {...stepVariant} className="space-y-8">
      <header className="space-y-3">
        <h2 className="font-display text-2xl font-bold text-primary sm:text-3xl">{t('heading')}</h2>
        <motion.span initial={{ width: 0 }} animate={{ width: 96 }} transition={{ duration: 0.6, delay: 0.1 }} className="block h-1 bg-secondary" />
        <p className="text-sm text-primary/70">{t('intro')}</p>
      </header>

      <div className="space-y-3">
        <span id="rfq-isExport-label" className="text-xs uppercase tracking-wider text-primary/70">{t('fields.isExport.label')}</span>
        <div role="radiogroup" aria-labelledby="rfq-isExport-label" className="grid grid-cols-2 gap-3">
          <Chip role="radio" selected={isExport === true} onClick={() => setExport(true)}>
            {t('fields.isExport.options.export')}
          </Chip>
          <Chip role="radio" selected={isExport === false} onClick={() => setExport(false)}>
            {t('fields.isExport.options.domestic')}
          </Chip>
        </div>
        {errors.isExport && <span className="text-xs text-red-500">{tErrors('required')}</span>}
      </div>

      {isExport === true && (
        <div className="space-y-3">
          <span id="rfq-method-label" className="text-xs uppercase tracking-wider text-primary/70">{t('fields.method.label')}</span>
          <div role="radiogroup" aria-labelledby="rfq-method-label" className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {METHODS.map((m) => (
              <Chip key={m} role="radio" selected={method === m} onClick={() => setValue('shippingMethod', m, { shouldDirty: true, shouldValidate: true })}>
                {tMethods(m)}
              </Chip>
            ))}
          </div>
          {errors.shippingMethod && <span className="text-xs text-red-500">{tErrors('required')}</span>}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TextField label={t('fields.destinationPort.label')} placeholder={t('fields.destinationPort.placeholder')} {...register('destinationPort')} error={errors.destinationPort?.message} />
        <TextField
          label={t('fields.estimatedDate.label')}
          type="date"
          {...register('estimatedDate')}
          error={errors.estimatedDate?.message}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs uppercase tracking-wider text-primary/70">{t('fields.specialRequirements.label')}</label>
        <textarea
          {...register('specialRequirements')}
          placeholder={t('fields.specialRequirements.placeholder')}
          rows={4}
          className="rounded-xl border border-primary/10 bg-white/60 px-4 py-3 text-sm text-primary outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/30"
        />
      </div>

      {isExport === true && (
        <div className="space-y-3 rounded-2xl border border-primary/10 bg-card/60 p-5">
          <h3 className="font-display text-base font-bold text-primary">{t('exportCerts.heading')}</h3>
          <p className="text-xs text-primary/70">{t('exportCerts.intro')}</p>
          <div className="flex flex-wrap gap-2">
            {EXPORT_CERTS.map((id) => (
              <Chip key={id} selected={selectedCerts.includes(id)} onClick={() => toggleCert(id)}>
                {tCerts(id)}
              </Chip>
            ))}
          </div>
        </div>
      )}
    </motion.section>
  );
}

export const SHIPPING_FIELDS = ['isExport', 'shippingMethod', 'destinationPort', 'estimatedDate', 'specialRequirements', 'exportCertifications'] as const;
