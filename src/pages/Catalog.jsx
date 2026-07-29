import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../services/api'
import { useFetch } from '../hooks/useFetch'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'
import ProductCard from '../components/ProductCard'

const SORT_OPTIONS = [
  { value: 'destacados', label: 'Destacados' },
  { value: 'precio-asc', label: 'Precio: menor a mayor' },
  { value: 'precio-desc', label: 'Precio: mayor a menor' },
  { value: 'nombre', label: 'Nombre A–Z' },
]

export default function Catalog() {
  const [searchParams] = useSearchParams()
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(
    searchParams.get('categoria') ?? '',
  )
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('destacados')

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

  const listaVisible = useMemo(() => {
    if (!productos) return []
    let lista = productos

    const term = search.trim().toLowerCase()
    if (term) lista = lista.filter((p) => p.nombre.toLowerCase().includes(term))

    lista = [...lista]
    if (sort === 'precio-asc') lista.sort((a, b) => a.precio - b.precio)
    else if (sort === 'precio-desc') lista.sort((a, b) => b.precio - a.precio)
    else if (sort === 'nombre') lista.sort((a, b) => a.nombre.localeCompare(b.nombre))

    return lista
  }, [productos, search, sort])

  const inputClass =
    'rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none'

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-7 flex flex-wrap items-end justify-between gap-6 border-b border-line pb-7">
        <div>
          <span className="text-sm font-medium tracking-[0.22em] text-brand uppercase">
            Catálogo
          </span>
          <h1 className="mt-2 font-display text-4xl font-semibold text-ink">
            Todos los productos
          </h1>
          {!loading && !error && (
            <p className="mt-2 text-sm text-muted">
              {listaVisible.length} {listaVisible.length === 1 ? 'producto' : 'productos'}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar producto…"
            className={`w-48 ${inputClass}`}
          />
          <select
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            className={inputClass}
          >
            <option value="">Todas las categorías</option>
            {categorias?.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.nombre}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className={inputClass}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      {loading && <Loader mensaje="Cargando productos…" />}
      {error && (
        <ErrorMessage message="No se pudieron cargar los productos." onRetry={reload} />
      )}
      {!loading && !error && listaVisible.length === 0 && (
        <p className="text-muted">No se encontraron productos para esta búsqueda.</p>
      )}
      {!loading && !error && listaVisible.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5">
          {listaVisible.map((producto) => (
            <ProductCard key={producto._id} producto={producto} />
          ))}
        </div>
      )}
    </section>
  )
}
