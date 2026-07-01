import { useCallback, useEffect, useState } from 'react'

// Patrón de carga/error reutilizable por las páginas.
// Uso: const { data, loading, error, reload } = useFetch(() => api.get('/products'), [])
export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Contador para forzar recarga manual vía reload().
  const [nonce, setNonce] = useState(0)

  const reload = useCallback(() => setNonce((n) => n + 1), [])

  useEffect(() => {
    let activo = true
    setLoading(true)
    setError(null)

    Promise.resolve(fetcher())
      .then((result) => {
        if (activo) setData(result)
      })
      .catch((err) => {
        if (activo) setError(err)
      })
      .finally(() => {
        if (activo) setLoading(false)
      })

    return () => {
      activo = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce])

  return { data, loading, error, reload }
}

export default useFetch
