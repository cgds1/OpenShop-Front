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
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Catálogo de Productos</h1>

        <div>
          <label htmlFor="categoria-select" className="mr-2 font-bold">
            Filtrar por categoría:
          </label>
          <select
            id="categoria-select"
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            className="rounded border border-gray-300 p-2"
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
        <p>No se encontraron productos para esta categoría.</p>
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
