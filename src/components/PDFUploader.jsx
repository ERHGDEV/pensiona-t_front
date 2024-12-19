import { useState, useEffect } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import Button from './Button'
import extractDataFromPDF from '../utils/extractDataFromPDF'

const PDFUploader = ({ onDataExtracted, onError }) => {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadWorker = async () => {
      const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.mjs');
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    };
    loadWorker();
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0])
    onError(null)
  }

  const handleUpload = async () => {
    if (!file) {
      onError('Por favor, selecciona un archivo PDF.')
      return
    }
  
    setLoading(true)
    onError(null)
  
    try {
      const fileReader = new FileReader()
      fileReader.onload = async (e) => {
        const pdfData = new Uint8Array(e.target.result)
        try {
          const extractedData = await extractDataFromPDF(pdfData)
  
          // Verificar si el trabajador pertenece a la Ley 97
          if (extractedData.ley === 'Trabajador Ley 97') {
            onError('El reporte corresponde a la Ley 97')
          } else {
            onDataExtracted(extractedData)
          }
        } catch (err) {
          onError(err.message) // Mostrar el mensaje de error capturado
        }
        setLoading(false)
      }
      fileReader.onerror = () => {
        onError('Error al leer el archivo.')
        setLoading(false)
      }
      fileReader.readAsArrayBuffer(file)
    } catch (err) {
      onError('Error al procesar el archivo PDF: ' + err.message)
      setLoading(false)
    }
  }
  
  return (
    <div className="max-w-md mx-auto">
      <div className="relative z-0 w-full mt-2 mb-5 group">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="block py-2.5 px-0 w-full text-md bg-transparent border-0 border-b-2 border-gray-500 appearance-none focus:outline-none focus:ring-0 focus:border-gray-100 peer" 
          
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4 max-w-fit mx-auto">
        <Button variant="primary" onClick={handleUpload} disabled={loading || !file}>
          Procesar
        </Button>
      </div>
    </div>
  )
}

export default PDFUploader
