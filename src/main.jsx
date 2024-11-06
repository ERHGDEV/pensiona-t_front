import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { NotificationProvider } from './context/NotificationContext.jsx'

createRoot(document.getElementById('root')).render(
  /* <StrictMode> */
    <NotificationProvider>
      <App />
    </NotificationProvider>
  /* </StrictMode>, */
)
