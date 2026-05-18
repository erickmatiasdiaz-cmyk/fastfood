# Punto Mordida Demo

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

## Admin

El panel operativo esta disponible en:

```text
/admin
```

Permite cambiar estado abierto/cerrado, mensaje visible, tiempo estimado,
horarios, imagen principal, imagenes de productos y promocion destacada. Los
cambios se guardan automaticamente en `localStorage` del navegador.

Tambien permite agregar productos nuevos, editar productos existentes, destacar
productos, quitar/restaurar productos del menu y manejar varias promociones
activas al mismo tiempo.

El acceso local pide un PIN. Configuralo con:

```bash
NEXT_PUBLIC_ADMIN_PIN=1234
```

Si no se define, el PIN demo es `1234`. Este login es local y sirve para demo o
uso en un equipo controlado; no reemplaza autenticacion real en produccion.

## Estructura

- `src/app`: layout, pagina principal y estilos globales.
- `src/components`: UI del menu, carrito, modal de checkout y toast.
- `src/data/products.ts`: catalogo demo.
- `src/lib/whatsapp.ts`: generacion del enlace de pedido por WhatsApp.
