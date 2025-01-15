import { useState, useEffect } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import Button from './Button'
import extractDataFromPDF from '../utils/extractDataFromPDF'
import axiosInstance from '../services/axiosConfig'
import Dots from './Dots'

const PDFUploader = ({ onDataExtracted, onPDFBack }) => {
  const [file, setFile] = useState(null)
  const [pdfError, setPdfError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadWorker = async () => {
      const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.mjs')
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker
    }
    loadWorker()
  }, [])

  const incrementPDFExtractCount = async () => {
    try {
      await axiosInstance.put('/user/increment-pdf')
    } catch (error) {
      console.error('Error al incrementar el contador:', error)
    }
}

  const handleFileChange = (event) => {
    setFile(event.target.files[0])
    setPdfError(null)
  }

  const handleUpload = async () => {
    setPdfError(null)

    try {
      const fileReader = new FileReader()
      fileReader.onload = async (e) => {
        const pdfData = new Uint8Array(e.target.result)
        try {
          const extractedData = await extractDataFromPDF(pdfData)

          if (extractedData.ley === 'Trabajador Ley 97') {
            setPdfError('El reporte corresponde a la Ley 97')
          } else {
            onDataExtracted(extractedData)
            incrementPDFExtractCount()
          }
        } catch (err) {
          setPdfError(err.message)
        }
        setLoading(false)
      }
      fileReader.onerror = () => {
        setPdfError('Error al leer el archivo.')
        setLoading(false)
      }
      fileReader.readAsArrayBuffer(file)
    } catch (err) {
      setPdfError('Error al procesar el archivo PDF: ' + err.message)
      setLoading(false)
    }
  }

  const handleButtonClick = () => {
    if (!file) {
      setPdfError('Por favor, selecciona un archivo PDF.')
      return
    }

    setLoading(true)
    setTimeout(() => {
      handleUpload()
    }, 3000)
  }

  return (
    <div className="max-w-md h-36 mx-auto">
      <div className="relative z-0 w-full mt-2 mb-5 group">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="block py-2.5 px-0 w-full text-md text-sky-950 bg-transparent border-0 border-b-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-gray-100 peer"
        />
      </div>
      <div className="flex flex-row gap-4 max-w-fit mx-auto">
        <Button order="primary" onClick={onPDFBack}>
          Volver
        </Button>
        <Button onClick={handleButtonClick} disabled={loading || !file}>
          {loading ? (
            <span>
              Procesando
              <Dots />
            </span>
          ) : (
            'Procesar'
          )}
        </Button>
      </div>
      {pdfError && <p className="text-red-600 text-center italic my-2 h-1">{pdfError}</p>}
    </div>
  )
}

export default PDFUploader

