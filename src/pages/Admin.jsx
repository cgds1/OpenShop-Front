import { useState, useEffect } from 'react';

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Cargar productos y órdenes reales del backend en paralelo
        const [prodRes, ordRes] = await Promise.all([
          fetch('http://localhost:3000/products'),
          fetch('http://localhost:3000/orders').catch(() => ({ ok: false })) // Por si el endpoint de órdenes se arma después
        ]);

        if (prodRes.ok) setProducts(await prodRes.json());
        if (ordRes.ok && typeof ordRes.json === 'function') {
          const ordData = await ordRes.json();
          setOrders(Array.isArray(ordData) ? ordData : []);
        }
      } catch (err) {
        console.error('Error cargando datos del panel admin', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newName || !newPrice) return;

    try {
      const response = await fetch('http://localhost:3000/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, price: parseFloat(newPrice) })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setProducts([...products, data]);
      setNewName('');
      setNewPrice('');
    } catch (err) {
      alert('Error al crear producto: ' + err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/products/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar');
      setProducts(products.filter(p => (p.id || p._id) !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p className="p-4">Cargando panel de administración...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-10">
      <h2 className="text-3xl font-bold">Panel de Administración</h2>

      {/* Sección 1: Gestión de Productos */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Gestión de Productos</h3>
        <form onSubmit={handleAddProduct} className="flex gap-2 mb-6">
          <input 
            type="text" placeholder="Nombre del producto" value={newName} 
            onChange={(e) => setNewName(e.target.value)} className="border p-2 rounded flex-1" required 
          />
          <input 
            type="number" placeholder="Precio" value={newPrice} 
            onChange={(e) => setNewPrice(e.target.value)} className="border p-2 rounded w-32" required 
          />
          <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-purple-700">Agregar</button>
        </form>

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Nombre</th>
              <th className="border p-2 text-left">Precio</th>
              <th className="border p-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => {
              const id = p.id || p._id;
              return (
                <tr key={id}>
                  <td className="border p-2">{p.name}</td>
                  <td className="border p-2">${p.price}</td>
                  <td className="border p-2 text-center">
                    <button onClick={() => handleDeleteProduct(id)} className="bg-red-500 text-white px-2 py-1 rounded text-sm cursor-pointer hover:bg-red-600">Eliminar</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* Sección 2: Tabla de Órdenes */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Órdenes de Compra Recibidas</h3>
        {orders.length === 0 ? (
          <p className="text-gray-500">No hay órdenes registradas aún.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">ID Orden</th>
                <th className="border p-2 text-left">Cliente</th>
                <th className="border p-2 text-left">Dirección</th>
                <th className="border p-2 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id || o._id}>
                  <td className="border p-2 font-mono text-xs">{o.id || o._id}</td>
                  <td className="border p-2">{o.name}</td>
                  <td className="border p-2">{o.address}</td>
                  <td className="border p-2">${o.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
