import React, { useState, useEffect } from 'react'

const PensionCalculatorForm = ({ formData, errors, handleInputChange, handleSubmit, UMA }) => {
  const [includeModalidad40, setIncludeModalidad40] = useState(false)
  const [salarioModalidad40, setSalarioModalidad40] = useState('')
  const [anosModalidad40, setAnosModalidad40] = useState('1')
  const [modalidad40Errors, setModalidad40Errors] = useState({})

  useEffect(() => {
    if (!includeModalidad40) {
      setSalarioModalidad40('')
      setAnosModalidad40('1')
      setModalidad40Errors({})
    }
  }, [includeModalidad40])

  const handleModalidad40Change = (e) => {
    const { name, value } = e.target
    if (name === 'includeModalidad40') {
      setIncludeModalidad40(e.target.checked)
    } else if (name === 'salarioModalidad40') {
      setSalarioModalidad40(value)
      validateSalarioModalidad40(value)
    } else if (name === 'anosModalidad40') {
      setAnosModalidad40(value)
    }
  }

  const validateSalarioModalidad40 = (value) => {
    const salarioModalidad40 = parseFloat(value)
    const salarioPromedio = parseFloat(formData.salarioPromedio)
    const maxSalario = 25 * UMA * 30

    if (salarioModalidad40 < salarioPromedio) {
      setModalidad40Errors(prev => ({ ...prev, salarioModalidad40: 'El salario debe ser mayor o igual al último salario.' }))
    } else if (salarioModalidad40 > maxSalario) {
      setModalidad40Errors(prev => ({ ...prev, salarioModalidad40: `El salario de Mod 40 no puede ser mayor a ${maxSalario.toFixed(2)}` }))
    } else {
      setModalidad40Errors(prev => ({ ...prev, salarioModalidad40: '' }))
    }
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (includeModalidad40 && !salarioModalidad40) {
      setModalidad40Errors(prev => ({ ...prev, salarioModalidad40: 'Este campo es requerido' }))
      return
    }
    handleSubmit(e, { includeModalidad40, salarioModalidad40, anosModalidad40 })
  }

  return (
    <form onSubmit={handleFormSubmit} className="max-w-md mx-auto pt-6 pb-8 mb-4">
      <div className="relative z-0 w-full mb-5 group">
        <input
          type="number"
          name="salarioPromedio"
          id="salarioPromedio"
          className="block py-2.5 px-0 w-full text-md bg-transparent border-0 border-b-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-gray-100 peer" 
          placeholder=" " 
          required 
          value={formData.salarioPromedio}
          onChange={handleInputChange}
        />
        <label 
          className="absolute text-md text-gray-400 duration-300 transform -translate-y-6 scale-90 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6"
        >
          Salario promedio
        </label>
        {errors.salarioPromedio && <p className="text-red-400 text-xs italic mt-1 h-1">{errors.salarioPromedio}</p>}
      </div>
      <div className="relative z-0 w-full mb-5 group">
        <input
          type="number"
          name="semanasCotizadas"
          id="semanasCotizadas"
          className="block py-2.5 px-0 w-full text-md bg-transparent border-0 border-b-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-gray-100 peer" 
          placeholder=" " 
          required 
          value={formData.semanasCotizadas}
          onChange={handleInputChange}
        />
        <label 
          className="absolute text-md text-gray-400 duration-300 transform -translate-y-6 scale-90 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6"
        >
          Semanas cotizadas
        </label>
        {errors.semanasCotizadas && <p className="text-red-400 text-xs italic mt-1 h-1">{errors.semanasCotizadas}</p>}
      </div>
      <div className="relative z-0 w-full mb-5 group">
        <input
          type="number"
          name="edad"
          id="edad"
          className="block py-2.5 px-0 w-full text-md bg-transparent border-0 border-b-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-gray-100 peer" 
          placeholder=" " 
          required 
          value={formData.edad}
          onChange={handleInputChange}
        />
        <label 
          className="absolute text-md text-gray-400 duration-300 transform -translate-y-6 scale-90 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6"
        >
          Edad
        </label>
        {errors.edad && <p className="text-red-400 text-xs italic mt-1 h-1">{errors.edad}</p>}
      </div>
      <div className="relative z-0 w-full mb-5 group">
        <select
          name="estadoCivil"
          id="estadoCivil"
          className="block py-2.5 px-0 w-full text-md bg-transparent border-0 border-b-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-gray-100 peer" 
          placeholder=" " 
          required 
          value={formData.estadoCivil}
          onChange={handleInputChange}
        >
          <option className="text-sky-950" value="soltero">Soltero</option>
          <option className="text-sky-950" value="casado">Casado</option>
        </select>
        <label 
          className="absolute text-md text-gray-400 duration-300 transform -translate-y-6 scale-90 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6"
        >
          Estado civil
        </label>
        {errors.estadoCivil && <p className="text-red-400 text-xs italic mt-1 h-1">{errors.estadoCivil}</p>}
      </div>
      <div className="relative z-0 w-full mb-5 group">
        <select
          name="hijos"
          id="hijos"
          className="block py-2.5 px-0 w-full text-md bg-transparent border-0 border-b-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-gray-100 peer" 
          placeholder=" " 
          required 
          value={formData.hijos}
          onChange={handleInputChange}
        >
          <option className="text-sky-950" value="No">No</option>
          <option className="text-sky-950" value="1">1</option>
          <option className="text-sky-950" value="2">2</option>
        </select>
        <label 
          className="absolute text-md text-gray-400 duration-300 transform -translate-y-6 scale-90 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6"
        >
          Hijos
        </label>
      </div>
      <div className="relative z-0 w-full mb-5 group">
        <input
          type="checkbox"
          name="includeModalidad40"
          id="includeModalidad40"
          className="mr-2"
          checked={includeModalidad40}
          onChange={handleModalidad40Change}
        />
        <label htmlFor="includeModalidad40" className="text-md text-gray-400">
          Incluir Modalidad 40
        </label>
      </div>
      {includeModalidad40 && (
        <>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="number"
              name="salarioModalidad40"
              id="salarioModalidad40"
              className="block py-2.5 px-0 w-full text-md bg-transparent border-0 border-b-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-gray-100 peer" 
              placeholder=" " 
              required 
              value={salarioModalidad40}
              onChange={handleModalidad40Change}
            />
            <label 
              className="absolute text-md text-gray-400 duration-300 transform -translate-y-6 scale-90 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6"
            >
              Salario Modalidad 40
            </label>
            {modalidad40Errors.salarioModalidad40 && <p className="text-red-400 text-xs italic mt-1 h-1">{modalidad40Errors.salarioModalidad40}</p>}
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <select
              name="anosModalidad40"
              id="anosModalidad40"
              className="block py-2.5 px-0 w-full text-md bg-transparent border-0 border-b-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-gray-100 peer" 
              placeholder=" " 
              required 
              value={anosModalidad40}
              onChange={handleModalidad40Change}
            >
              <option className="text-sky-950" value="1">1 año</option>
              <option className="text-sky-950" value="2">2 años</option>
              <option className="text-sky-950" value="3">3 años</option>
              <option className="text-sky-950" value="4">4 años</option>
              <option className="text-sky-950" value="5">5 años</option>
            </select>
            <label 
              className="absolute text-md text-gray-400 duration-300 transform -translate-y-6 scale-90 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6"
            >
              Años que se pagará
            </label>
          </div>
        </>
      )}
      <div>
        <button
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Calcular
        </button>
      </div>
    </form>
  )
}

export default PensionCalculatorForm