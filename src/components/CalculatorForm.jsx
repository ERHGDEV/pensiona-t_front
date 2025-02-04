import { useState, useEffect } from "react"
import Button from "./Button"
import { MONTHS as months } from '../constants/calculateData'
import { validateInputs } from "../utils/userFormValidation"
import axiosInstance from "../services/axiosConfig"
import Dots from "./Dots"

const CalculatorForm = ({ onCalculatorBack, onCalculate, data, subscription }) => {
    const [formData, setFormData] = useState({
        averageSalary: data?.salarioPromedio || '',
        weeksContributed: data?.totalSemanas || '',
        age: data?.edad || '',
        maritalStatus: 'single',
        children: 'No',
        modalidad40: false, 
        salaryModalidad40: '', 
        yearsModalidad40: '',
        startMonth: (new Date().getMonth() + 1).toString(),
        startYear: new Date().getFullYear().toString()
    })
    const [salarioMinimo, setSalarioMinimo] = useState(0)
    const [uma, setUma] = useState(0)
    const [errors, setErrors] = useState({})
    const [isCalculating, setIsCalculating] = useState(false)

    const currentYear = new Date().getFullYear()
    const yearRange = Array.from({ length: 16 }, (_, i) => currentYear -5 + i)

    useEffect(() => {
        getValues()
    }, [])
    
    const getValues = async () => {
        try {
            const response = await axiosInstance.get("/values")
            if (!response.data.salarioMinimo || !response.data.uma) {
                throw new Error('No se pudieron obtener los valores actualizados de salario mínimo y UMA')
            }
            setSalarioMinimo(response.data.salarioMinimo)
            setUma(response.data.uma)
        } catch (error) {
            console.error('Error:', error)
        }
    }

    const incrementCalculationCount = async () => {
        try {
          await axiosInstance.put('/user/increment-calculos')
        } catch (error) {
          console.error('Error al incrementar el contador:', error)
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        if (name === 'modalidad40') {
            setFormData(prevState => ({
                ...prevState,
                [name]: !formData.modalidad40
            }))
            return
        }
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: ''
        }))
    }

    const handleCalculate = async () => {
        if (!validateInputs(formData, setErrors, salarioMinimo, uma)) return 
            
        setIsCalculating(true)
        setTimeout(() => {
            onCalculate(formData, salarioMinimo)
            incrementCalculationCount()
            setIsCalculating(false)
        }, 3000)    
    }

    return (
        <div>
            <form 
                className="max-w-md mx-auto"
            >
                <div className="relative z-0 w-full mb-5">
                    <input 
                        type="number"
                        name="averageSalary"
                        id="averageSalary"
                        placeholder=" "
                        required
                        className="block py-2.5 px-0 w-full text-md text-gray-500 bg-transparent border-0 border-b-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-sky-800 peer focus:text-sky-800"
                        value={formData.averageSalary}
                        onChange={handleInputChange}
                    />
                    <label
                        className="absolute text-md text-gray-500 duration-300 transform -translate-y-6 scale-90 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-sky-800 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6"
                    >
                        Salario Promedio
                    </label>
                    {errors.averageSalary && <p className="text-red-600 text-xs italic mt-1 h-1">{errors.averageSalary}</p>}
                </div>
                <div className="relative z-0 w-full mb-5">
                    <input
                        type="number"
                        name="weeksContributed"
                        id="weeksContributed"
                        placeholder=" "
                        required
                        className="block py-2.5 px-0 w-full text-md text-gray-500 bg-transparent border-0 border-b-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-sky-800 peer focus:text-sky-800"
                        value={formData.weeksContributed}
                        onChange={handleInputChange}
                    />
                    <label
                        className="absolute text-md text-gray-500 duration-300 transform -translate-y-6 scale-90 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-sky-800 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6"
                    >
                        Semanas Cotizadas
                    </label>
                    {errors.weeksContributed && <p className="text-red-600 text-xs italic mt-1 h-1">{errors.weeksContributed}</p>}
                </div>
                <div className="relative z-0 w-full mb-5">
                    <input
                        type="number"
                        name="age"
                        id="age"
                        placeholder=" "
                        required
                        className="block py-2.5 px-0 w-full text-md text-gray-500 bg-transparent border-0 border-b-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-sky-800 peer focus:text-sky-800"
                        value={formData.age}
                        onChange={handleInputChange}
                    />
                    <label
                        className="absolute text-md text-gray-500 duration-300 transform -translate-y-6 scale-90 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-sky-800 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6"
                    >
                        Edad
                    </label>
                    {errors.age && <p className="text-red-600 text-xs italic mt-1 h-1">{errors.age}</p>}
                </div>
                <div className="relative z-0 w-full mb-5">
                    <select
                        name="maritalStatus"
                        id="maritalStatus"
                        required
                        className="block py-2.5 px-0 w-full text-md text-gray-500 bg-transparent border-0 border-b-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-sky-800 peer focus:text-sky-800"
                        value={formData.maritalStatus}
                        onChange={handleInputChange}
                    >
                        <option value="single">Soltero</option>
                        <option value="married">Casado</option>
                    </select>
                    <label
                        className="absolute text-md text-gray-500 duration-300 transform -translate-y-6 scale-90 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-sky-800 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6"
                    >
                        Estado Civil
                    </label>
                </div>
                <div className="relative z-0 w-full mb-3">
                    <select
                        name="children"
                        id="children"
                        required
                        className="block py-2.5 px-0 w-full text-md text-gray-500 bg-transparent border-0 border-b-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-sky-800 peer focus:text-sky-800"
                        value={formData.children}
                        onChange={handleInputChange}
                    >
                        <option value="No">No</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                    </select>
                    <label
                        className="absolute text-md text-gray-500 duration-300 transform -translate-y-6 scale-90 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-sky-800 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6"
                    >
                        Hijos
                    </label>
                </div>
                <div className="relative z-0 w-full mb-5">
                    <input
                        type="checkbox"
                        name="modalidad40"
                        id="modalidad40"
                        className="mr-2"
                        checked={formData.modalidad40}
                        onChange={handleInputChange}
                    />
                    <label
                        htmlFor="modalidad40"
                        className="text-md text-gray-500"
                    >
                        ¿Calcular modalidad 40?
                    </label>
                </div>
                {formData.modalidad40 && (
                    <>
                        <div className="relative z-0 w-full mb-5" >
                            <input
                                type="number"
                                name="salaryModalidad40"
                                id="salaryModalidad40"
                                placeholder=" "
                                required
                                className="block py-2.5 px-0 w-full text-md text-gray-500 bg-transparent border-0 border-b-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-sky-800 peer focus:text-sky-800"
                                value={formData.salaryModalidad40}
                                onChange={handleInputChange}
                            />
                            <label
                                className="absolute text-md text-gray-500 duration-300 transform -translate-y-6 scale-90 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-sky-800 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6"
                            >
                                Salario Modalidad 40
                            </label>
                            {errors.salaryModalidad40 && <p className="text-red-600 text-xs italic mt-1 h-1">{errors.salaryModalidad40}</p>}
                        </div>
                        <div className="relative z-0 w-full mb-3">
                            <select 
                                name="yearsModalidad40" 
                                id="yearsModalidad40"
                                placeholder=" "
                                required
                                className="block py-2.5 px-0 w-full text-md text-gray-500 bg-transparent border-0 border-b-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-sky-800 peer focus:text-sky-800"
                                value={formData.yearsModalidad40}
                                onChange={handleInputChange}
                            >
                                <option value="1">1 año</option>
                                <option value="2">2 años</option>
                                <option value="3">3 años</option>
                                <option value="4">4 años</option>
                                <option value="5">5 años</option>
                            </select>
                            <label
                                className="absolute text-md text-gray-500 duration-300 transform -translate-y-6 scale-90 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-sky-800 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6"
                            >
                                Años que pagará
                            </label>
                            {errors.yearsModalidad40 && <p className="text-red-600 text-xs italic mt-1 h-1">{errors.yearsModalidad40}</p>}
                        </div>
                        <div className="relative z-0 w-full mb-5">
                            <label className="block text-md text-gray-500">Cuándo se iniciará el pago</label>
                            <div className="flex gap-4">
                                <select 
                                    name="startMonth"
                                    id="startMonth"
                                    required
                                    className="block py-2.5 w-1/2 px-0 text-md text-gray-500 bg-transparent border-0 border-b-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-sky-800 peer focus:text-sky-800"
                                    value={formData.startMonth}
                                    onChange={handleInputChange}
                                >
                                    {months.map((month, index) => (
                                        <option key={index} value={index + 1} >{month}</option>
                                    ))}
                                </select>
                                <select 
                                    name="startYear"
                                    id="startYear"
                                    required
                                    className="block py-2.5 w-1/2 px-0 text-md text-gray-500 bg-transparent border-0 border-b-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-sky-800 peer focus:text-sky-800"
                                    value={formData.startYear}
                                    onChange={handleInputChange}
                                >
                                    {yearRange.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </>
                )}
            </form>
            <div className="mt-4 flex flex-row gap-4 max-w-fit mx-auto">
                {subscription != 'free' && 
                 <Button order="primary" onClick={onCalculatorBack}>
                    Volver
                </Button>}
                <Button onClick={handleCalculate} disabled={isCalculating}>
                    {isCalculating ? (
                        <span>
                            Calculando
                            <Dots />
                        </span>
                    ): (
                        "Calcular"
                    )}
                </Button>
            </div>
        </div>
    )
}

export default CalculatorForm