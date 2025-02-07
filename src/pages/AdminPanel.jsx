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
import UserGrowth from "../components/UserGrowth"
import PaymentList from "../components/PaymentList"

const AdminPanel = () => {
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('home')
  const [users, setUsers] = useState([])
  const [payments, setPayments] = useState([])
  const { showNotification } = useNotificationContext()
  
  const navigate = useNavigate()

  const fetchUsers = async () => {
    try { 
      const response = await axiosInstance.get('/admin')
      setUsers(response.data.users)
      setPayments(response.data.payments)
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

          <div className="flex justify-center">
            <button
                className={`px-4 py-2 mr-4 rounded-lg ${activeSection === 'home' ? 'bg-sky-950 text-white font-semibold' : 'bg-gray-100 text-gray-700' }`}
                onClick={() => setActiveSection('home')}
            >
                Home
            </button>
            <button
                className={`px-4 py-2 mr-4 rounded-lg ${activeSection === 'statistics' ? 'bg-sky-950 text-white font-semibold' : 'bg-gray-100 text-gray-700' }`}
                onClick={() => setActiveSection('statistics')}
            >
                Estadísticas
            </button>
            <button
                className={`px-4 py-2 rounded-lg ${activeSection === 'payments' ? 'bg-sky-950 text-white font-semibold' : 'bg-gray-100 text-gray-700' }`}
                onClick={() => setActiveSection('payments')}
            >
                Ingresos
            </button>
          </div>
        </div>

        {activeSection === 'home' ? (
          <>
            <CalculatorParameters />
            <UserList 
              users={users} 
              onUserUpdated={handleUserUpdated} 
              onUserAdded={handleUserAdded}
              handleNotification={showNotification} 
            />
          </>  
        ) : activeSection === 'statistics' ? (
          <>
            <UserGrowth users={users} />
            <UserActivity />
            {/* <AdminEmailForm /> */}
          </>
        ) : (
          <PaymentList payments={payments}/>
        )
        }

      </main>
    </div>
  )
}

export default AdminPanel