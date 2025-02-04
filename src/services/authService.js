import axios from 'axios'
import URL from '../constants/url'

class AuthService {
  async login(email, password) {
    const response = await axios.post(`${URL}/login`, { email, password })
    if (response.data.token && response.data.refreshToken) {
      this.setToken(response.data.token)
      this.setRefreshToken(response.data.refreshToken)
    }
    return response.data
  }

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
  }

  setToken(token) {
    localStorage.setItem('token', token)
  }

  getToken() {
    return localStorage.getItem('token')
  }

  setRefreshToken(refreshToken) {
    localStorage.setItem('refreshToken', refreshToken)
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken')
  }

  async refreshToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token available');
    
    try {
        const response = await axios.post(`${URL}/refresh-token`, { refreshToken });
        if (response.data.accessToken) {
            this.setToken(response.data.accessToken);
            return response.data.accessToken;
        }
        throw new Error('No access token returned');
    } catch (error) {
        console.error('Error al renovar el token:', error);
        throw error;
    }
  }

  isAuthenticated() {
    return !!this.getToken()
  }

  getUserRole() {
    const token = this.getToken()
    if (!token) return null
    const payload = token.split('.')[1]
    const data = JSON.parse(atob(payload))
    return data.role
  }

  getUsername() {
    const token = this.getToken()
    if (!token) return null
    const payload = token.split('.')[1]
    const data = JSON.parse(atob(payload))
    return data.email
  }

  getCurrentUser() {
    const token = this.getToken()
    if (!token) return null
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  }
}

export default new AuthService()