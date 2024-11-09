import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../services/axiosConfig'
import AuthService from '../services/authService'

const Header = () => {
    const navigate = useNavigate()
    const isLoggedIn = AuthService.isAuthenticated() 
    const userRole = AuthService.getUserRole() 
    const email = AuthService.getUsername() 

    const handleLogout = async () => {
        try {
            const response = await axiosInstance.post('/logout', { email })

            if (response.data.success) {
                AuthService.logout()
                navigate('/login')
            } else {
                console.error('Error during logout:', response.data.message)
                alert('Error al cerrar sesión, intenta de nuevo')
            }   
        } catch (error) {
            console.error('Error during logout:', error)
            alert('Error al cerrar sesión, intenta de nuevo')
        }
    }

    return (
        <header className="flex justify-between items-end p-4">
            {isLoggedIn ? (
                <>
                    <h1 className='text-2xl font-bold'>Pensiona-T</h1>
                    <nav>
                        {userRole === 'admin' && (
                            <Link to='/admin' className='text-green-100 hover:text-green-300 active:text-green-700 mr-8'>
                                Dashboard
                            </Link>
                        )}
                        {userRole === 'user' && (
                            <Link to='/user' className='text-green-100 hover:text-green-300 active:text-green-700 mr-8'>
                                Dashboard
                            </Link>
                        )}
                        <button
                            onClick={handleLogout}
                            className='text-lg font-semibold 
                            hover:text-gray-300 active:text-gray-500
                            transition duration-300 ease-in-out
                            rounded-full'
                        >
                            Salir
                            <span className="ml-2">→</span>
                        </button>
                    </nav>
                </>
            ) : (
                <>
                    <Link to="/" className='text-2xl hover:text-gray-300 active:text-gray-500 font-bold'>Pensiona-T</Link>
                </>
            )}
        </header>
    )
}

export default Header
