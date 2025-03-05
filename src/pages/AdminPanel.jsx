import { useNavigate, Link } from "react-router-dom"
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
import PaymentActivity from "../components/PaymentActivity"
import PreferencesList from "../components/PreferencesList"
import { AnimatePresence } from "framer-motion"
import ComponentTransition from "../components/ComponentTransition"

const AdminPanel = () => {
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('home')
  const [users, setUsers] = useState([])
  const [payments, setPayments] = useState([])
  const [preferences, setPreferences] = useState([])
  const { showNotification } = useNotificationContext()
  const navigate = useNavigate()

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
        showNotification('Error al verificar permisos de administrador', 'error')
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }
    verifyAdmin()
  }, [navigate])

  const fetchUsers = async () => {
    try { 
      const response = await axiosInstance.get('/admin')
      setUsers(response.data.users)
      setPayments(response.data.payments)
      setPreferences(response.data.preferences)
    } catch (error) {
      showNotification('Error al obtener la lista de usuarios', 'error')
    }
  }

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
      <h1 className="text-3xl font-bold mb-4 sm:px-4">Panel de Administrador</h1>
      <nav className="flex gap-4 overflow-x-auto sm:px-4">
        <button
          className={`px-4 py-2 h-full rounded-lg ${activeSection === 'home' ? 'bg-sky-950 text-white font-semibold' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setActiveSection('home')}
        >
          Home
        </button>
        <button
          className={`px-4 py-2 h-full rounded-lg ${activeSection === 'statistics' ? 'bg-sky-950 text-white font-semibold' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setActiveSection('statistics')}
        >
          Estadísticas
        </button>
        <button
          className={`px-4 py-2 h-full rounded-lg ${activeSection === 'payments' ? 'bg-sky-950 text-white font-semibold' : 'bg-gray-100 text-gray-700'}`}
          onClick={() => setActiveSection('payments')}
        >
          Ingresos
        </button>
        <Link
          className={`px-4 py-2 h-full text-nowrap rounded-lg ${activeSection === 'user' ? 'bg-sky-950 text-white font-semibold' : 'bg-gray-100 text-gray-700'}`}
          to='/user'
        >
          Ver como usuario
        </Link>
      </nav>

      <section className="sm:px-4">
        <AnimatePresence mode="wait">
          {activeSection === 'home' && (
            <ComponentTransition key="home">
              <CalculatorParameters />
              <UserList 
                users={users} 
                onUserUpdated={handleUserUpdated} 
                onUserAdded={handleUserAdded}
                handleNotification={showNotification} 
              />
            </ComponentTransition>
          )}
          {activeSection === 'statistics' && (
            <ComponentTransition key="statistics">
              <UserGrowth users={users} />
              <UserActivity />
            </ComponentTransition>
          )}
          {activeSection === 'payments' && (
            <ComponentTransition key="payments">
              <PaymentActivity payments={payments}/>
              <PaymentList payments={payments}/>
              <PreferencesList preferences={preferences}/>
            </ComponentTransition>
          )}
        </AnimatePresence>
      </section>
    </main>
  )
}

export default AdminPanel
