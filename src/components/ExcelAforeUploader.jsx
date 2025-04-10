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

const ExcelAforeUploader = () => {
  const [file, setFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState([])
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false)

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
        throw new Error('El límite son 100 números de seguridad social')
      }

      const batches = []
      for (let i = 0; i < data.length; i += 20) {
        batches.push(data.slice(i, i + 20))
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
  
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.aoa_to_sheet([
      ['NSS', 'AFORE'],
      ...results.map(({ nss, afore }) => [
        nss,
        AFORE_INFO[afore] ? AFORE_INFO[afore].name : afore
      ])
    ])
  
    // Ancho de columnas (ajustado para mejor visibilidad)
    worksheet['!cols'] = [{ wch: 15 }, { wch: 15 }]
  
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
    return results.filter(result => result.afore !== 'Intenta de nuevo mañana' && result.afore !== 'Formato inválido').length
  }

  return (
    <div className="mt-4 mb-6 pb-6 h-[205px] rounded-lg bg-white relative">
      <p className='text-sm font-medium text-gray-700'>Carga tu archivo de Excel</p>
      <p className='text-sm font-medium text-gray-700'>con hasta 100 nss:</p>
      <button
        className="absolute top-1 right-0 font-bold bg-yellow-300 text-sky-900 py-1 rounded-full hover:bg-yellow-500 hover:text-white px-3 transition-all"
        onClick={() => setIsHelpModalOpen(true)}
      >
        ?
      </button>

      <AnimatePresence mode="wait">
        {showForm && (
          <ComponentTransition key="form">
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="mt-4 w-full py-2 text-sky-900"
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
            <div className="text-center mt-8">
              <p className="text-sky-950 mb-4">Procesando ({Math.round(progress)}%)</p>
              <Dots color={true} />
            </div>
          </ComponentTransition>
        )}

        {results.length > 0 && !isLoading && (
          <ComponentTransition key="results">
            <p className="text-sky-950 text-center font-semibold mt-8">Resultados obtenidos para {getSuccessfulResultsCount()} NSS</p>
            <div className="mt-8 flex gap-4 max-w-fit mx-auto">
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
            <ExcelUploaderHelp onClose={() => setIsHelpModalOpen(false)} />
          </ComponentTransition>
        )}
      </AnimatePresence>

    </div>
  )
}

export default ExcelAforeUploader
