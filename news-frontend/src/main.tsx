import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App'

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Failed to find root element with ID 'root' in DOM.");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
