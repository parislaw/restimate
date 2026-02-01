import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext'
import { UserDataProvider } from './contexts/UserDataContext'
import { TimeOffProvider } from './contexts/TimeOffContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <UserDataProvider>
        <TimeOffProvider>
          <App />
        </TimeOffProvider>
      </UserDataProvider>
    </AuthProvider>
  </StrictMode>,
)
