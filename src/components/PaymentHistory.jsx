import { useUserContext } from "../context/UserContext"
import { formatDate } from "../utils/formatDate"
import { statusNormalize } from "../utils/statusPaymentNormalize"

const PaymentHistory = () => {
    const { user } = useUserContext()
    const { paymentHistory } = user

    return (
        <>
            <h2 className="mt-4 text-lg font-semibold text-sky-950">Historial de Pagos</h2>
            <div className="mt-2 space-y-2 overflow-y-auto">
                {paymentHistory.length > 0 ? (
                    paymentHistory.map((payment, index) => (
                        <div key={index} className="border-b pb-2">
                            <p className="text-gray-700"><span className="font-semibold">Fecha:</span> {formatDate(payment.date)}</p>
                            <p className="text-gray-700"><span className="font-semibold">Descripción:</span> {payment.description}</p>
                            <p className="text-gray-700"><span className="font-semibold">Monto:</span> ${payment.amount}</p>
                            <p className={`font-semibold ${
                                payment.status === 'approved' 
                                    ? 'text-green-600' 
                                    : payment.status === 'rejected' 
                                        ? 'text-red-600' 
                                        : 'text-yellow-600'
                            }`}>
                                Estatus: {statusNormalize(payment.status)}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No hay pagos registrados.</p>
                )}
            </div>
        </>
    )
}

export default PaymentHistory