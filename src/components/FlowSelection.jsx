import Button from "./Button"

const FlowSelection = ({ onSelection }) => {
    return (
        <div className="flex flex-col items-center text-sky-900">
            <h3 className="text-lg font-semibold">¿Cómo deseas ingresas tus datos?</h3>
            <h2 className="text-sm mt-4">Salario Promedio, Semanas Cotizadas, Edad</h2>

            <div className="mt-6 flex flex-col gap-4 max-w-fit mx-auto">
                <Button variant="primary" onClick={() => onSelection('calculatorForm')}>
                    Ingresar manualmente
                </Button>
                <Button variant="primary" onClick={() => onSelection('pdfUploader')}>
                    Cargar Semanas Cotizadas
                </Button>
            </div>
        </div>
    )
}

export default FlowSelection