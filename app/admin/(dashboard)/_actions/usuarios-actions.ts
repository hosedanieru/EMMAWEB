"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { requireAdmin } from "./auth-guard";
import {
  usuarioCrearSchema,
  usuarioEditarSchema,
} from "@/app/admin/(dashboard)/usuarios/_components/schema";

export async function crearUsuario(data: unknown) {
  await requireAdmin();

  const parsed = usuarioCrearSchema.parse(data);

  const existente = await prisma.user.findUnique({ where: { email: parsed.email } });
  if (existente) {
    throw new Error("Ya existe un usuario con ese correo.");
  }

  const passwordHasheado = await bcrypt.hash(parsed.password, 10);

  await prisma.user.create({
    data: {
      name: parsed.name,
      email: parsed.email,
      password: passwordHasheado,
      role: parsed.role,
    },
  });

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios");
}

export async function actualizarUsuario(id: string, data: unknown) {
  const session = await auth();
  await requireAdmin();

  const parsed = usuarioEditarSchema.parse(data);

  const esUnoMismo = session?.user?.id === id;
  if (esUnoMismo && parsed.role !== "ADMIN") {
    throw new Error("No podés quitarte el rol de ADMIN a vos mismo.");
  }

  if (parsed.role !== "ADMIN") {
    const objetivo = await prisma.user.findUnique({ where: { id } });
    if (objetivo?.role === "ADMIN") {
      const totalAdmins = await prisma.user.count({ where: { role: "ADMIN" } });
      if (totalAdmins <= 1) {
        throw new Error("No podés quitar el rol ADMIN al único administrador que queda.");
      }
    }
  }

  const emailEnUso = await prisma.user.findFirst({ where: { email: parsed.email, NOT: { id } } });
  if (emailEnUso) {
    throw new Error("Ya existe otro usuario con ese correo.");
  }

  await prisma.user.update({
    where: { id },
    data: { name: parsed.name, email: parsed.email, role: parsed.role },
  });

  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios");
}

export async function eliminarUsuario(id: string) {
  const session = await auth();
  await requireAdmin();

  if (session?.user?.id === id) {
    throw new Error("No podés eliminar tu propio usuario.");
  }

  const objetivo = await prisma.user.findUnique({ where: { id } });
  if (objetivo?.role === "ADMIN") {
    const totalAdmins = await prisma.user.count({ where: { role: "ADMIN" } });
    if (totalAdmins <= 1) {
      throw new Error("No podés eliminar al único administrador que queda.");
    }
  }

  await prisma.user.delete({ where: { id } });

  revalidatePath("/admin/usuarios");
}
