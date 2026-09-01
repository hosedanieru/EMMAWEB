'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { loginSchema, type LoginFormData } from './schema';

export default function FormularioLogin({ callbackUrl }: { callbackUrl: string }) {
  type EstadoEnvio = 'idle' | 'enviando' | 'error';

  const router = useRouter();
  const [estadoEnvio, setEstadoEnvio] = useState<EstadoEnvio>('idle');
  const [mensajeError, setMensajeError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setEstadoEnvio('enviando');
    setMensajeError('');

    const resultado = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (!resultado || resultado.error) {
      setEstadoEnvio('error');
      setMensajeError('Correo o contraseña incorrectos');
      return;
    }

    // signIn con redirect:false no navega solo: hay que hacerlo manualmente
    // y refrescar para que los Server Components vuelvan a leer la sesión.
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label htmlFor="email" className="block text-brand-ink font-medium mb-1">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="w-full rounded-md border border-brand-line px-3 py-2 text-brand-ink outline-none focus:border-brand-green"
        />
        {errors.email && (
          <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-brand-ink font-medium mb-1">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          {...register('password')}
          className="w-full rounded-md border border-brand-line px-3 py-2 text-brand-ink outline-none focus:border-brand-green"
        />
        {errors.password && (
          <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={estadoEnvio === 'enviando'}
        className="btn btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
      >
        {estadoEnvio === 'enviando' ? 'Ingresando...' : 'Ingresar'}
      </button>

      {estadoEnvio === 'error' && (
        <p className="text-red-600 text-sm">{mensajeError}</p>
      )}
    </form>
  );
}
