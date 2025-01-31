import Header from '../components/Header'
import Footer from '../components/Footer'
import Pricing from '../components/Pricing'

const Suscriptions = () => {
    return (
        <>
            <Header />
            <Pricing />
            <div className='xl:fixed xl:bottom-0 xl:w-full'>
                <Footer />
            </div>
                
        </>
    )
}

export default Suscriptions