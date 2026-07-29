import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function ProductDetail() {
  const { id } = useParams(); // Lee el id dinámico desde la URL (/products/:id)
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    setCargando(true);
    fetch(`${API_URL}/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener el producto");
        return res.json();
      })
      .then((data) => {
        setProducto(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error en ProductDetail:", err);
        setCargando(false);
      });
  }, [id, API_URL]);

  if (cargando) return <p style={{ padding: "2rem" }}>Cargando información del producto...</p>;
  if (!producto) return <p style={{ padding: "2rem" }}>Producto no encontrado.</p>;

  return (
    <section style={{ padding: "2rem", maxWidth: "850px", margin: "0 auto" }}>
      <Link to="/catalog" style={{ textDecoration: "none", color: "#007bff", display: "inline-block", marginBottom: "1rem" }}>
        ← Volver al catálogo
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", backgroundColor: "#fff", padding: "1.5rem", borderRadius: "8px", border: "1px solid #ddd" }}>
        <div>
          <img
            src={producto.imagen_url || "https://via.placeholder.com/300"}
            alt={producto.nombre}
            style={{ width: "100%", maxHeight: "320px", objectFit: "cover", borderRadius: "8px" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: "0.8rem", background: "#e9ecef", padding: "4px 10px", borderRadius: "12px", textTransform: "uppercase" }}>
              {producto.categoria_id?.nombre || "General"}
            </span>
            <h1 style={{ margin: "0.8rem 0 0.4rem", fontSize: "1.8rem" }}>{producto.nombre}</h1>
            <p style={{ color: "#6c757d", margin: "0 0 1rem" }}>
              Marca: <strong>{producto.marca || "N/A"}</strong>
            </p>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#28a745", margin: "0.5rem 0" }}>
              ${producto.precio}
            </p>
            <p style={{ margin: "0.5rem 0" }}>
              <strong>Stock disponible:</strong> {producto.stock} unidades
            </p>
          </div>

          <button
            onClick={() => alert(`¡Añadido ${producto.nombre} al carrito!`)}
            style={{
              background: "#28a745",
              color: "#fff",
              border: "none",
              padding: "0.8rem 1.2rem",
              borderRadius: "5px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: "1.5rem"
            }}
          >
            Agregar al carrito 🛒
          </button>
        </div>
      </div>
    </section>
  );
}