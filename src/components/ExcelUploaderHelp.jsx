import { createPortal } from "react-dom"
import Button from "./Button"
import ComponentTransition from "./ComponentTransition"

const ExcelUploaderHelp = ({ onClose }) => {
    return createPortal(
        <ComponentTransition >
          <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
            >
              <div className="bg-white p-4 rounded-lg max-w-sm shadow-lg text-sky-950">
                <h4 className="text-lg font-semibold text-center mb-4">Instrucciones</h4>
                <p className="mb-4 text-pretty">
                  Crea un nuevo documento de Excel y pega los números de seguridad social que deseas consultar (hasta 100 por consulta).
                </p>
                <p className="mb-4 text-pretty">
                  Guarda el documento de excel y adjuntalo oprimiendo en {"Elegir archivo"}.
                </p>
                <div className="border rounded-md p-4 bg-gray-100">
                  <p>Ejemplo:</p>
                  <img src="./excel.webp" alt="Ejemplo" className="mt-2 h-64 mx-auto" />
                </div>
                <div className="mt-4 flex gap-4 max-w-fit mx-auto">
                  <Button variant="primary" onClick={onClose}>
                    Aceptar
                  </Button>
                </div>
                
              </div>
          </div>
        </ComponentTransition>
    , document.body
    )
}

export default ExcelUploaderHelp