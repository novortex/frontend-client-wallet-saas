import { useNavigate } from 'react-router-dom'

export function ErrorPage() {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/')
  }

  return (
    <div
      id="error-page"
      className="bg-black-100 flex min-h-screen flex-col items-center justify-center p-6 text-center"
    >
      <h1 className="mb-4 text-4xl font-bold text-red-600">Oops!</h1>
      <p className="mb-2 text-lg text-gray-700">
        Sorry, an unexpected error has occurred.
      </p>
      <p className="mb-6 italic text-gray-500">
        <i>Page not found</i>
      </p>
      <button
        onClick={handleGoHome}
        className="rounded-md bg-yellow-500 px-6 py-3 text-lg font-semibold text-black shadow-md transition-colors duration-200 ease-in-out hover:bg-yellow-600"
      >
        Go to Home
      </button>
    </div>
  )
}
