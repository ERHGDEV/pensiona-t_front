import Button from "./Button"

const RegisterModal = ({ onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 animate-fade-in">
            <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-sm text-sky-950">
                <p className="text-xl font-semibold">¡Bienvenido a Pensiona-T!</p>
                <p className="my-5">Te sugerimos utilizar un correo electrónico con dominio
                    <strong> gmail</strong> para asegurar que recibas el correo de verificación.
                </p>
                <div className='mt-4 flex flex-col sm:flex-row gap-4 max-w-fit mx-auto'>
                    <Button onClick={() => onClose(false)} order="secundary" >Continuar</Button>
                </div>
            </div>
        </div> 
    )
}

export default RegisterModal