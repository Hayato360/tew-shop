import { authService } from '../../services/authService'

const state = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false
}

const getters = {
  currentUser: state => state.user,
  isAuthenticated: state => state.isAuthenticated,
  getToken: state => state.token
}

const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  SET_TOKEN(state, token) {
    state.token = token
    state.isAuthenticated = !!token
  },
  CLEAR_AUTH(state) {
    state.user = null
    state.token = null
    state.isAuthenticated = false
  }
}

const actions = {
  async register({ commit, dispatch }, userData) {
    try {
      dispatch('setLoading', true, { root: true })
      const response = await authService.register(userData)
      
      commit('SET_USER', response.data.user)
      dispatch('clearError', null, { root: true })
      
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed'
      dispatch('setError', errorMessage, { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },

  async login({ commit, dispatch }, credentials) {
    try {
      dispatch('setLoading', true, { root: true })
      const response = await authService.login(credentials)
      
      const { token } = response.data
      authService.setToken(token)
      commit('SET_TOKEN', token)
      
      dispatch('clearError', null, { root: true })
      
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed'
      dispatch('setError', errorMessage, { root: true })
      throw error
    } finally {
      dispatch('setLoading', false, { root: true })
    }
  },

  logout({ commit }) {
    authService.logout()
    commit('CLEAR_AUTH')
  },

  checkAuth({ commit }) {
    const token = authService.getToken()
    if (token) {
      commit('SET_TOKEN', token)
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