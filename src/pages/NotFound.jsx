import { Link } from "react-router-dom"

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold text-sky-400">404</h1>
            <p className="text-lg text-sky-50">Página no encontrada</p>
            <Link to="/" 
                className='mt-4 bg-white hover:bg-sky-200 text-sky-950 font-bold py-2 px-4 rounded text-nowrap'>Regresar al inicio</Link>
        </div>
    )
}

export default NotFound