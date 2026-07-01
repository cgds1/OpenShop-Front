import { createContext, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

// Estructura de cada ítem alineada con orders.items[] del contrato de datos
// (OPENSHOP_CONTEXT.md §2), para que el checkout arme el POST /orders sin remapear.
function toItem(producto, cantidad) {
  return {
    producto_id: producto._id,
    nombre: producto.nombre,
    precio_unitario: producto.precio,
    imagen_url: producto.imagen_url,
    cantidad,
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  function agregar(producto, cantidad = 1) {
    setItems((prev) => {
      const existente = prev.find((it) => it.producto_id === producto._id)
      if (existente) {
        return prev.map((it) =>
          it.producto_id === producto._id
            ? { ...it, cantidad: it.cantidad + cantidad }
            : it,
        )
      }
      return [...prev, toItem(producto, cantidad)]
    })
  }

  function quitar(producto_id) {
    setItems((prev) => prev.filter((it) => it.producto_id !== producto_id))
  }

  function cambiarCantidad(producto_id, cantidad) {
    setItems((prev) =>
      cantidad <= 0
        ? prev.filter((it) => it.producto_id !== producto_id)
        : prev.map((it) =>
            it.producto_id === producto_id ? { ...it, cantidad } : it,
          ),
    )
  }

  function vaciar() {
    setItems([])
  }

  const total = useMemo(
    () => items.reduce((acc, it) => acc + it.precio_unitario * it.cantidad, 0),
    [items],
  )

  const cantidadItems = useMemo(
    () => items.reduce((acc, it) => acc + it.cantidad, 0),
    [items],
  )

  const value = {
    items,
    total,
    cantidadItems,
    agregar,
    quitar,
    cambiarCantidad,
    vaciar,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (ctx === null) {
    throw new Error('useCart debe usarse dentro de <CartProvider>')
  }
  return ctx
}
