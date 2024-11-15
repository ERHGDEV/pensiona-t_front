import { useState } from 'react'
import emailService from '../services/emailService'
import AdminButton from './AdminButton'

export default function AdminEmailForm() {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSending(true)
    try {
      const result = await emailService.sendBulkEmail(subject, body)
      setMessage(result.message)
      setSubject('')
      setBody('')
    } catch (error) {
      setMessage('Error al enviar el correo. Por favor, intente de nuevo.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="bg-gray-50 rounded shadow-md p-4 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-sky-950">Enviar correo masivo</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-sky-900 mb-1">
            Asunto
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md border-sky-300 text-sky-900 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-transparent"
          />
        </div>
        <div>
          <label htmlFor="body" className="block text-sm font-medium text-sky-900 mb-1">
            Contenido del correo
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md border-sky-300 text-sky-900 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-transparent"
            rows={5}
          />
        </div>
        <div className="flex justify-between items-center">
            {message && (
                <div className={`p-2 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {message}
                </div>
            )}

            <div>
                <AdminButton
                    type="submit"
                    variant="primary"
                    disabled={isSending}
                >
                    {isSending ? 'Enviando...' : 'Enviar'}
                </AdminButton>
            </div>
        </div>
      </form>
    </div>
  )
}