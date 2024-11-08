import { useState } from "react"
import axiosInstance from "../services/axiosConfig"
import AuthService from "../services/authService"

const AddUserForm = ({ onUserAdded, handleNotification }) => {
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user'
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setNewUser(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await axiosInstance.post('/admin/users', newUser)

            if (response.data.success) {
                handleNotification('Usuario creado correctamente', 'success')
                setNewUser({
                    name: '',
                    email: '',
                    password: '',
                    role: 'user'
                })
                onUserAdded()
            } else {
                handleNotification(response.data.message || 'Error al crear el usuario', 'error')
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Error en el servidor'
            handleNotification(errorMsg, 'error')
            console.error('Error al crear usuario:', error)
            
            if (error.response && error.response.status === 401) {
                AuthService.logout()
                window.location.href = '/login'
            }
        }
    }

    return (
        <>
            <h2 className="text-sky-950 text-2xl font-bold mb-2">Añadir Usuario</h2>
            <form onSubmit={handleSubmit} className="space-y-2">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={newUser.name}
                        onChange={handleChange}
                        required
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-800"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={newUser.email}
                        onChange={handleChange}
                        required
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-800"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={newUser.password}
                        onChange={handleChange}
                        required
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-800"
                    />
                </div>
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">Rol</label>
                    <select 
                        id="role"
                        name="role"
                        value={newUser.role}
                        onChange={handleChange}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-800"
                    >
                        <option value="user">Usuario</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>
                <div className="pt-2">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                    >
                        Añadir Usuario
                    </button>
                </div>
            </form>
        </>
    )
}

export default AddUserForm
