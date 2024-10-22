import { useState } from "react"
import axios from "axios"

const AddUserForm = ({ onUserAdded }) => {
    const [newUser, setNewUser] = useState({
        firstname: '',
        lastname: '',
        username: '',
        password: '',
        role: 'user'
    })

    const [message, setMessage] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setNewUser(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage('')

        try {
            const token = localStorage.getItem('token')
            const response = await axios.post('http://localhost:5000/api/admin/users', newUser, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (response.data.success) {
                setMessage('Usuario creado correctamente')
                setNewUser({
                    firstname: '',
                    lastname: '',
                    username: '',
                    password: '',
                    role: 'user'
                })
                onUserAdded()
                setTimeout(() => setMessage(''), 2000)
            } else {
                setMessage(response.data.message || 'Error al crear el usuario')
            }
        } catch (error) {
            setMessage('Error en el servidor')
            console.error('Error al crear usuario')
        }
    }

    return (
        <>
            <h2 className="text-2xl font-bold mb-4">Añadir Usuario</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input
                        type="text"
                        id="firstname"
                        name="firstname"
                        value={newUser.firstname}
                        onChange={handleChange}
                        required
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Apellidos</label>
                    <input
                        type="text"
                        id="lastname"
                        name="lastname"
                        value={newUser.lastname}
                        onChange={handleChange}
                        required
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Usuario</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={newUser.username}
                        onChange={handleChange}
                        required
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">Rol</label>
                    <select 
                        id="role"
                        name="role"
                        value={newUser.role}
                        onChange={handleChange}
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option value="user">Usuario</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="bg-indigo-600 text-white rounded-md p-2 w-full"
                >
                    Añadir Usuario
                </button>
            </form>
        </>
    )
}

export default AddUserForm