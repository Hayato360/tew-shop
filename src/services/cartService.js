import apiClient from './api'

export const cartService = {
  // Get user's cart
  getCart() {
    return apiClient.get('/carts')
  },

  // Add item to cart
  addToCart(productId, qty) {
    return apiClient.post('/carts/add', { productId, qty })
  },

  // Update item quantity
  updateItemQuantity(productId, qty) {
    return apiClient.put(`/carts/item/${productId}`, { qty })
  },

  // Remove item from cart
  removeItem(productId) {
    return apiClient.delete(`/carts/item/${productId}`)
  },

  // Clear cart
  clearCart() {
    return apiClient.delete('/carts')
  },

  // Checkout (Create order from cart)
  checkout(orderCode) {
    return apiClient.post('/carts/checkout', { orderCode })
  }
}