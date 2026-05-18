# Come Come Demo

Aplicacion Next.js para pedidos de comida con carrito, checkout por WhatsApp y retiro en local.

## Requisitos

- Node.js 20.9 o superior
- npm

## Configuracion

El numero de WhatsApp puede configurarse con:

```bash
NEXT_PUBLIC_WHATSAPP_PHONE=56984795290
```

Si no se define, la app usa el numero demo incluido en `src/lib/whatsapp.ts`.

## Comandos

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Estructura

- `src/app`: layout, pagina principal y estilos globales.
- `src/components`: UI del menu, carrito, modal de checkout y toast.
- `src/data/products.ts`: catalogo demo.
- `src/lib/whatsapp.ts`: generacion del enlace de pedido por WhatsApp.
