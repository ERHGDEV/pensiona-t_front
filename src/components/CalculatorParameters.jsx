import { useState, useEffect } from 'react'
import axiosInstance from '../services/axiosConfig'
import AdminButton from './AdminButton'

const CalculatorParameters = () => {
    const [salarioMinimo, setSalarioMinimo] = useState('')
    const [uma, setUma] = useState('')
    const [isEditing, setIsEditing] = useState(false)
    const [tempSalarioMinimo, setTempSalarioMinimo] = useState('')
    const [tempUma, setTempUma] = useState('')

    useEffect(() => {
        fetchValues()
    }, [])

    const fetchValues = async () => {
        try {
            const response = await axiosInstance.get('/admin/values')
            setSalarioMinimo(response.data.salarioMinimo)
            setUma(response.data.uma)
            setTempSalarioMinimo(response.data.salarioMinimo)
            setTempUma(response.data.uma)
        } catch (error) {
            console.error('Error fetching values:', error)
        }
    }

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleCancel = () => {
        setIsEditing(false)
        setTempSalarioMinimo(salarioMinimo)
        setTempUma(uma)
    }

    const handleSave = async () => {
        try {
            await axiosInstance.put('/admin/values', {
                salarioMinimo: tempSalarioMinimo,
                uma: tempUma
            })
            setSalarioMinimo(tempSalarioMinimo)
            setUma(tempUma)
            setIsEditing(false)
        } catch (error) {
            console.error('Error updating values:', error)
        }
    }

    return (
        <div className="bg-gray-50 p-4 mt-4 rounded shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-sky-950">Parámetros de calculadora</h2>
                <div>
                    {!isEditing ? (
                        <AdminButton onClick={handleEdit} variant="primary">
                            Editar
                        </AdminButton>
                    ) : (
                        <div className='flex space-x-2'>
                            <AdminButton onClick={handleSave} variant="primary" className="mr-2">
                                Guardar
                            </AdminButton>
                            <AdminButton onClick={handleCancel} variant="secondary">
                                Cancelar
                            </AdminButton>
                        </div>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="currentSalarioMinimo" className="block text-sm font-medium text-sky-900 mb-1">
                        Salario Mínimo
                    </label>
                    <input
                        id="currentSalarioMinimo"
                        type="number"
                        value={isEditing ? tempSalarioMinimo : salarioMinimo}
                        onChange={(e) => setTempSalarioMinimo(e.target.value)}
                        readOnly={!isEditing}
                        className={`w-full px-3 py-2 border rounded-md ${
                            isEditing ? 'border-sky-300 text-sky-900' : 'border-gray-300 bg-gray-100 text-gray-600'
                        } focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-transparent ${
                            !isEditing ? 'cursor-default' : ''
                        }`}
                        tabIndex={isEditing ? 0 : -1}
                    />
                </div>
                <div>
                    <label htmlFor="currentUma" className="block text-sm font-medium text-sky-900 mb-1">
                        UMA
                    </label>
                    <input
                        id="currentUma"
                        type="number"
                        value={isEditing ? tempUma : uma}
                        onChange={(e) => setTempUma(e.target.value)}
                        readOnly={!isEditing}
                        className={`w-full px-3 py-2 border rounded-md ${
                            isEditing ? 'border-sky-300 text-sky-900' : 'border-gray-300 bg-gray-100 text-gray-600'
                        } focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-transparent ${
                            !isEditing ? 'cursor-default' : ''
                        }`}
                        tabIndex={isEditing ? 0 : -1}
                    />
                </div>
            </div>
        </div>
    )
}

export default CalculatorParameters