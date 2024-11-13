import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import Header from "../components/Header"
import UserList from "../components/UserList"
import AddUserForm from "../components/AddUserForm"
import Notification from "../components/Notification"
import Dots from "../components/Dots"
import UserActivity from "../components/UserActivity"
import { useNotificationContext } from "../context/NotificationContext"
import AuthService from "../services/authService"
import axiosInstance from "../services/axiosConfig"
import CalculatorParameters from "../components/CalculatorParameters"

const AdminPanel = () => {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
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
    setIsModalOpen(false)
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
      <main className="mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Panel de Administrador</h1>
        </div>

        <CalculatorParameters />

        <section className="flex justify-between mt-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white hover:bg-sky-200 text-sky-950 font-bold py-2 px-4 rounded"
          >
            Agregar Usuario
          </button>
        </section>

        <UserList users={users} onUserUpdated={handleUserUpdated} handleNotification={showNotification} />

        <UserActivity />

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center" id="my-modal">
            <div className="bg-gray-100 p-4 rounded-lg shadow-xl w-full max-w-md">
              <div>
                <div>
                  <AddUserForm onUserAdded={handleUserAdded} handleNotification={showNotification} />
                </div>
                <div className="items-center pt-3">
                  <button
                    id="ok-btn"
                    className="w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default AdminPanel