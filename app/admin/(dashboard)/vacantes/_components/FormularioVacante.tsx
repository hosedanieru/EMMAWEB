"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  vacanteSchema,
  TIPOS_CONTRATO,
  ETIQUETAS_TIPO_CONTRATO,
  type VacanteFormValues,
} from "./schema";

export default function FormularioVacante({
  valoresIniciales,
  onSubmit,
}: {
  valoresIniciales?: VacanteFormValues;
  onSubmit: (data: VacanteFormValues) => Promise<void>;
}) {
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VacanteFormValues>({
    resolver: zodResolver(vacanteSchema),
    defaultValues: valoresIniciales ?? {
      titulo: "",
      area: "",
      ubicacion: "",
      tipo: "TIEMPO_COMPLETO",
      descripcion: "",
      activa: true,
    },
  });

  async function enviar(data: VacanteFormValues) {
    setEnviando(true);
    setError("");
    try {
      await onSubmit(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ocurrió un error al guardar");
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(enviar)} className="flex flex-col gap-4">
      <div>
        <label htmlFor="titulo" className="mb-1 block text-sm font-medium text-brand-ink">
          Título del cargo
        </label>
        <input
          id="titulo"
          type="text"
          placeholder="Ej. Auxiliar de logística"
          {...register("titulo")}
          className="w-full rounded-md border border-brand-line px-3 py-2 text-brand-ink outline-none focus:border-brand-green"
        />
        {errors.titulo && <p className="mt-1 text-sm text-red-600">{errors.titulo.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="area" className="mb-1 block text-sm font-medium text-brand-ink">
            Área
          </label>
          <input
            id="area"
            type="text"
            placeholder="Ej. Logística, Producción, Ventas..."
            {...register("area")}
            className="w-full rounded-md border border-brand-line px-3 py-2 text-brand-ink outline-none focus:border-brand-green"
          />
          {errors.area && <p className="mt-1 text-sm text-red-600">{errors.area.message}</p>}
        </div>

        <div>
          <label htmlFor="ubicacion" className="mb-1 block text-sm font-medium text-brand-ink">
            Ubicación
          </label>
          <input
            id="ubicacion"
            type="text"
            placeholder="Ej. Mosquera, Cundinamarca"
            {...register("ubicacion")}
            className="w-full rounded-md border border-brand-line px-3 py-2 text-brand-ink outline-none focus:border-brand-green"
          />
          {errors.ubicacion && <p className="mt-1 text-sm text-red-600">{errors.ubicacion.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="tipo" className="mb-1 block text-sm font-medium text-brand-ink">
          Tipo de contrato
        </label>
        <select
          id="tipo"
          {...register("tipo")}
          className="w-full rounded-md border border-brand-line px-3 py-2 text-brand-ink outline-none focus:border-brand-green"
        >
          {TIPOS_CONTRATO.map((tipo) => (
            <option key={tipo} value={tipo}>
              {ETIQUETAS_TIPO_CONTRATO[tipo]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="descripcion" className="mb-1 block text-sm font-medium text-brand-ink">
          Descripción
        </label>
        <textarea
          id="descripcion"
          rows={5}
          {...register("descripcion")}
          className="w-full rounded-md border border-brand-line px-3 py-2 text-brand-ink outline-none focus:border-brand-green"
        />
        {errors.descripcion && (
          <p className="mt-1 text-sm text-red-600">{errors.descripcion.message}</p>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm text-brand-ink">
        <input type="checkbox" {...register("activa")} /> Activa (visible en el sitio)
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={enviando}
        className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        {enviando ? "Guardando..." : "Guardar vacante"}
      </button>
    </form>
  );
}
