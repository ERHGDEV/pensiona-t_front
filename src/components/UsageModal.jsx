const UsageModal = ({ show, handleClose }) => {
  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white text-pretty rounded-2xl shadow-lg p-6 max-w-sm w-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Aviso Importante</h2>
        <p className="text-gray-600 mb-6 text-pretty">
          A partir del <strong>15 de febrero de 2025</strong>, la forma en que se otorga el servicio cambiará. 
          Contaremos con <strong>tres planes</strong>: Free, Pro y Unlimited, cada uno con distintas características.
        </p>
        <ul className="text-gray-600 mb-6 text-pretty list-disc list-inside">
          <li><strong>Free:</strong> No contará con el análisis de reporte de semanas cotizadas, no tendrá acceso a la consulta masiva de AFORE y solo permitirá <strong>1 consulta individual de AFORE al día</strong>.</li>
          <li><strong>Pro:</strong> Incluirá el análisis de reporte de semanas cotizadas y aumentará el límite de consultas individuales de AFORE a <strong>10 por día</strong>.</li>
          <li><strong>Unlimited:</strong> Ofrecerá <strong>consultas ilimitadas de AFORE</strong>, unicamente este plan tiene acceso a la <strong>Consulta Masiva de Afore</strong>.</li>
        </ul>
        <p className="text-gray-600 mb-6 text-pretty">
          Para más información, contáctanos en <a href="mailto:contacto@pensiona-t.com" className="text-blue-600 font-semibold">contacto@pensiona-t.com</a>
        </p>
        <button
          onClick={handleClose}
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Aceptar
        </button>
      </div>
    </div>
  )
}

export default UsageModal
