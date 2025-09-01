import { useNavigate } from 'react-router-dom'

export function ErrorPage() {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/')
  }

  return (
    <div
      id="error-page"
      className="bg-background flex min-h-screen flex-col items-center justify-center p-6 text-center"
    >
      <h1 className="mb-4 text-4xl font-bold text-destructive">Oops!</h1>
      <p className="mb-2 text-lg text-foreground">
        Sorry, an unexpected error has occurred.
      </p>
      <p className="mb-6 italic text-muted-foreground">
        <i>Page not found</i>
      </p>
      <button
        onClick={handleGoHome}
        className="rounded-md btn-yellow px-6 py-3 text-lg font-semibold shadow-md"
      >
        Go to Home
      </button>
    </div>
  )
}
