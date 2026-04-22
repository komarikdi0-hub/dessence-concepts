import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Redirect to concepts unless embedded in iframe
if (window.self === window.top) {
  window.location.replace(import.meta.env.BASE_URL + 'concepts.html');
} else {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
