import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import Header from "../components/Header"
import UserList from "../components/UserList"
import AddUserForm from "../components/AddUserForm"
import Notification from "../components/Notification"
import AuthService from "../services/authService"
import axiosInstance from "../services/axiosConfig"

const AdminPanel = () => {
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [salarioMinimo, setSalarioMinimo] = useState('')
  const [uma, setUma] = useState('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editValues, setEditValues] = useState({ salarioMinimo: '', uma: '' })
  const navigate = useNavigate()

  const [notificationMessage, setNotificationMessage] = useState('')
  const [showNotification, setShowNotification] = useState(false)
  const [notificationType, setNotificationType] = useState('error')

  const handleNotification = (message, type) => {
    setNotificationMessage(message)
    setNotificationType(type)
    setShowNotification(true)
  }

  const fetchUsers = async () => {
    try { 
      const response = await axiosInstance.get('/admin')
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
      handleNotification('Error al obtener la lista de usuarios', 'error')
    }
  }

  const fetchValues = async () => {
    try {
      const response = await axiosInstance.get('/admin/values')
      setSalarioMinimo(response.data.salarioMinimo)
      setUma(response.data.uma)
      setEditValues({ salarioMinimo: response.data.salarioMinimo, uma: response.data.uma })
    } catch (error) {
      console.error('Error fetching values:', error)
      handleNotification('Error al obtener los valores de salario mínimo y UMA', 'error')
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
          handleNotification('No tienes permisos de administrador', 'error')
          navigate('/login')
          return
        }
        await fetchUsers()
        await fetchValues()
      } catch (error) {
        console.error('Error verifying admin:', error)
        handleNotification('Error al verificar permisos de administrador', 'error')
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }
    verifyAdmin()
  }, [navigate])

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showNotification])

  const handleUserAdded = () => {
    fetchUsers()
    setIsModalOpen(false)
    handleNotification('Usuario agregado exitosamente', 'success')
  }

  const handleUserUpdated = () => {
    fetchUsers()
    handleNotification('Usuario actualizado exitosamente', 'success')
  }

  const handleEditInputChange = (e) => {
    const { name, value } = e.target
    setEditValues(prev => ({ ...prev, [name]: value }))
  }

  const handleValuesUpdate = async (e) => {
    e.preventDefault()
    try {
      await axiosInstance.put('/admin/values', editValues)
      handleNotification('Valores actualizados correctamente', 'success')
      setIsEditModalOpen(false)
      fetchValues()
    } catch (error) {
      console.error('Error updating values:', error)
      handleNotification('Error al actualizar los valores', 'error')
    }
  }
  
    if (loading) {
      return <div className="flex justify-center items-center h-screen">Cargando...</div>
    }
  
    return (
      <div className="min-h-screen">
        <Header />
        <Notification
          showNotification={showNotification}
          message={notificationMessage}
          type={notificationType}
        />
        <main className="mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Panel de Administrador</h1>
          </div>

          <div className="rounded pt-6 pb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Parámetros de calculadora</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="currentSalarioMinimo" className="block text-gray-200 text-sm font-bold mb-2">
                  Salario Mínimo
                </label>
                <input
                  id="currentSalarioMinimo"
                  type="text"
                  value={salarioMinimo}
                  readOnly
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label htmlFor="currentUma" className="block text-gray-200 text-sm font-bold mb-2">
                  UMA
                </label>
                <input
                  id="currentUma"
                  type="text"
                  value={uma}
                  readOnly
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            </div>
          </div>

          <section className="flex justify-between mb-8">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="bg-white hover:bg-sky-200 text-sky-950 font-bold py-2 px-4 rounded"
            >
              Editar Parámetros
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white hover:bg-sky-200 text-sky-950 font-bold py-2 px-4 rounded"
            >
              Agregar Usuario
            </button>
          </section>

          <UserList users={users} onUserUpdated={handleUserUpdated} handleNotification={handleNotification} />

          {isModalOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="my-modal">
              <div className="relative top-20 mx-auto p-8 border w-96 shadow-lg rounded-md bg-gray-100">
                <div>
                  <div>
                    <AddUserForm onUserAdded={handleUserAdded} handleNotification={handleNotification} />
                  </div>
                  <div className="items-center py-3">
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
          
          {isEditModalOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="edit-modal">
              <div className="relative top-20 mx-auto p-8 border w-96 shadow-lg rounded-md bg-gray-100">
                <div className="mt-3">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Editar parámetros de calculadora</h3>
                  <div className="mt-2 py-3">
                    <form onSubmit={handleValuesUpdate}>
                      <div className="mb-4">
                        <label htmlFor="salarioMinimo" className="block text-gray-700 text-sm font-bold mb-2">
                          Salario Mínimo <span className="text-xs pl-4">Actualizar cada 1ero de Enero</span>
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          id="salarioMinimo"
                          name="salarioMinimo"
                          value={editValues.salarioMinimo}
                          onChange={handleEditInputChange}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="uma" className="block text-gray-700 text-sm font-bold mb-2">
                          UMA <span className="text-xs pl-4">Actualizar cada 1ero de Febrero</span>
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          id="uma"
                          name="uma"
                          value={editValues.uma}
                          onChange={handleEditInputChange}
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <button
                          type="submit"
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                          Guardar cambios
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditModalOpen(false)}
                          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
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
