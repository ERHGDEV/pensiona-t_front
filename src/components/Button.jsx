import { Link } from 'react-router-dom'

const Button = ({ children, order, onClick, type, to }) => {
    const baseClasses = `font-bold text-nowrap
        py-3 px-6 rounded-full 
        transition duration-300 ease-in-out 
        flex items-center justify-center sm:max-w-fit sm:mx-auto`
    const orderClasses =
        order === 'primary'
        ? 'bg-white hover:bg-sky-500 active:bg-sky-700 text-lg text-sky-900 hover:text-white'
        : 'bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-lg text-white'

    if (to) {
        return (
        <Link to={to} className={`${baseClasses} ${orderClasses}`}>
            {children}
            <span className="ml-2">→</span>
        </Link>
        )
    }

    return (
        <button onClick={onClick} type={type} className={`${baseClasses} ${orderClasses}`}>
            {children}
            <span className="ml-2">→</span>
        </button>
    )
}

export default Button
