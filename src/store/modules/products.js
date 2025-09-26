import { productService } from '../../services/productService'

const state = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
  searchQuery: '',
  selectedCategory: ''
}

const mutations = {
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  
  SET_ERROR(state, error) {
    state.error = error
  },
  
  SET_PRODUCTS(state, products) {
    state.products = products
  },
  
  SET_CURRENT_PRODUCT(state, product) {
    state.currentProduct = product
  },
  
  ADD_PRODUCT(state, product) {
    state.products.push(product)
  },
  
  UPDATE_PRODUCT(state, updatedProduct) {
    const index = state.products.findIndex(p => p._id === updatedProduct._id)
    if (index !== -1) {
      state.products.splice(index, 1, updatedProduct)
    }
  },
  
  REMOVE_PRODUCT(state, productId) {
    state.products = state.products.filter(p => p._id !== productId)
  },
  
  SET_SEARCH_QUERY(state, query) {
    state.searchQuery = query
  },
  
  SET_SELECTED_CATEGORY(state, category) {
    state.selectedCategory = category
  }
}

const actions = {
  async fetchProducts({ commit }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      const response = await productService.getAllProducts()
      commit('SET_PRODUCTS', response.data)
    } catch (error) {
      commit('SET_ERROR', 'Failed to fetch products')
      console.error('Error fetching products:', error)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async fetchProductById({ commit }, productId) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      const response = await productService.getProductById(productId)
      commit('SET_CURRENT_PRODUCT', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', 'Product not found')
      console.error('Error fetching product:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async createProduct({ commit }, productData) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      const response = await productService.createProduct(productData)
      commit('ADD_PRODUCT', response.data.product || response.data)
      return response
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create product'
      commit('SET_ERROR', errorMessage)
      console.error('Error creating product:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async updateProduct({ commit }, { productId, productData }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      const response = await productService.updateProduct(productId, productData)
      commit('UPDATE_PRODUCT', response.data.product || response.data)
      return response
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update product'
      commit('SET_ERROR', errorMessage)
      console.error('Error updating product:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async deleteProduct({ commit }, productId) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      await productService.deleteProduct(productId)
      commit('REMOVE_PRODUCT', productId)
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete product'
      commit('SET_ERROR', errorMessage)
      console.error('Error deleting product:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  setSearchQuery({ commit }, query) {
    commit('SET_SEARCH_QUERY', query)
  },
  
  setSelectedCategory({ commit }, category) {
    commit('SET_SELECTED_CATEGORY', category)
  },
  
  clearError({ commit }) {
    commit('SET_ERROR', null)
  }
}

const getters = {
  allProducts: state => state.products,
  
  currentProduct: state => state.currentProduct,
  
  isLoading: state => state.loading,
  
  error: state => state.error,
  
  searchQuery: state => state.searchQuery,
  
  selectedCategory: state => state.selectedCategory,
  
  // Filtered products based on search and category
  filteredProducts: state => {
    let filtered = state.products
    
    // Filter by category
    if (state.selectedCategory && state.selectedCategory !== '') {
      filtered = filtered.filter(product => 
        product.category === state.selectedCategory
      )
    }
    
    // Filter by search query
    if (state.searchQuery && state.searchQuery.trim() !== '') {
      const query = state.searchQuery.toLowerCase().trim()
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.code.toLowerCase().includes(query)
      )
    }
    
    return filtered
  },
  
  // Product categories
  categories: state => {
    const categories = [...new Set(state.products.map(p => p.category))]
    return categories.sort()
  },
  
  // Products by category
  productsByCategory: state => {
    const categories = {}
    state.products.forEach(product => {
      if (!categories[product.category]) {
        categories[product.category] = []
      }
      categories[product.category].push(product)
    })
    return categories
  },
  
  // Get product by ID
  getProductById: state => id => {
    return state.products.find(product => product._id === id)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}