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
  if (!producto) return <p className="text-muted">Producto no encontrado.</p>

  return (
    <section className="mx-auto max-w-3xl">
      <Link
        to="/catalog"
        className="mb-4 inline-block text-sm font-medium text-brand no-underline"
      >
        ← Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 gap-8 rounded-xl border border-line bg-surface p-6 md:grid-cols-2">
        <div>
          <img
            src={producto.imagen_url || 'https://via.placeholder.com/300'}
            alt={producto.nombre}
            className="max-h-80 w-full rounded-lg object-cover"
          />
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <span className="rounded-full bg-brand-light px-2.5 py-1 text-xs font-medium tracking-wide text-brand-dark uppercase">
              {producto.categoria_id?.nombre || 'General'}
            </span>
            <h1 className="mt-3 mb-1 font-display text-3xl font-semibold text-ink">
              {producto.nombre}
            </h1>
            <p className="mb-4 text-muted">
              Marca: <strong className="text-ink">{producto.marca || 'N/A'}</strong>
            </p>
            {producto.descripcion && (
              <p className="mb-4 text-ink/80">{producto.descripcion}</p>
            )}
            <p className="my-2 text-3xl font-semibold text-brand">${producto.precio}</p>
            <p className="my-2 text-muted">
              <strong className="text-ink">Stock disponible:</strong> {producto.stock}{' '}
              unidades
            </p>
          </div>

          <button
            onClick={handleAgregar}
            className="mt-6 cursor-pointer rounded-full bg-brand px-5 py-3 font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            {agregado ? 'Agregado ✓' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </section>
  )
}
