<template>
  <v-container fluid class="admin-orders-page">
    <v-row>
      <v-col cols="12">
        <!-- Header -->
        <div class="d-flex justify-space-between align-center mb-6">
          <div>
            <h1 class="display-1 font-weight-bold">📋 จัดการออเดอร์</h1>
            <p class="subtitle-1">ติดตามและจัดการสถานะออเดอร์</p>
          </div>
          <v-btn
            color="primary"
            @click="fetchOrders"
            :loading="loading"
          >
            <v-icon left>mdi-refresh</v-icon>
            รีเฟรช
          </v-btn>
        </div>

        <!-- Filters -->
        <v-card class="mb-6">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="search"
                  prepend-inner-icon="mdi-magnify"
                  label="ค้นหาออเดอร์..."
                  outlined
                  dense
                  clearable
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="statusFilter"
                  :items="statusOptions"
                  label="สถานะออเดอร์"
                  outlined
                  dense
                  clearable
                  @change="filterByStatus"
                ></v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="dateRange"
                  :items="dateRangeOptions"
                  label="ช่วงเวลา"
                  outlined
                  dense
                  clearable
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <!-- Orders Data Table -->
        <v-card>
          <v-data-table
            :headers="headers"
            :items="filteredOrders"
            :loading="loading"
            :search="search"
            class="elevation-1"
            :items-per-page="15"
            sort-by="createdAt"
            sort-desc
          >
            <!-- Order Code -->
            <template v-slot:[`item.orderCode`]="{ item }">
              <v-chip
                color="primary"
                small
                outlined
                @click="viewOrderDetail(item)"
                class="cursor-pointer"
              >
                {{ item.orderCode }}
              </v-chip>
            </template>

            <!-- Buyer -->
            <template v-slot:[`item.buyer`]="{ item }">
              <div v-if="item.buyer">
                <strong>{{ item.buyer.firstName }} {{ item.buyer.lastName }}</strong>
                <br>
                <small class="text--secondary">{{ item.buyer.username }}</small>
              </div>
              <span v-else class="text--secondary">ไม่ระบุ</span>
            </template>

            <!-- Items Count -->
            <template v-slot:[`item.itemCount`]="{ item }">
              <v-chip small>
                {{ item.items?.length || 0 }} รายการ
              </v-chip>
            </template>

            <!-- Total Amount -->
            <template v-slot:[`item.totalAmount`]="{ item }">
              <span class="font-weight-bold text-h6">฿{{ formatPrice(item.totalAmount) }}</span>
            </template>

            <!-- Status -->
            <template v-slot:[`item.status`]="{ item }">
              <v-select
                :value="item.status"
                :items="statusSelectOptions"
                dense
                outlined
                hide-details
                @change="updateOrderStatusAction(item, $event)"
                :disabled="updatingStatus === item._id"
                :loading="updatingStatus === item._id"
              >
                <template v-slot:selection="{ item: statusItem }">
                  <v-chip
                    :color="getStatusColor(statusItem.value)"
                    small
                    text-color="white"
                  >
                    {{ statusItem.text }}
                  </v-chip>
                </template>
              </v-select>
            </template>

            <!-- Created Date -->
            <template v-slot:[`item.createdAt`]="{ item }">
              <div>
                {{ formatDate(item.createdAt) }}
                <br>
                <small class="text--secondary">{{ formatTime(item.createdAt) }}</small>
              </div>
            </template>

            <!-- Actions -->
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn
                icon
                small
                color="primary"
                @click="viewOrderDetail(item)"
              >
                <v-icon>mdi-eye</v-icon>
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
                <v-icon size="64" color="grey">mdi-clipboard-list-outline</v-icon>
                <h3 class="mt-4">ไม่มีออเดอร์</h3>
                <p>รอลูกค้าสั่งซื้อสินค้า</p>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Order Detail Dialog -->
    <v-dialog v-model="orderDetailDialog" max-width="800px" scrollable>
      <v-card v-if="selectedOrder">
        <v-card-title class="pb-2">
          <div>
            <h2>รายละเอียดออเดอร์</h2>
            <v-chip
              :color="getStatusColor(selectedOrder.status)"
              small
              text-color="white"
              class="mt-2"
            >
              {{ getStatusText(selectedOrder.status) }}
            </v-chip>
          </div>
          <v-spacer></v-spacer>
          <v-btn icon @click="orderDetailDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <!-- Order Info -->
          <v-row class="mb-4">
            <v-col cols="12" md="6">
              <v-card outlined>
                <v-card-subtitle>ข้อมูลออเดอร์</v-card-subtitle>
                <v-card-text>
                  <div><strong>รหัสออเดอร์:</strong> {{ selectedOrder.orderCode }}</div>
                  <div><strong>วันที่สั่งซื้อ:</strong> {{ formatDate(selectedOrder.createdAt) }}</div>
                  <div v-if="selectedOrder.completedAt">
                    <strong>วันที่เสร็จสิ้น:</strong> {{ formatDate(selectedOrder.completedAt) }}
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-card outlined>
                <v-card-subtitle>ข้อมูลลูกค้า</v-card-subtitle>
                <v-card-text v-if="selectedOrder.buyer">
                  <div><strong>ชื่อ:</strong> {{ selectedOrder.buyer.firstName }} {{ selectedOrder.buyer.lastName }}</div>
                  <div><strong>Username:</strong> {{ selectedOrder.buyer.username }}</div>
                  <div><strong>อายุ:</strong> {{ selectedOrder.buyer.age }} ปี</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Order Items -->
          <v-card outlined>
            <v-card-subtitle>รายการสินค้า</v-card-subtitle>
            <v-card-text>
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th>รหัสสินค้า</th>
                      <th>ชื่อสินค้า</th>
                      <th class="text-center">จำนวน</th>
                      <th class="text-right">ราคาต่อหน่วย</th>
                      <th class="text-right">รวม</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in selectedOrder.items" :key="item._id">
                      <td>{{ item.productCode }}</td>
                      <td>{{ item.name }}</td>
                      <td class="text-center">{{ item.qty }}</td>
                      <td class="text-right">฿{{ formatPrice(item.price) }}</td>
                      <td class="text-right font-weight-bold">฿{{ formatPrice(item.total) }}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="font-weight-bold">
                      <td colspan="4" class="text-right">ยอดรวมทั้งหมด:</td>
                      <td class="text-right text-h6">฿{{ formatPrice(selectedOrder.totalAmount) }}</td>
                    </tr>
                  </tfoot>
                </template>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-card-text>
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
  name: 'AdminOrdersView',
  data() {
    return {
      search: '',
      statusFilter: '',
      dateRange: '',
      orderDetailDialog: false,
      selectedOrder: null,
      updatingStatus: null,
      snackbar: {
        show: false,
        message: '',
        color: 'success'
      },
      headers: [
        { text: 'รหัสออเดอร์', value: 'orderCode', sortable: true, width: '150px' },
        { text: 'ลูกค้า', value: 'buyer', sortable: false, width: '200px' },
        { text: 'รายการ', value: 'itemCount', sortable: false, width: '100px' },
        { text: 'ยอดรวม', value: 'totalAmount', sortable: true, width: '150px' },
        { text: 'สถานะ', value: 'status', sortable: true, width: '200px' },
        { text: 'วันที่สั่งซื้อ', value: 'createdAt', sortable: true, width: '180px' },
        { text: 'จัดการ', value: 'actions', sortable: false, width: '100px', align: 'center' }
      ],
      statusOptions: [
        { text: 'ทั้งหมด', value: '' },
        { text: 'รอดำเนินการ', value: 'pending' },
        { text: 'กำลังดำเนินการ', value: 'processing' },
        { text: 'เสร็จสิ้น', value: 'completed' },
        { text: 'ยกเลิก', value: 'cancelled' }
      ],
      statusSelectOptions: [
        { text: 'รอดำเนินการ', value: 'pending' },
        { text: 'กำลังดำเนินการ', value: 'processing' },
        { text: 'เสร็จสิ้น', value: 'completed' },
        { text: 'ยกเลิก', value: 'cancelled' }
      ],
      dateRangeOptions: [
        { text: 'วันนี้', value: 'today' },
        { text: '7 วันล่าสุด', value: 'week' },
        { text: '30 วันล่าสุด', value: 'month' },
        { text: 'ทั้งหมด', value: '' }
      ]
    }
  },
  computed: {
    ...mapState('orders', {
      loading: 'loading',
      error: 'error'
    }),
    ...mapGetters('orders', ['allOrders']),

    orders() {
      return this.allOrders || []
    },

    filteredOrders() {
      let orders = this.orders || []

      // Filter by date range
      if (this.dateRange) {
        const now = new Date()
        const startDate = new Date()

        switch (this.dateRange) {
          case 'today':
            startDate.setHours(0, 0, 0, 0)
            break
          case 'week':
            startDate.setDate(now.getDate() - 7)
            break
          case 'month':
            startDate.setDate(now.getDate() - 30)
            break
        }

        orders = orders.filter(order => 
          new Date(order.createdAt) >= startDate
        )
      }

      return orders
    }
  },
  async created() {
    console.log('AdminOrdersView created')
    // Check admin permission
    if (!this.$store.getters['auth/isAdmin']) {
      this.$router.push('/')
      return
    }

    console.log('Fetching orders...')
    await this.fetchOrders()
    console.log('Orders after fetch:', this.allOrders)
  },
  methods: {
    ...mapActions('orders', [
      'fetchOrders',
      'updateOrderStatus',
      'getOrdersByStatus'
    ]),

    async filterByStatus() {
      if (this.statusFilter) {
        await this.getOrdersByStatus(this.statusFilter)
      } else {
        await this.fetchOrders()
      }
    },

    async updateOrderStatusAction(order, newStatus) {
      this.updatingStatus = order._id
      try {
        await this.updateOrderStatus({
          orderId: order._id,
          status: newStatus
        })
        this.showSnackbar(`อัพเดทสถานะออเดอร์เป็น "${this.getStatusText(newStatus)}" สำเร็จ`, 'success')
        await this.fetchOrders()
      } catch (error) {
        this.showSnackbar(error.response?.data?.message || 'เกิดข้อผิดพลาด', 'error')
      } finally {
        this.updatingStatus = null
      }
    },

    viewOrderDetail(order) {
      this.selectedOrder = order
      this.orderDetailDialog = true
    },

    getStatusColor(status) {
      const colors = {
        pending: 'orange',
        processing: 'blue',
        completed: 'green',
        cancelled: 'red'
      }
      return colors[status] || 'grey'
    },

    getStatusText(status) {
      const texts = {
        pending: 'รอดำเนินการ',
        processing: 'กำลังดำเนินการ',
        completed: 'เสร็จสิ้น',
        cancelled: 'ยกเลิก'
      }
      return texts[status] || status
    },

    formatPrice(price) {
      return new Intl.NumberFormat('th-TH').format(price)
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('th-TH')
    },

    formatTime(date) {
      return new Date(date).toLocaleTimeString('th-TH', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
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
.admin-orders-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding-top: 2rem;
}

.v-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95) !important;
}

.cursor-pointer {
  cursor: pointer;
}
</style>