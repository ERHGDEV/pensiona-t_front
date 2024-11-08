import { useState } from 'react'
import EditUserForm from './EditUserForm'
import { parseISO, format } from 'date-fns'

const UserList = ({ users, onUserUpdated, handleNotification }) => {
    const [search, setSearch] = useState('')
    const [editingUser, setEditingUser] = useState(null)

    const filteredUsers = users.filter((user) => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    )

    const handleEditClick = (user) => setEditingUser(user)
    const handleEditClose = () => setEditingUser(null)

    const formatDate = (dateString) => format(parseISO(dateString), 'dd/MM/yyyy')

    return (
        <div className="rounded-lg">
            <h2 className="text-2xl text-gray-100 font-bold mb-4">Usuarios</h2>
            <input
                type="text"
                placeholder="Buscar"
                className="w-full p-2 mb-4 border border-gray-300 rounded text-gray-800 focus:outline-none focus:border-sky-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-100">
                    <thead>
                        <tr className="bg-sky-900 text-gray-100 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Nombre</th>
                            <th className="py-3 px-6 text-left">Email</th>
                            <th className="py-3 px-6 text-left">Role</th>
                            <th className="py-3 px-6 text-left">Vigencia</th>
                            <th className="py-3 px-6 text-left">Estatus</th>
                            <th className="py-3 px-6 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-sky-950 text-sm font-light">
                        {filteredUsers.map((user) => (
                            <tr key={user.email} className="border-b border-gray-500 hover:bg-gray-300">
                                <td className="py-3 px-6 text-left whitespace-nowrap">{user.name}</td>
                                <td className="py-3 px-6 text-left whitespace-nowrap">{user.email}</td>
                                <td className="py-3 px-6 text-left">{user.role}</td>
                                <td className="py-3 px-6 text-left whitespace-nowrap">{formatDate(user.expiration)}</td>
                                <td className="py-3 px-6 text-left">{user.status}</td>
                                <td className="py-3 px-6 text-left whitespace-nowrap">
                                    <button
                                        onClick={() => handleEditClick(user)}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        aria-label={`Editar usuario ${user.email}`}
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
                    onClose={handleEditClose}
                    onUserUpdated={onUserUpdated}
                    handleNotification={handleNotification}
                />
            )}
        </div>
    )
}

export default UserList
