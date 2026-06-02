'use client';

import { useFormContext, useFieldArray, useWatch } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import type { PrivateLabelRfqInput } from '@/lib/schemas';
import { TextField } from './text-field';
import { Chip } from './chip';
import { stepVariant } from './motion';

const CATEGORIES = ['tomato_paste', 'jams', 'juices', 'fava_beans', 'sauces', 'beans_peas', 'canned_vegetables', 'other'] as const;
const PACK_FORMATS = ['tin', 'glass', 'pet', 'pouch'] as const;
const CERTS = ['halal', 'iso22000', 'fda', 'gmp', 'brc', 'kosher', 'euOrganic', 'other'] as const;

export function PrivateLabelStep() {
  const t = useTranslations('rfq.privateLabel');
  const tCerts = useTranslations('rfq.certifications');
  const tFmt = useTranslations('rfq.privateLabel.packagingFormats');
  const { control, register, setValue, formState: { errors } } = useFormContext<PrivateLabelRfqInput>();
  const { fields, append, remove } = useFieldArray({ control, name: 'briefs' });
  const briefs = useWatch({ name: 'briefs' }) as Array<{ certifications?: string[]; packagingFormat?: string }> | undefined;

  const toggleCert = (briefIdx: number, cert: string) => {
    const current = briefs?.[briefIdx]?.certifications ?? [];
    const next = current.includes(cert) ? current.filter((c) => c !== cert) : [...current, cert];
    setValue(`briefs.${briefIdx}.certifications`, next, { shouldDirty: true });
  };

  return (
    <motion.section {...stepVariant} className="space-y-8">
      <header className="space-y-3">
        <h2 className="font-display text-2xl font-bold text-primary sm:text-3xl">{t('step.heading')}</h2>
        <motion.span initial={{ width: 0 }} animate={{ width: 96 }} transition={{ duration: 0.6, delay: 0.1 }} className="block h-1 bg-secondary" />
        <p className="text-sm text-primary/70">{t('step.intro')}</p>
      </header>

      <div className="space-y-6">
        {fields.map((field, idx) => {
          const selectedFormat = briefs?.[idx]?.packagingFormat;
          const selectedCerts = briefs?.[idx]?.certifications ?? [];
          return (
            <div key={field.id} className="space-y-4 rounded-2xl border border-primary/10 bg-card/60 p-6">
              <div className="flex items-start justify-between gap-3">
                <span className="text-xs uppercase tracking-wider text-primary/60">#{idx + 1}</span>
                {fields.length > 1 && (
                  <button type="button" onClick={() => remove(idx)} aria-label={t('remove')} className="text-primary/50 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs uppercase tracking-wider text-primary/70">{t('fields.category.label')}</label>
                <select
                  {...register(`briefs.${idx}.category` as const)}
                  className="rounded-xl border border-primary/10 bg-white/60 px-4 py-3 text-sm text-primary outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/30"
                >
                  <option value="">—</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{t(`categories.${c}`)}</option>)}
                </select>
              </div>

              <div className="space-y-3">
                <span className="text-xs uppercase tracking-wider text-primary/70">{t('fields.packagingFormat.label')}</span>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {PACK_FORMATS.map((f) => (
                    <Chip key={f} selected={selectedFormat === f} onClick={() => setValue(`briefs.${idx}.packagingFormat`, f, { shouldDirty: true, shouldValidate: true })}>
                      {tFmt(f)}
                    </Chip>
                  ))}
                </div>
              </div>

              <TextField label={t('fields.targetVolume.label')} placeholder={t('fields.targetVolume.placeholder')} {...register(`briefs.${idx}.targetVolume` as const)} />

              <div className="space-y-3">
                <span className="text-xs uppercase tracking-wider text-primary/70">{t('fields.certifications.label')}</span>
                <div className="flex flex-wrap gap-2">
                  {CERTS.map((c) => (
                    <Chip key={c} selected={selectedCerts.includes(c)} onClick={() => toggleCert(idx, c)}>
                      {tCerts(c)}
                    </Chip>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <TextField label={t('fields.brandName.label')} placeholder={t('fields.brandName.placeholder')} {...register(`briefs.${idx}.brandName` as const)} />
                <TextField label={t('fields.targetRetailPrice.label')} placeholder={t('fields.targetRetailPrice.placeholder')} {...register(`briefs.${idx}.targetRetailPrice` as const)} />
              </div>

              <div className="space-y-1">
                <TextField label={t('fields.artworkLink.label')} placeholder={t('fields.artworkLink.placeholder')} type="url" {...register(`briefs.${idx}.artworkLink` as const)} />
                <p className="text-xs text-primary/60">{t('fields.artworkLink.help')}</p>
              </div>
            </div>
          );
        })}

        {errors.briefs?.root?.message && (
          <span className="text-xs text-red-500">{errors.briefs.root.message}</span>
        )}

        <button
          type="button"
          onClick={() => append({ category: 'tomato_paste', packagingFormat: 'tin', targetVolume: '', certifications: [], brandName: '', targetRetailPrice: '', artworkLink: '' })}
          className="rounded-xl border border-dashed border-primary/30 bg-white/40 px-4 py-3 text-sm text-primary hover:border-primary/60 hover:bg-white/60"
        >
          + {t('addAnother')}
        </button>
      </div>
    </motion.section>
  );
}

export const PRIVATE_LABEL_FIELDS = ['briefs'] as const;
