import Button from '../components/Button'
import Footer from '../components/Footer'
import Header from '../components/Header'

const NotFound = () => {
    return (
        <>
            <Header />
            <div className="flex flex-col items-center mt-40">
                <h1 className="text-4xl font-bold text-sky-400">404</h1>
                <p className="text-lg text-sky-50 mb-4 mt-4">Página no encontrada</p>
                <Button to="/" order="primary" >Volver al inicio</Button>
            </div>
            <Footer variant="fixed"/>
        </>
        
    )
}

export default NotFound