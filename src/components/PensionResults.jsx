import Button from "./Button"

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
      <div className="mt-4 flex flex-col sm:flex-row gap-4 max-w-fit mx-auto">
        <Button onClick={onGeneratePDF} order="primary" children="Generar PDF" />
        <Button onClick={onBack} children="Regresar" />
      </div>
    </div>
    </>
  )
}

export default PensionResults