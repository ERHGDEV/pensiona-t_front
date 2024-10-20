import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Header = () => {
    const navigate = useNavigate()
    const isLoggedIn = !!localStorage.getItem('token')
    const userRole = localStorage.getItem('role')

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await axios.post('http://localhost:5000/api/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (response.data.success) {
                localStorage.removeItem('token')
                localStorage.removeItem('role')
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
        <header className="flex justify-between p-4">
                {isLoggedIn ? (
                    <>
                        <h1 className='text-2xl font-bold'>Pensiona-T</h1>
                        <nav>
                            {userRole === 'admin' && (
                                <Link to='/admin' className='text-green-200 mr-4'>
                                    Dashboard
                                </Link>
                            )}
                            {userRole === 'user' && (
                                <Link to='/user' className='text-green-200 mr-4'>
                                    Dashboard
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className='text-lg font-semibold hover:text-gray-400'
                            >
                                Cerrar sesión
                            </button>
                        </nav>
                    </>
                ) : (
                    <>
                        <Link to="/" className='text-2xl font-bold'>Pensiona-T</Link>
                        <Link to='/login' className='text-lg font-semibold hover:text-gray-400'>
                            Iniciar sesión
                        </Link>
                    </>
                )}
        </header>
    )
}

export default Header