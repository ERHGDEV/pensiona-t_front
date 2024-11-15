import axiosInstance from './axiosConfig'

const sendBulkEmail = async (subject, body) => {
    try {
        const response = await axiosInstance.post('/admin/send-bulk-email', { subject, body })
        return response.data
    } catch (error) {
        console.error('Error while sending bulk email', error)
        throw error
    }
}

export default {
    sendBulkEmail
}