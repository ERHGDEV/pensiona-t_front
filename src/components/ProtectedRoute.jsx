import { Navigate, Outlet } from 'react-router-dom'
import AuthService from '../services/authService'

const ProtectedRoute = ({ redirectPath = '/login', children }) => {
  if (!AuthService.isAuthenticated()) {
    return <Navigate to={redirectPath} replace />
  }
  return children ? children : <Outlet />
}

export default ProtectedRoute