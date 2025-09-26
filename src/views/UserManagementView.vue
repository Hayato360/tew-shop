<template>
  <v-container fluid class="user-management-page">
    <div class="page-header mb-6">
      <h1 class="page-title">
        👥 Guild Management
      </h1>
      <p class="page-subtitle">Manage all adventurers in your realm</p>
    </div>

    <!-- Action Bar -->
    <v-card class="action-bar mb-6" elevation="4">
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="searchQuery"
              prepend-icon="mdi-magnify"
              label="🔍 Search adventurers..."
              outlined
              dense
              clearable
              hide-details
              class="search-field"
            />
          </v-col>
          <v-col cols="12" md="6" class="text-right">
            <v-btn
              color="primary"
              large
              @click="openCreateDialog"
              class="create-btn"
            >
              <v-icon left>mdi-account-plus</v-icon>
              Add New Adventurer
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Users Table -->
    <v-card class="users-table" elevation="8">
      <v-card-title class="table-header">
        <span class="table-title">🏰 Adventurers Registry</span>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="filteredUsers"
        :loading="loading"
        :items-per-page="10"
        class="game-table"
        loading-text="Summoning adventurers..."
        no-data-text="No adventurers found in this realm"
      >
        <!-- Custom header -->
        <template v-slot:header="{ props }">
          <thead>
            <tr class="table-header-row">
              <th 
                v-for="header in props.headers" 
                :key="header.text"
                class="table-header-cell"
              >
                {{ header.text }}
              </th>
            </tr>
          </thead>
        </template>

        <!-- Username with avatar -->
        <template v-slot:[`item.username`]="{ item }">
          <div class="d-flex align-center">
            <v-avatar size="40" class="mr-3">
              <v-icon color="primary" size="24">
                {{ item.gender === 'male' ? 'mdi-face-man' : 
                     item.gender === 'female' ? 'mdi-face-woman' : 'mdi-account' }}
              </v-icon>
            </v-avatar>
            <div>
              <div class="username">{{ item.username }}</div>
              <div class="user-id">ID: {{ item._id }}</div>
            </div>
          </div>
        </template>

        <!-- Full Name -->
        <template v-slot:[`item.fullName`]="{ item }">
          <div class="full-name">
            {{ item.firstName }} {{ item.lastName }}
          </div>
        </template>

        <!-- Gender with icon -->
        <template v-slot:[`item.gender`]="{ item }">
          <v-chip
            :color="getGenderColor(item.gender)"
            dark
            small
            class="gender-chip"
          >
            <v-icon left small>
              {{ getGenderIcon(item.gender) }}
            </v-icon>
            {{ item.gender }}
          </v-chip>
        </template>

        <!-- Age with level theme -->
        <template v-slot:[`item.age`]="{ item }">
          <div class="age-display">
            <v-icon color="warning" small class="mr-1">mdi-star</v-icon>
            {{ item.age }}
          </div>
        </template>

        <!-- Role with badge -->
        <template v-slot:[`item.role`]="{ item }">
          <v-chip
            :color="item.role === 'admin' ? 'error' : 'success'"
            dark
            small
            class="role-chip"
          >
            <v-icon left small>
              {{ item.role === 'admin' ? 'mdi-crown' : 'mdi-sword' }}
            </v-icon>
            {{ item.role }}
          </v-chip>
        </template>

        <!-- Actions -->
        <template v-slot:[`item.actions`]="{ item }">
          <div class="action-buttons">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  small
                  color="info"
                  v-bind="attrs"
                  v-on="on"
                  @click="viewUser(item)"
                >
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
              </template>
              <span>View Details</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  small
                  color="warning"
                  v-bind="attrs"
                  v-on="on"
                  @click="editUser(item)"
                >
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>Edit Adventurer</span>
            </v-tooltip>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  small
                  color="error"
                  v-bind="attrs"
                  v-on="on"
                  @click="confirmDelete(item)"
                  :disabled="item.role === 'admin'"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>{{ item.role === 'admin' ? 'Cannot delete admin' : 'Remove Adventurer' }}</span>
            </v-tooltip>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Create/Edit User Dialog -->
    <UserFormDialog
      :dialog="userDialog"
      :user="selectedUser"
      :is-edit="isEdit"
      @close="closeUserDialog"
      @save="handleSaveUser"
    />

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="500">
      <v-card class="delete-card">
        <v-card-title class="delete-title">
          <v-icon color="error" class="mr-2">mdi-alert-circle</v-icon>
          Remove Adventurer
        </v-card-title>
        <v-card-text class="delete-content">
          Are you sure you want to remove <strong>{{ userToDelete?.username }}</strong> from the realm?
          <br><br>
          <v-alert type="warning" dense>
            This action cannot be undone!
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" text @click="deleteDialog = false">
            Cancel
          </v-btn>
          <v-btn 
            color="error" 
            @click="handleDeleteUser"
            :loading="loading"
          >
            Remove
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- User Details Dialog -->
    <UserDetailsDialog
      :dialog="detailsDialog"
      :user="selectedUser"
      @close="detailsDialog = false"
    />
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import UserFormDialog from '@/components/UserFormDialog.vue'
import UserDetailsDialog from '@/components/UserDetailsDialog.vue'

export default {
  name: 'UserManagementView',
  components: {
    UserFormDialog,
    UserDetailsDialog
  },
  data() {
    return {
      searchQuery: '',
      userDialog: false,
      detailsDialog: false,
      deleteDialog: false,
      selectedUser: null,
      userToDelete: null,
      isEdit: false,
      headers: [
        { text: '👤 Adventurer', value: 'username', sortable: true },
        { text: '🏷️ Full Name', value: 'fullName', sortable: false },
        { text: '⚥ Gender', value: 'gender', sortable: true },
        { text: '🎂 Age', value: 'age', sortable: true },
        { text: '🎭 Role', value: 'role', sortable: true },
        { text: '⚔️ Actions', value: 'actions', sortable: false }
      ]
    }
  },
  computed: {
    ...mapGetters(['isLoading', 'getError']),
    ...mapGetters('users', ['allUsers']),
    loading() {
      return this.isLoading
    },
    error() {
      return this.getError
    },
    filteredUsers() {
      if (!this.searchQuery) return this.allUsers
      
      const query = this.searchQuery.toLowerCase()
      return this.allUsers.filter(user =>
        user.username.toLowerCase().includes(query) ||
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      )
    }
  },
  methods: {
    ...mapActions(['clearError']),
    ...mapActions('users', ['fetchUsers', 'createUser', 'updateUser', 'deleteUser']),

    async loadUsers() {
      try {
        await this.fetchUsers()
      } catch (error) {
        console.error('Failed to load users:', error)
      }
    },

    openCreateDialog() {
      this.selectedUser = null
      this.isEdit = false
      this.userDialog = true
    },

    editUser(user) {
      this.selectedUser = { ...user }
      this.isEdit = true
      this.userDialog = true
    },

    viewUser(user) {
      this.selectedUser = user
      this.detailsDialog = true
    },

    confirmDelete(user) {
      this.userToDelete = user
      this.deleteDialog = true
    },

    closeUserDialog() {
      this.userDialog = false
      this.selectedUser = null
      this.isEdit = false
    },

    async handleSaveUser(userData) {
      try {
        if (this.isEdit) {
          await this.updateUser({
            id: this.selectedUser._id,
            userData
          })
        } else {
          await this.createUser(userData)
        }
        this.closeUserDialog()
      } catch (error) {
        console.error('Failed to save user:', error)
      }
    },

    async handleDeleteUser() {
      try {
        await this.deleteUser(this.userToDelete._id)
        this.deleteDialog = false
        this.userToDelete = null
      } catch (error) {
        console.error('Failed to delete user:', error)
      }
    },

    getGenderColor(gender) {
      const colors = {
        male: 'blue',
        female: 'pink',
        other: 'purple',
        'not-specified': 'grey'
      }
      return colors[gender] || 'grey'
    },

    getGenderIcon(gender) {
      const icons = {
        male: 'mdi-gender-male',
        female: 'mdi-gender-female',
        other: 'mdi-gender-non-binary',
        'not-specified': 'mdi-help-circle'
      }
      return icons[gender] || 'mdi-help-circle'
    }
  },

  async mounted() {
    this.clearError()
    await this.loadUsers()
  }
}
</script>

<style scoped>
.user-management-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.page-header {
  text-align: center;
  color: white;
}

.page-title {
  font-size: 2.5rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  margin-bottom: 10px;
}

.page-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

.action-bar {
  background: linear-gradient(145deg, #2C3E50, #34495E);
  border: 2px solid #FFD700;
  border-radius: 15px;
}

.users-table {
  background: linear-gradient(145deg, #2C3E50, #34495E);
  border: 2px solid #FFD700;
  border-radius: 15px;
}

.table-title {
  color: #FFD700;
  font-size: 1.3rem;
  font-weight: bold;
}

.game-table >>> .v-data-table {
  background: transparent;
}

.game-table >>> .v-data-table__wrapper {
  background: transparent;
}

.game-table >>> th {
  background: linear-gradient(145deg, #34495E, #2C3E50) !important;
  color: #FFD700 !important;
  font-weight: bold;
}

.game-table >>> td {
  background: rgba(52, 73, 94, 0.3) !important;
  color: white !important;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2) !important;
}

.username {
  font-weight: bold;
  color: #4ECDC4;
}

.user-id {
  font-size: 0.8rem;
  color: #B0BEC5;
}

.full-name {
  font-weight: 500;
}

.age-display {
  display: flex;
  align-items: center;
}

.gender-chip,
.role-chip {
  font-weight: bold;
}

.action-buttons {
  display: flex;
  gap: 5px;
}

.create-btn {
  background: linear-gradient(45deg, #4ECDC4, #44A08D);
  font-weight: bold;
  text-transform: none;
}

.search-field >>> .v-input__control {
  color: white;
}

.search-field >>> .v-label {
  color: #B0BEC5 !important;
}

.delete-card {
  background: linear-gradient(145deg, #2C3E50, #34495E);
  border: 2px solid #FF6B6B;
}

.delete-title {
  color: #FF6B6B;
  font-weight: bold;
}

.delete-content {
  color: white;
}
</style>