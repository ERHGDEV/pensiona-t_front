import InfoSquareRoundedIcon from "./icons/InfoSquareRoundedIcon"

const UpgradeNotice = ({ onSelection }) => {
  return (
    <div className="bg-white border-l-4 border-sky-600 p-4 mt-4 rounded-xl shadow-md flex items-start gap-2">
      <InfoSquareRoundedIcon className="text-sky-600 w-16 my-auto" />
      <p className="text-sky-900 text-base leading-relaxed">
        Con el plan <span className="font-semibold text-yellow-700">Free</span> solo puedes hacer{" "}
        <span className="font-semibold text-yellow-700">una consulta de Afore al día</span>.{" "}
        <button
          onClick={() => onSelection("subscription")}
          className="text-yellow-700 font-semibold underline hover:text-yellow-900 transition-all focus:outline-none"
        >
          Mejora tu plan
        </button>{" "}
        para obtener más.
      </p>
    </div>
  )
}

export default UpgradeNotice
