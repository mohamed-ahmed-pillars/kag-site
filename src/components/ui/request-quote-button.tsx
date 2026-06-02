'use client';

import { useTranslations } from 'next-intl';
import { FlowButton } from '@/components/ui/flow-button';

type RequestQuoteButtonProps = {
  type: 'brands' | 'privateLabel';
  productId?: number;
  text?: string;
  className?: string;
  variant?: 'primary' | 'secondary';
};

function buildHref(type: 'brands' | 'privateLabel', productId?: number): string {
  if (type === 'privateLabel') return '/rfq/private-label';
  return productId ? `/rfq/brands?product=${productId}` : '/rfq/brands';
}

export function RequestQuoteButton({
  type,
  productId,
  text,
  className,
  variant = 'primary',
}: RequestQuoteButtonProps) {
  const t = useTranslations('rfq.actions');
  return (
    <FlowButton
      href={buildHref(type, productId)}
      text={text ?? t('requestQuote')}
      variant={variant}
      className={className}
    />
  );
}
