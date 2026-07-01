function Loader({ mensaje = 'Cargando…' }) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <span className="loader__spinner" aria-hidden="true" />
      <span>{mensaje}</span>
    </div>
  )
}

export default Loader
