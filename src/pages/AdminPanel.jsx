import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import UserList from "../components/UserList"
import Dots from "../components/Dots"
import UserActivity from "../components/UserActivity"
import { useNotificationContext } from "../context/NotificationContext"
import AuthService from "../services/authService"
import axiosInstance from "../services/axiosConfig"
import CalculatorParameters from "../components/CalculatorParameters"
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
      <div className="flex flex-col justify-center items-center h-[calc(100vh-80px)]">
        <p className="mb-8">Cargando</p>
        <Dots />
      </div>
    )
  }
  
  return (
    <main className="mx-auto max-w-7xl p-4">
      <h1 className="text-3xl text-center font-bold mb-4">Panel de Administrador</h1>
      <nav className="flex justify-center">
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
      </nav>
      <section className="px-4">
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
          </>
        ) : (
          <PaymentList payments={payments}/>
        )
        }
      </section>
    </main>
  )
}

export default AdminPanel