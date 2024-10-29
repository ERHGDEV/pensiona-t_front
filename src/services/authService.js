import axios from 'axios'
import URL from '../constants/url'

class AuthService {
  async login(username, password) {
    const response = await axios.post(`${URL}/login`, { username, password })
    if (response.data.token) {
      this.setToken(response.data.token)
    }
    return response.data
  }

  logout() {
    localStorage.removeItem('token')
  }

  setToken(token) {
    localStorage.setItem('token', token)
  }

  getToken() {
    return localStorage.getItem('token')
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
    return data.username
  }

  getCurrentUser() {
    const token = this.getToken()
    if (!token) return null
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  }
}

export default new AuthService()