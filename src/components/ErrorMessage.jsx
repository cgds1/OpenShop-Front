function ErrorMessage({ message = 'Ocurrió un error.', onRetry }) {
  return (
    <div
      className="rounded-lg border border-danger/20 bg-danger-light p-4 text-danger"
      role="alert"
    >
      <p>{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 cursor-pointer rounded-full bg-danger px-3 py-1 text-sm font-semibold text-white transition-colors hover:opacity-90"
        >
          Reintentar
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
