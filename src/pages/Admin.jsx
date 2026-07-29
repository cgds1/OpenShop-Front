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

export default function Admin() {
  const [nuevoProducto, setNuevoProducto] = useState(PRODUCTO_INICIAL)

  const {
    data: productos,
    loading: loadingProductos,
    error: errorProductos,
    reload: reloadProductos,
  } = useFetch(() => api.get('/products'), [])

  const {
    data: categorias,
  } = useFetch(() => api.get('/categories'), [])

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

  return (
    <div className="mx-auto max-w-6xl space-y-10 p-4">
      <h2 className="text-3xl font-bold">Panel de Administración</h2>

      <section>
        <h3 className="mb-4 text-xl font-semibold">Gestión de Productos</h3>
        <form onSubmit={handleAddProduct} className="mb-6 flex flex-wrap gap-2">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del producto"
            value={nuevoProducto.nombre}
            onChange={handleChange}
            className="flex-1 rounded border p-2"
            required
          />
          <input
            type="number"
            step="0.01"
            name="precio"
            placeholder="Precio"
            value={nuevoProducto.precio}
            onChange={handleChange}
            className="w-28 rounded border p-2"
            required
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={nuevoProducto.stock}
            onChange={handleChange}
            className="w-24 rounded border p-2"
            required
          />
          <input
            type="text"
            name="marca"
            placeholder="Marca"
            value={nuevoProducto.marca}
            onChange={handleChange}
            className="w-32 rounded border p-2"
          />
          <input
            type="text"
            name="imagen_url"
            placeholder="URL de imagen"
            value={nuevoProducto.imagen_url}
            onChange={handleChange}
            className="w-40 rounded border p-2"
          />
          <select
            name="categoria_id"
            value={nuevoProducto.categoria_id}
            onChange={handleChange}
            className="rounded border p-2"
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
            className="cursor-pointer rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
          >
            Agregar
          </button>
        </form>

        {loadingProductos && <Loader mensaje="Cargando productos…" />}
        {errorProductos && (
          <ErrorMessage message="No se pudieron cargar los productos." onRetry={reloadProductos} />
        )}
        {!loadingProductos && !errorProductos && (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Nombre</th>
                <th className="border p-2 text-left">Precio</th>
                <th className="border p-2 text-left">Stock</th>
                <th className="border p-2 text-left">Categoría</th>
                <th className="border p-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p._id}>
                  <td className="border p-2">{p.nombre}</td>
                  <td className="border p-2">${p.precio}</td>
                  <td className="border p-2">{p.stock}</td>
                  <td className="border p-2">{p.categoria_id?.nombre || '—'}</td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handleDeleteProduct(p._id)}
                      className="cursor-pointer rounded bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h3 className="mb-4 text-xl font-semibold">Órdenes de Compra Recibidas</h3>
        {loadingOrdenes && <Loader mensaje="Cargando órdenes…" />}
        {errorOrdenes && (
          <ErrorMessage message="No se pudieron cargar las órdenes." onRetry={reloadOrdenes} />
        )}
        {!loadingOrdenes && !errorOrdenes && ordenes.length === 0 && (
          <p className="text-gray-500">No hay órdenes registradas aún.</p>
        )}
        {!loadingOrdenes && !errorOrdenes && ordenes.length > 0 && (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">ID Orden</th>
                <th className="border p-2 text-left">Cliente</th>
                <th className="border p-2 text-left">Total</th>
                <th className="border p-2 text-left">Estado</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((o) => (
                <tr key={o._id}>
                  <td className="border p-2 font-mono text-xs">{o._id}</td>
                  <td className="border p-2">{o.usuario_id?.nombre || '—'}</td>
                  <td className="border p-2">${o.total}</td>
                  <td className="border p-2 capitalize">{o.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
