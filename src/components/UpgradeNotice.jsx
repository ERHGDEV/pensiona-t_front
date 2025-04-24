const UpgradeNotice = ({ onSelection }) => {
    return (
      <div className="bg-sky-50 border-l-4 border-sky-400 p-4 mt-4 rounded-lg shadow-sm">
        <p className="text-sky-900 text-base leading-relaxed">
          En tu plan actual{" "}
          <span className="font-semibold text-yellow-700">(Free)</span>, solo puedes realizar{" "}
          <span className="font-semibold text-yellow-700">una consulta de Afore al día</span>. Para acceder a más consultas, te invitamos a{" "}
          <button
            onClick={() => onSelection("subscription")}
            className="text-yellow-700 font-semibold underline hover:text-yellow-900 transition-all"
          >
            mejorar tu plan
          </button>.
        </p>
      </div>
    )
  }
  
  export default UpgradeNotice