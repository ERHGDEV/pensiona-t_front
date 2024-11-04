import React from 'react'

const PensionResults = ({ results, onBack, onGeneratePDF }) => {
  return (
    <>
      <div className="max-w-lg mx-auto overflow-x-auto text-gray-100 pt-6 pb-8 mb-4">
      <table className="w-full">
        <thead>
          <tr>
            <th className="px-4 py-2 text-center">Edad</th>
            <th className="px-4 py-2 text-center">%</th>
            <th className="px-4 py-2 text-center">Pensión</th>
            {results.pensionModalidad40 && (
              <>
                <th className="px-4 py-2 text-center bg-sky-800 rounded-t-md">Con Mod40</th>
                <th className="px-4 py-2 text-center">Diferencia</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {results && results.pensionPorEdad.map((result, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-sky-900' : ''}>
              <td className="border px-4 py-2 text-center whitespace-nowrap">{result.edad} años</td>
              <td className="border px-4 py-2 text-center whitespace-nowrap">{result.porcentaje}%</td>
              <td className="border px-4 py-2 text-center font-bold  whitespace-nowrap">${result.pension.toFixed(2)}</td>
              {results.pensionModalidad40 && (
                <>
                  <td className="border px-4 py-2 text-center font-bold whitespace-nowrap bg-sky-800 text-gray-100">
                    ${results.pensionModalidad40[index].pension.toFixed(2)}
                  </td>
                  <td className="border px-4 py-2 text-center whitespace-nowrap">
                    ${(results.pensionModalidad40[index].pension - result.pension).toFixed(2)}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="flex justify-between max-w-lg mx-auto">
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
    </>
  )
}

export default PensionResults