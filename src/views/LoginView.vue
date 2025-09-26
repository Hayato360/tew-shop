<template>
  <v-container fluid class="login-page">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">
        <!-- Game Shop Logo -->
        <div class="text-center mb-6">
          <v-img
            src="/img/icons/android-chrome-192x192.png"
            max-width="120"
            class="mx-auto mb-4"
          />
          <h1 class="game-title gradient-text">
            🎮 GAME SHOP
          </h1>
          <p class="subtitle-text">Adventure Awaits!</p>
        </div>

        <!-- Login Form Card -->
        <v-card class="game-card elevation-12">
          <v-card-title class="justify-center py-6">
            <span class="card-title">⚔️ Enter Your Quest</span>
          </v-card-title>
          
          <v-card-text>
            <v-form ref="loginForm" v-model="valid" @submit.prevent="handleLogin">
              <!-- Error Alert -->
              <v-alert
                v-if="error"
                type="error"
                dismissible
                class="mb-4"
                @input="clearError"
              >
                {{ error }}
              </v-alert>

              <!-- Username Field -->
              <v-text-field
                v-model="loginData.username"
                :rules="usernameRules"
                label="🗡️ Username"
                prepend-icon="mdi-account-circle"
                outlined
                dense
                class="game-input"
                color="primary"
              />

              <!-- Password Field -->
              <v-text-field
                v-model="loginData.password"
                :rules="passwordRules"
                :type="showPassword ? 'text' : 'password'"
                label="🔐 Password"
                prepend-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                outlined
                dense
                class="game-input"
                color="primary"
              />

              <!-- Login Button -->
              <v-btn
                :disabled="!valid || loading"
                :loading="loading"
                color="primary"
                block
                large
                type="submit"
                class="game-btn mt-4 mb-4"
              >
                <v-icon left>mdi-login</v-icon>
                Start Adventure
              </v-btn>

              <!-- Register Link -->
              <div class="text-center">
                <p class="mb-0">New to the realm?</p>
                <router-link to="/register" class="register-link">
                  🌟 Create Your Character
                </router-link>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'LoginView',
  data() {
    return {
      valid: false,
      showPassword: false,
      loginData: {
        username: '',
        password: ''
      },
      usernameRules: [
        v => !!v || 'Username is required',
        v => v.length >= 3 || 'Username must be at least 3 characters'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length >= 6 || 'Password must be at least 6 characters'
      ]
    }
  },
  computed: {
    ...mapGetters(['isLoading', 'getError']),
    loading() {
      return this.isLoading
    },
    error() {
      return this.getError
    }
  },
  methods: {
    ...mapActions(['clearError']),
    ...mapActions('auth', ['login']),

    async handleLogin() {
      if (this.$refs.loginForm.validate()) {
        try {
          await this.login(this.loginData)
          this.$router.push('/')
          this.$toast?.success('Welcome back, adventurer! 🎉')
        } catch (error) {
          // Error is handled by Vuex store
        }
      }
    }
  },
  mounted() {
    // Clear any previous errors
    this.clearError()
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-attachment: fixed;
}

.game-title {
  font-size: 2.5rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.gradient-text {
  background: linear-gradient(45deg, #FFD700, #FFA500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle-text {
  color: #E8EAF6;
  font-size: 1.1rem;
  margin-bottom: 0;
}

.game-card {
  background: linear-gradient(145deg, #2C3E50, #34495E);
  border-radius: 20px;
  border: 2px solid #FFD700;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.card-title {
  color: #FFD700;
  font-size: 1.4rem;
  font-weight: bold;
}

.game-input >>> .v-input__control {
  color: white;
}

.game-input >>> .v-label {
  color: #B0BEC5 !important;
}

.game-input >>> .v-input__icon--prepend .v-icon {
  color: #FFD700;
}

.game-btn {
  background: linear-gradient(45deg, #FF6B6B, #4ECDC4);
  font-weight: bold;
  font-size: 1.1rem;
  text-transform: none;
  border-radius: 10px;
}

.register-link {
  color: #4ECDC4;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s;
}

.register-link:hover {
  color: #FFD700;
}

.v-card-text {
  color: white;
}
</style>