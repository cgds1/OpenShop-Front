import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const links = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/catalog', label: 'Catálogo' },
  { to: '/cart', label: 'Carrito' },
  { to: '/checkout', label: 'Checkout' },
  { to: '/admin', label: 'Admin' },
]

function Navbar() {
  const { cantidadItems } = useCart()

  return (
    <nav className="sticky top-0 z-30 flex items-center gap-10 border-b border-line bg-surface px-8 py-5">
      <Link
        to="/"
        className="font-display text-2xl font-semibold tracking-tight text-ink no-underline"
      >
        OpenShop
      </Link>
      <ul className="flex list-none gap-7">
        {links.map(({ to, label, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `border-b-2 pb-1 text-sm font-medium uppercase tracking-wide no-underline transition-colors ${
                  isActive
                    ? 'border-brand text-brand'
                    : 'border-transparent text-muted hover:text-ink'
                }`
              }
            >
              {label}
              {to === '/cart' && cantidadItems > 0 && (
                <span className="ml-1.5 inline-block min-w-5 rounded-full bg-brand px-1.5 text-center text-xs leading-5 text-white">
                  {cantidadItems}
                </span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navbar
