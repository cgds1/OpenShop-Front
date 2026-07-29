import { useState } from 'react'
import api from '../services/api'
import { useFetch } from '../hooks/useFetch'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'

const PRODUCTO_INICIAL = {
  nombre: '',
  precio: '',
  stock: '',
  marca: '',
  imagen_url: '',
  categoria_id: '',
}

const inputClass =
  'rounded-lg border border-line bg-surface p-2 text-sm text-ink placeholder:text-muted focus:border-brand focus:outline-none'

export default function Admin() {
  const [nuevoProducto, setNuevoProducto] = useState(PRODUCTO_INICIAL)

  const {
    data: productos,
    loading: loadingProductos,
    error: errorProductos,
    reload: reloadProductos,
  } = useFetch(() => api.get('/products'), [])

  const { data: categorias } = useFetch(() => api.get('/categories'), [])

  const {
    data: ordenes,
    loading: loadingOrdenes,
    error: errorOrdenes,
    reload: reloadOrdenes,
  } = useFetch(() => api.get('/orders'), [])

  const handleChange = (e) => {
    setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value })
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    try {
      await api.post('/products', {
        ...nuevoProducto,
        precio: parseFloat(nuevoProducto.precio),
        stock: parseInt(nuevoProducto.stock, 10) || 0,
      })
      setNuevoProducto(PRODUCTO_INICIAL)
      reloadProductos()
    } catch (err) {
      alert('Error al crear producto: ' + err.message)
    }
  }

  const handleDeleteProduct = async (id) => {
    try {
      await api.del(`/products/${id}`)
      reloadProductos()
    } catch (err) {
      alert(err.message)
    }
  }

  const estadoClass = {
    pendiente: 'bg-brand-light text-brand-dark',
    completado: 'bg-success-light text-success',
    cancelado: 'bg-danger-light text-danger',
  }

  return (
    <div className="mx-auto max-w-6xl space-y-12">
      <h2 className="font-display text-3xl font-semibold text-ink">
        Panel de Administración
      </h2>

      <section>
        <h3 className="mb-4 font-display text-xl font-semibold text-ink">
          Gestión de Productos
        </h3>
        <form
          onSubmit={handleAddProduct}
          className="mb-6 flex flex-wrap gap-2 rounded-xl border border-line bg-surface p-4"
        >
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del producto"
            value={nuevoProducto.nombre}
            onChange={handleChange}
            className={`flex-1 ${inputClass}`}
            required
          />
          <input
            type="number"
            step="0.01"
            name="precio"
            placeholder="Precio"
            value={nuevoProducto.precio}
            onChange={handleChange}
            className={`w-28 ${inputClass}`}
            required
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={nuevoProducto.stock}
            onChange={handleChange}
            className={`w-24 ${inputClass}`}
            required
          />
          <input
            type="text"
            name="marca"
            placeholder="Marca"
            value={nuevoProducto.marca}
            onChange={handleChange}
            className={`w-32 ${inputClass}`}
          />
          <input
            type="text"
            name="imagen_url"
            placeholder="URL de imagen"
            value={nuevoProducto.imagen_url}
            onChange={handleChange}
            className={`w-40 ${inputClass}`}
          />
          <select
            name="categoria_id"
            value={nuevoProducto.categoria_id}
            onChange={handleChange}
            className={inputClass}
            required
          >
            <option value="">Categoría…</option>
            {categorias?.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.nombre}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="cursor-pointer rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Agregar
          </button>
        </form>

        {loadingProductos && <Loader mensaje="Cargando productos…" />}
        {errorProductos && (
          <ErrorMessage
            message="No se pudieron cargar los productos."
            onRetry={reloadProductos}
          />
        )}
        {!loadingProductos && !errorProductos && (
          <div className="overflow-hidden rounded-xl border border-line">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-brand-light text-left text-brand-dark">
                  <th className="p-3 font-semibold">Nombre</th>
                  <th className="p-3 font-semibold">Precio</th>
                  <th className="p-3 font-semibold">Stock</th>
                  <th className="p-3 font-semibold">Categoría</th>
                  <th className="p-3 text-center font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p._id} className="border-t border-line text-ink">
                    <td className="p-3">{p.nombre}</td>
                    <td className="p-3">${p.precio}</td>
                    <td className="p-3">{p.stock}</td>
                    <td className="p-3">{p.categoria_id?.nombre || '—'}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDeleteProduct(p._id)}
                        className="cursor-pointer rounded-full bg-danger px-3 py-1 text-xs font-semibold text-white transition-colors hover:opacity-90"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-4 font-display text-xl font-semibold text-ink">
          Órdenes de Compra Recibidas
        </h3>
        {loadingOrdenes && <Loader mensaje="Cargando órdenes…" />}
        {errorOrdenes && (
          <ErrorMessage
            message="No se pudieron cargar las órdenes."
            onRetry={reloadOrdenes}
          />
        )}
        {!loadingOrdenes && !errorOrdenes && ordenes.length === 0 && (
          <p className="text-muted">No hay órdenes registradas aún.</p>
        )}
        {!loadingOrdenes && !errorOrdenes && ordenes.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-line">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-brand-light text-left text-brand-dark">
                  <th className="p-3 font-semibold">ID Orden</th>
                  <th className="p-3 font-semibold">Cliente</th>
                  <th className="p-3 font-semibold">Total</th>
                  <th className="p-3 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {ordenes.map((o) => (
                  <tr key={o._id} className="border-t border-line text-ink">
                    <td className="p-3 font-mono text-xs text-muted">{o._id}</td>
                    <td className="p-3">{o.usuario_id?.nombre || '—'}</td>
                    <td className="p-3">${o.total}</td>
                    <td className="p-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${estadoClass[o.estado] ?? 'bg-line text-muted'}`}
                      >
                        {o.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
