# Guía de despliegue — Emma Colombia

Checklist para poner el sitio en producción. El `README.md` explica cómo
levantar el proyecto en una máquina de desarrollo; esto es lo otro.

Léela completa antes de empezar: hay un paso (el webhook de Wompi, §7) que si
se omite hace que **los pagos se cobren pero ningún pedido se confirme**, y el
síntoma no es evidente.

---

## 1. Qué es esto

Tienda en línea y panel administrativo. Next.js 16 (App Router) + PostgreSQL 14
o superior + Prisma 7. Los pagos van por Wompi (Web Checkout).

Requisitos del servidor:

| | Versión |
|---|---|
| Node.js | 20 o superior |
| npm | 10 o superior |
| PostgreSQL | 14 o superior |

---

## 2. Base de datos

### 2.1 Si usas un proveedor administrado

Railway, Render, Neon, Supabase y similares ya entregan una base con un usuario
limitado a ella. Copia la cadena de conexión que te den, **agrégale
`?sslmode=require`** si no lo trae, y salta a la sección 3.

### 2.2 Si instalas PostgreSQL a mano

No uses el superusuario `postgres` para la aplicación. Crea un rol dedicado:

```sql
CREATE ROLE emma_app WITH LOGIN PASSWORD 'una-clave-larga-y-generada-al-azar';
CREATE DATABASE emma_db OWNER emma_app;
```

Como dueño de su propia base, `emma_app` puede correr las migraciones sin
problema, pero no puede tocar otras bases del servidor ni crear usuarios. Si
esa contraseña se filtra algún día, el daño queda contenido a los datos de Emma.

Además, en `pg_hba.conf` y en el firewall: que el puerto 5432 solo acepte
conexiones desde el servidor de la aplicación, nunca desde internet.

---

## 3. Variables de entorno

Copia `.env.example` a `.env` (o cárgalas en el panel del proveedor). El
`.env.example` explica cada una; acá está lo mínimo.

### Obligatorias

```env
DATABASE_URL="postgresql://emma_app:CLAVE@host:5432/emma_db?sslmode=require"

# Genera uno nuevo con:  npx auth secret
# Es la clave que firma las sesiones del panel. NO reutilices la de desarrollo.
AUTH_SECRET=

# Dominio público, SIN barra final.
APP_URL=https://tudominio.com.co
```

`APP_URL` importa más de lo que parece: se usa para el `redirect-url` del
checkout de Wompi, para el chequeo de origen de la ruta de cancelación de
pedidos, y para el `robots.txt`. Detrás de un proxy, la URL de la petición no
siempre trae el dominio real.

### Si hay un proxy o balanceador delante

```env
AUTH_TRUST_HOST=true
```

Hace falta con nginx, Traefik, Docker, Railway, Render. **En Vercel no.** Si lo
omites cuando hace falta, el login redirige a la URL equivocada después de
autenticar.

### Wompi

```env
WOMPI_PUBLIC_KEY=
WOMPI_INTEGRITY_SECRET=
WOMPI_EVENTS_SECRET=
WOMPI_PRIVATE_KEY=
```

Salen del panel de Wompi, en «Llaves del API» y «Secretos para integración
técnica».

> Las que empiezan por `pub_prod_` / `prod_` / `prv_prod_` son de **producción y
> cobran dinero real**. Para la prueba del paso 8, pide las de prueba
> (`pub_test_`, `test_integrity_`, `test_events_`) y cámbialas por las reales
> solo al final.

Si estas variables quedan vacías, el sitio funciona igual: el pedido se crea
pero sin link de pago, y alguien del equipo coordina el cobro a mano.

### Correo (opcional, pero muy recomendable)

```env
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM="Emma Colombia <pedidos@tudominio.com.co>"
SMTP_TO=
```

Mientras `SMTP_USER` y `SMTP_PASS` estén vacíos no se manda ningún correo y
nada falla. Pero el correo es lo que lleva el link de pago: sin él, un cliente
que cierra la pestaña antes de pagar solo se puede recuperar a mano desde el
panel (que sí permite reenviarle el link por WhatsApp, ver §9).

Brevo tiene plan gratuito de 300 correos/día y no requiere tocar DNS. **No uses
el correo institucional de Microsoft 365**: exige apagar Security Defaults en
todo el tenant, y Microsoft desactiva la autenticación básica SMTP a fin de 2026.

---

## 4. Instalación y migraciones

```bash
npm ci                      # instalación limpia desde package-lock
npx prisma migrate deploy   # aplica las 13 migraciones
npm run seed                # carga el catálogo inicial de productos
```

`npm ci` ejecuta `prisma generate` solo al terminar (está en `postinstall`).

Sobre las migraciones: en el servidor se usa **`deploy`, nunca `dev`**.
`prisma migrate dev` puede borrar datos si detecta desfases; es solo para la
máquina de desarrollo.

El seed es idempotente: se puede correr las veces que quieras. Actualiza
precios y nombres, y **nunca toca el stock** — eso se maneja desde el panel.

---

## 5. Compilar y levantar

```bash
npm run build
npm start
```

El sitio queda en el puerto 3000 salvo que definas `PORT`.

### 5.1 Alternativa: desplegar en Netlify

Netlify detecta Next.js solo y le aplica su adaptador; **no hay que instalar
ningún plugin**. Lo que no puede adivinar está en `netlify.toml`, que ya viene
en el repositorio.

Se despliega **conectando el repositorio de GitHub**, no subiendo un `.zip`.
Este es un sitio con servidor (base de datos, sesiones, webhook de pago): el
arrastrar-y-soltar de Netlify solo publica archivos estáticos ya compilados y
no ejecuta ningún build, así que con el código fuente en un zip nunca va a
funcionar.

**La base de datos tiene que ser accesible desde internet.** Las funciones de
Netlify corren en la nube y no ven un PostgreSQL local; hace falta un Postgres
administrado (Neon, Supabase, Railway, Render). Y como cada invocación abre su
propia conexión, conviene usar la **cadena con pooler** que ofrezca el
proveedor y no la directa, o el Postgres se queda sin conexiones libres.

Variables de entorno a cargar en *Site configuration → Environment variables*
(las mismas de §3, más una):

```env
AUTH_TRUST_HOST=true
```

Hace falta sí o sí: el sitio se sirve desde funciones detrás del CDN de
Netlify, así que Auth.js necesita permiso explícito para confiar en el host de
la petición. Sin ella el login redirige mal después de autenticar.

Las migraciones (§4) **no corren en el build de Netlify**: se lanzan una vez a
mano contra la base de producción, desde una máquina con el `DATABASE_URL` de
producción cargado.

Dos diferencias de comportamiento frente a un servidor propio, ninguna
bloqueante:

- El límite de intentos de `lib/rate-limit.ts` cuenta en la memoria del
  proceso. En serverless hay varias instancias, así que el límite efectivo se
  multiplica por la cantidad de instancias vivas. Sigue frenando fuerza bruta,
  pero es menos estricto de lo que dicen los números de `auth.ts`.
- Las cabeceras y los redirects de `next.config.ts` se evalúan **después** del
  `proxy.ts`, al revés que en Next.js por su cuenta.

---

## 6. Crear el primer administrador

El panel exige estar logueado para crear usuarios, así que el primero va por
consola:

```bash
npm run crear-admin -- --email admin@tudominio.com.co --password "ClaveLarga123" --nombre "Nombre"
```

El `--` después de `crear-admin` es lo que hace que npm le pase los argumentos
al script. Si prefieres no dejar la clave en el historial del shell:

```bash
ADMIN_EMAIL=admin@tudominio.com.co ADMIN_PASSWORD="ClaveLarga123" npm run crear-admin
```

El comando es idempotente: si el correo ya existe, le cambia la contraseña y lo
asciende a ADMIN. **Es la única forma de recuperar el acceso** — no hay
recuperación por correo.

### Roles

| Rol | Puede |
|---|---|
| `ADMIN` | Todo: pedidos, productos, vacantes, usuarios |
| `FACTURACION` | Solo pedidos |
| `EDITOR` | Nada del panel todavía (es el rol por defecto al crear usuarios) |
| `VIEWER` | Nada del panel todavía |

El sistema no deja quedarse sin administradores: no se puede eliminar ni
degradar al último ADMIN, ni quitarse el rol a uno mismo.

La sesión dura 8 horas y el rol se revalida contra la base cada 5 minutos, así
que degradar o eliminar a alguien le corta el acceso casi de inmediato.

---

## 7. Registrar el webhook en Wompi — NO OMITIR

En el panel de Wompi, registrar esta URL de eventos:

```
https://TU-DOMINIO/api/webhooks/wompi
```

**Por qué es crítico.** El webhook es lo único que marca un pedido como pagado
y descuenta el inventario. El regreso del cliente a la tienda después de pagar
es solo una pantalla informativa: no cambia nada en la base.

Si la URL no está registrada, el síntoma es engañoso — los pagos se cobran
normal, el cliente ve que pagó, y en el panel el pedido sigue apareciendo como
«por pagar» indefinidamente. Nadie sospecha de la URL.

La ruta es pública y no requiere autenticación, porque quien la llama es Wompi
y no un usuario. Su seguridad viene de la firma que Wompi incluye en cada
evento, que se verifica con `WOMPI_EVENTS_SECRET`.

---

## 8. Verificación

### 8.1 Automática

```bash
npm run verificar
```

27 comprobaciones sobre el redondeo de precios, el cálculo del envío, la firma
de integridad, la firma de eventos del webhook y el límite de intentos. Deben
pasar las 27.

### 8.2 Compra completa, con llaves de prueba

Antes de anunciar la apertura, hacer una compra real de punta a punta y
comprobar que:

1. El envío se cobra según la ciudad elegida, y desaparece al pasar el umbral.
2. El total del link de pago **incluye el envío**.
3. Después de pagar, el pedido pasa a «pagado» en `/admin/pedidos/aprobados`
   (puede tardar unos segundos: el webhook es asíncrono).
4. El stock del producto bajó.

Si el paso 3 no ocurre, casi siempre es el webhook sin registrar (§7) o el
`WOMPI_EVENTS_SECRET` equivocado.

### 8.3 Activar la CSP

El sitio sale con `Content-Security-Policy-Report-Only`: el navegador no
bloquea nada, solo reporta en la consola. Recorrer el checkout y el panel
completos, revisar qué se reporta, y cuando esté limpio cambiar la cabecera a
`Content-Security-Policy` a secas en `next.config.ts`.

---

## 9. Configurar antes de abrir al público

Tres valores que el código deja listos pero que solo la empresa puede
confirmar. Cada uno vive en un solo archivo.

| Qué | Dónde | Nota |
|---|---|---|
| Tarifas y cobertura de envío | `lib/envio.ts` | Vienen puestas según lo que el sitio promete: Sabana de Occidente $6.000 con envío gratis desde $50.000, Bogotá $12.000 desde $120.000. Editar la tabla `ZONAS_ENVIO` y nada más. Las ciudades de esa tabla son las que aparecen en el desplegable del checkout. |
| NIT de la empresa | `lib/empresa.ts` | Mientras esté vacío, las páginas legales muestran un aviso en vez de un campo en blanco. |
| Credenciales SMTP | variables `SMTP_*` | Ver §3. |

Además, los cuatro documentos legales de `app/legal/` están redactados conforme
a la Ley 1581 de 2012 y la Ley 1480 de 2011, pero **deben pasar por revisión de
un abogado** antes de abrir al público.

---

## 10. Cómo funciona el cobro (resumen)

Útil para diagnosticar si algo falla.

1. El cliente arma el carrito, que vive en el `localStorage` de su navegador.
2. Al confirmar, `POST /api/pedidos` **ignora los precios que manda el
   navegador** y los vuelve a leer de la base. Calcula el envío según la ciudad
   y arma el total.
3. Se crea el pedido en estado `APROBADO`. **El stock no se toca todavía.**
4. El servidor firma el monto con `WOMPI_INTEGRITY_SECRET` y arma el link de
   pago.
5. El cliente sale a `checkout.wompi.co` y paga. Ningún dato de tarjeta pasa
   por este servidor.
6. Wompi devuelve al cliente a `/pedido-recibido/<id>` — **pantalla
   informativa, no confirma nada**.
7. Por separado, Wompi llama a `/api/webhooks/wompi`. Ahí se verifica la firma,
   se comprueba que el monto coincida con el del pedido, se marca como pagado y
   **recién ahí se descuenta el inventario**.

Los pasos 6 y 7 son independientes y pueden llegar en cualquier orden: por eso
la pantalla de comprobante puede decir «pendiente» justo después de un pago
exitoso.

### Si un pedido queda sin pagar

En `/admin/pedidos/<id>` hay un botón para copiar el link de pago o enviárselo
al cliente por WhatsApp. El link se reconstruye en el momento, así que sirve
aunque el pedido sea de hace días.

### Pedidos marcados para revisión

Arriba de `/admin/pedidos` aparece un aviso rojo cuando un pedido necesita que
lo mire una persona. Pasa en tres casos:

- **Sobreventa** — el pago se confirmó pero el stock se había agotado entre la
  creación del pedido y el pago. El inventario quedó en 0.
- **Pedido cancelado que se pagó** — el cliente usó un link viejo. El dinero
  entró pero el inventario no se descontó: hay que reactivar el pedido o
  reembolsar desde el panel de Wompi.
- **El monto no coincide** — llegó una confirmación por un valor distinto al
  del pedido. No se marcó como pagado ni se tocó el inventario.

---

## 11. Respaldos

No están configurados. Antes de abrir al público, definir frecuencia y
retención de copias de PostgreSQL y — sobre todo — **probar una restauración**.
Un respaldo que nunca se restauró no es un respaldo.
