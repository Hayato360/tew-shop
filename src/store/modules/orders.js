import { orderService } from '../../services/orderService'

const state = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null
}

const mutations = {
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  
  SET_ERROR(state, error) {
    state.error = error
  },
  
  SET_ORDERS(state, orders) {
    state.orders = orders
  },
  
  SET_CURRENT_ORDER(state, order) {
    state.currentOrder = order
  },
  
  ADD_ORDER(state, order) {
    state.orders.unshift(order) // Add to beginning of array
  },
  
  UPDATE_ORDER(state, updatedOrder) {
    const index = state.orders.findIndex(o => o._id === updatedOrder._id)
    if (index !== -1) {
      state.orders.splice(index, 1, updatedOrder)
    }
    
    // Also update current order if it matches
    if (state.currentOrder && state.currentOrder._id === updatedOrder._id) {
      state.currentOrder = updatedOrder
    }
  }
}

const actions = {
  async fetchOrders({ commit }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      const response = await orderService.getAllOrders()
      commit('SET_ORDERS', response.data)
    } catch (error) {
      commit('SET_ERROR', 'Failed to fetch orders')
      console.error('Error fetching orders:', error)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async fetchOrderById({ commit }, orderId) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      const response = await orderService.getOrderById(orderId)
      commit('SET_CURRENT_ORDER', response.data)
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Order not found'
      commit('SET_ERROR', errorMessage)
      console.error('Error fetching order:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async createOrder({ commit }, orderData) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      const response = await orderService.createOrder(orderData)
      // Note: In practice, the order would be added via checkout from cart module
      return response
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create order'
      commit('SET_ERROR', errorMessage)
      console.error('Error creating order:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async updateOrderStatus({ commit }, { orderId, status }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      const response = await orderService.updateOrderStatus(orderId, status)
      commit('UPDATE_ORDER', response.data)
      return response
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update order status'
      commit('SET_ERROR', errorMessage)
      console.error('Error updating order status:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async fetchOrdersByStatus({ commit }, status) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      const response = await orderService.getOrdersByStatus(status)
      commit('SET_ORDERS', response.data)
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch orders by status'
      commit('SET_ERROR', errorMessage)
      console.error('Error fetching orders by status:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  // Action to handle successful checkout from cart
  addOrderFromCheckout({ commit }, order) {
    commit('ADD_ORDER', order)
  },
  
  clearError({ commit }) {
    commit('SET_ERROR', null)
  },
  
  clearCurrentOrder({ commit }) {
    commit('SET_CURRENT_ORDER', null)
  }
}

const getters = {
  allOrders: state => state.orders,
  
  currentOrder: state => state.currentOrder,
  
  isLoading: state => state.loading,
  
  error: state => state.error,
  
  // Orders by status
  pendingOrders: state => state.orders.filter(order => order.status === 'pending'),
  
  processingOrders: state => state.orders.filter(order => order.status === 'processing'),
  
  completedOrders: state => state.orders.filter(order => order.status === 'completed'),
  
  cancelledOrders: state => state.orders.filter(order => order.status === 'cancelled'),
  
  // Order statistics
  orderStats: state => {
    const stats = {
      total: state.orders.length,
      pending: 0,
      processing: 0,
      completed: 0,
      cancelled: 0,
      totalRevenue: 0
    }
    
    state.orders.forEach(order => {
      stats[order.status]++
      if (order.status === 'completed') {
        stats.totalRevenue += order.totalAmount
      }
    })
    
    return stats
  },
  
  // Get orders sorted by date (newest first)
  ordersByDate: state => {
    return [...state.orders].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    )
  },
  
  // Get order by ID
  getOrderById: state => id => {
    return state.orders.find(order => order._id === id)
  },
  
  // Recent orders (last 5)
  recentOrders: state => {
    return [...state.orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
  },
  
  // Formatted total revenue
  formattedTotalRevenue: (state, getters) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(getters.orderStats.totalRevenue)
  },
  
  // Order status options for UI
  statusOptions: () => [
    { value: 'pending', text: 'รอดำเนินการ', color: 'orange' },
    { value: 'processing', text: 'กำลังจัดส่ง', color: 'blue' },
    { value: 'completed', text: 'สำเร็จ', color: 'green' },
    { value: 'cancelled', text: 'ยกเลิก', color: 'red' }
  ],
  
  // Get status display info
  getStatusInfo: () => status => {
    const statusMap = {
      'pending': { text: 'รอดำเนินการ', color: 'orange' },
      'processing': { text: 'กำลังจัดส่ง', color: 'blue' },
      'completed': { text: 'สำเร็จ', color: 'green' },
      'cancelled': { text: 'ยกเลิก', color: 'red' }
    }
    return statusMap[status] || { text: status, color: 'grey' }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}