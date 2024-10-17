import { useNavigate } from "react-router-dom"
import Header from "../components/Header"

const Login = () => {
    const navigate = useNavigate()

    return (
        <>
            <Header />

            <p>Esto es la página de login</p>
        </>
    )
}

export default Login