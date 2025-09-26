// Mock gaming products data
const mockProducts = [
  {
    _id: '1',
    code: 'GAME001',
    name: '🎮 PlayStation 5',
    description: 'The ultimate gaming console with ultra-fast SSD and stunning 4K graphics. Experience next-generation gaming with immersive 3D audio and haptic feedback.',
    price: 17900,
    stock: 15,
    category: 'console',
    image: '/img/products/ps5.jpg',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    _id: '2',
    code: 'GAME002',
    name: '🎯 Xbox Series X',
    description: 'Microsoft\'s most powerful console ever. 12 teraflops of raw graphic power and thousands of games across four generations.',
    price: 16900,
    stock: 20,
    category: 'console',
    image: '/img/products/xbox.jpg',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    _id: '3',
    code: 'GAME003',
    name: '⚔️ The Legend of Zelda: Breath of the Wild',
    description: 'Embark on an epic adventure in the kingdom of Hyrule. Explore vast landscapes and discover ancient ruins.',
    price: 1890,
    stock: 50,
    category: 'game',
    image: '/img/products/zelda.jpg',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    _id: '4',
    code: 'GAME004',
    name: '🗡️ Elden Ring',
    description: 'A fantasy action RPG adventure set in the Lands Between. Rise, Tarnished, and be guided by grace.',
    price: 2190,
    stock: 35,
    category: 'game',
    image: '/img/products/elden-ring.jpg',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    _id: '5',
    code: 'GAME005',
    name: '🎮 DualSense Wireless Controller',
    description: 'Experience haptic feedback and adaptive triggers. The most advanced PlayStation controller ever.',
    price: 2490,
    stock: 40,
    category: 'accessory',
    image: '/img/products/dualsense.jpg',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    _id: '6',
    code: 'GAME006',
    name: '🎧 SteelSeries Arctis 7P',
    description: 'Premium wireless gaming headset with lossless 2.4GHz audio and 24-hour battery life.',
    price: 6900,
    stock: 25,
    category: 'accessory',
    image: '/img/products/headset.jpg',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    _id: '7',
    code: 'GAME007',
    name: '🔥 Cyberpunk 2077',
    description: 'An open-world RPG set in the futuristic Night City. Become a cyberpunk, an urban mercenary equipped with cybernetic enhancements.',
    price: 1590,
    stock: 60,
    category: 'game',
    image: '/img/products/cyberpunk.jpg',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    _id: '8',
    code: 'GAME008',
    name: '🌟 Nintendo Switch OLED',
    description: 'Enhanced Nintendo Switch with vivid OLED screen and improved audio. Play at home or on the go.',
    price: 12500,
    stock: 18,
    category: 'console',
    image: '/img/products/switch.jpg',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }
]

// Mock cart data
let mockCart = {
  _id: 'cart1',
  user: '2', // gamer123
  items: [],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z'
}

// Mock orders data
const mockOrders = []

let nextProductId = 9
let nextOrderId = 1

// Helper function to generate order code
const generateOrderCode = () => {
  const now = new Date()
  const dateStr = now.toISOString().split('T')[0].replace(/-/g, '')
  const orderNum = String(nextOrderId++).padStart(3, '0')
  return `ORD-${dateStr}-${orderNum}`
}

// Mock Product Service
export const mockProductService = {
  getAllProducts() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: [...mockProducts]
        })
      }, 500)
    })
  },

  getProductById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const product = mockProducts.find(p => p._id === id)
        if (!product) {
          reject({
            response: {
              status: 404,
              data: { message: 'Product not found' }
            }
          })
          return
        }
        resolve({
          data: product
        })
      }, 300)
    })
  },

  createProduct(productData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check for duplicate code
        const existingProduct = mockProducts.find(p => p.code === productData.code)
        if (existingProduct) {
          reject({
            response: {
              status: 400,
              data: { message: 'Product code already exists' }
            }
          })
          return
        }

        const newProduct = {
          _id: String(nextProductId++),
          ...productData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        mockProducts.push(newProduct)

        resolve({
          data: {
            message: 'Product created successfully',
            product: newProduct
          }
        })
      }, 800)
    })
  },

  updateProduct(id, productData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const productIndex = mockProducts.findIndex(p => p._id === id)
        if (productIndex === -1) {
          reject({
            response: {
              status: 404,
              data: { message: 'Product not found' }
            }
          })
          return
        }

        mockProducts[productIndex] = {
          ...mockProducts[productIndex],
          ...productData,
          updatedAt: new Date().toISOString()
        }

        resolve({
          data: {
            message: 'Product updated successfully',
            product: mockProducts[productIndex]
          }
        })
      }, 600)
    })
  },

  deleteProduct(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const productIndex = mockProducts.findIndex(p => p._id === id)
        if (productIndex === -1) {
          reject({
            response: {
              status: 404,
              data: { message: 'Product not found' }
            }
          })
          return
        }

        mockProducts.splice(productIndex, 1)
        resolve({
          data: {
            message: 'Product deleted successfully'
          }
        })
      }, 500)
    })
  }
}

// Mock Cart Service
export const mockCartService = {
  getCart() {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Populate product details for cart items
        const populatedCart = {
          ...mockCart,
          items: mockCart.items.map(item => ({
            ...item,
            product: mockProducts.find(p => p._id === item.product)
          })).filter(item => item.product) // Remove items with deleted products
        }
        
        resolve({
          data: populatedCart
        })
      }, 300)
    })
  },

  addToCart(productId, qty) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const product = mockProducts.find(p => p._id === productId)
        if (!product) {
          reject({
            response: {
              status: 404,
              data: { message: 'Product not found' }
            }
          })
          return
        }

        if (qty <= 0) {
          reject({
            response: {
              status: 400,
              data: { message: 'Quantity must be greater than 0' }
            }
          })
          return
        }

        if (product.stock < qty) {
          reject({
            response: {
              status: 400,
              data: { message: 'Not enough stock' }
            }
          })
          return
        }

        // Check if product already in cart
        const existingItemIndex = mockCart.items.findIndex(item => item.product === productId)
        
        if (existingItemIndex !== -1) {
          // Update existing item quantity
          const newQty = mockCart.items[existingItemIndex].qty + qty
          if (product.stock < newQty) {
            reject({
              response: {
                status: 400,
                data: { message: 'Not enough stock' }
              }
            })
            return
          }
          mockCart.items[existingItemIndex].qty = newQty
        } else {
          // Add new item to cart
          mockCart.items.push({
            _id: `item_${Date.now()}`,
            product: productId,
            qty: qty
          })
        }

        mockCart.updatedAt = new Date().toISOString()

        // Return populated cart
        const populatedCart = {
          ...mockCart,
          items: mockCart.items.map(item => ({
            ...item,
            product: mockProducts.find(p => p._id === item.product)
          }))
        }

        resolve({
          data: populatedCart
        })
      }, 500)
    })
  },

  updateItemQuantity(productId, qty) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const product = mockProducts.find(p => p._id === productId)
        if (!product) {
          reject({
            response: {
              status: 404,
              data: { message: 'Product not found' }
            }
          })
          return
        }

        if (qty <= 0) {
          reject({
            response: {
              status: 400,
              data: { message: 'Quantity must be greater than 0' }
            }
          })
          return
        }

        if (product.stock < qty) {
          reject({
            response: {
              status: 400,
              data: { message: 'Not enough stock' }
            }
          })
          return
        }

        const itemIndex = mockCart.items.findIndex(item => item.product === productId)
        if (itemIndex === -1) {
          reject({
            response: {
              status: 404,
              data: { message: 'Item not found in cart' }
            }
          })
          return
        }

        mockCart.items[itemIndex].qty = qty
        mockCart.updatedAt = new Date().toISOString()

        // Return populated cart
        const populatedCart = {
          ...mockCart,
          items: mockCart.items.map(item => ({
            ...item,
            product: mockProducts.find(p => p._id === item.product)
          }))
        }

        resolve({
          data: populatedCart
        })
      }, 400)
    })
  },

  removeItem(productId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockCart.items = mockCart.items.filter(item => item.product !== productId)
        mockCart.updatedAt = new Date().toISOString()

        // Return populated cart
        const populatedCart = {
          ...mockCart,
          items: mockCart.items.map(item => ({
            ...item,
            product: mockProducts.find(p => p._id === item.product)
          }))
        }

        resolve({
          data: populatedCart
        })
      }, 300)
    })
  },

  clearCart() {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockCart.items = []
        mockCart.updatedAt = new Date().toISOString()
        resolve({
          data: {
            message: 'Cart cleared successfully'
          }
        })
      }, 300)
    })
  },

  checkout(orderCode) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!orderCode) {
          reject({
            response: {
              status: 400,
              data: { message: 'Order code is required' }
            }
          })
          return
        }

        if (mockCart.items.length === 0) {
          reject({
            response: {
              status: 400,
              data: { message: 'Cart is empty' }
            }
          })
          return
        }

        // Check if order code already exists
        const existingOrder = mockOrders.find(o => o.orderCode === orderCode)
        if (existingOrder) {
          reject({
            response: {
              status: 400,
              data: { message: 'Order code already exists' }
            }
          })
          return
        }

        // Check stock for all items
        for (const cartItem of mockCart.items) {
          const product = mockProducts.find(p => p._id === cartItem.product)
          if (!product || product.stock < cartItem.qty) {
            reject({
              response: {
                status: 400,
                data: { message: `Not enough stock for ${product?.name || 'product'}` }
              }
            })
            return
          }
        }

        // Calculate total and create order items
        let totalAmount = 0
        const orderItems = mockCart.items.map(cartItem => {
          const product = mockProducts.find(p => p._id === cartItem.product)
          const itemTotal = product.price * cartItem.qty
          totalAmount += itemTotal

          return {
            _id: `orderitem_${Date.now()}_${product._id}`,
            product: product._id,
            productCode: product.code,
            name: product.name,
            qty: cartItem.qty,
            price: product.price,
            total: itemTotal
          }
        })

        // Reduce stock
        mockCart.items.forEach(cartItem => {
          const productIndex = mockProducts.findIndex(p => p._id === cartItem.product)
          if (productIndex !== -1) {
            mockProducts[productIndex].stock -= cartItem.qty
          }
        })

        // Create order
        const newOrder = {
          _id: `order_${Date.now()}`,
          orderCode,
          items: orderItems,
          buyer: mockCart.user,
          totalAmount,
          status: 'pending',
          completedAt: null,
          createdAt: new Date().toISOString()
        }

        mockOrders.push(newOrder)

        // Clear cart
        mockCart.items = []
        mockCart.updatedAt = new Date().toISOString()

        resolve({
          data: newOrder
        })
      }, 1000)
    })
  }
}

// Mock Order Service
export const mockOrderService = {
  createOrder(orderData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // This is typically not used directly, but implemented for completeness
        if (mockOrders.find(o => o.orderCode === orderData.orderCode)) {
          reject({
            response: {
              status: 400,
              data: { message: 'Order code already exists' }
            }
          })
          return
        }

        // Implementation would be similar to checkout but more complex
        // For now, just return a basic response
        resolve({
          data: {
            message: 'Order created successfully'
          }
        })
      }, 800)
    })
  },

  getAllOrders() {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In real implementation, this would filter based on user role
        // Admin sees all orders, user sees only their orders
        const currentUser = localStorage.getItem('mockUser')
        const isAdmin = currentUser === 'admin'

        let orders
        if (isAdmin) {
          orders = [...mockOrders]
        } else {
          orders = mockOrders.filter(order => order.buyer === mockCart.user)
        }

        resolve({
          data: orders
        })
      }, 500)
    })
  },

  getOrderById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const order = mockOrders.find(o => o._id === id)
        if (!order) {
          reject({
            response: {
              status: 404,
              data: { message: 'Order not found' }
            }
          })
          return
        }

        // Check access permissions
        const currentUser = localStorage.getItem('mockUser')
        const isAdmin = currentUser === 'admin'

        if (!isAdmin && order.buyer !== mockCart.user) {
          reject({
            response: {
              status: 403,
              data: { message: 'Forbidden' }
            }
          })
          return
        }

        resolve({
          data: order
        })
      }, 300)
    })
  },

  updateOrderStatus(id, status) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const validStatuses = ['pending', 'processing', 'completed', 'cancelled']
        if (!validStatuses.includes(status)) {
          reject({
            response: {
              status: 400,
              data: { message: 'Invalid status' }
            }
          })
          return
        }

        const orderIndex = mockOrders.findIndex(o => o._id === id)
        if (orderIndex === -1) {
          reject({
            response: {
              status: 404,
              data: { message: 'Order not found' }
            }
          })
          return
        }

        mockOrders[orderIndex].status = status
        if (status === 'completed') {
          mockOrders[orderIndex].completedAt = new Date().toISOString()
        }

        resolve({
          data: mockOrders[orderIndex]
        })
      }, 500)
    })
  },

  getOrdersByStatus(status) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const validStatuses = ['pending', 'processing', 'completed', 'cancelled']
        if (!validStatuses.includes(status)) {
          reject({
            response: {
              status: 400,
              data: { message: 'Invalid status' }
            }
          })
          return
        }

        const filteredOrders = mockOrders.filter(order => order.status === status)
        resolve({
          data: filteredOrders
        })
      }, 400)
    })
  }
}

export { generateOrderCode }