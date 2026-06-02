'use client';

import { useState } from 'react';
import { FormProvider, useForm, type FieldPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { brandsRfqSchema, type BrandsRfqInput } from '@/lib/schemas';
import { FlowButton } from '@/components/ui/flow-button';
import { StepIndicator } from './step-indicator';
import { ContactStep, CONTACT_FIELDS } from './contact-step';
import { ShippingStep, SHIPPING_FIELDS } from './shipping-step';
import { ReviewStep } from './review-step';
import { BrandsStep, BRANDS_FIELDS } from './brands-step';

const STEP_FIELDS: readonly (readonly FieldPath<BrandsRfqInput>[])[] = [
  CONTACT_FIELDS as readonly FieldPath<BrandsRfqInput>[],
  BRANDS_FIELDS as readonly FieldPath<BrandsRfqInput>[],
  SHIPPING_FIELDS as readonly FieldPath<BrandsRfqInput>[],
  [],
];

type Props = { preselectProductId?: string };

export function BrandsWizard({ preselectProductId }: Props) {
  const t = useTranslations('rfq');
  const tSteps = useTranslations('rfq.steps');
  const tActions = useTranslations('rfq.actions');
  const [step, setStep] = useState(0);
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'ok' | 'error'>('idle');
  const [reference, setReference] = useState<string | null>(null);

  const methods = useForm<BrandsRfqInput>({
    resolver: zodResolver(brandsRfqSchema),
    mode: 'onTouched',
    defaultValues: {
      companyName: '', contactName: '', email: '', phone: '', country: '', address: '',
      products: [{ productId: preselectProductId ?? '', quantity: 1, notes: '' }],
      shippingMethod: 'fob', destinationPort: '', estimatedDate: '', specialRequirements: '',
      exportCertifications: [],
      hp: '',
    },
  });

  const labels = [tSteps('contact'), tSteps('products'), tSteps('shipping'), tSteps('review')];

  const goNext = async () => {
    const fields = STEP_FIELDS[step];
    const ok = fields.length === 0 ? true : await methods.trigger(fields);
    if (!ok) return;
    setStep((s) => Math.min(s + 1, 3));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goPrev = () => {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (data: BrandsRfqInput) => {
    if (submitState === 'submitting') return;
    setSubmitState('submitting');
    try {
      const res = await fetch('/api/rfq/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        setSubmitState('error');
        return;
      }
      setReference(`RFQ-${Date.now().toString(36).toUpperCase()}`);
      setSubmitState('ok');
    } catch {
      setSubmitState('error');
    }
  };

  if (submitState === 'ok') {
    return (
      <div className="mx-auto max-w-2xl space-y-6 rounded-3xl border border-primary/10 bg-card/60 p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary/30">
          <CheckCircle className="h-8 w-8 text-primary" />
        </div>
        <h2 className="font-display text-2xl font-bold text-primary">{t('success.heading')}</h2>
        <p className="text-primary/70">{t('success.message')}</p>
        {reference && <p className="text-sm text-primary/60">{t('success.reference')}: <span className="font-mono font-semibold">{reference}</span></p>}
        <FlowButton href="/" text={t('success.backHome')} />
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="mx-auto w-full max-w-3xl space-y-10">
        <div className="sticky top-20 z-10 -mx-2 rounded-2xl bg-background/80 px-2 py-4 backdrop-blur">
          <StepIndicator steps={labels} current={step} />
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && <ContactStep key="contact" />}
          {step === 1 && <BrandsStep key="brands" />}
          {step === 2 && <ShippingStep key="shipping" />}
          {step === 3 && <ReviewStep key="review" flow="brands" />}
        </AnimatePresence>

        {submitState === 'error' && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {t('errors.submitFailed')}
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          <motion.div whileTap={{ scale: 0.97 }}>
            {step > 0 ? (
              <button type="button" onClick={goPrev} className="text-sm text-primary/70 hover:text-primary">
                ← {tActions('prev')}
              </button>
            ) : <span />}
          </motion.div>
          {step < 3 ? (
            <FlowButton text={tActions('next')} onClick={goNext} />
          ) : (
            <FlowButton
              text={submitState === 'submitting' ? tActions('submitting') : tActions('submit')}
              type="submit"
            />
          )}
        </div>
      </form>
    </FormProvider>
  );
}
