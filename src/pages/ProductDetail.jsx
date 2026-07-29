import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import { useFetch } from '../hooks/useFetch'
import { useCart } from '../context/CartContext'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import ProductCard from '../components/ProductCard'
import { formatPrice, getStockBadge } from '../utils/format'

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

  const { data: todos } = useFetch(() => api.get('/products'), [])

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

  const badge = getStockBadge(producto.stock)

  const mismaCategoria =
    todos?.filter(
      (p) => p._id !== producto._id && p.categoria_id?._id === producto.categoria_id?._id,
    ) ?? []
  const otros = todos?.filter((p) => p._id !== producto._id) ?? []
  const relacionados = [...mismaCategoria, ...otros.filter((p) => !mismaCategoria.includes(p))]
    .filter((p, i, arr) => arr.findIndex((x) => x._id === p._id) === i)
    .slice(0, 3)

  return (
    <section className="mx-auto max-w-[1100px] px-6 py-10">
      <Link
        to="/catalog"
        className="mb-6 inline-block text-sm font-semibold text-brand no-underline"
      >
        ← Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-line bg-surface md:grid-cols-2">
        <div className="aspect-square overflow-hidden bg-brand-light">
          <img
            src={producto.imagen_url || 'https://via.placeholder.com/500'}
            alt={producto.nombre}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-3.5 p-10">
          <div className="flex items-center gap-2">
            <span className="w-fit rounded-full bg-brand-light px-3 py-1 text-xs font-semibold tracking-wide text-brand-dark uppercase">
              {producto.categoria_id?.nombre || 'General'}
            </span>
            {badge && (
              <span className="rounded-full bg-danger-light px-3 py-1 text-xs font-semibold text-danger">
                {badge.text}
              </span>
            )}
          </div>
          <h1 className="mt-1 font-display text-[34px] leading-tight font-semibold tracking-tight text-ink">
            {producto.nombre}
          </h1>
          <p className="text-sm text-muted">
            Marca: <strong className="text-ink">{producto.marca || 'N/A'}</strong>
          </p>
          {producto.descripcion && (
            <p className="text-[15px] leading-relaxed text-muted">{producto.descripcion}</p>
          )}
          <p className="mt-2 font-display text-4xl font-semibold text-brand">
            {formatPrice(producto.precio)}
          </p>
          <p className="text-sm text-muted">
            Stock disponible: <strong className="text-ink">{producto.stock} unidades</strong>
          </p>

          <button
            onClick={handleAgregar}
            className="mt-3.5 cursor-pointer rounded-full bg-brand py-4 font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            {agregado ? 'Agregado ✓' : 'Agregar al carrito'}
          </button>
        </div>
      </div>

      {relacionados.length > 0 && (
        <>
          <h2 className="mt-12 mb-5 font-display text-2xl font-semibold text-ink">
            También te puede interesar
          </h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5">
            {relacionados.map((p) => (
              <ProductCard key={p._id} producto={p} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
