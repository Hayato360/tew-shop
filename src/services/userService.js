import apiClient from './api'

export const userService = {
  // Get current user profile
  getMe() {
    return apiClient.get('/users/me')
  },

  // Get all users (Admin only)
  getAllUsers() {
    return apiClient.get('/users')
  },

  // Get user by ID
  getUserById(id) {
    return apiClient.get(`/users/${id}`)
  },

  // Create new user (Admin only)
  createUser(userData) {
    return apiClient.post('/users', userData)
  },

  // Update user (Admin only)
  updateUser(id, userData) {
    return apiClient.put(`/users/${id}`, userData)
  },

  // Delete user (Admin only)
  deleteUser(id) {
    return apiClient.delete(`/users/${id}`)
  }
}