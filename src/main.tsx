import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// @ts-expect-error CSS side-effect imports are handled by the bundler.
import './main.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
