import { useEffect } from 'react'
import Footer from '../components/Footer'
import Pricing from '../components/Pricing'

const Subscriptions = () => {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <>
            <Pricing />
            <div className='xl:fixed xl:bottom-0 xl:w-full'>
                <Footer />
            </div>
        </>
    )
}

export default Subscriptions