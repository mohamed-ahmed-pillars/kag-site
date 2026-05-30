'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { contactSchema, type ContactInput } from '@/lib/schemas';

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'ok' | 'err'>('idle');
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', message: '', hp: '' },
  });

  const onSubmit = async (data: ContactInput) => {
    try {
      const res = await fetch('/api/contact', {
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
      {errors.name && <span>name required</span>}
      <input {...register('email')} type="email" placeholder="email" />
      {errors.email && <span>email invalid</span>}
      <textarea {...register('message')} placeholder="message" />
      {errors.message && <span>message too short</span>}
      <button type="submit" disabled={isSubmitting}>
        Send
      </button>
      {status === 'ok' && <p>Sent</p>}
      {status === 'err' && <p>Error</p>}
    </form>
  );
}
