import { useNavigate } from "react-router-dom"
import Header from "../components/Header"

const UserPanel = () => {
    const navigate = useNavigate()

    return (
        <>
            <Header />

            <p>Esto es el panel de usuario</p>
        </>
    )
}

export default UserPanel