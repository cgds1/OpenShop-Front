import { Link } from 'react-router-dom'

function Home() {
  return (
    <section className="flex flex-col items-center gap-6 py-20 text-center">
      <span className="text-sm font-medium tracking-[0.3em] text-brand uppercase">
        Bienvenido
      </span>
      <h1 className="max-w-2xl font-display text-5xl font-semibold text-ink">
        Todo lo que buscás, en un solo lugar
      </h1>
      <p className="max-w-md text-muted">
        Explorá el catálogo de OpenShop y encontrá tu próxima compra.
      </p>
      <Link
        to="/catalog"
        className="mt-2 rounded-full bg-brand px-8 py-3 text-sm font-semibold text-white no-underline transition-colors hover:bg-brand-dark"
      >
        Ver catálogo
      </Link>
    </section>
  )
}

export default Home
