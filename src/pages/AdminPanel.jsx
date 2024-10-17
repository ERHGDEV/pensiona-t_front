import { useNavigate } from "react-router-dom"
import Header from "../components/Header"

const AdminPanel = () => {
    const navigate = useNavigate()

    return (
        <>
            <Header />

            <p>Esto es el panel de administración</p>
        </>
    )
}

export default AdminPanel