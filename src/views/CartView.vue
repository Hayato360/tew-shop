<template>
  <v-container fluid class="cart-page">
    <!-- Header Section -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="text-center mb-8">
          <h1 class="gaming-title gradient-text">🛒 ตะกร้าสินค้า</h1>
          <p class="subtitle-1 mt-2">จัดการสินค้าในตะกร้าของคุณ</p>
        </div>
      </v-col>
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
        <p class="mt-4">กำลังโหลดตะกร้า...</p>
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

    <!-- Empty Cart -->
    <v-row v-else-if="isEmpty" class="justify-center">
      <v-col cols="12" md="6" class="text-center py-12">
        <div class="empty-cart">
          <v-icon size="120" color="grey lighten-2">mdi-cart-off</v-icon>
          <h2 class="mt-6 mb-4">ตะกร้าของคุณว่างเปล่า</h2>
          <p class="text--secondary mb-6">
            เพิ่มสินค้าที่คุณต้องการลงในตะกร้า
          </p>
          <v-btn
            @click="goToProducts"
            color="primary"
            large
            depressed
            class="gaming-btn"
          >
            <v-icon left>mdi-shopping</v-icon>
            เลือกซื้อสินค้า
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Cart Items -->
    <div v-else>
      <v-row>
        <v-col cols="12" lg="8">
          <v-card class="gaming-card cart-items-card">
            <v-card-title class="d-flex justify-space-between align-center">
              <span>
                <v-icon left color="primary">mdi-cart</v-icon>
                สินค้าในตะกร้า ({{ itemCount }} รายการ)
              </span>
              <v-btn
                @click="confirmClearCart"
                color="error"
                text
                small
                :disabled="clearingCart"
              >
                <v-icon small left>mdi-delete</v-icon>
                ล้างตะกร้า
              </v-btn>
            </v-card-title>
            
            <v-divider></v-divider>

            <div class="cart-items">
              <div
                v-for="(item, index) in cartItemsWithSubtotals"
                :key="item._id"
                class="cart-item"
              >
                <v-row align="center" class="py-3">
                  <!-- Product Image -->
                  <v-col cols="3" sm="2">
                    <v-img
                      :src="item.product?.image || '/img/products/default.jpg'"
                      :alt="item.product?.name"
                      height="80"
                      width="80"
                      class="cart-item-image"
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
                            size="20"
                          ></v-progress-circular>
                        </v-row>
                      </template>
                    </v-img>
                  </v-col>

                  <!-- Product Info -->
                  <v-col cols="9" sm="4">
                    <div class="cart-item-info">
                      <h4 class="cart-item-name">{{ item.product?.name }}</h4>
                      <p class="cart-item-code text--secondary">
                        รหัส: {{ item.product?.code }}
                      </p>
                      <p class="cart-item-price">
                        ฿{{ formatPrice(item.product?.price) }}
                      </p>
                    </div>
                  </v-col>

                  <!-- Quantity Controls -->
                  <v-col cols="6" sm="3" class="text-center">
                    <div class="quantity-controls">
                      <v-btn
                        @click="decreaseQuantity(item)"
                        :disabled="updatingItems[item.product?._id] || item.qty <= 1"
                        icon
                        small
                        color="primary"
                      >
                        <v-icon>mdi-minus</v-icon>
                      </v-btn>
                      
                      <span class="quantity-display mx-3">{{ item.qty }}</span>
                      
                      <v-btn
                        @click="increaseQuantity(item)"
                        :disabled="updatingItems[item.product?._id] || item.qty >= item.product?.stock"
                        icon
                        small
                        color="primary"
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </div>
                    <div class="stock-info mt-2">
                      <small class="text--secondary">
                        คงเหลือ {{ item.product?.stock }} ชิ้น
                      </small>
                    </div>
                  </v-col>

                  <!-- Subtotal and Remove -->
                  <v-col cols="6" sm="3" class="text-right">
                    <div class="cart-item-subtotal">
                      <span class="subtotal-amount">
                        ฿{{ formatPrice(item.subtotal) }}
                      </span>
                      <br>
                      <v-btn
                        @click="confirmRemoveItem(item)"
                        :disabled="removingItems[item.product?._id]"
                        :loading="removingItems[item.product?._id]"
                        icon
                        small
                        color="error"
                        class="mt-2"
                      >
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>

                <v-divider v-if="index < cartItemsWithSubtotals.length - 1"></v-divider>
              </div>
            </div>
          </v-card>
        </v-col>

        <!-- Order Summary -->
        <v-col cols="12" lg="4">
          <v-card class="gaming-card order-summary-card" sticky>
            <v-card-title>
              <v-icon left color="primary">mdi-calculator</v-icon>
              สรุปคำสั่งซื้อ
            </v-card-title>
            
            <v-divider></v-divider>
            
            <v-card-text class="pa-4">
              <div class="order-summary">
                <div class="summary-row">
                  <span>จำนวนสินค้า:</span>
                  <span>{{ itemCount }} รายการ</span>
                </div>
                
                <div class="summary-row">
                  <span>ยอดรวม:</span>
                  <span class="total-amount">
                    ฿{{ formatPrice(totalAmount) }}
                  </span>
                </div>
                
                <v-divider class="my-3"></v-divider>
                
                <div class="summary-row total-row">
                  <span class="total-label">ยอดรวมทั้งสิ้น:</span>
                  <span class="final-total">
                    ฿{{ formatPrice(totalAmount) }}
                  </span>
                </div>
              </div>
            </v-card-text>

            <v-card-actions class="pa-4">
              <v-btn
                @click="proceedToCheckout"
                :disabled="isEmpty || checkingOut"
                :loading="checkingOut"
                color="success"
                large
                block
                depressed
                class="gaming-btn checkout-btn"
              >
                <v-icon left>mdi-credit-card</v-icon>
                ดำเนินการชำระเงิน
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Confirmation Dialogs -->
    <!-- Remove Item Dialog -->
    <v-dialog v-model="showRemoveDialog" max-width="400" persistent>
      <v-card class="gaming-card">
        <v-card-title class="headline">
          <v-icon left color="warning">mdi-alert</v-icon>
          ยืนยันการลบสินค้า
        </v-card-title>
        <v-card-text>
          คุณแน่ใจหรือไม่ที่จะลบ "{{ itemToRemove?.product?.name }}" ออกจากตะกร้า?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showRemoveDialog = false" text>ยกเลิก</v-btn>
          <v-btn @click="removeItemConfirmed" color="error" depressed>
            ลบออก
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Clear Cart Dialog -->
    <v-dialog v-model="showClearDialog" max-width="400" persistent>
      <v-card class="gaming-card">
        <v-card-title class="headline">
          <v-icon left color="warning">mdi-alert</v-icon>
          ยืนยันการล้างตะกร้า
        </v-card-title>
        <v-card-text>
          คุณแน่ใจหรือไม่ที่จะล้างสินค้าทั้งหมดในตะกร้า?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showClearDialog = false" text>ยกเลิก</v-btn>
          <v-btn @click="clearCartConfirmed" color="error" depressed>
            ล้างตะกร้า
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Checkout Dialog -->
    <v-dialog v-model="showCheckoutDialog" max-width="500" persistent>
      <v-card class="gaming-card">
        <v-card-title class="headline">
          <v-icon left color="success">mdi-credit-card</v-icon>
          ยืนยันการสั่งซื้อ
        </v-card-title>
        <v-card-text>
          <div class="checkout-summary">
            <p class="mb-3">กรุณายืนยันรายการสั่งซื้อของคุณ:</p>
            
            <v-simple-table dense>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th>สินค้า</th>
                    <th class="text-center">จำนวน</th>
                    <th class="text-right">ราคา</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in cartItemsWithSubtotals" :key="item._id">
                    <td>{{ truncateText(item.product?.name, 25) }}</td>
                    <td class="text-center">{{ item.qty }}</td>
                    <td class="text-right">฿{{ formatPrice(item.subtotal) }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <th colspan="2">ยอดรวมทั้งสิ้น</th>
                    <th class="text-right success--text">
                      ฿{{ formatPrice(totalAmount) }}
                    </th>
                  </tr>
                </tfoot>
              </template>
            </v-simple-table>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showCheckoutDialog = false" text>ยกเลิก</v-btn>
          <v-btn @click="confirmCheckout" :loading="checkingOut" color="success" depressed>
            ยืนยันการสั่งซื้อ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success/Error Messages -->
    <v-snackbar
      v-model="showSuccessMessage"
      :timeout="3000"
      color="success"
      bottom
      right
    >
      {{ successMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="showSuccessMessage = false">
          ปิด
        </v-btn>
      </template>
    </v-snackbar>

    <v-snackbar
      v-model="showErrorMessage"
      :timeout="5000"
      color="error"
      bottom
      right
    >
      {{ errorMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="showErrorMessage = false">
          ปิด
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import { generateOrderCode } from '../services/mockShopService'

export default {
  name: 'CartView',
  data() {
    return {
      updatingItems: {},
      removingItems: {},
      clearingCart: false,
      checkingOut: false,
      showRemoveDialog: false,
      showClearDialog: false,
      showCheckoutDialog: false,
      itemToRemove: null,
      successMessage: '',
      showSuccessMessage: false,
      errorMessage: '',
      showErrorMessage: false
    }
  },
  computed: {
    ...mapState('cart', {
      isLoading: 'loading',
      error: 'error'
    }),
    ...mapGetters('cart', [
      'cartItemsWithSubtotals',
      'itemCount',
      'totalAmount',
      'isEmpty'
    ])
  },
  async mounted() {
    await this.fetchCart()
  },
  methods: {
    ...mapActions('cart', [
      'fetchCart',
      'updateItemQuantity',
      'removeItem',
      'clearCart',
      'checkout'
    ]),

    async retryFetch() {
      await this.fetchCart()
    },

    goToProducts() {
      this.$router.push('/products')
    },

    async increaseQuantity(item) {
      if (item.qty >= item.product.stock) {
        this.showError('ไม่สามารถเพิ่มได้ เนื่องจากเกินจำนวนที่มีในสต็อก')
        return
      }

      await this.updateQuantity(item, item.qty + 1)
    },

    async decreaseQuantity(item) {
      if (item.qty <= 1) {
        this.confirmRemoveItem(item)
        return
      }

      await this.updateQuantity(item, item.qty - 1)
    },

    async updateQuantity(item, newQuantity) {
      this.$set(this.updatingItems, item.product._id, true)
      
      try {
        await this.updateItemQuantity({
          productId: item.product._id,
          qty: newQuantity
        })
      } catch (error) {
        this.showError(error.message || 'เกิดข้อผิดพลาดในการอัปเดตจำนวน')
      } finally {
        this.$delete(this.updatingItems, item.product._id)
      }
    },

    confirmRemoveItem(item) {
      this.itemToRemove = item
      this.showRemoveDialog = true
    },

    async removeItemConfirmed() {
      if (!this.itemToRemove) return

      const productId = this.itemToRemove.product._id
      this.$set(this.removingItems, productId, true)
      
      try {
        await this.removeItem(productId)
        this.showSuccess(`ลบ "${this.itemToRemove.product.name}" ออกจากตะกร้าแล้ว`)
      } catch (error) {
        this.showError(error.message || 'เกิดข้อผิดพลาดในการลบสินค้า')
      } finally {
        this.$delete(this.removingItems, productId)
        this.showRemoveDialog = false
        this.itemToRemove = null
      }
    },

    confirmClearCart() {
      this.showClearDialog = true
    },

    async clearCartConfirmed() {
      this.clearingCart = true
      
      try {
        await this.clearCart()
        this.showSuccess('ล้างตะกร้าสินค้าแล้ว')
      } catch (error) {
        this.showError(error.message || 'เกิดข้อผิดพลาดในการล้างตะกร้า')
      } finally {
        this.clearingCart = false
        this.showClearDialog = false
      }
    },

    proceedToCheckout() {
      this.showCheckoutDialog = true
    },

    async confirmCheckout() {
      this.checkingOut = true
      
      try {
        const orderCode = generateOrderCode()
        const response = await this.checkout(orderCode)
        
        this.showSuccess('สั่งซื้อสำเร็จ! ขอบคุณสำหรับการสั่งซื้อ')
        
        // Navigate to order success page or order details
        setTimeout(() => {
          this.$router.push(`/orders/${response.data._id}`)
        }, 2000)
        
      } catch (error) {
        this.showError(error.message || 'เกิดข้อผิดพลาดในการสั่งซื้อ')
      } finally {
        this.checkingOut = false
        this.showCheckoutDialog = false
      }
    },

    formatPrice(price) {
      return new Intl.NumberFormat('th-TH').format(price || 0)
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
.cart-page {
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

.gaming-card {
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.gaming-alert {
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.empty-cart {
  padding: 2rem;
}

.gaming-btn {
  border-radius: 10px;
  text-transform: none;
  font-weight: 500;
}

.cart-items-card {
  margin-bottom: 2rem;
}

.cart-item {
  padding: 0 1rem;
}

.cart-item-image {
  border-radius: 8px;
}

.cart-item-info {
  padding-left: 1rem;
}

.cart-item-name {
  font-weight: bold;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.cart-item-code {
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
}

.cart-item-price {
  font-weight: 500;
  color: #1976d2;
  margin: 0;
}

.quantity-controls {
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-display {
  min-width: 2rem;
  text-align: center;
  font-weight: bold;
  font-size: 1.1rem;
}

.stock-info {
  font-size: 0.75rem;
}

.cart-item-subtotal {
  text-align: right;
}

.subtotal-amount {
  font-weight: bold;
  font-size: 1.1rem;
  color: #1976d2;
}

.order-summary-card {
  position: sticky;
  top: 2rem;
}

.order-summary {
  padding: 1rem 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.total-row {
  font-size: 1.1rem;
  font-weight: bold;
}

.total-label {
  font-size: 1.2rem;
}

.final-total {
  font-size: 1.3rem;
  color: #4caf50;
}

.checkout-btn {
  font-size: 1.1rem;
  padding: 1rem !important;
}

.checkout-summary {
  max-height: 300px;
  overflow-y: auto;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .order-summary-card {
    position: static;
    margin-top: 2rem;
  }
}

@media (max-width: 600px) {
  .gaming-title {
    font-size: 2rem;
  }
  
  .cart-item-info {
    padding-left: 0.5rem;
  }
  
  .quantity-controls {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .quantity-controls .v-btn {
    margin: 0;
  }
}

/* Animation for cart items */
.cart-item {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>