import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/format'

function generarPassword() {
  return Math.random().toString(36).slice(2)
}

const METODOS_PAGO = [
  { value: 'tarjeta', label: 'Tarjeta de crédito / débito' },
  { value: 'transferencia', label: 'Transferencia bancaria' },
]

export default function Checkout() {
  const { items, total, vaciar } = useCart()
  const navigate = useNavigate()

  const [form, setForm] = useState({ nombre: '', email: '', ciudad: '' })
  const [metodoPago, setMetodoPago] = useState('tarjeta')
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function resolverUsuario() {
    const usuarios = await api.get('/users')
    const existente = usuarios.find(
      (u) => u.email.toLowerCase() === form.email.toLowerCase(),
    )
    if (existente) return existente._id

    const nuevo = await api.post('/users', {
      nombre: form.nombre,
      email: form.email,
      ciudad: form.ciudad,
      password: generarPassword(),
    })
    return nuevo._id
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (items.length === 0) return

    setLoading(true)
    setErrorMessage('')

    try {
      const usuario_id = await resolverUsuario()
      const orden = await api.post('/orders', {
        usuario_id,
        items: items.map(({ producto_id, cantidad }) => ({ producto_id, cantidad })),
      })

      setOrderId(orden._id)
      vaciar()
    } catch (err) {
      setErrorMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'rounded-lg border border-line bg-surface p-3 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none'

  if (orderId) {
    return (
      <div className="mx-auto max-w-[520px] px-6 py-16 text-center">
        <div className="mx-auto mb-[18px] flex h-16 w-16 items-center justify-center rounded-full bg-success-light text-[30px] text-success">
          ✓
        </div>
        <h1 className="mb-2.5 font-display text-3xl font-semibold text-ink">
          ¡Gracias por tu compra!
        </h1>
        <p className="mb-6 text-[15px] text-muted">
          Tu orden fue registrada correctamente. N.º de orden:{' '}
          <span className="font-mono text-xs">{orderId}</span>
        </p>
        <button
          onClick={() => navigate('/catalog')}
          className="cursor-pointer rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Seguir comprando
        </button>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="mb-4 font-display text-3xl font-semibold text-ink">
          Finalizar compra
        </h1>
        <p className="text-muted">
          Tu carrito está vacío.{' '}
          <button
            onClick={() => navigate('/catalog')}
            className="cursor-pointer font-semibold text-brand underline"
          >
            Ir al catálogo
          </button>
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[1050px] px-6 py-12">
      <h1 className="mb-7 font-display text-4xl font-semibold text-ink">Finalizar compra</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 items-start gap-7 md:grid-cols-2"
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6">
            <h2 className="font-display text-lg font-semibold text-ink">
              Datos de contacto
            </h2>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted">Nombre completo</label>
              <input
                type="text"
                name="nombre"
                placeholder="Ej. Carlos Díaz"
                value={form.nombre}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted">Correo electrónico</label>
              <input
                type="email"
                name="email"
                placeholder="tucorreo@ejemplo.com"
                value={form.email}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-6">
            <h2 className="font-display text-lg font-semibold text-ink">Envío</h2>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted">Ciudad</label>
              <input
                type="text"
                name="ciudad"
                placeholder="Ciudad"
                value={form.ciudad}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-6">
            <h2 className="font-display text-lg font-semibold text-ink">Método de pago</h2>
            {METODOS_PAGO.map((metodo) => (
              <label
                key={metodo.value}
                className={`flex cursor-pointer items-center gap-2.5 rounded-lg border p-3.5 text-sm ${
                  metodoPago === metodo.value
                    ? 'border-brand bg-bg text-ink'
                    : 'border-line text-muted'
                }`}
              >
                <input
                  type="radio"
                  name="pago"
                  checked={metodoPago === metodo.value}
                  onChange={() => setMetodoPago(metodo.value)}
                  className="accent-brand"
                />
                {metodo.label}
              </label>
            ))}
          </div>

          {errorMessage && (
            <p className="rounded-lg bg-danger-light p-3 text-sm font-semibold text-danger">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="sticky top-24 rounded-2xl border border-line bg-surface p-6">
          <h2 className="mb-[18px] font-display text-xl font-semibold text-ink">
            Resumen del pedido
          </h2>
          {items.map((item) => (
            <div
              key={item.producto_id}
              className="flex justify-between gap-3 border-b border-line py-2.5 text-sm text-ink"
            >
              <span>
                {item.nombre} <span className="text-muted">×{item.cantidad}</span>
              </span>
              <span className="font-semibold whitespace-nowrap">
                {formatPrice(Math.round(item.precio_unitario * item.cantidad * 100) / 100)}
              </span>
            </div>
          ))}
          <div className="flex justify-between py-3.5 text-sm text-muted">
            <span>Subtotal</span>
            <span>{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between border-b border-line pb-3.5 text-sm text-muted">
            <span>Envío</span>
            <span className="font-semibold text-success">Gratis</span>
          </div>
          <div className="flex items-baseline justify-between py-4">
            <span className="font-display text-lg font-semibold text-ink">Total a pagar</span>
            <span className="font-display text-2xl font-semibold text-brand">
              {formatPrice(total)}
            </span>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-full bg-brand py-4 font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Procesando…' : 'Enviar orden'}
          </button>
        </div>
      </form>
    </div>
  )
}
