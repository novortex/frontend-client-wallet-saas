import { useNavigate } from 'react-router-dom'

export function ErrorPage() {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/')
  }

  return (
    <div
      id="error-page"
      className="flex flex-col items-center justify-center min-h-screen bg-black-100 text-center p-6"
    >
      <h1 className="text-4xl font-bold text-red-600 mb-4">
        Oops!
      </h1>
      <p className="text-lg text-gray-700 mb-2">
        Sorry, an unexpected error has occurred.
      </p>
      <p className="text-gray-500 italic mb-6">
        <i>Page not found</i>
      </p>
      <button
        onClick={handleGoHome}
        className="px-6 py-3 bg-yellow-500 text-black text-lg font-semibold rounded-md hover:bg-yellow-600 transition-colors duration-200 ease-in-out shadow-md"
      >
        Go to Home
      </button>
    </div>
  )
}
