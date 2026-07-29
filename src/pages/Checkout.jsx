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

  if (items.length === 0 && !successMessage) {
    return (
      <div className="mx-auto max-w-2xl p-4">
        <h2 className="mb-4 text-2xl font-bold">Finalizar Compra</h2>
        <p className="text-gray-500">
          Tu carrito está vacío.{' '}
          <button
            onClick={() => navigate('/catalog')}
            className="cursor-pointer text-blue-600 underline"
          >
            Ir al catálogo
          </button>
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 p-4 md:grid-cols-2">
      <div>
        <h2 className="mb-4 text-2xl font-bold">Finalizar Compra</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={handleChange}
            className="rounded border p-2"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            className="rounded border p-2"
            required
          />
          <input
            type="text"
            name="ciudad"
            placeholder="Ciudad"
            value={form.ciudad}
            onChange={handleChange}
            className="rounded border p-2"
            required
          />
          <button
            type="submit"
            disabled={loading || items.length === 0}
            className="cursor-pointer rounded bg-green-600 py-2 font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Procesando…' : 'Enviar Orden'}
          </button>
        </form>
        {successMessage && (
          <p className="mt-4 font-bold text-green-600">{successMessage}</p>
        )}
        {errorMessage && <p className="mt-4 font-bold text-red-600">{errorMessage}</p>}
      </div>

      <div className="rounded border bg-gray-50 p-4">
        <h3 className="mb-4 text-xl font-bold">Resumen del Pedido</h3>
        {items.map((item) => (
          <div key={item.producto_id} className="flex justify-between border-b py-2 text-sm">
            <span>
              {item.nombre} (x{item.cantidad})
            </span>
            <span>${item.precio_unitario * item.cantidad}</span>
          </div>
        ))}
        <div className="mt-4 flex justify-between pt-2 text-lg font-bold">
          <span>Total a pagar:</span>
          <span>${total}</span>
        </div>
      </div>
    </div>
  )
}
