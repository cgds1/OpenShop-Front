import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem';

export default function Cart() {
  const [cart, setCart] = useState([
    { id: '1', name: 'Producto de Prueba', price: 100, quantity: 2 }
  ]);
  
  const navigate = useNavigate();

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) return;
    setCart(cart.map(item => (item.id || item._id) === id ? { ...item, quantity: newQuantity } : item));
  };

  const handleRemove = (id) => {
    setCart(cart.filter(item => (item.id || item._id) !== id));
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Carrito de Compras</h2>
      {cart.length === 0 ? (
        <p className="text-gray-500">Tu carrito está vacío</p>
      ) : (
        <>
          {cart.map(item => (
            <CartItem 
              key={item.id || item._id} 
              item={item} 
              onUpdateQuantity={handleUpdateQuantity} 
              onRemove={handleRemove} 
            />
          ))}
          <div className="mt-6 flex justify-between items-center border-t pt-4">
            <span className="text-xl font-bold">Total: ${total}</span>
            <button 
              onClick={() => navigate('/checkout')}
              className="bg-blue-600 text-white px-5 py-2 rounded font-semibold cursor-pointer hover:bg-blue-700"
            >
              Proceder al Pago
            </button>
          </div>
        </>
      )}
    </div>
  );
}
