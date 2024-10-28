import { useState } from "react"
import axios from "axios"

const AddUserForm = ({ onUserAdded, handleNotification }) => {
    const [newUser, setNewUser] = useState({
        firstname: '',
        lastname: '',
        username: '',
        password: '',
        role: 'user',
        secretQuestion: '',
        secretAnswer: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setNewUser(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const token = localStorage.getItem('token')
            const response = await axios.post('https://pensiona-t-back.vercel.app/api/admin/users', newUser, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (response.data.success) {
                handleNotification('Usuario creado correctamente', 'success')
                setNewUser({
                    firstname: '',
                    lastname: '',
                    username: '',
                    password: '',
                    role: 'user',
                    secretQuestion: '',
                    secretAnswer: ''
                })
                onUserAdded()
            } else {
                handleNotification(response.data.message || 'Error al crear el usuario', 'error')
            }
        } catch (error) {
            handleNotification('Error en el servidor', 'error')
            console.error('Error al crear usuario:', error)
        }
    }

    return (
        <>
            <h2 className="text-2xl text-gray-800 font-bold mb-4">Añadir Usuario</h2>
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
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-800"
                    />
                </div>
                <div>
                    <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Apellido</label>
                    <input
                        type="text"
                        id="lastname"
                        name="lastname"
                        value={newUser.lastname}
                        onChange={handleChange}
                        required
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-800"
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
                <div>
                    <label htmlFor="secretQuestion" className="block text-sm font-medium text-gray-700">Pregunta Secreta</label>
                    <select
                        id="secretQuestion"
                        name="secretQuestion"
                        value={newUser.secretQuestion}
                        onChange={handleChange}
                        required
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-800"
                    >
                        <option value="">Selecciona una pregunta</option>
                        <option value="¿Cuál es el nombre de tu primera mascota?">¿Cuál es el nombre de tu primera mascota?</option>
                        <option value="¿En qué ciudad naciste?">¿En qué ciudad naciste?</option>
                        <option value="¿Cuál es el nombre de tu mejor amigo de la infancia?">¿Cuál es el nombre de tu mejor amigo de la infancia?</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="secretAnswer" className="block text-sm font-medium text-gray-700">Respuesta Secreta</label>
                    <input
                        type="text"
                        id="secretAnswer"
                        name="secretAnswer"
                        value={newUser.secretAnswer}
                        onChange={handleChange}
                        required
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-800"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                >
                    Añadir Usuario
                </button>
            </form>
        </>
    )
}

export default AddUserForm