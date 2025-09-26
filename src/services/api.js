import axios from 'axios'
import store from '../store'
import router from '../router'

// Base API URL - adjust according to your backend
const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle responses and errors
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      console.log('Token expired, logging out...')
      
      // Clear auth state
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Clear Vuex store
      store.dispatch('auth/logout')
      
      // Redirect to login if not already there
      if (router.currentRoute.path !== '/login') {
        router.push('/login')
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient