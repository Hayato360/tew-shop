<template>
  <v-container fluid class="products-page">
    <!-- Header Section -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="text-center mb-8">
          <h1 class="gaming-title">💻 Tech Store</h1>
          <!-- <p class="subtitle-1 mt-2">เทคโนโลยีคุณภาพสูง พร้อมส่งถึงมือคุณ</p> -->
        </div>
      </v-col>
    </v-row>

    <!-- Search and Filter Section -->
    <v-row class="mb-6">
      <v-col cols="12" md="12">
        <v-text-field
          v-model="searchQuery"
          prepend-inner-icon="mdi-magnify"
          label="ค้นหาสินค้า..."
          outlined
          dense
          clearable
          class="gaming-input"
          @input="handleSearchInput"
        ></v-text-field>
      </v-col>
      <!-- Remove category filter for now
      <v-col cols="12" md="4">
        <v-select
          v-model="selectedCategory"
          :items="categoryOptions"
          label="หมวดหมู่"
          outlined
          dense
          clearable
          class="gaming-input"
          @change="handleCategoryChange"
        ></v-select>
      </v-col>
      -->
    </v-row>

    <!-- Loading State -->
    <v-row v-if="isLoading" class="justify-center">
      <v-col cols="12" class="text-center py-12">
        <v-progress-circular
          :size="60"
          :width="6"
          color="primary"
          indeterminate
        ></v-progress-circular>
        <p class="mt-4">กำลังโหลดสินค้า...</p>
      </v-col>
    </v-row>

    <!-- Error State -->
    <v-row v-else-if="error" class="justify-center">
      <v-col cols="12" md="6">
        <v-alert
          type="error"
          prominent
          border="left"
          class="gaming-alert"
        >
          <v-row align="center">
            <v-col class="grow">{{ error }}</v-col>
            <v-col class="shrink">
              <v-btn @click="retryFetch" color="error" small>
                ลองใหม่
              </v-btn>
            </v-col>
          </v-row>
        </v-alert>
      </v-col>
    </v-row>

    <!-- Products Grid -->
    <v-row v-else-if="filteredProducts.length > 0">
      <v-col
        v-for="product in filteredProducts"
        :key="product._id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card
          class="product-card gaming-card"
          elevation="2"
          min-height="380px"
          @click="viewProductDetail(product)"
        >
          <!-- Product Image -->
          <div class="product-image-container">
            <v-img
              :src="product.image || '/img/products/default.jpg'"
              :alt="product.name"
              height="200"
              class="product-image"
            >
              <template v-slot:placeholder>
                <v-row
                  class="fill-height ma-0"
                  align="center"
                  justify="center"
                >
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-2"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>

            <!-- Stock Badge -->
            <div class="stock-badge">
              <v-chip
                :color="getStockColor(product.stock)"
                small
                dark
              >
                คงเหลือ {{ product.stock }}
              </v-chip>
            </div>

            <!-- Category Badge - Hide for now since API doesn't have category -->
            <!-- <div class="category-badge">
              <v-chip
                :color="getCategoryColor(product.category)"
                small
                outlined
              >
                {{ getCategoryLabel(product.category) }}
              </v-chip>
            </div> -->
          </div>

          <!-- Product Content -->
          <v-card-title class="pb-2">
            <div class="product-title">
              {{ product.name }}
            </div>
          </v-card-title>

          <v-card-subtitle class="pt-0 pb-2">
            <div class="product-code text--secondary">
              รหัส: {{ product.code }}
            </div>
          </v-card-subtitle>

          <v-card-text class="py-2">
            <div class="product-description">
              {{ truncateText(product.description, 80) }}
            </div>
          </v-card-text>

          <!-- Price and Actions -->
          <v-card-actions class="pt-0">
            <div class="d-flex justify-space-between align-center w-100">
              <div class="price-section">
                <span class="price-text">
                  ฿{{ formatPrice(product.price) }}
                </span>
              </div>
              
              <div class="action-buttons">
                <v-btn
                  :disabled="product.stock <= 0"
                  :loading="addingToCart === product._id"
                  @click.stop="addToCart(product)"
                  color="primary"
                  small
                  depressed
                >
                  <v-icon small left>mdi-cart-plus</v-icon>
                  {{ getCartButtonText(product) }}
                </v-btn>
              </div>
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-row v-else class="justify-center">
      <v-col cols="12" md="6" class="text-center py-12">
        <div class="empty-state">
          <v-icon size="80" color="grey lighten-2">mdi-package-variant</v-icon>
          <h3 class="mt-4 mb-2">ไม่พบสินค้า</h3>
          <p class="text--secondary">
            ลองเปลี่ยนคำค้นหา
          </p>
          <v-btn
            @click="clearFilters"
            color="primary"
            outlined
            class="mt-4"
          >
            ดูสินค้าทั้งหมด
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="showSuccessMessage"
      :timeout="3000"
      color="success"
      bottom
      right
    >
      {{ successMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="showSuccessMessage = false"
        >
          ปิด
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Error Snackbar -->
    <v-snackbar
      v-model="showErrorMessage"
      :timeout="5000"
      color="error"
      bottom
      right
    >
      {{ errorMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="showErrorMessage = false"
        >
          ปิด
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'ProductsView',
  data() {
    return {
      searchQuery: '',
      selectedCategory: '',
      addingToCart: null,
      successMessage: '',
      showSuccessMessage: false,
      errorMessage: '',
      showErrorMessage: false
    }
  },
  computed: {
    ...mapState('products', {
      isLoading: 'loading',
      error: 'error'
    }),
    ...mapGetters('products', [
      'filteredProducts',
      'categories'
    ]),
    ...mapGetters('cart', [
      'isInCart',
      'getItemQuantity'
    ]),

    categoryOptions() {
      const options = [
        { text: 'ทั้งหมด', value: '' }
      ]
      
      this.categories.forEach(category => {
        options.push({
          text: this.getCategoryLabel(category),
          value: category
        })
      })
      
      return options
    }
  },
  async mounted() {
    await this.fetchProducts()
    await this.fetchCart()
  },
  methods: {
    ...mapActions('products', [
      'fetchProducts',
      'setSearchQuery',
      'setSelectedCategory'
    ]),
    ...mapActions('cart', [
      'fetchCart',
      'addToCart as addItemToCart'
    ]),

    handleSearchInput() {
      this.setSearchQuery(this.searchQuery)
    },

    handleCategoryChange() {
      this.setSelectedCategory(this.selectedCategory)
    },

    clearFilters() {
      this.searchQuery = ''
      this.setSearchQuery('')
    },

    async retryFetch() {
      await this.fetchProducts()
    },

    viewProductDetail(product) {
      // Navigate to product detail page
      this.$router.push(`/products/${product._id}`)
    },

    async addToCart(product) {
      if (product.stock <= 0) {
        this.showError('สินค้าหมดสต็อก')
        return
      }

      this.addingToCart = product._id
      
      try {
        await this.addItemToCart({ 
          productId: product._id, 
          qty: 1 
        })
        
        this.showSuccess(`เพิ่ม "${product.name}" ลงตะกร้าแล้ว`)
      } catch (error) {
        this.showError(error.message || 'เกิดข้อผิดพลาด')
      } finally {
        this.addingToCart = null
      }
    },

    getCartButtonText(product) {
      if (product.stock <= 0) {
        return 'หมดสต็อก'
      }
      
      const quantity = this.getItemQuantity(product._id)
      if (quantity > 0) {
        return `ในตะกร้า (${quantity})`
      }
      
      return 'เพิ่มลงตะกร้า'
    },

    getStockColor(stock) {
      if (stock <= 0) return 'red'
      if (stock <= 10) return 'orange'
      return 'green'
    },

    getCategoryColor(category) {
      const colors = {
        'laptop': 'purple',
        'desktop': 'blue',
        'accessory': 'teal',
        'software': 'orange'
      }
      return colors[category] || 'grey'
    },

    getCategoryLabel(category) {
      const labels = {
        'laptop': '💻 Laptop',
        'desktop': '🖥️ Desktop',
        'accessory': '🖱️ อุปกรณ์',
        'software': '💿 Software'
      }
      return labels[category] || category
    },

    formatPrice(price) {
      return new Intl.NumberFormat('th-TH').format(price)
    },

    truncateText(text, maxLength) {
      if (!text) return ''
      if (text.length <= maxLength) return text
      return text.substring(0, maxLength) + '...'
    },

    showSuccess(message) {
      this.successMessage = message
      this.showSuccessMessage = true
    },

    showError(message) {
      this.errorMessage = message
      this.showErrorMessage = true
    }
  }
}
</script>

<style scoped>
.products-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-top: 2rem;
}

.gaming-title {
  font-size: 3rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 1rem;
}

.gradient-text {
  background: linear-gradient(45deg, #ff6b6b, #ffd93d, #6bcf7f, #4d9de0);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 3s ease infinite;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.gaming-input >>> .v-input__control {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
}

.gaming-input >>> .v-input__slot {
  backdrop-filter: blur(10px);
}

.product-card {
  border-radius: 15px;
  transition: all 0.3s ease;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2) !important;
}

.product-image-container {
  position: relative;
  overflow: hidden;
}

.product-image {
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.stock-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
}

.category-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 2;
}

.product-title {
  font-weight: bold;
  font-size: 1.1rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-code {
  font-size: 0.85rem;
}

.product-description {
  color: rgba(0, 0, 0, 0.7);
  line-height: 1.4;
  font-size: 0.9rem;
}

.price-section .price-text {
  font-size: 1.2rem;
  font-weight: bold;
  color: #1976d2;
}

.action-buttons .v-btn {
  border-radius: 8px;
  text-transform: none;
  font-weight: 500;
}

.gaming-alert {
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.empty-state {
  padding: 2rem;
}

.empty-state .v-icon {
  opacity: 0.5;
}

.empty-state h3 {
  color: rgba(0, 0, 0, 0.8);
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .gaming-title {
    font-size: 2rem;
  }
  
  .product-card {
    margin-bottom: 1rem;
  }
}

/* Animation for loading cards */
.product-card {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>