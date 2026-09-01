"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usuarioCrearSchema, ROLES, type UsuarioCrearFormValues } from "./schema";
import { crearUsuario } from "../../_actions/usuarios-actions";

export default function FormularioCrearUsuario() {
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UsuarioCrearFormValues>({
    resolver: zodResolver(usuarioCrearSchema),
    defaultValues: { name: "", email: "", password: "", role: "EDITOR" },
  });

  async function enviar(data: UsuarioCrearFormValues) {
    setEnviando(true);
    setError("");
    try {
      await crearUsuario(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ocurrió un error al crear el usuario");
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(enviar)} className="flex flex-col gap-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-brand-ink">
          Nombre
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="w-full rounded-md border border-brand-line px-3 py-2 text-brand-ink outline-none focus:border-brand-green"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-brand-ink">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="w-full rounded-md border border-brand-line px-3 py-2 text-brand-ink outline-none focus:border-brand-green"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-brand-ink">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          {...register("password")}
          className="w-full rounded-md border border-brand-line px-3 py-2 text-brand-ink outline-none focus:border-brand-green"
        />
        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
      </div>

      <div>
        <label htmlFor="role" className="mb-1 block text-sm font-medium text-brand-ink">
          Rol
        </label>
        <select
          id="role"
          {...register("role")}
          className="w-full rounded-md border border-brand-line px-3 py-2 text-brand-ink outline-none focus:border-brand-green"
        >
          {ROLES.map((rol) => (
            <option key={rol} value={rol}>
              {rol}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={enviando}
        className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        {enviando ? "Creando..." : "Crear usuario"}
      </button>
    </form>
  );
}
