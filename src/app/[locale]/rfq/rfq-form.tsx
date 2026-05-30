'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { rfqSchema, type RfqInput } from '@/lib/schemas';

export function RfqForm() {
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle');
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<RfqInput>({
    resolver: zodResolver(rfqSchema),
    defaultValues: {
      name: '',
      company: '',
      email: '',
      phone: '',
      productInterest: '',
      quantity: 1,
      details: '',
      hp: '',
    },
  });

  const onSubmit = async (data: RfqInput) => {
    try {
      const res = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setStatus(res.ok ? 'ok' : 'err');
    } catch {
      setStatus('err');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('hp')} hidden tabIndex={-1} autoComplete="off" />
      <input {...register('name')} placeholder="name" />
      {errors.name && <span>required</span>}
      <input {...register('company')} placeholder="company" />
      {errors.company && <span>required</span>}
      <input {...register('email')} type="email" placeholder="email" />
      {errors.email && <span>invalid</span>}
      <input {...register('phone')} placeholder="phone (optional)" />
      <input {...register('productInterest')} placeholder="product" />
      {errors.productInterest && <span>required</span>}
      <input
        {...register('quantity', { valueAsNumber: true })}
        type="number"
        min={1}
        placeholder="quantity"
      />
      {errors.quantity && <span>invalid</span>}
      <textarea {...register('details')} placeholder="details (optional)" />
      <button type="submit" disabled={isSubmitting}>
        Submit
      </button>
      {status === 'ok' && <p>Sent</p>}
      {status === 'err' && <p>Error</p>}
    </form>
  );
}
