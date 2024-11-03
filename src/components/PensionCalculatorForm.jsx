const PensionCalculatorForm = ({ formData, errors, handleInputChange, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto pt-6 pb-8 mb-4">
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
          className="absolute text-md text-gray-400 duration-300 transform -translate-y-6 scale-90 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/2 rtl:peer-focus:left-auto peer-focus:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6"
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
          className="absolute text-md text-gray-400 duration-300 transform -translate-y-6 scale-90 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/2 rtl:peer-focus:left-auto peer-focus:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6"
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
          className="absolute text-md text-gray-400 duration-300 transform -translate-y-6 scale-90 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/2 rtl:peer-focus:left-auto peer-focus:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6"
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
          className="absolute text-md text-gray-400 duration-300 transform -translate-y-6 scale-90 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/2 rtl:peer-focus:left-auto peer-focus:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6"
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
          className="absolute text-md text-gray-400 duration-300 transform -translate-y-6 scale-90 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/2 rtl:peer-focus:left-auto peer-focus:text-gray-100 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-6"
        >
          Hijos
        </label>
      </div>
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