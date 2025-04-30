import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { NotificationProvider } from './context/NotificationContext.jsx'
import { UserProvider } from './context/UserContext.jsx'
import { ActiveSectionProvider } from './context/ActiveSectionContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NotificationProvider>
      <UserProvider>
        <ActiveSectionProvider>
          <App />
        </ActiveSectionProvider>
      </UserProvider>
    </NotificationProvider>
  </StrictMode>,
)
