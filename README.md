# Emma Colombia — sitio web y panel administrativo

Tienda en línea y panel de administración de Compañía Colombiana de Alimentos
Emma SAS. Next.js 16 (App Router) + PostgreSQL + Prisma 7, pagos con Wompi.

---

## 1. Requisitos

| | Versión | Cómo verificar |
|---|---|---|
| Node.js | 20 o superior | `node -v` |
| npm | 10 o superior | `npm -v` |
| PostgreSQL | 14 o superior | `psql --version` |

Si no tienes Postgres instalado, la vía más rápida en Windows es el instalador
oficial de [postgresql.org](https://www.postgresql.org/download/windows/).

---

## 2. Instalación

```bash
# 1. Instalar dependencias
npm install
```

`npm install` ejecuta `prisma generate` automáticamente al terminar (está en
el script `postinstall`), así que el cliente de Prisma queda listo solo.

```bash
# 2. Crear el archivo de configuración
cp .env.example .env          # Linux / macOS
Copy-Item .env.example .env   # Windows PowerShell
```

Abre el `.env` y llena **como mínimo** estas dos:

```env
DATABASE_URL="postgresql://postgres:TU_CLAVE@localhost:5432/emma_db"
AUTH_SECRET=
```

Para generar el `AUTH_SECRET`:

```bash
npx auth secret
```

Es la clave con la que se firman las sesiones del panel. Si la cambias, se
cierran todas las sesiones abiertas.

El resto de variables están explicadas una por una dentro del `.env.example`.
Ninguna otra es obligatoria para arrancar.

---

## 3. Base de datos

Crea la base vacía (el nombre debe coincidir con el del `DATABASE_URL`):

```bash
psql -U postgres -c "CREATE DATABASE emma_db;"
```

Aplica las migraciones y carga el catálogo inicial de productos:

```bash
npx prisma migrate deploy   # crea todas las tablas
npm run seed                # carga los 9 productos con sus presentaciones
```

El seed es idempotente: puedes correrlo las veces que quieras y no duplica
nada. Actualiza nombres y descripciones, y reemplaza las presentaciones de
cada producto.

> El seed **no** crea usuarios. Eso es el paso siguiente.

---

## 4. Crear el primer administrador

El panel exige estar logueado para crear usuarios, así que el primer
administrador no se puede crear desde la interfaz: hay que meterlo por
consola.

```bash
npm run crear-admin -- --email ana@empresa.com --password "MiClave123" --nombre "Ana"
```

Fíjate en el `--` después de `crear-admin`: es lo que hace que npm pase los
argumentos al script en vez de interpretarlos él.

Si prefieres no dejar la contraseña en el historial del shell, usa variables
de entorno:

```bash
# Windows PowerShell
$env:ADMIN_EMAIL="ana@empresa.com"; $env:ADMIN_PASSWORD="MiClave123"; npm run crear-admin

# Linux / macOS
ADMIN_EMAIL=ana@empresa.com ADMIN_PASSWORD=MiClave123 npm run crear-admin
```

El comando es **idempotente**: si el correo ya existe, no falla — le cambia la
contraseña y lo asciende a ADMIN. Por eso sirve también para **recuperar el
acceso** si alguien pierde su clave, que es la única forma de hacerlo (no hay
recuperación por correo).

Ya con eso puedes entrar en `/admin/login`.

### Roles

| Rol | Puede |
|---|---|
| `ADMIN` | Todo: productos, usuarios, vacantes, pedidos |
| `FACTURACION` | Solo pedidos |
| `EDITOR` | Nada del panel todavía (rol por defecto al crear usuarios) |
| `VIEWER` | Nada del panel todavía |

Los usuarios siguientes se crean desde `/admin/usuarios`, ya sin consola.

El sistema no te deja quedarte sin administradores: no puedes eliminar ni
degradar al último ADMIN que quede, ni quitarte el rol a ti mismo.

---

## 5. Levantar el proyecto

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). El panel está en
[/admin](http://localhost:3000/admin).

### Comandos disponibles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm start` | Sirve lo compilado (requiere `build` antes) |
| `npm run lint` | Revisa el código |
| `npm run seed` | Carga/actualiza el catálogo de productos |
| `npm run crear-admin` | Crea o actualiza un usuario ADMIN |

---

## 6. Despliegue

### 6.1 Antes de subir nada

**Genera un `AUTH_SECRET` nuevo.** No reutilices el de desarrollo.

```bash
npx auth secret
```

**Revisa qué llaves de Wompi vas a usar.** Las que empiezan por `pub_prod_` /
`prod_` cobran dinero real. Si vas a probar el flujo completo en el servidor
antes de abrir al público, pide las de prueba (`pub_test_`, `test_events_`,
`test_integrity_`) en el mismo panel de Wompi.

### 6.2 Variables de entorno en el servidor

Todas las del `.env.example`. Estas tres son específicas de producción:

```env
APP_URL=https://tudominio.com.co     # sin barra final
AUTH_SECRET=<el nuevo>
AUTH_TRUST_HOST=true                 # solo si hay proxy delante
```

`AUTH_TRUST_HOST=true` hace falta en cualquier despliegue detrás de un proxy o
balanceador — nginx, Docker, Railway, Render. **En Vercel no**, ahí se detecta
solo. Si lo omites cuando hace falta, el login redirige a la URL equivocada
después de autenticar.

`APP_URL` importa más de lo que parece: es lo que se usa para armar el
`redirect-url` del checkout de Wompi. Detrás de un proxy, la URL de la
petición no siempre trae el dominio real.

### 6.3 Migraciones

En el servidor se usa `deploy`, **nunca** `dev`:

```bash
npx prisma migrate deploy
```

`prisma migrate dev` puede llegar a borrar datos si detecta desfases; es solo
para tu máquina.

### 6.4 Orden de despliegue

```bash
npm ci                      # instalación limpia desde package-lock
npx prisma migrate deploy   # tablas al día
npm run build               # compilar
npm start                   # levantar
```

Y una sola vez, para poder entrar al panel:

```bash
npm run crear-admin -- --email admin@tudominio.com.co --password "..." --nombre "..."
```

### 6.5 Webhook de Wompi (importante)

Wompi confirma los pagos llamando a:

```
https://TU-DOMINIO/api/webhooks/wompi
```

Hay que registrar esa URL en el panel de Wompi. **Sin esto, los pagos se
cobran pero el pedido nunca se marca como pagado y el inventario no se
descuenta**, porque el stock se descuenta justo ahí, cuando Wompi confirma.

Esa ruta tiene que ser accesible desde internet y no requiere autenticación
(el middleware solo protege `/admin` y `/api/admin`). Su seguridad viene de la
firma que Wompi incluye en cada evento, que se verifica con
`WOMPI_EVENTS_SECRET`.

### 6.6 Detalle sobre `localhost` y Wompi

En desarrollo, el checkout de Wompi está detrás de CloudFront y su WAF
**rechaza con 403** cualquier link cuyo `redirect-url` apunte a una dirección
local (`localhost`, `127.0.0.1`, `192.168.x.x`). Es una regla anti-SSRF del
WAF, no una validación de Wompi: pasa aunque las llaves estén perfectas.

El código lo detecta y omite el `redirect-url` en ese caso, así que el pago
funciona en local — lo único que se pierde es el retorno automático a la
tienda. Si quieres probar también el retorno, expón el sitio con un túnel
(ngrok) y pon esa URL pública en `APP_URL`.

---

## 7. Cosas que conviene saber

### El correo automático está apagado

No hay credenciales SMTP. Enviar desde el correo institucional de Microsoft
365 exigía apagar *Security Defaults* en todo el tenant de la empresa, que TI
no autorizó — y con razón, porque baja la seguridad de todos los buzones.
Además Microsoft apaga del todo la autenticación básica SMTP a fin de 2026.

**El sitio funciona igual.** Todo el contacto pasa por botones de WhatsApp con
el mensaje ya redactado:

- `/contacto` — consultas, vacantes y proveedores
- Comprobante de pedido — botón con el número de pedido incluido

Si algún día quieres reactivar el correo, llena las variables `SMTP_*` con un
proveedor transaccional (Brevo, Resend, SES) y se reactiva solo, sin tocar
código. Todos los envíos están detrás de la bandera `smtpConfigurado`.

### Datos pendientes de llenar

En `lib/contacto.ts` hay dos campos vacíos a propósito:

- `correo` — mientras esté vacío, solo se muestran los botones de WhatsApp
- `horario` — se muestra "Por definir"

Verifica también que el número de WhatsApp (`573113712834`) sea el correcto.

### Cómo funciona el inventario

El stock **no** se reserva al crear el pedido. Se descuenta cuando Wompi
confirma el pago por webhook. Un pedido creado y nunca pagado no bloquea
inventario.

Al crear el pedido sí se valida que haya stock suficiente; si entre la
creación y el pago se agota, el webhook lo registra en el log como posible
sobreventa y hay que resolverlo a mano.

### Los precios se leen siempre de la base

El carrito vive en el `localStorage` del navegador, así que el precio que
manda el cliente **no es confiable**. `/api/pedidos` ignora los precios
recibidos y los vuelve a leer de la base antes de calcular el total. Esto
también hace que un carrito viejo cobre el precio actual y no el que quedó
congelado en el navegador.

Si tocas ese endpoint, no reintroduzcas el cálculo con los precios del
cliente: la firma de integridad de Wompi se genera sobre ese total, así que un
precio manipulado produciría un pago "válido" por el monto equivocado.
