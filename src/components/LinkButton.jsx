import { Link } from 'react-router-dom'

const LinkButton = ({ to, children }) => {
    return (
        <Link
            to={to}
            className="bg-white hover:bg-sky-500 active:bg-sky-700
                text-lg text-sky-900 hover:text-white 
                font-bold py-3 px-6 rounded-full 
                transition duration-300 ease-in-out 
                flex items-center justify-center sm:max-w-fit sm:mx-auto"
        >
            {children}
            <span className="ml-2">→</span>
        </Link>
    )
}

export default LinkButton