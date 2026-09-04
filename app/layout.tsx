import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CarritoProvider } from "@/context/CarritoContext";
import { LocaleProvider } from "@/context/LocaleContext";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700", "800"],
});

// "Sansita One" no está en el catálogo de next/font/google de esta versión
// de Next (solo existe la familia "Sansita" con otros cortes), así que se
// carga igual que en Emma_web_v2_minimalista_SEO.html: vía Google Fonts CSS2.
export const metadata: Metadata = {
  title: "EMMA COLOMBIA",
  description: "Portal empresarial de EMMAWEB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={poppins.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font --
            La regla apunta al Pages Router (pages/_document.js), donde un
            <link> de fuente solo aplicaba a una página. En el App Router este
            head es el de la raíz y sí cubre todo el sitio, así que el aviso
            es un falso positivo. La alternativa real —next/font— no sirve
            acá: "Sansita One" no está en su catálogo (ver comentario arriba).
            Los dominios ya están permitidos en la CSP de next.config.ts. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Sansita+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LocaleProvider>
          <CarritoProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </CarritoProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
