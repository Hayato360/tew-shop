<template>
  <v-container fluid class="register-page">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="10" md="8" lg="6">
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
          <p class="subtitle-text">Create Your Legend!</p>
        </div>

        <!-- Register Form Card -->
        <v-card class="game-card elevation-12">
          <v-card-title class="justify-center py-6">
            <span class="card-title">⚔️ Character Creation</span>
          </v-card-title>
          
          <v-card-text>
            <v-form ref="registerForm" v-model="valid" @submit.prevent="handleRegister">
              <!-- Success Alert -->
              <v-alert
                v-if="success"
                type="success"
                dismissible
                class="mb-4"
                @input="success = false"
              >
                Account created successfully! Welcome to the adventure! 🎉
              </v-alert>

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

              <v-row>
                <!-- Username -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="registerData.username"
                    :rules="usernameRules"
                    label="🗡️ Username"
                    prepend-icon="mdi-account-circle"
                    outlined
                    dense
                    class="game-input"
                    color="primary"
                  />
                </v-col>

                <!-- Password -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="registerData.password"
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
                </v-col>

                <!-- First Name -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="registerData.firstName"
                    :rules="nameRules"
                    label="🏷️ First Name"
                    prepend-icon="mdi-account"
                    outlined
                    dense
                    class="game-input"
                    color="primary"
                  />
                </v-col>

                <!-- Last Name -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="registerData.lastName"
                    :rules="nameRules"
                    label="🏷️ Last Name"
                    prepend-icon="mdi-account"
                    outlined
                    dense
                    class="game-input"
                    color="primary"
                  />
                </v-col>

                <!-- Gender -->
                <v-col cols="12" md="6">
                  <v-select
                    v-model="registerData.gender"
                    :items="genderOptions"
                    :rules="genderRules"
                    label="⚥ Gender"
                    prepend-icon="mdi-human-male-female"
                    outlined
                    dense
                    class="game-input"
                    color="primary"
                  />
                </v-col>

                <!-- Age -->
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="registerData.age"
                    :rules="ageRules"
                    label="🎂 Age"
                    prepend-icon="mdi-calendar"
                    type="number"
                    min="13"
                    max="99"
                    outlined
                    dense
                    class="game-input"
                    color="primary"
                  />
                </v-col>
              </v-row>

              <!-- Register Button -->
              <v-btn
                :disabled="!valid || loading"
                :loading="loading"
                color="primary"
                block
                large
                type="submit"
                class="game-btn mt-4 mb-4"
              >
                <v-icon left>mdi-account-plus</v-icon>
                Begin Adventure
              </v-btn>

              <!-- Login Link -->
              <div class="text-center">
                <p class="mb-0">Already have an account?</p>
                <router-link to="/login" class="login-link">
                  🚪 Enter Existing Realm
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
  name: 'RegisterView',
  data() {
    return {
      valid: false,
      success: false,
      showPassword: false,
      registerData: {
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        gender: '',
        age: null
      },
      genderOptions: [
        { text: '🚹 Male', value: 'male' },
        { text: '🚺 Female', value: 'female' },
        { text: '⚥ Other', value: 'other' },
        { text: '🤐 Prefer not to say', value: 'not-specified' }
      ],
      usernameRules: [
        v => !!v || 'Username is required',
        v => v.length >= 3 || 'Username must be at least 3 characters',
        v => v.length <= 20 || 'Username must be less than 20 characters',
        v => /^[a-zA-Z0-9_]+$/.test(v) || 'Username can only contain letters, numbers, and underscores'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => v.length >= 6 || 'Password must be at least 6 characters'
      ],
      nameRules: [
        v => !!v || 'Name is required',
        v => v.length >= 2 || 'Name must be at least 2 characters',
        v => /^[a-zA-Z\s]+$/.test(v) || 'Name can only contain letters and spaces'
      ],
      genderRules: [
        v => !!v || 'Gender is required'
      ],
      ageRules: [
        v => v !== null && v !== undefined && v !== '' || 'Age is required',
        v => Number.isInteger(Number(v)) || 'Age must be a number',
        v => v >= 13 || 'Must be at least 13 years old',
        v => v <= 99 || 'Age must be less than 100'
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
    ...mapActions('auth', ['register']),

    async handleRegister() {
      if (this.$refs.registerForm.validate()) {
        try {
          await this.register(this.registerData)
          this.success = true
          
          // Redirect to login after 2 seconds
          setTimeout(() => {
            this.$router.push('/login')
          }, 2000)
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
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  background-attachment: fixed;
  padding: 20px 0;
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

.game-input >>> .v-select__selection {
  color: white;
}

.game-btn {
  background: linear-gradient(45deg, #4ECDC4, #44A08D);
  font-weight: bold;
  font-size: 1.1rem;
  text-transform: none;
  border-radius: 10px;
}

.login-link {
  color: #FF6B6B;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s;
}

.login-link:hover {
  color: #FFD700;
}

.v-card-text {
  color: white;
}
</style>