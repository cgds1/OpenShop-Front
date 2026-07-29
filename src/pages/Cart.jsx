import { useNavigate } from 'react-router-dom'
import CartItem from '../components/CartItem'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/format'

export default function Cart() {
  const { items, total, cambiarCantidad, quitar } = useCart()
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-[900px] px-6 py-12">
      <h1 className="mb-7 font-display text-4xl font-semibold text-ink">
        Carrito de compras
      </h1>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface px-6 py-16 text-center">
          <div className="mx-auto mb-[18px] flex h-16 w-16 items-center justify-center rounded-full bg-brand-light text-2xl">
            🛍️
          </div>
          <p className="mb-5 text-[17px] text-muted">Tu carrito está vacío.</p>
          <button
            onClick={() => navigate('/catalog')}
            className="cursor-pointer rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Explorar catálogo
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-line bg-surface px-6">
          {items.map((item) => (
            <CartItem
              key={item.producto_id}
              item={item}
              onUpdateQuantity={cambiarCantidad}
              onRemove={quitar}
            />
          ))}
          <div className="flex flex-wrap items-center justify-between gap-4 py-5">
            <div>
              <div className="text-sm text-muted">
                Envío: <span className="font-semibold text-success">Gratis</span>
              </div>
              <div className="mt-0.5 font-display text-[26px] font-semibold text-ink">
                Total: {formatPrice(total)}
              </div>
            </div>
            <button
              onClick={() => navigate('/checkout')}
              className="cursor-pointer rounded-full bg-brand px-8 py-3.5 font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Proceder al pago
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
