import { useActiveSection } from "../context/ActiveSectionContext"
import NavButton from "./NavButton"
import CalculatorIcon from "./icons/CalculatorIcon"
import PinIcon from "./icons/PinIcon"
import UserCircleIcon from "./icons/UserCircleIcon"

const MobileNavBar = () => {
    const { activeSection, setActiveSection } = useActiveSection()

    return (
        <nav className="fixed bottom-0 left-0 w-full bg-sky-900 shadow-md border-t border-sky-950 grid grid-cols-3 px-4 py-2 md:hidden">
            <NavButton
                label="Calculadora"
                icon={<CalculatorIcon />}
                isActive={activeSection === "calculator"}
                onClick={() => setActiveSection("calculator")}
            />
            <NavButton
                label="Afore"
                icon={<PinIcon />}
                isActive={activeSection === "afore"}
                onClick={() => setActiveSection("afore")}
            />
            <NavButton
                label="Mi cuenta"
                icon={<UserCircleIcon />}
                isActive={activeSection === "myAccount"}
                onClick={() => setActiveSection("myAccount")}
            />
        </nav>
    )
}

export default MobileNavBar