'use client';

import { useFormContext, useFieldArray } from 'react-hook-form';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { products as catalog } from '@/lib/data/products';
import { TextField } from './text-field';
import { stepVariant } from './motion';

export function BrandsStep() {
  const t = useTranslations('rfq.brands');
  const locale = useLocale();
  const { control, register, formState: { errors } } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: 'products' });
  const productLabel = (id: number) => {
    const p = catalog.find((x) => x.id === id);
    if (!p) return String(id);
    return locale === 'ar' ? p.nameAr : p.nameEn;
  };

  return (
    <motion.section {...stepVariant} className="space-y-8">
      <header className="space-y-3">
        <h2 className="font-display text-2xl font-bold text-primary sm:text-3xl">{t('step.heading')}</h2>
        <motion.span initial={{ width: 0 }} animate={{ width: 96 }} transition={{ duration: 0.6, delay: 0.1 }} className="block h-1 bg-secondary" />
        <p className="text-sm text-primary/70">{t('step.intro')}</p>
      </header>

      <div className="space-y-4">
        {fields.map((field, idx) => (
          <div key={field.id} className="space-y-3 rounded-2xl border border-primary/10 bg-card/60 p-5">
            <div className="flex items-start justify-between gap-3">
              <span className="text-xs uppercase tracking-wider text-primary/60">#{idx + 1}</span>
              {fields.length > 1 && (
                <button type="button" onClick={() => remove(idx)} aria-label={t('remove')} className="text-primary/50 hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs uppercase tracking-wider text-primary/70">{t('fields.product.label')}</label>
              <select
                {...register(`products.${idx}.productId` as const)}
                className="rounded-xl border border-primary/10 bg-white/60 px-4 py-3 text-sm text-primary outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/30"
              >
                <option value="">{t('fields.product.placeholder')}</option>
                {catalog.map((p) => (
                  <option key={p.id} value={String(p.id)}>{productLabel(p.id)}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField
                label={t('fields.quantity.label')}
                placeholder={t('fields.quantity.placeholder')}
                type="number"
                min={1}
                {...register(`products.${idx}.quantity` as const, { valueAsNumber: true })}
              />
              <TextField
                label={t('fields.notes.label')}
                placeholder={t('fields.notes.placeholder')}
                {...register(`products.${idx}.notes` as const)}
              />
            </div>
          </div>
        ))}

        {errors.products && typeof errors.products === 'object' && 'message' in errors.products && (
          <span className="text-xs text-red-500">{(errors.products as { message?: string }).message}</span>
        )}

        <button
          type="button"
          onClick={() => append({ productId: '', quantity: 1, notes: '' })}
          className="rounded-xl border border-dashed border-primary/30 bg-white/40 px-4 py-3 text-sm text-primary hover:border-primary/60 hover:bg-white/60"
        >
          + {t('addAnother')}
        </button>
      </div>
    </motion.section>
  );
}

export const BRANDS_FIELDS = ['products'] as const;
