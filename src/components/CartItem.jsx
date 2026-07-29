export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const subtotal = Math.round(item.precio_unitario * item.cantidad * 100) / 100

  return (
    <div className="flex items-center justify-between border-b border-line py-4 last:border-b-0">
      <div>
        <h4 className="font-semibold text-ink">{item.nombre}</h4>
        <p className="text-sm text-muted">${item.precio_unitario} c/u</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.producto_id, item.cantidad - 1)}
          className="cursor-pointer rounded-full border border-line px-2.5 py-1 font-bold text-ink hover:bg-brand-light"
        >
          -
        </button>
        <span className="px-2 text-ink">{item.cantidad}</span>
        <button
          onClick={() => onUpdateQuantity(item.producto_id, item.cantidad + 1)}
          className="cursor-pointer rounded-full border border-line px-2.5 py-1 font-bold text-ink hover:bg-brand-light"
        >
          +
        </button>
        <span className="ml-4 w-20 text-right font-semibold text-ink">${subtotal}</span>
        <button
          onClick={() => onRemove(item.producto_id)}
          className="ml-4 cursor-pointer text-sm font-semibold text-danger hover:underline"
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}
