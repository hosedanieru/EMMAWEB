import FormularioLogin from './_components/FormularioLogin';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

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
