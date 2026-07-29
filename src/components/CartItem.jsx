export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const subtotal = Math.round(item.precio_unitario * item.cantidad * 100) / 100

  return (
    <div className="flex items-center justify-between border-b py-4">
      <div>
        <h4 className="font-semibold">{item.nombre}</h4>
        <p className="text-gray-500">${item.precio_unitario} c/u</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.producto_id, item.cantidad - 1)}
          className="cursor-pointer rounded bg-gray-200 px-2.5 py-1 font-bold"
        >
          -
        </button>
        <span className="px-2">{item.cantidad}</span>
        <button
          onClick={() => onUpdateQuantity(item.producto_id, item.cantidad + 1)}
          className="cursor-pointer rounded bg-gray-200 px-2.5 py-1 font-bold"
        >
          +
        </button>
        <span className="ml-4 w-20 text-right font-semibold">${subtotal}</span>
        <button
          onClick={() => onRemove(item.producto_id)}
          className="ml-4 cursor-pointer text-sm font-semibold text-red-500 hover:underline"
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}
