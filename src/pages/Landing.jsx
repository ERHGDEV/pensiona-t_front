import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'

const Landing = () => {
    const navigate = useNavigate()
    
    return (
        <>
            <Header />
        </>
    )
}

export default Landing