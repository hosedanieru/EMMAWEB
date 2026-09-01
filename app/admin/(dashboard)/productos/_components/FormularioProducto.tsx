"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productoSchema, type ProductoFormValues } from "./schema";

type Categoria = { id: string; nombre: string };

const presentacionVacia = {
  cantidad: 0,
  unidad: "g" as const,
  unidadesPorPaquete: 1,
  precio: 0,
  stock: 0,
  activo: true,
};

export default function FormularioProducto({
  categorias,
  valoresIniciales,
  onSubmit,
}: {
  categorias: Categoria[];
  valoresIniciales?: ProductoFormValues;
  onSubmit: (data: ProductoFormValues) => Promise<void>;
}) {
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProductoFormValues>({
    resolver: zodResolver(productoSchema),
    defaultValues: valoresIniciales ?? {
      nombre: "",
      descripcion: "",
      imagen: "",
      categoriaId: "",
      activo: true,
      destacado: false,
      presentaciones: [presentacionVacia],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "presentaciones" });
  const imagenActual = watch("imagen");

  async function enviar(data: ProductoFormValues) {
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
    <form onSubmit={handleSubmit(enviar)} className="flex flex-col gap-6">
      <div>
        <label htmlFor="nombre" className="mb-1 block text-sm font-medium text-brand-ink">
          Nombre
        </label>
        <input
          id="nombre"
          type="text"
          {...register("nombre")}
          className="w-full rounded-md border border-brand-line px-3 py-2 text-brand-ink outline-none focus:border-brand-green"
        />
        {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>}
      </div>

      <div>
        <label htmlFor="descripcion" className="mb-1 block text-sm font-medium text-brand-ink">
          Descripción
        </label>
        <textarea
          id="descripcion"
          rows={3}
          {...register("descripcion")}
          className="w-full rounded-md border border-brand-line px-3 py-2 text-brand-ink outline-none focus:border-brand-green"
        />
        {errors.descripcion && <p className="mt-1 text-sm text-red-600">{errors.descripcion.message}</p>}
      </div>

      <div>
        <label htmlFor="imagen" className="mb-1 block text-sm font-medium text-brand-ink">
          Ruta de la imagen (ej: /images/arroz-500g-frontal.png)
        </label>
        <div className="flex items-start gap-3">
          <input
            id="imagen"
            type="text"
            {...register("imagen")}
            className="w-full rounded-md border border-brand-line px-3 py-2 text-brand-ink outline-none focus:border-brand-green"
          />
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-brand-line-2 bg-brand-paper-2">
            {imagenActual ? (
              // Vista previa simple: no usamos next/image acá porque el valor
              // cambia en vivo mientras se escribe y puede no ser válido aún.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagenActual} alt="" className="h-full w-full object-contain" />
            ) : (
              <span className="text-xs text-brand-muted">Sin imagen</span>
            )}
          </div>
        </div>
        {errors.imagen && <p className="mt-1 text-sm text-red-600">{errors.imagen.message}</p>}
      </div>

      <div>
        <label htmlFor="categoriaId" className="mb-1 block text-sm font-medium text-brand-ink">
          Categoría
        </label>
        <select
          id="categoriaId"
          {...register("categoriaId")}
          className="w-full rounded-md border border-brand-line px-3 py-2 text-brand-ink outline-none focus:border-brand-green"
        >
          <option value="">Elegí una categoría</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </select>
        {errors.categoriaId && <p className="mt-1 text-sm text-red-600">{errors.categoriaId.message}</p>}
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-brand-ink">
          <input type="checkbox" {...register("activo")} /> Activo (visible en el sitio)
        </label>
        <label className="flex items-center gap-2 text-sm text-brand-ink">
          <input type="checkbox" {...register("destacado")} /> Destacado
        </label>
      </div>

      <div>
        <h2 className="mb-3 text-base font-medium text-brand-green">Presentaciones</h2>

        <div className="flex flex-col gap-3">
          {fields.map((field, index) => {
            const esExistente = !!field.id && !!valoresIniciales?.presentaciones[index]?.id;
            const erroresFila = errors.presentaciones?.[index];

            return (
              <div key={field.id} className="rounded-lg border border-brand-line-2 p-3">
                <input type="hidden" {...register(`presentaciones.${index}.id`)} />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                  <div>
                    <label className="mb-1 block text-xs text-brand-muted">Cantidad</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register(`presentaciones.${index}.cantidad`)}
                      className="w-full rounded-md border border-brand-line px-2 py-1 text-brand-ink outline-none focus:border-brand-green"
                    />
                    {erroresFila?.cantidad && (
                      <p className="mt-1 text-xs text-red-600">{erroresFila.cantidad.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-brand-muted">Unidad</label>
                    <select
                      {...register(`presentaciones.${index}.unidad`)}
                      className="w-full rounded-md border border-brand-line px-2 py-1 text-brand-ink outline-none focus:border-brand-green"
                    >
                      <option value="g">g</option>
                      <option value="kg">kg</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-brand-muted">Unid. x paquete</label>
                    <input
                      type="number"
                      {...register(`presentaciones.${index}.unidadesPorPaquete`)}
                      className="w-full rounded-md border border-brand-line px-2 py-1 text-brand-ink outline-none focus:border-brand-green"
                    />
                    {erroresFila?.unidadesPorPaquete && (
                      <p className="mt-1 text-xs text-red-600">{erroresFila.unidadesPorPaquete.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-brand-muted">Precio</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register(`presentaciones.${index}.precio`)}
                      className="w-full rounded-md border border-brand-line px-2 py-1 text-brand-ink outline-none focus:border-brand-green"
                    />
                    {erroresFila?.precio && (
                      <p className="mt-1 text-xs text-red-600">{erroresFila.precio.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-brand-muted">Stock</label>
                    <input
                      type="number"
                      {...register(`presentaciones.${index}.stock`)}
                      className="w-full rounded-md border border-brand-line px-2 py-1 text-brand-ink outline-none focus:border-brand-green"
                    />
                    {erroresFila?.stock && (
                      <p className="mt-1 text-xs text-red-600">{erroresFila.stock.message}</p>
                    )}
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-brand-ink">
                    <input type="checkbox" {...register(`presentaciones.${index}.activo`)} /> Activa
                  </label>

                  {/* Una presentación ya guardada (con id) no se puede quitar de la
                      lista: solo desactivar con la casilla de arriba. Evita el
                      problema de borrar una fila que ya tiene pedidos asociados. */}
                  {!esExistente && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Quitar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {errors.presentaciones?.root && (
          <p className="mt-2 text-sm text-red-600">{errors.presentaciones.root.message}</p>
        )}

        <button
          type="button"
          onClick={() => append(presentacionVacia)}
          className="mt-3 text-sm text-brand-green-2 hover:text-brand-green hover:underline"
        >
          + Agregar presentación
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={enviando}
        className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        {enviando ? "Guardando..." : "Guardar producto"}
      </button>
    </form>
  );
}
