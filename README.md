# OpenShop — Frontend

Frontend de OpenShop: catálogo de productos, detalle, carrito, checkout y panel de
administración, construido con React + Vite y conectado a la API de OpenShop-Back.

## Requisitos

- Node.js 20 LTS
- pnpm (obligatorio; no usar npm ni yarn)
- El backend de OpenShop corriendo en `http://localhost:3000` (ver `OpenShop-Back/README.md`)

## Instalación

```bash
pnpm install
```

## Variables de entorno

Copiar `.env.example` a `.env` y ajustar si hace falta:

```env
VITE_API_URL=http://localhost:3000
```

## Desarrollo

```bash
pnpm dev
```

La app queda disponible en `http://localhost:5173`. El backend debe permitir CORS desde este
origen.

## Build de producción

```bash
pnpm build
pnpm preview
```

## Rutas

| Ruta | Página |
|---|---|
| `/` | Home |
| `/catalog` | Catálogo de productos, con filtro por categoría |
| `/products/:id` | Detalle de producto |
| `/cart` | Carrito de compras |
| `/checkout` | Checkout: crea la orden en el backend |
| `/admin` | Panel de administración: alta/baja de productos y listado de órdenes |

## Estructura

- `src/services/api.js` — cliente HTTP central (usa `VITE_API_URL`).
- `src/hooks/useFetch.js` — hook de carga/error reutilizable para llamadas GET.
- `src/context/CartContext.jsx` — estado global del carrito.
- `src/components/` — componentes reutilizables (`ProductCard`, `CartItem`, `Loader`,
  `ErrorMessage`, `Navbar`).
- `src/pages/` — una página por ruta.

## Lint

```bash
pnpm lint
```
