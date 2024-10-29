import { useState } from 'react';
import EditUserForm from './EditUserForm';
import { parseISO, format } from 'date-fns';
import axiosInstance from '../services/axiosConfig';
import AuthService from '../services/authService';

const UserList = ({ users, onUserUpdated, handleNotification }) => {
    const [search, setSearch] = useState('');
    const [editingUser, setEditingUser] = useState(null);

    const filteredUsers = users.filter((user) => 
        user.firstname.toLowerCase().includes(search.toLowerCase()) ||
        user.lastname.toLowerCase().includes(search.toLowerCase()) ||
        user.username.toLowerCase().includes(search.toLowerCase())
    );

    const handleEditClick = (user) => setEditingUser(user);
    const handleEditClose = () => setEditingUser(null);

    const handleLogoutUser = async (userId) => {
        try {
            const response = await axiosInstance.post(`/admin/users/logout/${userId}`);
            if (response.data.success) {
                onUserUpdated();
                handleNotification('Sesión del usuario cerrada exitosamente', 'success');
            } else {
                handleNotification('Error al cerrar sesión del usuario', 'error');
            }
        } catch (error) {
            console.error('Error al cerrar sesión del usuario', error);
            handleNotification('Error al cerrar sesión del usuario', 'error');
            if (error.response && error.response.status === 401) {
                AuthService.logout();
                window.location.href = '/login';
            }
        }
    };

    const formatDate = (dateString) => format(parseISO(dateString), 'dd/MM/yyyy');

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
                            <th className="py-3 px-6 text-left">Apellido</th>
                            <th className="py-3 px-6 text-left">Username</th>
                            <th className="py-3 px-6 text-left">Role</th>
                            <th className="py-3 px-6 text-left">Logged In</th>
                            <th className="py-3 px-6 text-left">Vigencia</th>
                            <th className="py-3 px-6 text-left">Estatus</th>
                            <th className="py-3 px-6 text-left">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-sky-950 text-sm font-light">
                        {filteredUsers.map((user) => (
                            <tr key={user.username} className="border-b border-gray-500 hover:bg-gray-300">
                                <td className="py-3 px-6 text-left whitespace-nowrap">{user.firstname}</td>
                                <td className="py-3 px-6 text-left whitespace-nowrap">{user.lastname}</td>
                                <td className="py-3 px-6 text-left whitespace-nowrap">{user.username}</td>
                                <td className="py-3 px-6 text-left">{user.role}</td>
                                <td className="py-3 px-6 text-left whitespace-nowrap">
                                    {user.isLoggedIn ? (
                                        <button
                                            onClick={() => handleLogoutUser(user._id)}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                                            aria-label={`Cerrar sesión de ${user.username}`}
                                        >
                                            Cerrar sesión
                                        </button>
                                    ) : 'No'}
                                </td>
                                <td className="py-3 px-6 text-left whitespace-nowrap">{formatDate(user.expiration)}</td>
                                <td className="py-3 px-6 text-left">{user.status}</td>
                                <td className="py-3 px-6 text-left whitespace-nowrap">
                                    <button
                                        onClick={() => handleEditClick(user)}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                        aria-label={`Editar usuario ${user.username}`}
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
    );
};

export default UserList;
