import apiClient from './api'

export const orderService = {
  // Create order (usually not used directly, use cart checkout instead)
  createOrder(orderData) {
    return apiClient.post('/orders', orderData)
  },

  // Get all orders
  getAllOrders() {
    return apiClient.get('/orders')
  },

  // Get order by ID
  getOrderById(id) {
    return apiClient.get(`/orders/${id}`)
  },

  // Update order status (Admin only)
  updateOrderStatus(id, status) {
    return apiClient.patch(`/orders/${id}/status`, { status })
  },

  // Get orders by status (Admin only)
  getOrdersByStatus(status) {
    return apiClient.get(`/orders/status/${status}`)
  }
}