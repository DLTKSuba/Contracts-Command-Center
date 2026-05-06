import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
/** Single entry: chains tokens, reset, layout, components, utilities per Harmony global.css */
import '@deltek/harmony-components/styles/global.css'
import App from './App'
/** After App so component CSS from the tree cannot override app shell overrides below */
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <App />
    </HashRouter>
  </StrictMode>,
)
