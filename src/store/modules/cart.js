import { cartService } from '../../services/cartService'

const state = {
  cart: {
    _id: null,
    user: null,
    items: [],
    createdAt: null,
    updatedAt: null
  },
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
  
  SET_CART(state, cart) {
    state.cart = cart
  },
  
  ADD_TO_CART_SUCCESS(state, updatedCart) {
    state.cart = updatedCart
  },
  
  UPDATE_CART_ITEM_SUCCESS(state, updatedCart) {
    state.cart = updatedCart
  },
  
  REMOVE_ITEM_SUCCESS(state, updatedCart) {
    state.cart = updatedCart
  },
  
  CLEAR_CART_SUCCESS(state) {
    state.cart.items = []
    state.cart.updatedAt = new Date().toISOString()
  }
}

const actions = {
  async fetchCart({ commit }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      const response = await cartService.getCart()
      commit('SET_CART', response.data)
    } catch (error) {
      commit('SET_ERROR', 'Failed to fetch cart')
      console.error('Error fetching cart:', error)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async addToCart({ commit }, { productId, qty = 1 }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      const response = await cartService.addToCart(productId, qty)
      commit('ADD_TO_CART_SUCCESS', response.data)
      return response
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add item to cart'
      commit('SET_ERROR', errorMessage)
      console.error('Error adding to cart:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async updateItemQuantity({ commit }, { productId, qty }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      const response = await cartService.updateItemQuantity(productId, qty)
      commit('UPDATE_CART_ITEM_SUCCESS', response.data)
      return response
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update item quantity'
      commit('SET_ERROR', errorMessage)
      console.error('Error updating item quantity:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async removeItem({ commit }, productId) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      const response = await cartService.removeItem(productId)
      commit('REMOVE_ITEM_SUCCESS', response.data)
      return response
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to remove item from cart'
      commit('SET_ERROR', errorMessage)
      console.error('Error removing item from cart:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async clearCart({ commit }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      await cartService.clearCart()
      commit('CLEAR_CART_SUCCESS')
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to clear cart'
      commit('SET_ERROR', errorMessage)
      console.error('Error clearing cart:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async checkout({ commit }, orderCode) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      const response = await cartService.checkout(orderCode)
      commit('CLEAR_CART_SUCCESS') // Clear cart after successful checkout
      return response
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Checkout failed'
      commit('SET_ERROR', errorMessage)
      console.error('Error during checkout:', error)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  clearError({ commit }) {
    commit('SET_ERROR', null)
  }
}

const getters = {
  cart: state => state.cart,
  
  cartItems: state => state.cart.items || [],
  
  isLoading: state => state.loading,
  
  error: state => state.error,
  
  // Cart summary calculations
  itemCount: state => {
    return state.cart.items?.reduce((total, item) => total + item.qty, 0) || 0
  },
  
  totalAmount: state => {
    return state.cart.items?.reduce((total, item) => {
      return total + (item.product?.price * item.qty || 0)
    }, 0) || 0
  },
  
  // Check if cart is empty
  isEmpty: state => {
    return !state.cart.items || state.cart.items.length === 0
  },
  
  // Get specific item from cart
  getCartItem: state => productId => {
    return state.cart.items?.find(item => item.product?._id === productId) || null
  },
  
  // Check if product is in cart
  isInCart: state => productId => {
    return state.cart.items?.some(item => item.product?._id === productId) || false
  },
  
  // Get item quantity for specific product
  getItemQuantity: state => productId => {
    const item = state.cart.items?.find(item => item.product?._id === productId)
    return item ? item.qty : 0
  },
  
  // Formatted total amount
  formattedTotalAmount: (state, getters) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(getters.totalAmount)
  },
  
  // Cart items with calculated subtotals
  cartItemsWithSubtotals: state => {
    return state.cart.items?.map(item => ({
      ...item,
      subtotal: (item.product?.price || 0) * item.qty,
      formattedSubtotal: new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB'
      }).format((item.product?.price || 0) * item.qty)
    })) || []
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}