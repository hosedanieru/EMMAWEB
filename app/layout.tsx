import type { Metadata } from "next";
import { Patua_One, Poppins } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CarritoProvider } from "@/context/CarritoContext";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
});

const accentFont = Patua_One({
  subsets: ["latin"],
  variable: "--font-sansita",
  weight: "400",
});

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
    <html lang="es" className={`${poppins.variable} ${accentFont.variable}`}>
      <body>
        <CarritoProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CarritoProvider>
      </body>
    </html>
  );
}