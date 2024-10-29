import axios from 'axios'
import AuthService from './authService'
import URL from '../constants/url'

const axiosInstance = axios.create({
  baseURL: URL
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = AuthService.getToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      AuthService.logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance