import { useState } from 'react'
import { parseISO, format } from 'date-fns'
import UserForm from './UserForm'
import AdminButton from './AdminButton'

const UserList = ({ users, onUserUpdated, onUserAdded, handleNotification }) => {
    const [search, setSearch] = useState('')
    const [selectedUser, setSelectedUser] = useState(null)
    const [isFormOpen, setIsFormOpen] = useState(false)

    const filteredUsers = users.filter((user) => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    )

    const handleEditClick = (user) => {
        setSelectedUser(user)
        setIsFormOpen(true)
    }

    const handleAddClick = () => {
        setSelectedUser(null)
        setIsFormOpen(true)
    }

    const handleFormClose = () => {
        setSelectedUser(null)
        setIsFormOpen(false)
    }

    const formatDate = (dateString) => format(parseISO(dateString), 'dd/MM/yyyy')


    return (
        <div className="bg-gray-50 rounded shadow-md p-4 mt-8">
            <div className="flex justify-between items-end mb-4">
                <h2 className="text-2xl text-sky-950 font-bold w-full">
                    Usuarios<span className="ml-2 text-sm text-gray-500"> ({filteredUsers.length})</span>
                </h2>
                <AdminButton
                    onClick={handleAddClick}
                    variant="primary"
                >
                    Agregar
                </AdminButton>
            </div>
            <div className="relative w-full mb-4">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  
                        stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  
                        className="text-sky-600 icon icon-tabler icons-tabler-outline icon-tabler-search">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                        <path d="M21 21l-6 -6" />
                    </svg>
                </span>
                <input
                    type="text"
                    placeholder="Buscar"
                    className="w-full pl-10 p-2 border rounded border-gray-300 text-gray-800 focus:outline-none focus:border-sky-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="max-h-96 overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-sky-700 text-gray-100 uppercase text-sm leading-normal sticky top-0">
                        <tr>
                            <th className="py-3 px-6 text-left" style={{ width: "40%" }}>Nombre</th>
                            <th className="py-3 px-6 text-left" style={{ width: "35%" }}>Email</th>
                            <th className="py-3 px-6 text-left" style={{ width: "5%" }}>Role</th>
                            <th className="py-3 px-6 text-left" style={{ width: "5%" }}>Creado</th>
                            <th className="py-3 px-6 text-left" style={{ width: "5%" }}>Vigencia</th>
                            <th className="py-3 px-6 text-left" style={{ width: "5%" }}>Estatus</th>
                            <th className="py-3 px-6 text-left" style={{ width: "5%" }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-sky-950 text-sm font-light">
                        {filteredUsers.map((user) => (
                            <tr key={user.email} className="border-b border-gray-500 hover:bg-gray-300">
                                <td className="py-3 px-6 text-left whitespace-nowrap">{user.name}</td>
                                <td className="py-3 px-6 text-left whitespace-nowrap">{user.email}</td>
                                <td className="py-3 px-6 text-left">{user.role}</td>
                                <td className="py-3 px-6 text-left whitespace-nowrap">{formatDate(user.created)}</td>
                                <td className="py-3 px-6 text-left whitespace-nowrap">{formatDate(user.expiration)}</td>
                                <td className="py-3 px-6 text-center">
                                    {user.verified ? '✅' : ''}
                                </td>
                                <td className="py-3 px-6 text-left whitespace-nowrap">
                                    <AdminButton
                                        onClick={() => handleEditClick(user)}
                                        variant="secondary"
                                    >
                                        Editar
                                    </AdminButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isFormOpen && (
                <UserForm
                    user={selectedUser}
                    onClose={handleFormClose}
                    onUserAdded={onUserAdded}
                    onUserUpdated={onUserUpdated}
                    handleNotification={handleNotification}
                />
            )}
        </div>
    )
}

export default UserList