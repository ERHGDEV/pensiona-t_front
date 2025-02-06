import axios from 'axios'
import AuthService from './authService'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_URL
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
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
        if (error.response.status === 403 && originalRequest.url.includes('/refresh-token')) {
            AuthService.logout();
            window.location.href = '/login';
            return Promise.reject(error);
        }

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const accessToken = await AuthService.refreshToken();
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                AuthService.logout();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
    }

    return Promise.reject(error);
  }
)

export default axiosInstance