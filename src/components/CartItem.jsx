import { formatPrice } from '../utils/format'

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const subtotal = Math.round(item.precio_unitario * item.cantidad * 100) / 100

  return (
    <div className="flex flex-wrap items-center gap-4 border-b border-line py-5 last:border-b-0">
      <img
        src={item.imagen_url || 'https://via.placeholder.com/64'}
        alt={item.nombre}
        className="h-16 w-16 flex-shrink-0 rounded-[10px] bg-brand-light object-cover"
      />

      <div className="min-w-[140px] flex-1">
        <h4 className="font-display text-[17px] font-semibold text-ink">{item.nombre}</h4>
        <p className="text-sm text-muted">{formatPrice(item.precio_unitario)} c/u</p>
      </div>

      <div className="flex items-center gap-1.5 rounded-full border border-line p-1">
        <button
          onClick={() => onUpdateQuantity(item.producto_id, item.cantidad - 1)}
          className="h-[30px] w-[30px] cursor-pointer rounded-full border-none bg-bg text-base text-ink"
        >
          −
        </button>
        <span className="min-w-6 text-center text-sm font-semibold text-ink">
          {item.cantidad}
        </span>
        <button
          onClick={() => onUpdateQuantity(item.producto_id, item.cantidad + 1)}
          className="h-[30px] w-[30px] cursor-pointer rounded-full border-none bg-bg text-base text-ink"
        >
          +
        </button>
      </div>

      <div className="min-w-[70px] text-right font-display text-lg font-semibold text-ink">
        {formatPrice(subtotal)}
      </div>

      <button
        onClick={() => onRemove(item.producto_id)}
        className="cursor-pointer text-sm font-semibold text-danger hover:underline"
      >
        Eliminar
      </button>
    </div>
  )
}
