import apiClient from './api'

export const authService = {
  // Test auth route
  testAuth() {
    return apiClient.get('/auth')
  },

  // Register new user
  register(userData) {
    return apiClient.post('/auth/register', userData)
  },

  // Login user
  login(credentials) {
    return apiClient.post('/auth/login', credentials)
  },

  // Logout user (client-side)
  logout() {
    localStorage.removeItem('token')
    window.location.href = '/login'
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token')
  },

  // Get token from localStorage
  getToken() {
    return localStorage.getItem('token')
  },

  // Set token to localStorage
  setToken(token) {
    localStorage.setItem('token', token)
  }
}