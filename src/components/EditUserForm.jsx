import { useState } from "react"
import axios from "axios"
import { parseISO, format, set } from 'date-fns'

const EditUserForm = ({ user, onClose, onUserUpdated }) => {
    const [editedUser, setEditedUser] = useState({
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        expiration: format(parseISO(user.expiration),'yyyy-MM-dd'),
        role: user.role,
        status: user.status
    })

    const [message, setMessage] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setEditedUser(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage('')

        try {
            const token = localStorage.getItem('token')
            const localDate = parseISO(editedUser.expiration)
            const utcDate = set(localDate, localDate.getTimezoneOffset())

            const response = await axios.put(`http://localhost:5000/api/admin/users/${user._id}`, 
                {
                    ...editedUser,
                    expiration: utcDate.toISOString()
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )

            if (response.data.success) {
                setMessage('Usuario actualizado correctamente')
                onUserUpdated()
                setTimeout(() => onClose(), 2000)
            } else {
                setMessage(response.data.message || 'Error al actualizar el usuario')
            } 
        } catch (error) {
            setMessage('Error en el servidor')
            console.error('Error al actualizar usuario')
        }
    }

    const handleDelete = async () => {
        if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return

        try {
            const token = localStorage.getItem('token')
            const response = await axios.delete(`http://localhost:5000/api/admin/users/${user._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (response.data.success) {
                setMessage('Usuario eliminado correctamente')
                onUserUpdated()
                setTimeout(() => onClose(), 2000)
            } else {
                setMessage(response.data.message || 'Error al eliminar el usuario')
            }
        } catch (error) {
            setMessage('Error en el servidor')
            console.error('Error al eliminar usuario')
        }
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="bg-gray-100 p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-gray-800 text-2xl font-bold mb-4">Editar Usuario</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input
                        type="text"
                        id="firstname"
                        name="firstname"
                        value={editedUser.firstname}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                        />
                    </div>

                    <div>
                        <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Apellido</label>
                        <input
                        type="text"
                        id="lastname"
                        name="lastname"
                        value={editedUser.lastname}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                        />
                    </div>

                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                        <input
                        type="text"
                        id="username"
                        name="username"
                        value={editedUser.username}
                        onChange={handleChange}
                        disabled
                        className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                        />
                    </div>

                    <div>
                        <label htmlFor="expiration" className="block text-sm font-medium text-gray-700">Fecha Término Vigencia</label>
                        <input
                        type="date"
                        id="expiration"
                        name="expiration"
                        value={editedUser.expiration}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                        />
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                        <select
                        id="role"
                        name="role"
                        value={editedUser.role}
                        onChange={handleChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md text-gray-800"
                        >
                        <option value="user">Usuario</option>
                        <option value="admin">Administrador</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Estatus</label>
                        <select
                        id="status"
                        name="status"
                        value={editedUser.status}
                        onChange={handleChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md text-gray-800"
                        >
                        <option value="active">Activo</option>
                        <option value="inactive">Inactivo</option>
                        </select>
                    </div>

                <div className="flex justify-between">
                    <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                    Guardar
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Eliminar
                    </button>

                    <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                    Cancelar
                    </button>
                </div>
                </form>
            </div>
        </div>
    )
}

export default EditUserForm