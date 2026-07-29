import { useNavigate } from 'react-router-dom'
import CartItem from '../components/CartItem'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, total, cambiarCantidad, quitar } = useCart()
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-6 font-display text-3xl font-semibold text-ink">
        Carrito de Compras
      </h2>
      {items.length === 0 ? (
        <p className="text-muted">Tu carrito está vacío</p>
      ) : (
        <div className="rounded-xl border border-line bg-surface p-6">
          {items.map((item) => (
            <CartItem
              key={item.producto_id}
              item={item}
              onUpdateQuantity={cambiarCantidad}
              onRemove={quitar}
            />
          ))}
          <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
            <span className="text-xl font-semibold text-ink">Total: ${total}</span>
            <button
              onClick={() => navigate('/checkout')}
              className="cursor-pointer rounded-full bg-brand px-6 py-2.5 font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Proceder al Pago
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
