import { useState } from 'react'
import * as XLSX from 'xlsx'
import axiosInstance from '../services/axiosConfig'
import Button from './Button'
import Dots from './Dots'
import { AFORE_INFO } from '../constants/infoAfore'

const ExcelAforeUploader = () => {
  const [file, setFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState([])
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
    setError(null)
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Por favor, selecciona un archivo Excel.')
      return
    }

    setIsLoading(true)
    setError(null)
    setShowForm(false)

    try {
      const data = await readExcel(file)
      if (data.length > 100) {
        throw new Error('El límite son 100 números de seguridad social')
      }

      const batches = []
      for (let i = 0; i < data.length; i += 10) {
        batches.push(data.slice(i, i + 10))
      }

      const allResults = []
      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i]
        const response = await axiosInstance.post('/batch-afore-info', { nssArray: batch })
        allResults.push(...response.data)

        setProgress(((i + 1) / batches.length) * 100)

        await new Promise(resolve => setTimeout(resolve, 500))
      }

      setResults(allResults)
    } catch (err) {
      setError(err.message || 'Ocurrió un error al procesar el archivo')
      setShowForm(true)
    } finally {
      setIsLoading(false)
    }
  }

  const readExcel = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result)
          const workbook = XLSX.read(data, { type: 'array' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false })
          const nssArray = jsonData.flat().filter(nss => nss !== undefined && nss !== null)
          resolve(nssArray)
        } catch (error) {
          reject(new Error('Error al leer el archivo Excel'))
        }
      }
      reader.onerror = (error) => reject(error)
      reader.readAsArrayBuffer(file)
    })
  }

  const handleDownload = () => {
    if (!results) return

    const worksheet = XLSX.utils.json_to_sheet(
      results.map(({ nss, afore }) => ({
        NSS: nss,
        AFORE: AFORE_INFO[afore] ? AFORE_INFO[afore].name : afore
      }))
    )
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Resultados AFORE')
    XLSX.writeFile(workbook, 'resultados_afore.xlsx')
  }

  const handleReset = () => {
    setFile(null)
    setResults([])
    setError(null)
    setShowForm(true)
    setProgress(0)
  }

  const getSuccessfulResultsCount = () => {
    if (!results) return 0
    return results.filter(result => result.afore !== 'Intenta de nuevo mañana' && result.afore !== 'Formato inválido').length
  }

  return (
    <div className="mt-4 p-6 h-[235px] border rounded-lg bg-white shadow-sm relative">
      <h3 className="text-2xl font-bold mb-4 text-center text-sky-900">Consulta masiva AFORE</h3>

      <button
        className="absolute top-2 right-2 font-bold bg-sky-600 text-white py-1 rounded-full hover:bg-sky-700 px-3"
        onClick={() => setIsHelpModalOpen(true)}
      >
        ?
      </button>

      {showForm && (
        <>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="mt-2 w-full px-3 py-2 border rounded-md text-sky-900 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-transparent"
          />
          <div className="mt-4 flex flex-col sm:flex-row gap-4 max-w-fit mx-auto">
            <Button
              variant="primary"
              onClick={handleUpload}
              disabled={!file || isLoading}
            >
              {isLoading ? 'Procesando...' : 'Procesar'}
            </Button>
          </div>
        </>
      )}

      {isLoading && (
        <div className="text-center mt-4">
          <p className="text-sky-950 mb-4">Procesando ({Math.round(progress)}%)</p>
          <Dots color={true} />
        </div>
      )}

      {error && <p className="text-center text-red-500 text-sm mt-2">{error}</p>}

      {results.length > 0 && !isLoading && (
        <>
          <p className="text-sky-950 text-center mt-8">Resultados obtenidos para {getSuccessfulResultsCount()} NSS</p>
          <div className="mt-8 flex gap-4 max-w-fit mx-auto">
            <Button order="primary" onClick={handleReset}>
              Volver
            </Button>
            <Button onClick={handleDownload}>
              Descargar
            </Button>
          </div>
        </>
      )}

      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white p-4 rounded-lg max-w-sm shadow-lg text-sky-950">
            <h4 className="text-lg font-semibold text-center mb-4">Instrucciones</h4>
            <p className="mb-4 text-pretty">
              Crea un nuevo documento de Excel y pega los números de seguridad social que deseas consultar (hasta 100 por consulta).
            </p>
            <p className="mb-4 text-pretty">
              Guarda el documento de excel y adjuntalo oprimiendo en "Elegir archivo".
            </p>
            <div className="border rounded-md p-4 bg-gray-100">
              <p>Ejemplo:</p>
              <img src="./excel.webp" alt="Ejemplo" className="mt-2 h-64 mx-auto" />
            </div>
            <div className="mt-4 flex gap-4 max-w-fit mx-auto">
              <Button variant="primary" onClick={() => setIsHelpModalOpen(false)}>
                Aceptar
              </Button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  )
}

export default ExcelAforeUploader