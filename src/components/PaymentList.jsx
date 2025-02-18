import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { statusNormalize } from '../utils/statusPaymentNormalize'

const PaymentList = ({ payments }) => {
    const [search, setSearch] = useState('')
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' })
    const [statusFilter, setStatusFilter] = useState('')

    const formatDate = (dateString) => format(parseISO(dateString), 'dd/MM/yy')

    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
        }))
    }

    const filteredPayments = payments?.filter((payment) => {
        const normalizedStatus = statusNormalize(payment.status)
        return (
            (payment.user.toLowerCase().includes(search.toLowerCase()) ||
            payment.email.toLowerCase().includes(search.toLowerCase()) ||
            payment.amount.toString().includes(search.toLowerCase())) &&
            (statusFilter ? normalizedStatus === statusFilter : true)
        )
    }) || []

    const sortedPayments = [...filteredPayments].sort((a, b) => {
        if (!sortConfig.key) return 0

        const aValue = sortConfig.key === 'date' ? new Date(a[sortConfig.key]) : a[sortConfig.key]
        const bValue = sortConfig.key === 'date' ? new Date(b[sortConfig.key]) : b[sortConfig.key]

        return (aValue < bValue ? -1 : 1) * (sortConfig.direction === 'asc' ? 1 : -1)
    })

    return (
        <div className="bg-gray-50 rounded shadow-md p-4 mt-8">
            <h2 className="text-2xl text-sky-950 font-bold mb-4">Pagos Realizados</h2>
            <input
                type="text"
                placeholder="Buscar"
                className="w-full p-2 border rounded border-gray-300 text-gray-800 focus:outline-none focus:border-sky-500 mb-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex space-x-2 mb-2">
                {['Todos', 'Aprobado', 'Rechazado'].map((status) => (
                    <button
                        key={status}
                        className={`px-4 py-2 rounded ${statusFilter === status || (status === 'Todos' && statusFilter === '') ? 'bg-sky-700 text-white font-semibold' : 'bg-gray-300 text-gray-800'}`}
                        onClick={() => setStatusFilter(status === 'Todos' ? '' : status)}
                    >
                        {status}
                    </button>
                ))}
            </div>
            <div className="max-h-80 h-80 overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-sky-700 text-gray-100 uppercase text-sm leading-normal">
                        <tr>
                            <th className="py-3 px-4 text-left" style={{ width: '30%' }}>Usuario</th>
                            <th className="py-3 px-4 text-left" style={{ width: '30%' }}>Email</th>
                            <th className="py-3 px-4 text-left cursor-pointer" style={{ width: '10%' }} onClick={() => handleSort('amount')}>Monto</th>
                            <th className="py-3 px-4 text-left cursor-pointer" style={{ width: '10%' }} onClick={() => handleSort('date')}>Fecha</th>
                            <th className="py-3 px-4 text-left cursor-pointer" style={{ width: '10%' }} onClick={() => handleSort('status')}>Estado</th>
                            <th className="py-3 px-4 text-left cursor-pointer" style={{ width: '10%' }} onClick={() => handleSort('external_reference')}>Referencia</th>
                        </tr>
                    </thead>
                    <tbody className="text-sky-950 text-sm font-light">
                        {sortedPayments.map((payment) => (
                            <tr key={payment.id} className="border-b border-gray-500 hover:bg-gray-300">
                                <td className="py-3 px-4 text-left whitespace-nowrap">{payment.user}</td>
                                <td className="py-3 px-4 text-left whitespace-nowrap">{payment.email}</td>
                                <td className="py-3 px-4 text-left whitespace-nowrap">${payment.amount}</td>
                                <td className="py-3 px-4 text-left whitespace-nowrap">{formatDate(payment.date)}</td>
                                <td className="py-3 px-4 text-left whitespace-nowrap">{statusNormalize(payment.status)}</td>
                                <td className="py-3 px-4 text-left whitespace-nowrap">{payment.external_reference}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default PaymentList