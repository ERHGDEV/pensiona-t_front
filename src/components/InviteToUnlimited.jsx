const InviteToUnlimited = ({ onSelection }) => {
    return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 mt-4 rounded-lg">
            <p className="text-sky-900">
                Para acceder a la <span className="font-semibold">Consulta Masiva de Afore{" "}</span> 
                <button 
                    onClick={() => onSelection('subscription')} 
                    className="text-sky-800 font-semibold underline hover:text-yellow-900 transition-all"
                >
                    suscríbete
                </button> 
                {" "}en el plan <span className="font-semibold">Unlimited</span>
            </p>
        </div>
    )
}

export default InviteToUnlimited