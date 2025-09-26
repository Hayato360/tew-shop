import { userService } from '../../services/userService'

const state = {
  users: [],
  currentUser: null
}

const getters = {
  allUsers: state => state.users,
  getCurrentUser: state => state.currentUser,
  getUserById: state => id => state.users.find(user => user._id === id)
}

const mutations = {
  SET_USERS(state, users) {
    state.users = users
  },
  SET_CURRENT_USER(state, user) {
    state.currentUser = user
  },
  ADD_USER(state, user) {
    state.users.push(user)
  },
  UPDATE_USER(state, updatedUser) {
    const index = state.users.findIndex(user => user._id === updatedUser._id)
    if (index !== -1) {
      state.users.splice(index, 1, updatedUser)
    }
  },
  REMOVE_USER(state, userId) {
    state.users = state.users.filter(user => user._id !== userId)
  }
}

const actions = {
  async fetchUsers({ commit, dispatch }) {
    try {
      dispatch('setLoading', true, { root: true })
      const response = await userService.getAllUsers()
      commit('SET_USERS', response.data)
      dispatch('clearError', null, { root: true })
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch users'
      dispatch('setError', errorMessage, { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },

  async fetchUser({ commit, dispatch }, userId) {
    try {
      dispatch('setLoading', true, { root: true })
      const response = await userService.getUserById(userId)
      commit('SET_CURRENT_USER', response.data)
      dispatch('clearError', null, { root: true })
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch user'
      dispatch('setError', errorMessage, { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },

  async createUser({ commit, dispatch }, userData) {
    try {
      dispatch('setLoading', true, { root: true })
      const response = await userService.createUser(userData)
      commit('ADD_USER', response.data.user)
      dispatch('clearError', null, { root: true })
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create user'
      dispatch('setError', errorMessage, { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },

  async updateUser({ commit, dispatch }, { id, userData }) {
    try {
      dispatch('setLoading', true, { root: true })
      const response = await userService.updateUser(id, userData)
      commit('UPDATE_USER', response.data.user)
      dispatch('clearError', null, { root: true })
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update user'
      dispatch('setError', errorMessage, { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },

  async deleteUser({ commit, dispatch }, userId) {
    try {
      dispatch('setLoading', true, { root: true })
      await userService.deleteUser(userId)
      commit('REMOVE_USER', userId)
      dispatch('clearError', null, { root: true })
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete user'
      dispatch('setError', errorMessage, { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}