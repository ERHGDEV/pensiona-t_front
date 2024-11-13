import React, { useState, useEffect } from 'react'
import axiosInstance from '../services/axiosConfig'

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
        <div className="bg-gray-50 p-4 mt-8 rounded shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-sky-950">Parámetros de calculadora</h2>
                <div>
                    {!isEditing ? (
                        <button
                            onClick={handleEdit}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
                        >
                            Editar
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors mr-2"
                            >
                                Guardar
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors"
                            >
                                Cancelar
                            </button>
                        </>
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