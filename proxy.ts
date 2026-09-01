import { NextResponse } from 'next/server';
import { auth } from '@/auth';

// Next.js 16 corre proxy.ts siempre en runtime Node.js (ya no hay opción Edge),
// así que auth.ts puede importar Prisma (driver pg) sin problema aquí.
export default auth((req) => {
  const { nextUrl } = req;
  const estaLogueado = !!req.auth;
  const esRutaLogin = nextUrl.pathname === '/admin/login';
  const esApi = nextUrl.pathname.startsWith('/api/admin');

  if (esRutaLogin) {
    if (estaLogueado) {
      return NextResponse.redirect(new URL('/admin', nextUrl));
    }
    return NextResponse.next();
  }

  if (!estaLogueado) {
    // Las rutas de API no tienen a dónde "redirigir": un fetch() del cliente
    // espera JSON, no un 307 hacia una página de login.
    if (esApi) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }
    const loginUrl = new URL('/admin/login', nextUrl);
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
