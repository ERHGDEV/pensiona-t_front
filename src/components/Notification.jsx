import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useNotificationContext } from '../context/NotificationContext'
import AlertRoundedIcon from './icons/AlertRoundedIcon'
import CheckRoundedIcon from './icons/CheckRoundedIcon'
import XSquareRoundedIcon from './icons/XSquareRoundedIcon'


const Notification = () => {
  const { show, message, type } = useNotificationContext()

  const typeStyles = {
    error: 'bg-gray-50 text-red-600 border border-red-500',
    success: 'bg-gray-50 text-green-800 border border-green-500',
    info: 'bg-gray-50 text-sky-800 border border-sky-500',
  }

  return createPortal(
    <AnimatePresence>
      {show && (
        <motion.div
          key="notification"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className={`fixed z-50 bottom-4 right-4 flex flex-row place-items-center
            px-3 py-3 rounded shadow-lg font-semibold text-base text-right
            max-w-xs
            ${typeStyles[type] || 'bg-gray-100 text-gray-700 border border-gray-400'}`}
        >
          {type === 'error' ? (
            <XSquareRoundedIcon className='mr-2' />
          ) : type === 'success' ? (
            <CheckRoundedIcon className='mr-2' />
          ) : type === 'info' ? (
            <AlertRoundedIcon className='mr-2' />
          ) : null} {message}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default Notification
