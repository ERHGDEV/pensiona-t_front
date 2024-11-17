import Button from "./Button"

const PensionResults = ({ results, onBack, onGeneratePDF }) => {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-center text-gray-700">
            <thead className="text-xs uppercase bg-sky-800 text-white">
              <tr>
                <th className="px-6 py-3">Edad</th>
                <th className="px-6 py-3">%</th>
                <th className="px-6 py-3">Pensión</th>
                {results.pensionModalidad40 && (
                  <>
                    <th className="px-6 py-3 bg-sky-900 whitespace-nowrap">Con Mod40</th>
                    <th className="px-6 py-3">Diferencia</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {results && results.pensionPorEdad.map((result, index) => (
                <tr 
                  key={index} 
                  className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors duration-200`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">{result.edad} años</td>
                  <td className="px-6 py-4 whitespace-nowrap">{result.porcentaje}%</td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">${result.pension.toFixed(2)}</td>
                  {results.pensionModalidad40 && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-sky-800">
                        ${results.pensionModalidad40[index].pension.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-green-600">
                        +${(results.pensionModalidad40[index].pension - result.pension).toFixed(2)}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-8 max-w-sm mx-auto flex justify-center space-x-4">
        <Button onClick={onGeneratePDF} order="primary">
          Generar PDF
        </Button>
        <Button onClick={onBack}>
          Regresar
        </Button>
      </div>
    </div>
  )
}

export default PensionResults