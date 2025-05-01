import { useActiveSection } from "../context/ActiveSectionContext"
import InfoSquareRoundedIcon from "./icons/InfoSquareRoundedIcon"

const InviteToUnlimited = () => {
    const { setActiveSection } = useActiveSection()

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4 rounded-xl shadow-md flex items-start gap-2">
      <InfoSquareRoundedIcon className="text-sky-600 w-12 my-auto" />
      <p className="text-sky-900 text-base leading-relaxed">
        Para acceder a la <span className="text-yellow-700 font-semibold">Consulta Masiva de Afore</span>,{" "}
        <button
          onClick={() => setActiveSection("subscription")}
          className="text-yellow-700 font-semibold underline hover:text-yellow-900 transition-all focus:outline-none"
        >
          mejora tu plan
        </button>{" "}
        a <span className="font-semibold text-yellow-700">Unlimited</span>.
      </p>
    </div>
  )
}

export default InviteToUnlimited
