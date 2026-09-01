import type { MetadataRoute } from "next";

// Mantiene el panel y las rutas de API fuera de los buscadores. Sin esto, la
// pantalla de login del panel puede terminar indexada — no es una brecha de
// seguridad, pero le regala a cualquiera la ubicación exacta de la puerta.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /pedido-recibido lleva el id del pedido en la URL y muestra el nombre
      // del cliente: no tiene por qué quedar indexado.
      disallow: ["/admin", "/api/", "/pedido-recibido/"],
    },
  };
}
