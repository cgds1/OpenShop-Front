import { useState } from 'react'
import api from '../services/api'
import { useFetch } from '../hooks/useFetch'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import ProductCard from '../components/ProductCard'

export default function Catalog() {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('')

  const { data: categorias } = useFetch(() => api.get('/categories'), [])

  const {
    data: productos,
    loading,
    error,
    reload,
  } = useFetch(
    () =>
      api.get(
        categoriaSeleccionada
          ? `/products?categoria=${categoriaSeleccionada}`
          : '/products',
      ),
    [categoriaSeleccionada],
  )

  return (
    <section>
      <header className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <span className="text-sm font-medium tracking-[0.3em] text-brand uppercase">
            Catálogo
          </span>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Todos los productos
          </h1>
        </div>

        <div>
          <label
            htmlFor="categoria-select"
            className="mr-2 text-sm font-medium text-muted"
          >
            Filtrar por categoría
          </label>
          <select
            id="categoria-select"
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            className="rounded-full border border-line bg-surface px-4 py-2 text-sm text-ink"
          >
            <option value="">Todas las categorías</option>
            {categorias?.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>
      </header>

      {loading && <Loader mensaje="Cargando productos…" />}
      {error && (
        <ErrorMessage message="No se pudieron cargar los productos." onRetry={reload} />
      )}
      {!loading && !error && productos?.length === 0 && (
        <p className="text-muted">No se encontraron productos para esta categoría.</p>
      )}
      {!loading && !error && productos?.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
          {productos.map((producto) => (
            <ProductCard key={producto._id} producto={producto} />
          ))}
        </div>
      )}
    </section>
  )
}
