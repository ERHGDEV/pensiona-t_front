import { Link } from 'react-router-dom'

const Header = () => {
    const isLogged = false

    return (
        <header className="flex justify-between p-4">
            <Link to="/" className='text-2xl font-bold'>Pensiona-T</Link>

            {!isLogged ? (
                <Link to="/" className='text-lg font-semibold hover:text-gray-400'>Login</Link>
            ) : (
                <button 
                    className='text-lg font-semibold hover:text-gray-400'
                >
                    Cerrar sesión
                </button>
            )}


        </header>
    )
}

export default Header