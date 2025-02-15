export const statusNormalize = (status) => {
    const statusMap = {
        approved: 'Aprobado',
        authorized: 'Autorizado',
        in_process: 'En proceso',
        in_mediation: 'En mediación',
        pending: 'Pendiente',
        rejected: 'Rechazado',
        cancelled: 'Cancelado',
        refunded: 'Reembolsado',
        charged_back: 'Contracargo'
    }

    return statusMap[status] || status
}