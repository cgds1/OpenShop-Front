import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice, getStockBadge } from '../utils/format'

function ProductCard({ producto }) {
  const { agregar } = useCart()
  const badge = getStockBadge(producto.stock)

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(28,23,18,.10)]">
      <div className="relative p-3.5 pb-0">
        <div className="aspect-[4/3] overflow-hidden rounded-[10px] bg-brand-light">
          <img
            src={producto.imagen_url || 'https://via.placeholder.com/300'}
            alt={producto.nombre}
            className="h-full w-full object-cover"
          />
        </div>
        {badge && (
          <span className="absolute top-[22px] right-[22px] rounded-full bg-danger-light px-2.5 py-1 text-xs font-semibold text-danger">
            {badge.text}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <span className="w-fit rounded-full bg-brand-light px-2.5 py-0.5 text-xs font-semibold text-brand-dark">
          {producto.categoria_id?.nombre || 'Sin categoría'}
        </span>
        <h3 className="font-display text-lg leading-tight font-semibold text-ink">
          {producto.nombre}
        </h3>
        <span className="text-xs text-muted">Marca: {producto.marca || 'N/A'}</span>
        <div className="mt-auto pt-2">
          <span className="font-display text-xl font-semibold text-brand">
            {formatPrice(producto.precio)}
          </span>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/products/${producto._id}`}
            className="flex-1 rounded-full border border-line px-3 py-2 text-center text-sm font-medium text-ink no-underline transition-colors hover:bg-bg"
          >
            Ver detalle
          </Link>
          <button
            type="button"
            onClick={() => agregar(producto)}
            className="flex-1 cursor-pointer rounded-full bg-brand px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
