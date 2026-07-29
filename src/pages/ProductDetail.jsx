import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import { useFetch } from '../hooks/useFetch'
import { useCart } from '../context/CartContext'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'

export default function ProductDetail() {
  const { id } = useParams()
  const { agregar } = useCart()
  const [agregado, setAgregado] = useState(false)

  const {
    data: producto,
    loading,
    error,
    reload,
  } = useFetch(() => api.get(`/products/${id}`), [id])

  function handleAgregar() {
    agregar(producto)
    setAgregado(true)
  }

  if (loading) return <Loader mensaje="Cargando información del producto…" />
  if (error)
    return (
      <ErrorMessage message="No se pudo cargar el producto." onRetry={reload} />
    )
  if (!producto) return <p>Producto no encontrado.</p>

  return (
    <section className="mx-auto max-w-3xl">
      <Link to="/catalog" className="mb-4 inline-block text-blue-600 no-underline">
        ← Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 gap-8 rounded-lg border border-gray-200 bg-white p-6 md:grid-cols-2">
        <div>
          <img
            src={producto.imagen_url || 'https://via.placeholder.com/300'}
            alt={producto.nombre}
            className="max-h-80 w-full rounded-lg object-cover"
          />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <span className="rounded-xl bg-gray-100 px-2.5 py-1 text-xs uppercase">
              {producto.categoria_id?.nombre || 'General'}
            </span>
            <h1 className="mt-3 mb-1 text-3xl font-bold">{producto.nombre}</h1>
            <p className="mb-4 text-gray-500">
              Marca: <strong>{producto.marca || 'N/A'}</strong>
            </p>
            {producto.descripcion && (
              <p className="mb-4 text-gray-700">{producto.descripcion}</p>
            )}
            <p className="my-2 text-3xl font-bold text-green-600">${producto.precio}</p>
            <p className="my-2">
              <strong>Stock disponible:</strong> {producto.stock} unidades
            </p>
          </div>

          <button
            onClick={handleAgregar}
            className="mt-6 cursor-pointer rounded-md bg-green-600 px-5 py-3 font-bold text-white hover:bg-green-700"
          >
            {agregado ? 'Agregado ✓' : 'Agregar al carrito 🛒'}
          </button>
        </div>
      </div>
    </section>
  )
}
