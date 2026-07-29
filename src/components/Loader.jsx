function Loader({ mensaje = 'Cargando…' }) {
  return (
    <div
      className="flex items-center gap-2.5 py-4 text-muted"
      role="status"
      aria-live="polite"
    >
      <span
        className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-brand"
        aria-hidden="true"
      />
      <span>{mensaje}</span>
    </div>
  )
}

export default Loader
