import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import FormularioLogin from './_components/FormularioLogin';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  // Esto lo hacía proxy.ts, que se eliminó: Netlify monta el middleware de
  // Next como Edge Function y ahí reventaba con "nextHandler is not a
  // function", devolviendo 500 en todo /admin. Sin el proxy, mandar a quien
  // ya tiene sesión de vuelta al panel toca hacerlo acá.
  const session = await auth();
  if (session?.user) {
    redirect('/admin');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-paper px-4">
      <div className="w-full max-w-sm rounded-brand border border-brand-line-2 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-xl text-brand-green">
          Ingresar al panel administrativo
        </h1>
        <FormularioLogin callbackUrl={callbackUrl ?? '/admin'} />
      </div>
    </div>
  );
}
