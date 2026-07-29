import { NavLink } from 'react-router-dom'
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
    <nav className="flex items-center gap-8 border-b border-gray-200 px-6 py-4">
      <span className="text-xl font-bold">OpenShop</span>
      <ul className="flex list-none gap-5">
        {links.map(({ to, label, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `no-underline text-inherit ${isActive ? 'font-bold underline' : ''}`
              }
            >
              {label}
              {to === '/cart' && cantidadItems > 0 && (
                <span className="ml-1.5 inline-block min-w-5 rounded-full bg-rose-600 px-1.5 text-center text-xs leading-5 text-white">
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
