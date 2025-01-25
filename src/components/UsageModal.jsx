const UsageModal = ({ show, handleClose }) => {
    if (!show) return null
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm w-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Aviso Importante</h2>
          <p className="text-gray-600 mb-6 text-pretty">
            Debido a la alta demanda de la consulta individual y consulta masiva de AFORE, 
            estamos excediendo la capacidad de la plataforma.
            <strong> Estamos trabajando en buscar alternativas </strong>
            para continuar brindando el mejor servicio posible. <strong> Esperamos  
            tener noticias para principios de febrero. </strong>
            Agradecemos su comprensión.
          </p>
          <p className="text-gray-600 mb-6 text-pretty">
            Cualquier duda o comentario, por favor escríbanos a <a href="mailto:contacto@pensiona-t.com"><strong>contacto@pensiona-t.com</strong></a>
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