import { Link } from 'react-router-dom'

function ProductCard({ producto }) {
  return (
    <div className="flex flex-col rounded-lg border border-gray-200 bg-white p-4">
      <img
        src={producto.imagen_url || 'https://via.placeholder.com/300'}
        alt={producto.nombre}
        className="h-40 w-full rounded object-cover"
      />
      <span className="mt-2 inline-block w-fit rounded-full bg-gray-100 px-2 py-0.5 text-xs">
        {producto.categoria_id?.nombre || 'Sin categoría'}
      </span>
      <h3 className="mt-2 mb-0.5 text-lg font-semibold">{producto.nombre}</h3>
      <p className="m-0 text-sm text-gray-500">Marca: {producto.marca || 'N/A'}</p>
      <p className="my-2 text-xl font-bold text-gray-800">${producto.precio}</p>

      <Link
        to={`/products/${producto._id}`}
        className="mt-auto rounded bg-blue-600 py-2 text-center font-semibold text-white no-underline hover:bg-blue-700"
      >
        Ver detalle
      </Link>
    </div>
  )
}

export default ProductCard
