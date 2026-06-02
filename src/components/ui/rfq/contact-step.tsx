'use client';

import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import type { ContactStepInput } from '@/lib/schemas';
import { TextField } from './text-field';
import { stepVariant } from './motion';

export function ContactStep() {
  const t = useTranslations('rfq.contact');
  const { register, formState: { errors } } = useFormContext<ContactStepInput & { hp?: string }>();

  return (
    <motion.section {...stepVariant} className="space-y-8">
      <header className="space-y-3">
        <h2 className="font-display text-2xl font-bold text-primary sm:text-3xl">{t('heading')}</h2>
        <motion.span
          initial={{ width: 0 }}
          animate={{ width: 96 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="block h-1 bg-secondary"
        />
        <p className="text-sm text-primary/70">{t('intro')}</p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TextField label={t('fields.companyName.label')} placeholder={t('fields.companyName.placeholder')} {...register('companyName')} error={errors.companyName?.message} />
        <TextField label={t('fields.contactName.label')} placeholder={t('fields.contactName.placeholder')} {...register('contactName')} error={errors.contactName?.message} />
        <TextField label={t('fields.email.label')} type="email" placeholder={t('fields.email.placeholder')} {...register('email')} error={errors.email?.message} />
        <TextField
          label={t('fields.phone.label')}
          placeholder={t('fields.phone.placeholder')}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          {...register('phone')}
          error={errors.phone?.message}
        />
        <TextField label={t('fields.country.label')} placeholder={t('fields.country.placeholder')} {...register('country')} error={errors.country?.message} />
        <TextField label={t('fields.address.label')} placeholder={t('fields.address.placeholder')} {...register('address')} />
      </div>

      {/* honeypot */}
      <input {...register('hp')} hidden tabIndex={-1} autoComplete="off" />
    </motion.section>
  );
}

export const CONTACT_FIELDS = ['companyName', 'contactName', 'email', 'phone', 'country', 'address'] as const;
