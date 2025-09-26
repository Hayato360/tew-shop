<template>
  <v-app>
    <!-- Navigation App Bar -->
    <v-app-bar
      app
      color="primary"
      dark
      elevation="8"
      class="game-navbar"
    >
      <!-- Logo -->
      <div class="d-flex align-center">
        <v-img
          alt="Game Shop Logo"
          class="shrink mr-2"
          contain
          src="/img/icons/android-chrome-192x192.png"
          transition="scale-transition"
          width="40"
        />
        <v-toolbar-title class="app-title">
          🎮 GAME SHOP
        </v-toolbar-title>
      </div>

      <v-spacer />

      <!-- Navigation Items -->
      <template v-if="!$vuetify.breakpoint.mobile">
        <!-- Public Navigation Items -->
        <v-btn to="/" text class="gaming-nav-btn">
          <v-icon left>mdi-home</v-icon>
          หน้าแรก
        </v-btn>
        
        <v-btn to="/products" text class="gaming-nav-btn">
          <v-icon left>mdi-shopping</v-icon>
          สินค้า
        </v-btn>
        
        <v-btn to="/about" text class="gaming-nav-btn">
          <v-icon left>mdi-information</v-icon>
          เกี่ยวกับ
        </v-btn>
        
        <!-- Cart Button (show when authenticated) -->
        <v-btn v-if="isAuthenticated" to="/cart" text class="gaming-nav-btn position-relative">
          <v-icon left>mdi-cart</v-icon>
          ตะกร้า
          <v-badge
            v-if="cartItemCount > 0"
            :content="cartItemCount"
            color="red"
            overlap
            offset-x="16"
            offset-y="16"
          >
          </v-badge>
        </v-btn>
        
        <!-- Admin Only - User Management -->
        <v-btn v-if="isAdmin" text to="/users" class="gaming-nav-btn">
          <v-icon left>mdi-account-group</v-icon>
          จัดการผู้ใช้
        </v-btn>
      </template>

      <!-- User Menu -->
      <div v-if="isAuthenticated">
        <v-menu bottom left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
              class="user-menu-btn"
            >
              <v-avatar size="36" color="secondary">
                <v-icon color="white">
                  {{ currentUser?.gender === 'male' ? 'mdi-face-man' : 
                       currentUser?.gender === 'female' ? 'mdi-face-woman' : 'mdi-account' }}
                </v-icon>
              </v-avatar>
            </v-btn>
          </template>

          <v-list class="user-menu">
            <v-list-item>
              <v-list-item-avatar>
                <v-avatar size="40" color="primary">
                  <v-icon color="white">
                    {{ currentUser?.gender === 'male' ? 'mdi-face-man' : 
                         currentUser?.gender === 'female' ? 'mdi-face-woman' : 'mdi-account' }}
                  </v-icon>
                </v-avatar>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold">
                  {{ currentUser?.username }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ currentUser?.role === 'admin' ? '👑 Admin' : '🗡️ Adventurer' }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider />

            <!-- Mobile Navigation Items -->
            <template v-if="$vuetify.breakpoint.mobile">
              <v-list-item to="/">
                <v-list-item-icon>
                  <v-icon>mdi-home</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Home</v-list-item-title>
              </v-list-item>

              <v-list-item to="/about">
                <v-list-item-icon>
                  <v-icon>mdi-information</v-icon>
                </v-list-item-icon>
                <v-list-item-title>About</v-list-item-title>
              </v-list-item>

              <v-list-item v-if="isAdmin" to="/users">
                <v-list-item-icon>
                  <v-icon>mdi-account-group</v-icon>
                </v-list-item-icon>
                <v-list-item-title>User Management</v-list-item-title>
              </v-list-item>

              <v-divider />
            </template>

            <!-- Logout -->
            <v-list-item @click="handleLogout">
              <v-list-item-icon>
                <v-icon color="red">mdi-logout</v-icon>
              </v-list-item-icon>
              <v-list-item-title class="red--text">Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>

      <!-- Guest Menu -->
      <div v-else>
        <template v-if="!$vuetify.breakpoint.mobile">
          <v-btn text to="/login">
            <v-icon left>mdi-login</v-icon>
            Login
          </v-btn>
          <v-btn color="secondary" to="/register">
            <v-icon left>mdi-account-plus</v-icon>
            Register
          </v-btn>
        </template>

        <!-- Mobile Guest Menu -->
        <v-menu v-else bottom left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-menu</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item to="/">
              <v-list-item-icon>
                <v-icon>mdi-home</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item>

            <v-list-item to="/about">
              <v-list-item-icon>
                <v-icon>mdi-information</v-icon>
              </v-list-item-icon>
              <v-list-item-title>About</v-list-item-title>
            </v-list-item>

            <v-divider />

            <v-list-item to="/login">
              <v-list-item-icon>
                <v-icon>mdi-login</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Login</v-list-item-title>
            </v-list-item>

            <v-list-item to="/register">
              <v-list-item-icon>
                <v-icon>mdi-account-plus</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Register</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <router-view />
    </v-main>

    <!-- Loading Overlay -->
    <v-overlay v-if="isLoading" :value="isLoading">
      <div class="text-center">
        <v-progress-circular
          indeterminate
          size="64"
          color="primary"
        />
        <p class="mt-4 white--text">Loading...</p>
      </div>
    </v-overlay>

    <!-- Global Error Snackbar -->
    <v-snackbar
      v-model="showError"
      color="error"
      top
      timeout="6000"
    >
      {{ error }}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="clearError"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'App',
  data() {
    return {
      
    }
  },
  computed: {
    ...mapGetters(['isLoading', 'getError']),
    ...mapGetters('auth', ['isAuthenticated', 'currentUser']),
    ...mapGetters('cart', ['itemCount']),
    
    isAdmin() {
      return this.currentUser?.role === 'admin'
    },
    
    cartItemCount() {
      return this.itemCount
    },
    
    error() {
      return this.getError
    },
    
    showError: {
      get() {
        return !!this.error
      },
      set() {
        this.clearError()
      }
    }
  },
  methods: {
    ...mapActions(['clearError']),
    ...mapActions('auth', ['logout', 'checkAuth']),
    ...mapActions('cart', ['fetchCart']),

    handleLogout() {
      this.logout()
    }
  },
  
  async created() {
    // Check authentication status on app start
    this.checkAuth()
    
    // Fetch cart if user is authenticated
    if (this.isAuthenticated) {
      await this.fetchCart()
    }
  },
  
  watch: {
    // Watch authentication state to fetch cart when user logs in
    isAuthenticated(newValue) {
      if (newValue) {
        this.fetchCart()
      }
    }
  }
}
</script>

<style>
.game-navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border-bottom: 3px solid #FFD700;
}

.app-title {
  font-weight: bold;
  font-size: 1.5rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  background: linear-gradient(45deg, #FFD700, #FFA500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.user-menu-btn {
  border: 2px solid #FFD700;
  border-radius: 50%;
}

.user-menu {
  background: linear-gradient(145deg, #2C3E50, #34495E);
  border: 2px solid #4ECDC4;
  border-radius: 10px;
}

.user-menu .v-list-item {
  color: white;
}

.user-menu .v-list-item:hover {
  background: rgba(78, 205, 196, 0.1);
}

.user-menu .v-list-item-title {
  color: #4ECDC4;
}

.user-menu .v-list-item-subtitle {
  color: #B0BEC5;
}

.v-main {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}
</style>
