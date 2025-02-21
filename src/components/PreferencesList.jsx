import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { statusNormalize } from '../utils/statusPaymentNormalize'

const PreferencesList = ({ preferences }) => {
    const [search, setSearch] = useState('')
    const [sortConfig, setSortConfig] = useState({ key: 'date_created', direction: 'desc' })
    const [statusFilter, setStatusFilter] = useState('')

    const formatDate = (dateString) => format(parseISO(dateString), 'dd/MM/yy')

    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }))
    }

    const approvedCount = preferences.filter(pref => statusNormalize(pref.status) === 'Aprobado').length
    const pendingCount = preferences.filter(pref => statusNormalize(pref.status) === 'Pendiente').length

    const filteredPreferences = preferences?.filter((pref) => {
        const normalizedStatus = statusNormalize(pref.status)
        return (
            (pref.email.toLowerCase().includes(search.toLowerCase()) ||
            pref.total_amount.toString().includes(search.toLowerCase())) &&
            (statusFilter ? normalizedStatus === statusFilter : true)
        )
    }) || []

    const sortedPreferences = [...filteredPreferences].sort((a, b) => {
        if (!sortConfig.key) return 0

        const aValue = sortConfig.key === 'date_created' ? new Date(a[sortConfig.key]) : a[sortConfig.key]
        const bValue = sortConfig.key === 'date_created' ? new Date(b[sortConfig.key]) : b[sortConfig.key]

        return (aValue < bValue ? -1 : 1) * (sortConfig.direction === 'asc' ? 1 : -1)
    })

    return (
        <div className="bg-gray-50 rounded shadow-md p-4 mt-4">
            <h2 className="text-2xl text-sky-950 font-bold mb-4">Lista de Preferencias</h2>
            <input
                type="text"
                placeholder="Buscar"
                className="w-full p-2 border rounded border-gray-300 text-gray-800 focus:outline-none focus:border-sky-500 mb-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex space-x-2 mb-2">
                <button
                    className={`px-4 py-2 rounded ${statusFilter === '' ? 'bg-sky-700 text-white font-semibold' : 'bg-gray-300 text-gray-800'}`}
                    onClick={() => setStatusFilter('')}
                >
                    Todos
                </button>
                <button
                    className={`px-4 py-2 rounded ${statusFilter === 'Aprobado' ? 'bg-sky-700 text-white font-semibold' : 'bg-gray-300 text-gray-800'}`}
                    onClick={() => setStatusFilter('Aprobado')}
                >
                    Aprobado ({approvedCount})
                </button>
                <button
                    className={`px-4 py-2 rounded ${statusFilter === 'Pendiente' ? 'bg-sky-700 text-white font-semibold' : 'bg-gray-300 text-gray-800'}`}
                    onClick={() => setStatusFilter('Pendiente')}
                >
                    Pendiente ({pendingCount})
                </button>
            </div>
            <div className="max-h-80 h-80 overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-sky-700 text-gray-100 uppercase text-sm leading-normal sticky top-0">
                        <tr>
                            <th className="py-3 px-4 text-left" style={{ width: '40%' }}>Email</th>
                            <th className="py-3 px-4 text-left cursor-pointer" style={{ width: '20%' }} onClick={() => handleSort('total_amount')}>Monto Total</th>
                            <th className="py-3 px-4 text-left cursor-pointer" style={{ width: '20%' }} onClick={() => handleSort('date_created')}>Fecha Creación</th>
                            <th className="py-3 px-4 text-left cursor-pointer" style={{ width: '20%' }} onClick={() => handleSort('status')}>Estado</th>
                            <th className='py-3 px-4 text-left' style={{ width: '10%' }}>Preference ID</th>
                        </tr>
                    </thead>
                    <tbody className="text-sky-950 text-sm font-light">
                        {sortedPreferences.map((pref) => (
                            <tr key={pref.id} className="border-b border-gray-500 hover:bg-gray-300">
                                <td className="py-3 px-4 text-left whitespace-nowrap">{pref.email}</td>
                                <td className="py-3 px-4 text-left whitespace-nowrap">${pref.total_amount}</td>
                                <td className="py-3 px-4 text-left whitespace-nowrap">{formatDate(pref.date_created)}</td>
                                <td className="py-3 px-4 text-left whitespace-nowrap">{statusNormalize(pref.status)}</td>
                                <td className="py-3 px-4 text-left whitespace-nowrap">{pref.id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default PreferencesList
