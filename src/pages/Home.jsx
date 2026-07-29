import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useFetch } from '../hooks/useFetch'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const navigate = useNavigate()
  const { data: productos } = useFetch(() => api.get('/products'), [])
  const { data: categorias } = useFetch(() => api.get('/categories'), [])

  const featured = productos?.slice(0, 4) ?? []
  const categoryCards =
    categorias?.map((cat) => {
      const count = productos?.filter((p) => p.categoria_id?._id === cat._id).length ?? 0
      return { ...cat, count }
    }) ?? []

  return (
    <div>
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 md:grid-cols-2">
          <div className="flex flex-col gap-5">
            <span className="text-sm font-semibold tracking-[0.22em] text-brand uppercase">
              Bienvenido a OpenShop
            </span>
            <h1 className="font-display text-[clamp(40px,6vw,68px)] leading-[1.02] font-semibold tracking-tight text-ink text-balance">
              Todo lo que buscás, en un solo lugar.
            </h1>
            <p className="max-w-md text-[17px] leading-relaxed text-muted">
              Explorá el catálogo de OpenShop — electrónica y hogar seleccionados, con envío
              gratis en todo el país.
            </p>
            <div className="mt-1 flex flex-wrap gap-3">
              <Link
                to="/catalog"
                className="rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white no-underline transition-colors hover:bg-brand-dark"
              >
                Ver catálogo
              </Link>
              <Link
                to="/cart"
                className="rounded-full border border-line px-7 py-3.5 text-sm font-medium text-ink no-underline transition-colors hover:bg-bg"
              >
                Ver mi carrito
              </Link>
            </div>
          </div>
          <div className="flex aspect-[5/4] items-center justify-center rounded-2xl border border-line bg-brand-light">
            <span className="font-mono text-sm tracking-wide text-brand-dark">
              imagen editorial / hero
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-14">
        <h2 className="mb-6 font-display text-3xl font-semibold text-ink">
          Comprá por categoría
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {categoryCards.map((cat) => (
            <button
              key={cat._id}
              type="button"
              onClick={() => navigate(`/catalog?categoria=${cat._id}`)}
              className="cursor-pointer overflow-hidden rounded-2xl border border-line bg-surface p-0 text-left"
            >
              <div className="flex aspect-[16/7] items-center justify-center bg-brand-light">
                <span className="font-mono text-xs text-brand-dark">
                  categoría {cat.nombre.toLowerCase()}
                </span>
              </div>
              <div className="flex items-center justify-between px-5 py-[18px]">
                <div>
                  <div className="font-display text-xl font-semibold text-ink">
                    {cat.nombre}
                  </div>
                  <div className="mt-0.5 text-sm text-muted">{cat.count} productos</div>
                </div>
                <span className="text-xl text-brand">→</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="font-display text-3xl font-semibold text-ink">Destacados</h2>
          <Link to="/catalog" className="text-sm font-semibold text-brand no-underline">
            Ver todo →
          </Link>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5">
          {featured.map((producto) => (
            <ProductCard key={producto._id} producto={producto} />
          ))}
        </div>
      </section>
    </div>
  )
}
