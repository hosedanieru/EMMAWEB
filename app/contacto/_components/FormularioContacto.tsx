'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactoSchema, type ContactoFormData } from './schema';
import { enviarContacto } from './actions';

export default function FormularioContacto() {
    type EstadoEnvio = 'idle' | 'enviando' | 'exito' | 'error';

    // ...dentro del componente:
    const [estadoEnvio, setEstadoEnvio] = useState<EstadoEnvio>('idle');
  const [mensajeError, setMensajeError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactoFormData>({
    resolver: zodResolver(contactoSchema),
  });

  const onSubmit = async (data: ContactoFormData) => {
    setEstadoEnvio('enviando');
    setMensajeError('');

    const resultado = await enviarContacto(data);

    if (resultado.success) {
      setEstadoEnvio('exito');
      reset(); // limpia el formulario tras el envío exitoso
    } else {
      setEstadoEnvio('error');
      setMensajeError(resultado.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label htmlFor="nombre" className="block text-black font-medium mb-1">
          Nombre
        </label>
        <input
          id="nombre"
          type="text"
          {...register('nombre')}
          className="w-full rounded-md border border-gray-900 px-3 py-2"
        />
        {errors.nombre && (
          <p className="text-red-600 text-sm mt-1">{errors.nombre.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="correo" className="block text-black font-medium mb-1">
          Correo electrónico
        </label>
        <input
          id="correo"
          type="email"
          {...register('correo')}
          className="w-full rounded-md border border-gray-900 px-3 py-2"
        />
        {errors.correo && (
          <p className="text-red-600 text-sm mt-1">{errors.correo.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="telefono" className="block text-black font-medium mb-1">
          Teléfono (opcional)
        </label>
        <input
          id="telefono"
          type="tel"
          {...register('telefono')}
          className="w-full rounded-md border border-gray-900 px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="mensaje" className="block text-black font-medium mb-1">
          Mensaje
        </label>
        <textarea
          id="mensaje"
          rows={4}
          {...register('mensaje')}
          className="w-full rounded-md border border-gray-900 px-3 py-2"
        />
        {errors.mensaje && (
          <p className="text-red-600 text-sm mt-1">{errors.mensaje.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={estadoEnvio === 'enviando'}
        className="bg-brand-green-500 text-white rounded-md py-2 font-medium disabled:opacity-50"
      >
        {estadoEnvio === 'enviando' ? 'Enviando...' : 'Enviar mensaje'}
      </button>

      {estadoEnvio === 'exito' && (
        <p className="text-green-600 text-sm">
          ¡Gracias! Tu mensaje fue enviado correctamente.
        </p>
      )}
      {estadoEnvio === 'error' && (
        <p className="text-red-600 text-sm">{mensajeError}</p>
      )}
    </form>
  );
}