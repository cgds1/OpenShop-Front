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
    <nav className="navbar">
      <span className="navbar__brand">OpenShop</span>
      <ul className="navbar__links">
        {links.map(({ to, label, end }) => (
          <li key={to}>
            <NavLink to={to} end={end}>
              {label}
              {to === '/cart' && cantidadItems > 0 && (
                <span className="navbar__badge">{cantidadItems}</span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navbar
