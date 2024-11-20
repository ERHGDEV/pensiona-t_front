import { useState, useEffect } from 'react'
import axiosInstance from '../services/axiosConfig'

const UserProfile = ({ onClose, isMobile = false }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true)
      try {
        const response = await axiosInstance.get('/user')
        if (response.data) {
          setUser(response.data)
        } else {
          console.error('Error fetching user data:', response.data.message)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUserData()
  }, [])

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (error) {
      return 'Fecha no disponible'
    }
  }

  if (isLoading) {
    return (
      <div className={`text-sky-950 ${isMobile ? 'w-full bg-transparent' : 'bg-white rounded-lg shadow-xl max-w-md w-full mx-auto'} p-4 flex items-center justify-center h-[440px]`}>
        <p>Cargando perfil...</p>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className={`text-sky-950 ${isMobile ? 'w-full bg-transparent' : 'bg-white rounded-lg shadow-xl h-[440px] p-4 max-w-md w-full mx-auto'} relative`}>
      {!isMobile && (
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      <div className="flex flex-col items-center pt-4">
        <img 
          src={user.profileImage || '/placeholder.svg'} 
          alt="Profile" 
          className="w-16 h-16 rounded-full mb-3 bg-gray-200"
        />
        <h2 className="text-lg font-bold mb-1">{user.name}</h2>
        <p className="text-gray-600 mb-1">{user.email}</p>
        <p className="text-gray-500 text-sm mb-3">Miembro desde: {formatDate(user.created)}</p>
      </div>
      <h2 className='mb-2 text-center'>Has realizado</h2>
      <div className="text-center grid grid-cols-2 gap-3">
        <div>
          <h3 className="text-sm font-semibold mb-1">Cálculos</h3>
          <div className={`${isMobile ? 'bg-gray-100' : 'bg-gray-200'} h-16 rounded flex items-center justify-center`}>
            <span className="text-xl font-bold">{user.calculosRealizados || 0}</span>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-1">Reportes</h3>
          <div className={`${isMobile ? 'bg-gray-100' : 'bg-gray-200'} h-16 rounded flex items-center justify-center`}>
            <span className="text-xl font-bold">{user.reportesGenerados || 0}</span>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-1">Afore consultadas</h3>
          <div className={`${isMobile ? 'bg-gray-100' : 'bg-gray-200'} h-16 rounded flex items-center justify-center`}>
            <span className="text-xl font-bold">{user.aforesConsultadas || 0}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile