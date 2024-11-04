import { useState, useEffect, useCallback } from 'react'

const useNotification = (duration = 3000) => {
  const [notification, setNotification] = useState({
    message: '',
    type: 'error',
    show: false
  })

  const showNotification = useCallback((message, type) => {
    setNotification({ message, type, show: true })
  }, [])

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, show: false }))
  }, [])

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        hideNotification()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [notification.show, duration, hideNotification])

  return {
    ...notification,
    showNotification,
    hideNotification
  }
}

export default useNotification