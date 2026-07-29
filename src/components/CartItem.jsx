export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const itemId = item.id || item._id;

  return (
    <div className="flex items-center justify-between border-b py-4">
      <div>
        <h4 className="font-semibold">{item.name}</h4>
        <p className="text-gray-500">${item.price} c/u</p>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onUpdateQuantity(itemId, item.quantity - 1)}
          className="px-2.5 py-1 bg-gray-200 rounded cursor-pointer font-bold"
        >-</button>
        <span className="px-2">{item.quantity}</span>
        <button 
          onClick={() => onUpdateQuantity(itemId, item.quantity + 1)}
          className="px-2.5 py-1 bg-gray-200 rounded cursor-pointer font-bold"
        >+</button>
        <button 
          onClick={() => onRemove(itemId)}
          className="text-red-500 ml-4 cursor-pointer text-sm font-semibold hover:underline"
        >Eliminar</button>
      </div>
    </div>
  );
}