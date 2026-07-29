import { useState } from 'react';

export default function Checkout() {
  const [cartItems] = useState([
    { id: 1, name: 'Producto Ejemplo', price: 50, quantity: 2 }
  ]);
  
  const [form, setForm] = useState({ name: '', address: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, items: cartItems, total }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al procesar la orden');

      setSuccessMessage('¡Orden creada con éxito!');
      setForm({ name: '', address: '', email: '' });
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Formulario de Envío */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Finalizar Compra</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input 
            type="text" name="name" placeholder="Nombre completo" 
            value={form.name} onChange={handleChange} className="border p-2 rounded" required 
          />
          <input 
            type="email" name="email" placeholder="Correo electrónico" 
            value={form.email} onChange={handleChange} className="border p-2 rounded" required 
          />
          <input 
            type="text" name="address" placeholder="Dirección de envío" 
            value={form.address} onChange={handleChange} className="border p-2 rounded" required 
          />
          <button 
            type="submit" disabled={loading}
            className="bg-green-600 text-white py-2 rounded font-semibold cursor-pointer hover:bg-green-700"
          >
            {loading ? 'Procesando...' : 'Enviar Orden'}
          </button>
        </form>
        {successMessage && <p className="mt-4 text-green-600 font-bold">{successMessage}</p>}
        {errorMessage && <p className="mt-4 text-red-600 font-bold">{errorMessage}</p>}
      </div>

      {/* Resumen de la Compra */}
      <div className="bg-gray-50 p-4 rounded border">
        <h3 className="text-xl font-bold mb-4">Resumen del Pedido</h3>
        {cartItems.map(item => (
          <div key={item.id} className="flex justify-between py-2 border-b text-sm">
            <span>{item.name} (x{item.quantity})</span>
            <span>${item.price * item.quantity}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold text-lg mt-4 pt-2">
          <span>Total a pagar:</span>
          <span>${total}</span>
        </div>
      </div>
    </div>
  );
}
