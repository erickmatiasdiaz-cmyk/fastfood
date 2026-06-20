# Punto Mordida

Aplicacion Next.js para pedidos de comida con carrito, checkout por WhatsApp y
retiro en local. Los datos (menu, horarios, promociones, estado del local y
pedidos) se gestionan en **Supabase** y se comparten en tiempo real entre todos
los clientes.

## Requisitos

- Node.js 20.9 o superior
- npm
- Un proyecto de Supabase

## Variables de entorno

Crea `.env.local` con:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxx
NEXT_PUBLIC_WHATSAPP_PHONE=56984795290
```

En producción (Vercel) define estas mismas variables en el panel del proyecto.

## Comandos

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Arquitectura

- `src/app/page.tsx`: tienda. Server Component que carga datos de Supabase con
  el cliente anónimo (RLS solo expone productos visibles y promos activas).
- `src/app/admin`: panel operativo protegido con **Supabase Auth** (login con
  email/contraseña). Solo usuarios en la tabla `admins` pueden gestionar.
- `src/app/admin/pedidos`: listado de pedidos con cambio de estado.
- `src/lib/supabase/`: clientes de Supabase (browser y server).
- `src/lib/data.ts`: carga de datos de la tienda (SSR).
- `src/components`: UI de la tienda, carrito, checkout y panel.

## Base de datos (Supabase)

Tablas en el schema `public`:

- `site_settings`: configuración única (abierto/cerrado, mensaje, tiempo de
  preparación, imagen principal, horarios).
- `products`: catálogo del menú.
- `promos`: promociones de la tienda.
- `orders`: pedidos enviados desde el checkout.
- `admins`: lista de usuarios autorizados para el panel.

Row Level Security:

- Público (anon): lee productos visibles, promos activas y `site_settings`; puede
  crear pedidos (con validación) pero no leerlos.
- Administradores (autenticados en `admins`): gestión completa de menú, promos,
  configuración y pedidos.

## Admin

El panel está disponible en `/admin`. El acceso requiere una cuenta de Supabase
Auth cuyo `user_id` esté en la tabla `admins`. Para crear más administradores,
agrega el usuario en Supabase Auth e inserta su `user_id` en `public.admins`.
