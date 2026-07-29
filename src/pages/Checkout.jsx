import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useCart } from '../context/CartContext'

function generarPassword() {
  return Math.random().toString(36).slice(2)
}

export default function Checkout() {
  const { items, total, vaciar } = useCart()
  const navigate = useNavigate()

  const [form, setForm] = useState({ nombre: '', email: '', ciudad: '' })
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
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
    setSuccessMessage('')
    setErrorMessage('')

    try {
      const usuario_id = await resolverUsuario()
      const orden = await api.post('/orders', {
        usuario_id,
        items: items.map(({ producto_id, cantidad }) => ({ producto_id, cantidad })),
      })

      setSuccessMessage(`¡Orden creada con éxito! N.º de orden: ${orden._id}`)
      setForm({ nombre: '', email: '', ciudad: '' })
      vaciar()
    } catch (err) {
      setErrorMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'rounded-lg border border-line bg-surface p-3 text-ink placeholder:text-muted focus:border-brand focus:outline-none'

  if (items.length === 0 && !successMessage) {
    return (
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-4 font-display text-3xl font-semibold text-ink">
          Finalizar Compra
        </h2>
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
    <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
      <div>
        <h2 className="mb-6 font-display text-3xl font-semibold text-ink">
          Finalizar Compra
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={handleChange}
            className={inputClass}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            className={inputClass}
            required
          />
          <input
            type="text"
            name="ciudad"
            placeholder="Ciudad"
            value={form.ciudad}
            onChange={handleChange}
            className={inputClass}
            required
          />
          <button
            type="submit"
            disabled={loading || items.length === 0}
            className="cursor-pointer rounded-full bg-brand py-3 font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Procesando…' : 'Enviar Orden'}
          </button>
        </form>
        {successMessage && (
          <p className="mt-4 rounded-lg bg-success-light p-3 font-semibold text-success">
            {successMessage}
          </p>
        )}
        {errorMessage && (
          <p className="mt-4 rounded-lg bg-danger-light p-3 font-semibold text-danger">
            {errorMessage}
          </p>
        )}
      </div>

      <div className="h-fit rounded-xl border border-line bg-surface p-6">
        <h3 className="mb-4 font-display text-xl font-semibold text-ink">
          Resumen del Pedido
        </h3>
        {items.map((item) => (
          <div
            key={item.producto_id}
            className="flex justify-between border-b border-line py-2 text-sm text-ink"
          >
            <span>
              {item.nombre} (x{item.cantidad})
            </span>
            <span>${Math.round(item.precio_unitario * item.cantidad * 100) / 100}</span>
          </div>
        ))}
        <div className="mt-4 flex justify-between pt-2 text-lg font-semibold text-ink">
          <span>Total a pagar:</span>
          <span>${total}</span>
        </div>
      </div>
    </div>
  )
}
