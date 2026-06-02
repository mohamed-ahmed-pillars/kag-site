'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { contactSchema, type ContactInput } from '@/lib/schemas';
import { FlowButton } from '@/components/ui/flow-button';
import { TextField } from '@/components/ui/rfq/text-field';

export function ContactForm() {
  const t = useTranslations('contact.form');
  const tSuccess = useTranslations('contact.success');
  const tErrors = useTranslations('contact.errors');
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'ok' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: 'onTouched',
    defaultValues: { name: '', email: '', message: '', hp: '' },
  });

  const onSubmit = async (data: ContactInput) => {
    if (submitState === 'submitting') return;
    setSubmitState('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        setSubmitState('error');
        return;
      }
      reset();
      setSubmitState('ok');
    } catch {
      setSubmitState('error');
    }
  };

  if (submitState === 'ok') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-4 rounded-3xl border border-primary/10 bg-card/60 p-10 text-center"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary/30">
          <CheckCircle className="h-8 w-8 text-primary" />
        </div>
        <h2 className="font-display text-xl font-bold text-primary">{tSuccess('heading')}</h2>
        <p className="text-sm text-primary/70">{tSuccess('message')}</p>
        <button
          type="button"
          onClick={() => setSubmitState('idle')}
          className="text-xs uppercase tracking-wider text-primary/70 underline-offset-4 hover:text-primary hover:underline"
        >
          {tSuccess('sendAnother')}
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5 rounded-3xl border border-primary/10 bg-card/60 p-6 sm:p-8"
    >
      <TextField
        label={t('name.label')}
        placeholder={t('name.placeholder')}
        autoComplete="name"
        {...register('name')}
        error={errors.name && tErrors('name')}
      />
      <TextField
        label={t('email.label')}
        placeholder={t('email.placeholder')}
        type="email"
        inputMode="email"
        autoComplete="email"
        {...register('email')}
        error={errors.email && tErrors('email')}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-message" className="text-xs uppercase tracking-wider text-primary/70">
          {t('message.label')}
        </label>
        <textarea
          id="contact-message"
          rows={5}
          placeholder={t('message.placeholder')}
          aria-invalid={errors.message ? true : undefined}
          {...register('message')}
          className={
            'rounded-xl border border-primary/10 bg-white/60 px-4 py-3 text-sm text-primary outline-none transition-all focus:border-secondary focus:ring-2 focus:ring-secondary/30' +
            (errors.message ? ' border-red-400 focus:border-red-400 focus:ring-red-200' : '')
          }
        />
        {errors.message && (
          <span role="alert" className="text-xs text-red-500">
            {tErrors('message')}
          </span>
        )}
      </div>

      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" {...register('hp')} />

      {submitState === 'error' && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {tErrors('submitFailed')}
        </div>
      )}

      <div className="flex justify-end">
        <FlowButton
          type="submit"
          text={submitState === 'submitting' ? t('submitting') : t('submit')}
        />
      </div>
    </form>
  );
}
