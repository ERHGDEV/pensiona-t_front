export const statusNormalize = (status) => {
    if (status === 'approved') {
        return 'Aprobado'
    } else if (status === 'in_process') {
        return 'Pendiente'
    } else if (status === 'rejected') {
        return 'Rechazado'
    } else return status
}