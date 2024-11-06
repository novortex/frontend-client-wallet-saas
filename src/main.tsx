import ReactDOM from 'react-dom/client'
import { App } from './App'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from './components/ui/toaster'

const rootElement = document.getElementById('root')

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>,
  )
} else {
  console.error("Root element with id 'root' not found")
}
