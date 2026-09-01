"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "./auth-guard";
import { vacanteSchema } from "@/app/admin/(dashboard)/vacantes/_components/schema";

export async function crearVacante(data: unknown) {
  await requireAdmin();

  const parsed = vacanteSchema.parse(data);

  await prisma.vacante.create({ data: parsed });

  revalidatePath("/admin/vacantes");
  revalidatePath("/contacto");
  redirect("/admin/vacantes");
}

export async function actualizarVacante(id: string, data: unknown) {
  await requireAdmin();

  const parsed = vacanteSchema.parse(data);

  await prisma.vacante.update({ where: { id }, data: parsed });

  revalidatePath("/admin/vacantes");
  revalidatePath("/contacto");
  redirect("/admin/vacantes");
}

export async function cambiarEstadoVacante(id: string, activa: boolean) {
  await requireAdmin();

  await prisma.vacante.update({ where: { id }, data: { activa } });

  revalidatePath("/admin/vacantes");
  revalidatePath("/contacto");
}
