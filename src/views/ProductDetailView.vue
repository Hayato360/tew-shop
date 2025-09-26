<template>
  <v-container>
    <v-row>
      <!-- Loading State -->
      <v-col cols="12" v-if="loading">
        <v-skeleton-loader type="article"></v-skeleton-loader>
      </v-col>

      <!-- Error State -->
      <v-col cols="12" v-else-if="error">
        <v-alert type="error" dismissible>
          {{ error }}
        </v-alert>
        <v-btn @click="$router.go(-1)" color="primary">
          <v-icon left>mdi-arrow-left</v-icon>
          Back
        </v-btn>
      </v-col>

      <!-- Product Detail -->
      <v-col cols="12" v-else-if="product">
        <!-- Breadcrumb -->
        <v-breadcrumbs :items="breadcrumbs" divider=">"></v-breadcrumbs>

        <v-row>
          <!-- Product Image -->
          <v-col cols="12" md="6">
            <v-card flat>
              <v-img
                :src="product.image || '/img/product-placeholder.jpg'"
                :alt="product.name"
                height="400"
                contain
                class="grey lighten-4"
              >
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-icon size="100" color="grey lighten-1">mdi-package-variant</v-icon>
                  </v-row>
                </template>
              </v-img>
            </v-card>
          </v-col>

          <!-- Product Info -->
          <v-col cols="12" md="6">
            <div class="product-info">
              <!-- Product Code -->
              <v-chip v-if="product.code" small color="primary" outlined class="mb-2">
                Code: {{ product.code }}
              </v-chip>

              <!-- Product Title -->
              <h1 class="display-1 font-weight-bold mb-4">{{ product.name }}</h1>

              <!-- Price -->
              <div class="price-section mb-4">
                <span class="display-2 font-weight-bold primary--text">
                  ฿{{ formatPrice(product.price) }}
                </span>
              </div>

              <!-- Stock Status -->
              <div class="stock-section mb-4">
                <v-chip 
                  :color="stockColor"
                  :text-color="stockTextColor"
                  small
                >
                  <v-icon left small>{{ stockIcon }}</v-icon>
                  {{ stockText }}
                </v-chip>
                <span class="ml-2 text--secondary">
                  {{ product.stock }} units available
                </span>
              </div>

              <!-- Description -->
              <div class="description-section mb-6">
                <h3 class="headline mb-2">Description</h3>
                <p class="body-1">{{ product.description || 'No description available.' }}</p>
              </div>

              <!-- Add to Cart Section -->
              <div class="cart-section">
                <v-row align="center">
                  <v-col cols="auto">
                    <v-text-field
                      v-model.number="quantity"
                      type="number"
                      min="1"
                      :max="product.stock"
                      outlined
                      dense
                      style="width: 100px"
                      label="Qty"
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <v-btn
                      color="primary"
                      large
                      block
                      :disabled="!canAddToCart"
                      :loading="addingToCart"
                      @click="addToCart"
                    >
                      <v-icon left>mdi-cart-plus</v-icon>
                      Add to Cart
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- Product Specifications -->
        <v-row class="mt-8">
          <v-col cols="12">
            <v-card>
              <v-card-title>
                <v-icon left>mdi-information-outline</v-icon>
                Product Specifications
              </v-card-title>
              <v-card-text>
                <v-simple-table>
                  <tbody>
                    <tr v-if="product.code">
                      <td class="font-weight-bold">Product Code</td>
                      <td>{{ product.code }}</td>
                    </tr>
                    <tr>
                      <td class="font-weight-bold">Stock</td>
                      <td>{{ product.stock }} units</td>
                    </tr>
                    <tr>
                      <td class="font-weight-bold">Price</td>
                      <td>฿{{ formatPrice(product.price) }}</td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      bottom
    >
      {{ snackbar.message }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.show = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ProductDetailView',
  data() {
    return {
      product: null,
      loading: true,
      error: null,
      quantity: 1,
      addingToCart: false,
      snackbar: {
        show: false,
        message: '',
        color: 'success'
      }
    }
  },
  computed: {
    ...mapGetters('cart', ['cartItems']),
    ...mapGetters('products', ['getProductById', 'products']),
    productId() {
      return this.$route.params.id
    },
    breadcrumbs() {
      return [
        { text: 'Home', to: '/', exact: true },
        { text: 'Products', to: '/products', exact: true },
        { text: this.product ? this.product.name : 'Product', disabled: true }
      ]
    },
    canAddToCart() {
      return this.product && 
             this.product.stock > 0 && 
             this.quantity > 0 && 
             this.quantity <= this.product.stock
    },
    stockColor() {
      if (!this.product) return 'grey'
      if (this.product.stock === 0) return 'red'
      if (this.product.stock <= 5) return 'orange'
      return 'green'
    },
    stockTextColor() {
      return 'white'
    },
    stockIcon() {
      if (!this.product) return 'mdi-help'
      if (this.product.stock === 0) return 'mdi-close-circle'
      if (this.product.stock <= 5) return 'mdi-alert-circle'
      return 'mdi-check-circle'
    },
    stockText() {
      if (!this.product) return 'Unknown'
      if (this.product.stock === 0) return 'Out of Stock'
      if (this.product.stock <= 5) return 'Low Stock'
      return 'In Stock'
    }
  },
  async created() {
    await this.fetchProduct()
  },
  methods: {
    ...mapActions('products', ['fetchProducts', 'fetchProductById']),
    ...mapActions('cart', { 
      addToCartAction: 'addToCart'
    }),
    async fetchProduct() {
      try {
        this.loading = true
        this.error = null
        
        // If products not loaded yet, load them first
        if (!this.products || this.products.length === 0) {
          await this.fetchProducts()
        }
        
        // Then try to get the specific product
        let product = this.getProductById(this.productId)
        
        if (!product) {
          // If still not found, try to fetch individual product
          try {
            await this.fetchProductById(this.productId)
            product = this.getProductById(this.productId)
          } catch (fetchError) {
            console.warn('Could not fetch individual product, might not be implemented on API:', fetchError)
          }
        }
        
        if (product) {
          this.product = product
        } else {
          this.error = 'Product not found'
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        this.error = 'Failed to load product details'
      } finally {
        this.loading = false
      }
    },
    async addToCart() {
      try {
        this.addingToCart = true
        
        await this.addToCartAction({
          productId: this.product._id,
          qty: this.quantity
        })

        this.showSnackbar('Added to cart successfully!', 'success')
        
        // Reset quantity
        this.quantity = 1
      } catch (error) {
        console.error('Error adding to cart:', error)
        this.showSnackbar('Failed to add to cart', 'error')
      } finally {
        this.addingToCart = false
      }
    },
    showSnackbar(message, color = 'success') {
      this.snackbar.message = message
      this.snackbar.color = color
      this.snackbar.show = true
    },
    formatPrice(price) {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(price)
    }
  },
  watch: {
    '$route'() {
      // Refetch product if route changes
      this.fetchProduct()
    }
  }
}
</script>

<style scoped>
.product-info {
  padding: 20px;
}

.price-section {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 16px;
}

.stock-section {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 16px;
}

.description-section {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 24px;
}

.cart-section {
  margin-top: 24px;
}
</style>