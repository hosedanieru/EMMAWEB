import { auth } from '@/auth';

export default async function AdminHomePage() {
  const session = await auth();

  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold text-brand-green">
        Bienvenido, {session?.user?.name}
      </h1>
      <p className="mt-1 text-sm text-brand-muted">
        Rol: {session?.user?.role}
      </p>
    </div>
  );
}
