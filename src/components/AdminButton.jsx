import { Link } from 'react-router-dom'

const AdminButton = ({
  onClick,
  type = 'button',
  variant = 'primary',
  children,
  className = '',
  disabled = false,
  to
}) => {
  const baseClasses = `font-bold text-nowrap text-sm
    py-2 px-4 rounded-full 
    transition duration-300 ease-in-out 
    sm:max-w-fit sm:mx-auto`

  const variantStyles = {
    secondary: 'bg-white hover:bg-sky-500 active:bg-sky-700 text-lg text-sky-900 hover:text-white',
    primary: 'bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-lg text-white',
    danger: 'bg-red-600 hover:bg-red-500 active:bg-red-700 text-lg text-white'
  }

  const buttonStyles = `${baseClasses} ${variantStyles[variant]} ${className}`

  if (to) {
    return (
      <Link to={to} className={buttonStyles}>
        {children}
        <span className="ml-2">→</span>
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonStyles}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default AdminButton