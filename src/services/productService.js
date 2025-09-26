import apiClient from './api'

export const productService = {
  // Get all products
  getAllProducts() {
    return apiClient.get('/products')
  },

  // Get product by ID
  getProductById(id) {
    return apiClient.get(`/products/${id}`)
  },

  // Create new product (Admin only)
  createProduct(productData) {
    return apiClient.post('/products', productData)
  },

  // Update product (Admin only)
  updateProduct(id, productData) {
    return apiClient.put(`/products/${id}`, productData)
  },

  // Delete product (Admin only)
  deleteProduct(id) {
    return apiClient.delete(`/products/${id}`)
  }
}