<template>
  <v-container fluid class="admin-products-page">
    <v-row>
      <v-col cols="12">
        <!-- Header -->
        <div class="d-flex justify-space-between align-center mb-6">
          <div>
            <h1 class="display-1 font-weight-bold">📦 จัดการสินค้า</h1>
            <p class="subtitle-1">เพิ่ม แก้ไข ลบ สินค้าในระบบ</p>
          </div>
          <v-btn
            color="primary"
            large
            @click="openCreateDialog"
          >
            <v-icon left>mdi-plus</v-icon>
            เพิ่มสินค้าใหม่
          </v-btn>
        </div>

        <!-- Search and Filters -->
        <v-card class="mb-6">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="search"
                  prepend-inner-icon="mdi-magnify"
                  label="ค้นหาสินค้า..."
                  outlined
                  dense
                  clearable
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="statusFilter"
                  :items="statusOptions"
                  label="สถานะสินค้า"
                  outlined
                  dense
                  clearable
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Products Data Table -->
        <v-card>
          <v-data-table
            :headers="headers"
            :items="filteredProducts"
            :loading="loading"
            :search="search"
            class="elevation-1"
            :items-per-page="10"
          >
            <!-- Product Image -->
            <template v-slot:[`item.image`]="{ item }">
              <div class="d-flex justify-center">
                <v-avatar size="50" tile class="ma-1">
                  <v-img
                    v-if="item.image"
                    :src="item.image"
                    :alt="item.name"
                    class="grey lighten-2"
                  >
                    <template v-slot:placeholder>
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <v-progress-circular
                          indeterminate
                          color="grey lighten-5"
                          size="20"
                        ></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                  <v-icon v-else color="grey">mdi-image-off</v-icon>
                </v-avatar>
              </div>
            </template>

            <!-- Stock Status -->
            <template v-slot:[`item.stock`]="{ item }">
              <v-chip
                :color="getStockColor(item.stock)"
                small
                text-color="white"
              >
                {{ item.stock }} units
              </v-chip>
            </template>

            <!-- Price -->
            <template v-slot:[`item.price`]="{ item }">
              <span class="font-weight-bold">฿{{ formatPrice(item.price) }}</span>
            </template>

            <!-- Created Date -->
            <template v-slot:[`item.createdAt`]="{ item }">
              {{ formatDate(item.createdAt) }}
            </template>

            <!-- Actions -->
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn
                icon
                small
                color="primary"
                @click="openEditDialog(item)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                icon
                small
                color="red"
                @click="confirmDelete(item)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>

            <!-- Loading -->
            <template v-slot:loading>
              <div class="text-center pa-4">
                <v-progress-circular indeterminate></v-progress-circular>
              </div>
            </template>

            <!-- No data -->
            <template v-slot:no-data>
              <div class="text-center pa-8">
                <v-icon size="64" color="grey">mdi-package-variant-closed</v-icon>
                <h3 class="mt-4">ไม่มีสินค้า</h3>
                <p>เพิ่มสินค้าใหม่เพื่อเริ่มต้นการขาย</p>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Create/Edit Product Dialog -->
    <v-dialog v-model="productDialog" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          <span class="headline">{{ isEdit ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่' }}</span>
        </v-card-title>
        
        <v-card-text>
          <v-form ref="productForm" v-model="formValid" lazy-validation>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="productForm.code"
                  label="รหัสสินค้า"
                  :rules="[rules.required]"
                  outlined
                  dense
                  :disabled="isEdit"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="productForm.name"
                  label="ชื่อสินค้า"
                  :rules="[rules.required]"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="productForm.description"
                  label="รายละเอียดสินค้า"
                  outlined
                  rows="3"
                  dense
                ></v-textarea>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="productForm.image"
                  label="URL รูปภาพสินค้า"
                  outlined
                  dense
                  placeholder="https://example.com/image.jpg"
                ></v-text-field>
                
                <!-- Image Preview -->
                <v-card v-if="productForm.image" flat class="mt-2">
                  <v-card-text class="text-center pa-2">
                    <div class="text-caption mb-2">ตัวอย่างรูปภาพ:</div>
                    <v-img
                      :src="productForm.image"
                      :alt="productForm.name"
                      max-height="150"
                      max-width="150"
                      class="mx-auto"
                    >
                      <template v-slot:placeholder>
                        <v-row
                          class="fill-height ma-0"
                          align="center"
                          justify="center"
                        >
                          <v-progress-circular
                            indeterminate
                            color="grey lighten-5"
                          ></v-progress-circular>
                        </v-row>
                      </template>
                      <template v-slot:error>
                        <v-row
                          class="fill-height ma-0"
                          align="center"
                          justify="center"
                        >
                          <v-icon color="grey">mdi-image-off</v-icon>
                          <div class="text-caption ml-2">ไม่สามารถโหลดรูปภาพได้</div>
                        </v-row>
                      </template>
                    </v-img>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="productForm.price"
                  label="ราคา"
                  type="number"
                  :rules="[rules.required, rules.minValue(0)]"
                  outlined
                  dense
                  prefix="฿"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="productForm.stock"
                  label="จำนวนในคลัง"
                  type="number"
                  :rules="[rules.required, rules.minValue(0)]"
                  outlined
                  dense
                  suffix="units"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="closeDialog"
          >
            ยกเลิก
          </v-btn>
          <v-btn
            color="primary"
            :loading="saving"
            :disabled="!formValid"
            @click="saveProduct"
          >
            {{ isEdit ? 'บันทึก' : 'เพิ่มสินค้า' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="headline red--text">
          <v-icon color="red" left>mdi-alert</v-icon>
          ยืนยันการลบ
        </v-card-title>
        
        <v-card-text>
          คุณแน่ใจหรือไม่ที่จะลบสินค้า "<strong>{{ deleteItem?.name }}</strong>"?<br>
          การกระทำนี้ไม่สามารถย้อนกลับได้
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="deleteDialog = false"
          >
            ยกเลิก
          </v-btn>
          <v-btn
            color="red"
            :loading="deleting"
            @click="deleteProductAction"
          >
            ลบ
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success/Error Snackbars -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      bottom
    >
      {{ snackbar.message }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.show = false">
          ปิด
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'AdminProductsView',
  data() {
    return {
      search: '',
      statusFilter: '',
      productDialog: false,
      deleteDialog: false,
      deleteItem: null,
      isEdit: false,
      formValid: false,
      saving: false,
      deleting: false,
      productForm: {
        code: '',
        name: '',
        description: '',
        price: null,
        stock: null,
        image: ''
      },
      snackbar: {
        show: false,
        message: '',
        color: 'success'
      },
      headers: [
        { text: 'รูปภาพ', value: 'image', sortable: false, align: 'center', width: '100' },
        { text: 'รหัสสินค้า', value: 'code', sortable: true },
        { text: 'ชื่อสินค้า', value: 'name', sortable: true },
        { text: 'ราคา', value: 'price', sortable: true },
        { text: 'คลัง', value: 'stock', sortable: true },
        { text: 'สร้างเมื่อ', value: 'createdAt', sortable: true },
        { text: 'จัดการ', value: 'actions', sortable: false, align: 'center' }
      ],
      statusOptions: [
        { text: 'ทั้งหมด', value: '' },
        { text: 'มีสินค้า', value: 'in-stock' },
        { text: 'สินค้าน้อย', value: 'low-stock' },
        { text: 'หมดสต็อก', value: 'out-of-stock' }
      ],
      rules: {
        required: v => !!v || 'กรุณากรอกข้อมูล',
        minValue: (min) => v => v >= min || `ค่าต้องไม่น้อยกว่า ${min}`
      }
    }
  },
  computed: {
    ...mapState('products', {
      loading: 'loading',
      error: 'error'
    }),
    ...mapGetters('products', ['allProducts']),

    products() {
      return this.allProducts
    },

    filteredProducts() {
      let products = this.products

      if (this.statusFilter) {
        products = products.filter(product => {
          switch (this.statusFilter) {
            case 'in-stock': return product.stock > 10
            case 'low-stock': return product.stock > 0 && product.stock <= 10
            case 'out-of-stock': return product.stock === 0
            default: return true
          }
        })
      }

      return products
    }
  },
  async created() {
    console.log('AdminProductsView created')
    // Check admin permission
    if (!this.$store.getters['auth/isAdmin']) {
      this.$router.push('/')
      return
    }

    console.log('Fetching products...')
    await this.fetchProducts()
    console.log('Products after fetch:', this.allProducts)
  },
  methods: {
    ...mapActions('products', [
      'fetchProducts',
      'createProduct',
      'updateProduct',
      'deleteProduct'
    ]),

    openCreateDialog() {
      this.isEdit = false
      this.resetForm()
      this.productDialog = true
    },

    openEditDialog(product) {
      this.isEdit = true
      this.productForm = {
        ...product
      }
      this.productDialog = true
    },

    closeDialog() {
      this.productDialog = false
      this.resetForm()
    },

    resetForm() {
      this.productForm = {
        code: '',
        name: '',
        description: '',
        price: null,
        stock: null,
        image: ''
      }
      if (this.$refs.productForm) {
        this.$refs.productForm.resetValidation()
      }
    },

    async saveProduct() {
      if (!this.$refs.productForm.validate()) {
        return
      }

      this.saving = true
      try {
        if (this.isEdit) {
          await this.updateProduct({
            productId: this.productForm._id,
            productData: {
              name: this.productForm.name,
              description: this.productForm.description,
              price: this.productForm.price,
              stock: this.productForm.stock,
              image: this.productForm.image
            }
          })
          this.showSnackbar('แก้ไขสินค้าสำเร็จ', 'success')
        } else {
          await this.createProduct(this.productForm)
          this.showSnackbar('เพิ่มสินค้าสำเร็จ', 'success')
        }
        
        this.closeDialog()
        await this.fetchProducts()
      } catch (error) {
        this.showSnackbar(error.response?.data?.message || 'เกิดข้อผิดพลาด', 'error')
      } finally {
        this.saving = false
      }
    },

    confirmDelete(product) {
      this.deleteItem = product
      this.deleteDialog = true
    },

    async deleteProductAction() {
      this.deleting = true
      try {
        await this.deleteProduct(this.deleteItem._id)
        this.showSnackbar('ลบสินค้าสำเร็จ', 'success')
        this.deleteDialog = false
        await this.fetchProducts()
      } catch (error) {
        this.showSnackbar(error.response?.data?.message || 'เกิดข้อผิดพลาด', 'error')
      } finally {
        this.deleting = false
      }
    },

    getStockColor(stock) {
      if (stock === 0) return 'red'
      if (stock <= 10) return 'orange'
      return 'green'
    },

    formatPrice(price) {
      return new Intl.NumberFormat('th-TH').format(price)
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('th-TH')
    },

    showSnackbar(message, color = 'success') {
      this.snackbar.message = message
      this.snackbar.color = color
      this.snackbar.show = true
    }
  }
}
</script>

<style scoped>
.admin-products-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding-top: 2rem;
}

.v-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95) !important;
}

.headline {
  font-weight: bold;
}
</style>