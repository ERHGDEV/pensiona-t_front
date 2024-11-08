import Button from '../components/Button'

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold text-sky-400">404</h1>
            <p className="text-lg text-sky-50 mb-4 mt-4">Página no encontrada</p>
            <Button to="/" order="primary" children="Volver al inicio" />
        </div>
    )
}

export default NotFound