import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import Header from "../components/Header"
import UserList from "../components/UserList"
import Notification from "../components/Notification"
import Dots from "../components/Dots"
import UserActivity from "../components/UserActivity"
import { useNotificationContext } from "../context/NotificationContext"
import AuthService from "../services/authService"
import axiosInstance from "../services/axiosConfig"
import CalculatorParameters from "../components/CalculatorParameters"
import AdminEmailForm from "../components/AdminEmailForm"

const AdminPanel = () => {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const { showNotification } = useNotificationContext()
  
  const navigate = useNavigate()

  const fetchUsers = async () => {
    try { 
      const response = await axiosInstance.get('/admin')
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
      showNotification('Error al obtener la lista de usuarios', 'error')
    }
  }

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        if (!AuthService.isAuthenticated()) {
          navigate('/login')
          return
        }
        const user = await AuthService.getCurrentUser()
        if (user.role !== 'admin') {
          showNotification('No tienes permisos de administrador', 'error')
          navigate('/login')
          return
        }
        await fetchUsers()
      } catch (error) {
        console.error('Error verifying admin:', error)
        showNotification('Error al verificar permisos de administrador', 'error')
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }
    verifyAdmin()
  }, [navigate])

  const handleUserAdded = () => {
    fetchUsers()
    showNotification('Usuario agregado exitosamente', 'success')
  }

  const handleUserUpdated = () => {
    fetchUsers()
    showNotification('Usuario actualizado exitosamente', 'success')
  }
  
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="mb-8">Cargando</p>
        <Dots />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen">
      <Header />
      <Notification />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Panel de Administrador</h1>
        </div>

        <CalculatorParameters />

        <UserList 
          users={users} 
          onUserUpdated={handleUserUpdated} 
          onUserAdded={handleUserAdded}
          handleNotification={showNotification} 
        />

        <UserActivity />

        <AdminEmailForm />
      </main>
    </div>
  )
}

export default AdminPanel