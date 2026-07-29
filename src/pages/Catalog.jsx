import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Catalog() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [cargando, setCargando] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // 1. Pide las categorías para llenar el select
  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener categorías");
        return res.json();
      })
      .then((data) => setCategorias(data))
      .catch((err) => console.error("Error obteniendo categorías:", err));
  }, [API_URL]);

  // 2. Pide la lista de productos (aplica query param si hay categoría seleccionada)
  useEffect(() => {
    setCargando(true);
    const endpoint = categoriaSeleccionada
      ? `${API_URL}/products?categoria=${categoriaSeleccionada}`
      : `${API_URL}/products`;

    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener productos");
        return res.json();
      })
      .then((data) => {
        setProductos(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error obteniendo productos:", err);
        setCargando(false);
      });
  }, [categoriaSeleccionada, API_URL]);

  return (
    <section style={{ padding: "2rem" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1>Catálogo de Productos</h1>

        {/* Filtro por Categoría */}
        <div>
          <label htmlFor="categoria-select" style={{ marginRight: "0.5rem", fontWeight: "bold" }}>
            Filtrar por categoría:
          </label>
          <select
            id="categoria-select"
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Renderizado condicional según estado */}
      {cargando ? (
        <p>Cargando productos...</p>
      ) : productos.length === 0 ? (
        <p>No se encontraron productos para esta categoría.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.5rem" }}>
          {productos.map((producto) => (
            <div
              key={producto._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                justify: "space-between",
                backgroundColor: "#fff"
              }}
            >
              <div>
                <img
                  src={producto.imagen_url || "https://via.placeholder.com/150"}
                  alt={producto.nombre}
                  style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "4px" }}
                />
                <span
                  style={{
                    fontSize: "0.75rem",
                    background: "#e9ecef",
                    padding: "2px 8px",
                    borderRadius: "10px",
                    display: "inline-block",
                    marginTop: "0.5rem"
                  }}
                >
                  {producto.categoria_id?.nombre || "Sin categoría"}
                </span>
                <h3 style={{ margin: "0.5rem 0 0.2rem", fontSize: "1.1rem" }}>{producto.nombre}</h3>
                <p style={{ margin: "0", fontSize: "0.85rem", color: "#6c757d" }}>
                  Marca: {producto.marca || "N/A"}
                </p>
                <p style={{ fontWeight: "bold", fontSize: "1.2rem", color: "#2c3e50", margin: "0.5rem 0" }}>
                  ${producto.precio}
                </p>
              </div>

              <Link
                to={`/products/${producto._id}`}
                style={{
                  textAlign: "center",
                  background: "#007bff",
                  color: "#fff",
                  padding: "0.5rem",
                  borderRadius: "4px",
                  textDecoration: "none",
                  marginTop: "0.8rem",
                  fontWeight: "bold"
                }}
              >
                Ver detalle
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}