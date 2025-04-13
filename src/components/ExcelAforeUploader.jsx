import { useState } from 'react'
import { useNotificationContext } from '../context/NotificationContext'
import * as XLSX from 'xlsx'
import axiosInstance from '../services/axiosConfig'
import Button from './Button'
import Dots from './Dots'
import { AFORE_INFO } from '../constants/infoAfore'
import ExcelUploaderHelp from './ExcelUploaderHelp'
import ComponentTransition from './ComponentTransition'
import { AnimatePresence } from 'framer-motion'
import FileTypeXlsIcon from './icons/FileTypeXlsIcon'

const ExcelAforeUploader = () => {
  const [file, setFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState([])
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false)
  const [queryType, setQueryType] = useState('nss') 

  const { showNotification } = useNotificationContext()

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
        throw new Error(`El límite son 100 ${queryType === "nss" ? "NSS" : "CURP"}`)
      }

      const batches = []
      for (let i = 0; i < data.length; i += 20) {
        batches.push(data.slice(i, i + 20))
      }

      const allResults = []
      const endpoint = queryType === 'nss' ? '/batch-afore-info' : '/batch-afore-info-curp'

      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i]
        const response = await axiosInstance.post(endpoint, { 
          [queryType + 'Array']: batch 
        })
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

    const idHeader = queryType === 'curp' ? 'CURP' : 'NSS'
  
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.aoa_to_sheet([
      [idHeader, 'AFORE'],
      ...results.map(( item ) => [
        item[queryType],
        AFORE_INFO[item.afore] ? AFORE_INFO[item.afore].name : item.afore
      ])
    ])
  
    // Ancho de columnas (ajustado para mejor visibilidad)
    worksheet['!cols'] = [{ wch: 20 }, { wch: 20 }]
  
    // Agregar la hoja de cálculo al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Resultados AFORE')
  
    // Guardar el archivo
    XLSX.writeFile(workbook, 'resultados_afore.xlsx')
  
    showNotification('Archivo descargado con éxito', 'success')
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
    return results.filter(result => 
      result.afore !== 'Intenta de nuevo mañana' 
      && result.afore !== 'Formato inválido'
      && result.afore !== 'No está registrado en una Afore'
      && result.afore !== 'No se encontró información'
    ).length
  }

  return (
    <div className="mt-4 h-[270px] rounded-lg bg-white relative">

      <AnimatePresence mode="wait">
        {showForm && (
          <ComponentTransition key="form">

            <div className="mb-4">
              <div className="flex justify-between">
                <label htmlFor="queryType" className="block text-sm font-medium text-gray-700">
                  Consultar por
                </label>
              </div>
              <select
                id="queryType"
                value={queryType}
                onChange={(e) => setQueryType(e.target.value)}
                className="mt-2 w-full px-3 py-2 border rounded-md text-sky-900 font-semibold focus:outline-none"
              >
                <option value="nss">NSS</option>
                <option value="curp">CURP</option>
              </select>
            </div>

            <p className='flex place-items-center text-sm font-medium text-gray-700 mt-6'>
              Carga tu <FileTypeXlsIcon className='mx-1 text-green-700' />Excel con hasta 100 {queryType.toUpperCase()}:
            </p>
            <button
              className="absolute top-[88px] right-0 font-bold bg-yellow-300 text-sky-900 py-1 rounded-full hover:bg-yellow-500 hover:text-white px-3 transition-all"
              onClick={() => setIsHelpModalOpen(true)}
            >
              ?
            </button>

            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="mt-2 w-full py-2 text-sky-900"
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
          </ComponentTransition>
        )}

        {isLoading && (
          <ComponentTransition key="loading">
            <div className="text-center pt-20">
              <p className="text-sky-950 mb-4">Procesando ({Math.round(progress)}%)</p>
              <Dots color={true} />
            </div>
          </ComponentTransition>
        )}

        {results.length > 0 && !isLoading && (
          <ComponentTransition key="results">
            <div className="pt-8">
              <FileTypeXlsIcon className="w-20 h-20 mx-auto text-green-800" />
              <p className="text-sky-950 text-center pt-4">
                Resultados obtenidos para <span className='font-semibold'>{getSuccessfulResultsCount()} {queryType === "nss" ? "NSS" : "CURP"}</span>
              </p>
            </div>
            <div className="mt-12 flex gap-4 max-w-fit mx-auto">
              <Button order="primary" onClick={handleReset}>
                Volver
              </Button>
              <Button onClick={handleDownload}>
                Descargar
              </Button>
            </div>
          </ComponentTransition>
        )}
      </AnimatePresence>

      {error && <p className="text-center text-red-500 text-sm mt-2">{error}</p>}

      <AnimatePresence >
        {isHelpModalOpen && (
          <ComponentTransition key="help-modal">
            <ExcelUploaderHelp onClose={() => setIsHelpModalOpen(false)} type={queryType} />
          </ComponentTransition>
        )}
      </AnimatePresence>

    </div>
  )
}

export default ExcelAforeUploader
