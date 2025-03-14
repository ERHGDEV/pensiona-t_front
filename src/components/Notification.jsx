import { createPortal } from 'react-dom'
import { useNotificationContext } from '../context/NotificationContext'
import ComponentTransition from './ComponentTransition'

const Notification = () => {
  const { show, message, type } = useNotificationContext()

  if (!show) return null

  const typeStyles = {
    error: 'bg-gray-50 text-red-600 border border-red-500',
    success: 'bg-gray-50 text-green-800 border border-green-500',
    info: 'bg-gray-50 text-sky-800 border border-sky-500',
  }

  return createPortal(
    <ComponentTransition>
    <div
      className={`fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
        px-6 py-3 rounded shadow-lg text-center font-semibold 
        ${typeStyles[type] || 'bg-gray-100 text-gray-700 border border-gray-400'}`}
    >
      {message}
    </div>
    </ComponentTransition>,
    document.body
  )
}

export default Notification