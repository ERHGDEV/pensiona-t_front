import { useNotificationContext } from '../context/NotificationContext'

const Notification = () => {
  const { show, message, type } = useNotificationContext()

  if (!show) return null

  return (
    <div
      className={`fixed z-50 top-24 left-1/2 transform -translate-x-1/2 
        px-6 py-3 rounded shadow-lg
        text-center font-bold
        bg-white
        ${type === 'error' ? 'text-red-600' : 'text-sky-800'}
      `}
    >
      {message}
    </div>
  )
}

export default Notification
