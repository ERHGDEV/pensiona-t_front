const PensionResults = ({ results, onBack, onGeneratePDF }) => {
  return (
    <div className="max-w-md mx-auto text-gray-100 pt-6 pb-8 mb-4">
      <table className="w-full mb-4">
        <thead>
          <tr>
            <th className="px-4 py-2 text-center" style={{ width: '35%' }}>Edad</th>
            <th className="px-4 py-2 text-center" style={{ width: '20%' }}>%</th>
            <th className="px-4 py-2 text-center" style={{ width: '45%' }}>Pensión</th>
          </tr>
        </thead>
        <tbody>
          {results && results.pensionPorEdad.map((result, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-sky-900' : ''}>
              <td className="border px-4 py-2 text-center whitespace-nowrap">{result.edad} años</td>
              <td className="border px-4 py-2 text-center whitespace-nowrap">{result.porcentaje}%</td>
              <td className="border px-4 py-2 text-center font-bold whitespace-nowrap">${result.pension.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={onBack}
        >
          Volver
        </button>
        <button
          onClick={onGeneratePDF}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Generar PDF
        </button>
      </div>
    </div>
  )
}

export default PensionResults