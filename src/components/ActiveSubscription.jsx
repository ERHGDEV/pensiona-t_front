const ActiveSubscription = ({ name, expirationDate, paymentHistory }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('es-MX', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
    }

    const subscriptionNormalize = (subscription) => {
        if (subscription === 'unlimited') {
            return 'Unlimited'
        } else if (subscription === 'pro') {
            return 'Pro'
        } else if (subscription === 'free') {
            return 'Free'
        }
    }

    const statusNormalize = (status) => {
        if (status === 'approved') {
            return 'Aprobado'
        } else if (status === 'in_process') {
            return 'Pendiente'
        } else if (status === 'rejected') {
            return 'Rechazado'
        }
    }

    return (
        <div className="bg-white pt-4 max-w-md w-full mx-auto">
            <h1 className="text-xl font-bold text-sky-950">Tienes una suscripción activa</h1>
            
            <div className="mt-4">
                <p className="text-gray-700"><span className="font-semibold">Suscripción:</span> {subscriptionNormalize(name)}</p>
                <p className="text-gray-700"><span className="font-semibold">Vencimiento:</span> {formatDate(expirationDate)}</p>
            </div>

            <h2 className="mt-4 text-lg font-semibold text-sky-950">Historial de Pagos</h2>
            <div className="mt-2 space-y-2 overflow-y-auto h-60">
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
        </div>
    )
}

export default ActiveSubscription
