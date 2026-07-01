// Cliente HTTP central de OpenShop.
// La base URL sale de VITE_API_URL (definida en .env / .env.example).
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

async function request(path, { method = 'GET', body } = {}) {
  const options = { method, headers: {} }

  if (body !== undefined) {
    options.headers['Content-Type'] = 'application/json'
    options.body = JSON.stringify(body)
  }

  const res = await fetch(`${BASE_URL}${path}`, options)

  // Manejo de error centralizado: intentamos leer el message del back si viene.
  if (!res.ok) {
    let detalle = ''
    try {
      const data = await res.json()
      detalle = data?.message ?? ''
    } catch {
      // respuesta sin cuerpo JSON: nos quedamos con el status
    }
    throw new Error(`${res.status} ${res.statusText}${detalle ? ` — ${detalle}` : ''}`)
  }

  // 204 No Content (p. ej. DELETE) o respuesta vacía.
  if (res.status === 204) return null
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

export const get = (path) => request(path)
export const post = (path, body) => request(path, { method: 'POST', body })
export const put = (path, body) => request(path, { method: 'PUT', body })
export const del = (path) => request(path, { method: 'DELETE' })

export default { get, post, put, del }
