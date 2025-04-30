import { useActiveSection } from "../context/ActiveSectionContext"
import UserPill from "./UserPill"
import CalculatorIcon from "./icons/CalculatorIcon"
import PinIcon from "./icons/PinIcon"
import UserCircleIcon from "./icons/UserCircleIcon"

const DesktopNavBar = () => {
    const { activeSection, setActiveSection } = useActiveSection()

    return (
        <nav className="hidden md:flex justify-center space-x-4">
            <UserPill 
                activeSection={activeSection} 
                setActiveSection={setActiveSection} 
                section="calculator" 
                text="Calculadora" 
                icon={<CalculatorIcon className="mr-1"/>} 
            />
            <UserPill 
                activeSection={activeSection} 
                setActiveSection={setActiveSection} 
                section="afore" 
                text="Afore" 
                icon={<PinIcon className="mr-1" />} 
            />
            <UserPill 
                activeSection={activeSection} 
                setActiveSection={setActiveSection} 
                section="myAccount" 
                text="Mi cuenta" 
                icon={<UserCircleIcon className="mr-1"/>} 
            />
        </nav>
    )
}

export default DesktopNavBar