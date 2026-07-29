import { Link } from 'react-router-dom'

function ProductCard({ producto }) {
  return (
    <Link
      to={`/products/${producto._id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-line bg-surface no-underline transition-shadow hover:shadow-md"
    >
      <div className="overflow-hidden">
        <img
          src={producto.imagen_url || 'https://via.placeholder.com/300'}
          alt={producto.nombre}
          className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="w-fit rounded-full bg-brand-light px-2 py-0.5 text-xs font-medium text-brand-dark">
          {producto.categoria_id?.nombre || 'Sin categoría'}
        </span>
        <h3 className="mt-2 mb-0.5 font-display text-lg font-semibold text-ink">
          {producto.nombre}
        </h3>
        <p className="m-0 text-sm text-muted">Marca: {producto.marca || 'N/A'}</p>
        <p className="mt-3 text-xl font-semibold text-ink">${producto.precio}</p>
        <span className="mt-auto pt-3 text-sm font-semibold text-brand">
          Ver detalle →
        </span>
      </div>
    </Link>
  )
}

export default ProductCard
