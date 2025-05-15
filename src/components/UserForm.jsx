import { useState, useEffect } from "react"
import { parseISO, format, set } from 'date-fns'
import axiosInstance from "../services/axiosConfig"
import AuthService from "../services/authService"
import AdminButton from "./AdminButton"

const UserForm = ({ user, onClose, onUserAdded, onUserUpdated, handleNotification }) => {
    const isEditing = !!user
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        expiration: format(new Date(), 'yyyy-MM-dd'),
        role: 'user',
        status: 'active',
        subscription: 'free'
    })

    useEffect(() => {
        if (isEditing) {
            setFormData({
                name: user.name,
                email: user.email,
                expiration: format(parseISO(user.expiration), 'yyyy-MM-dd'),
                role: user.role,
                status: user.status,
                subscription: user.subscription
            })
        }
    }, [user])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            let response
            if (isEditing) {
                const localDate = parseISO(formData.expiration)
                const utcDate = set(localDate, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 })
                response = await axiosInstance.put(`/admin/users/${user._id}`, 
                    {
                        ...formData,
                        expiration: utcDate.toISOString()
                    }
                )
            } else {
                const { name, email, password, role } = formData
                response = await axiosInstance.post('/admin/users', { name, email, password, role })
            }
            if (response.data.success) {
                handleNotification(`Usuario ${isEditing ? 'actualizado' : 'creado'} correctamente`, 'success')
                if (isEditing) {
                    onUserUpdated()
                } else {
                    onUserAdded()
                }
                onClose()
            } else {
                handleNotification(response.data.message || `Error al ${isEditing ? 'actualizar' : 'crear'} el usuario`, 'error')
            }
        } catch (error) {
            console.error(`Error al ${isEditing ? 'actualizar' : 'crear'} usuario:`, error)
            if (error.response) {
                console.error('Response data:', error.response.data)
                console.error('Response status:', error.response.status)
                console.error('Response headers:', error.response.headers)
            }
            handleNotification(error.response?.data?.message || 'Error en el servidor', 'error')

            if (error.response && error.response.status === 401) {
                AuthService.logout()
                window.location.href = '/login'
            }
        }
    }

    const handleDelete = async () => {
        if (!isEditing) return
        if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return

        try {
            const response = await axiosInstance.delete(`/admin/users/${user._id}`)

            if (response.data.success) {
                handleNotification('Usuario eliminado correctamente', 'success')
                onUserUpdated()
                onClose()
            } else {
                handleNotification(response.data.message || 'Error al eliminar el usuario', 'error')
            }
        } catch (error) {
            handleNotification('Error en el servidor', 'error')
            console.error('Error al eliminar usuario:', error)

            if (error.response && error.response.status === 401) {
                AuthService.logout()
                window.location.href = '/login'
            }
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div className="bg-gray-100 p-4 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-sky-950 text-2xl font-bold mb-2">
                    {isEditing ? 'Editar Usuario' : 'Añadir Usuario'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-2">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={isEditing}
                            className={`mt-1 block w-full px-3 py-2 ${isEditing ? 'bg-gray-100' : 'bg-white'} border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800`}
                        />
                    </div>

                    {!isEditing && (
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                            />
                        </div>
                    )}

                    {isEditing && (
                        <div>
                            <label htmlFor="expiration" className="block text-sm font-medium text-gray-700">Fecha Término Vigencia</label>
                            <input
                                type="date"
                                id="expiration"
                                name="expiration"
                                value={formData.expiration}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                            />
                        </div>
                    )}

                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Rol</label>
                        <select 
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md text-gray-800"
                        >
                            <option value="user">Usuario</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>

                    {isEditing && (
                        <div>
                            <label htmlFor="subscription" className="block text-sm font-medium text-gray-700">Plan</label>
                            <select
                                id="subscription"
                                name="subscription"
                                value={formData.subscription}
                                onChange={handleChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md text-gray-800"
                            >
                                <option value="free">Free</option>
                                <option value="pro">Pro</option>
                                <option value="unlimited">Unlimited</option>
                            </select>
                        </div>
                    )}

                    {isEditing && (
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Estatus</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md text-gray-800"
                            >
                                <option value="active">Activo</option>
                                <option value="inactive">Inactivo</option>
                            </select>
                        </div>
                    )}

                    <div className="flex justify-between pt-2">
                        <AdminButton
                            type="submit"
                            variant="primary"
                        >
                            {isEditing ? 'Guardar' : 'Añadir Usuario'}
                        </AdminButton>

                        {isEditing && (
                            <AdminButton
                                onClick={handleDelete}
                                variant="danger"
                            >
                                Eliminar
                            </AdminButton>
                        )}

                        <AdminButton
                            onClick={onClose}
                            variant="secondary"
                        >
                            Cancelar
                        </AdminButton>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserForm