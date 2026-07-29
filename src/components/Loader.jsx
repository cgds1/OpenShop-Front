function Loader({ mensaje = 'Cargando…' }) {
  return (
    <div
      className="flex items-center gap-2.5 py-4 text-gray-600"
      role="status"
      aria-live="polite"
    >
      <span
        className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"
        aria-hidden="true"
      />
      <span>{mensaje}</span>
    </div>
  )
}

export default Loader
