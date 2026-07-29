function ErrorMessage({ message = 'Ocurrió un error.', onRetry }) {
  return (
    <div
      className="rounded-md border border-red-200 bg-red-50 p-4 text-red-800"
      role="alert"
    >
      <p>{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 cursor-pointer rounded bg-red-600 px-3 py-1 text-sm font-semibold text-white hover:bg-red-700"
        >
          Reintentar
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
