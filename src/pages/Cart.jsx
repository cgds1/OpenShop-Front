import { useNavigate } from 'react-router-dom'
import CartItem from '../components/CartItem'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, total, cambiarCantidad, quitar } = useCart()
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h2 className="mb-4 text-2xl font-bold">Carrito de Compras</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">Tu carrito está vacío</p>
      ) : (
        <>
          {items.map((item) => (
            <CartItem
              key={item.producto_id}
              item={item}
              onUpdateQuantity={cambiarCantidad}
              onRemove={quitar}
            />
          ))}
          <div className="mt-6 flex items-center justify-between border-t pt-4">
            <span className="text-xl font-bold">Total: ${total}</span>
            <button
              onClick={() => navigate('/checkout')}
              className="cursor-pointer rounded bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Proceder al Pago
            </button>
          </div>
        </>
      )}
    </div>
  )
}
