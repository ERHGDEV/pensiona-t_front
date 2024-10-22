import { useState } from 'react'
import EditUserForm from './EditUserForm'
import axios from 'axios'
import { parseISO, format } from 'date-fns'

const UserList = ({ users, onUserUpdated }) => {
    const [search, setSearch] = useState('')
    const [editingUser, setEditingUser] = useState(null)

    const filteredUsers = users.filter(user => 
        user.firstname.toLowerCase().includes(search.toLowerCase()) ||
        user.lastname.toLowerCase().includes(search.toLowerCase()) ||
        user.username.toLowerCase().includes(search.toLowerCase())
    )

    const handleEditClick = (user) => {
        setEditingUser(user)
    }

    const handleEditclose = () => {
        setEditingUser(null)
    }

    const handleLogoutUser = async (userId) => {
        try {
            const token = localStorage.getItem('token')
            const response = await axios.post(`http://localhost:5000/api/admin/users/logout/${userId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (response.data.success) {
                onUserUpdated()
            } else {
                console.error('Error al cerrar sesión del usuario', response.data.message)
            }
        } catch (error) {
            console.error('Error al cerrar sesión del usuario', error)
        }
    }

    const formatDate = (dateString) => {
        const date = parseISO(dateString)
        return format(date, 'dd/MM/yyyy')
    }

    return (
        <div className="rounded-lg shadow-md">
            <h2 className="text-2xl text-gray-100 font-bold mb-4">Usuarios</h2>
            <input
                type="text"
                placeholder="Buscar"
                className="w-full p-2 mb-4 border rounded text-gray-800"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className="overflow-x-auto">
                <table className="min-w-full">
                <thead>
                    <tr className="bg-gray-300 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left" style={{ width: '20%' }}>Nombre</th>
                    <th className="py-3 px-6 text-left" style={{ width: '20%' }}>Apellido</th>                    
                    <th className="py-3 px-6 text-left" style={{ width: '25%' }}>Username</th>
                    <th className="py-3 px-6 text-left" style={{ width: '5%' }}>Role</th>
                    <th className="py-3 px-6 text-left" style={{ width: '10%' }}>Logged In</th>
                    <th className="py-3 px-6 text-left" style={{ width: '10%' }}>Vigencia</th>
                    <th className="py-3 px-6 text-left" style={{ width: '5%' }}>Estatus</th>
                    <th className="py-3 px-6 text-left" style={{ width: '5%' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light bg-gray-100">
                    {filteredUsers.map((user) => (
                    <tr key={user.username} className="border-b border-gray-200 hover:bg-gray-100">
                        <td className="py-3 px-6 text-left whitespace-nowrap">{user.firstname}</td>
                        <td className="py-3 px-6 text-left whitespace-nowrap">{user.lastname}</td>
                        <td className="py-3 px-6 text-left whitespace-nowrap">{user.username}</td>
                        <td className="py-3 px-6 text-left">{user.role}</td>
                        <td className="py-3 px-6 text-left whitespace-nowrap">
                        {user.isLoggedIn ? (
                            <button
                            onClick={() => handleLogoutUser(user._id)}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                            >
                            Cerrar sesión
                            </button>
                        ) : 'No'}
                        </td>
                        <td className="py-3 px-6 text-left whitespace-nowrap">{formatDate(user.expiration)}</td>
                        <td className="py-3 px-6 text-left">{user.status}</td>
                        <td className="py-3 px-6 text-left">
                        <button
                            onClick={() => handleEditClick(user)}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Editar
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            {editingUser && (
                <EditUserForm
                user={editingUser}
                onClose={handleEditclose}
                onUserUpdated={onUserUpdated}
                />
            )}
            </div> 
    )
}

export default UserList