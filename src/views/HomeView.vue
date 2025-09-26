<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <v-container>
        <v-row align="center" justify="center" class="hero-content">
          <v-col cols="12" md="8" class="text-center">
            <div class="hero-logo mb-6">
              <v-img
                src="/img/icons/android-chrome-512x512.png"
                max-width="200"
                class="mx-auto mb-4"
              />
              <h1 class="hero-title">
                🎮 Welcome to Game Shop
              </h1>
              <p class="hero-subtitle">
                Your Ultimate Gaming Adventure Starts Here!
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="hero-actions">
              <v-btn
                v-if="!isAuthenticated"
                x-large
                color="primary"
                class="hero-btn mr-4 mb-4"
                to="/register"
              >
                <v-icon left>mdi-sword-cross</v-icon>
                Start Your Quest
              </v-btn>
              
              <v-btn
                v-if="!isAuthenticated"
                x-large
                outlined
                color="white"
                class="hero-btn mb-4"
                to="/login"
              >
                <v-icon left>mdi-shield-account</v-icon>
                Enter Realm
              </v-btn>

              <v-btn
                v-if="isAuthenticated"
                x-large
                color="success"
                class="hero-btn mb-4"
                @click="scrollToShop"
              >
                <v-icon left>mdi-store</v-icon>
                Browse Shop
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Features Section -->
    <section class="features-section" id="shop">
      <v-container>
        <div class="section-header text-center mb-8">
          <h2 class="section-title">⚔️ Epic Features</h2>
          <p class="section-subtitle">Discover what awaits in your adventure</p>
        </div>

        <v-row>
          <!-- Feature Cards -->
          <v-col cols="12" md="4" v-for="feature in features" :key="feature.id" class="mb-4">
            <v-card class="feature-card h-100" elevation="8">
              <div class="feature-icon">
                <v-icon size="60" :color="feature.color">{{ feature.icon }}</v-icon>
              </div>
              <v-card-title class="justify-center">
                <span class="feature-title">{{ feature.title }}</span>
              </v-card-title>
              <v-card-text class="text-center">
                <p class="feature-description">{{ feature.description }}</p>
              </v-card-text>
              <v-card-actions class="justify-center pb-4">
                <v-btn
                  :color="feature.color"
                  outlined
                  @click="exploreFeature(feature)"
                >
                  {{ feature.action }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Stats Section -->
    <section class="stats-section" v-if="isAuthenticated">
      <v-container>
        <div class="section-header text-center mb-8">
          <h2 class="section-title">🏆 Your Adventure Stats</h2>
        </div>

        <v-row>
          <v-col cols="12" md="3" v-for="stat in userStats" :key="stat.label" class="mb-4">
            <v-card class="stat-card" elevation="6">
              <v-card-text class="text-center">
                <v-icon size="40" :color="stat.color" class="mb-2">{{ stat.icon }}</v-icon>
                <div class="stat-value">{{ stat.value }}</div>
                <div class="stat-label">{{ stat.label }}</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Admin Section -->
    <section class="admin-section" v-if="isAdmin">
      <v-container>
        <div class="section-header text-center mb-8">
          <h2 class="section-title">👑 Admin Controls</h2>
        </div>

        <v-row justify="center">
          <v-col cols="12" md="6">
            <v-card class="admin-card" elevation="8">
              <v-card-title class="justify-center">
                <v-icon color="error" class="mr-2">mdi-crown</v-icon>
                Guild Management
              </v-card-title>
              <v-card-text class="text-center">
                <p>Manage all adventurers in your realm</p>
              </v-card-text>
              <v-card-actions class="justify-center pb-4">
                <v-btn
                  color="primary"
                  large
                  to="/users"
                >
                  <v-icon left>mdi-account-group</v-icon>
                  Manage Users
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'HomeView',
  data() {
    return {
      features: [
        {
          id: 1,
          title: '🎮 Epic Games',
          description: 'Discover legendary games from mystical realms and futuristic worlds.',
          icon: 'mdi-gamepad-variant',
          color: 'primary',
          action: 'Explore Games'
        },
        {
          id: 2,
          title: '⚔️ Rare Items',
          description: 'Collect powerful weapons, armor, and magical artifacts for your journey.',
          icon: 'mdi-sword',
          color: 'warning',
          action: 'View Items'
        },
        {
          id: 3,
          title: '🏆 Achievements',
          description: 'Unlock incredible rewards and show off your gaming prowess.',
          icon: 'mdi-trophy',
          color: 'success',
          action: 'View Rewards'
        }
      ]
    }
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'currentUser']),
    
    isAdmin() {
      return this.currentUser?.role === 'admin'
    },

    userStats() {
      return [
        {
          icon: 'mdi-star',
          value: this.currentUser?.age || 0,
          label: 'Level',
          color: 'warning'
        },
        {
          icon: 'mdi-sword-cross',
          value: '12',
          label: 'Quests',
          color: 'error'
        },
        {
          icon: 'mdi-treasure-chest',
          value: '45',
          label: 'Items',
          color: 'success'
        },
        {
          icon: 'mdi-shield-check',
          value: '98%',
          label: 'Completion',
          color: 'info'
        }
      ]
    }
  },
  methods: {
    scrollToShop() {
      const element = document.getElementById('shop')
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    },

    exploreFeature() {
      // This would navigate to the specific feature page
      this.$router.push('/about') // Placeholder for now
    }
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="a"><stop offset="0" stop-color="%23fff" stop-opacity=".1"/><stop offset="1" stop-color="%23fff" stop-opacity="0"/></radialGradient></defs><circle cx="20" cy="20" r="2" fill="url(%23a)"/><circle cx="80" cy="40" r="1.5" fill="url(%23a)"/><circle cx="40" cy="80" r="1" fill="url(%23a)"/></svg>') repeat;
  opacity: 0.3;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: bold;
  text-shadow: 3px 3px 6px rgba(0,0,0,0.3);
  background: linear-gradient(45deg, #FFD700, #FFA500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
}

.hero-subtitle {
  font-size: 1.4rem;
  color: #E8EAF6;
  margin-bottom: 40px;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
}

.hero-btn {
  font-size: 1.1rem;
  font-weight: bold;
  text-transform: none;
  border-radius: 15px;
  min-width: 180px;
}

.features-section {
  background: linear-gradient(145deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 80px 0;
}

.stats-section {
  background: linear-gradient(145deg, #2C3E50, #34495E);
  padding: 80px 0;
  color: white;
}

.admin-section {
  background: linear-gradient(145deg, #1a1a2e, #16213e);
  padding: 80px 0;
  color: white;
}

.section-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 15px;
}

.section-subtitle {
  font-size: 1.2rem;
  opacity: 0.8;
}

.features-section .section-title {
  color: #2C3E50;
}

.feature-card {
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  border-radius: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 3px solid transparent;
  background-clip: padding-box;
  position: relative;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-radius: 20px;
  z-index: -1;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
}

.feature-icon {
  text-align: center;
  padding: 20px 0 10px 0;
}

.feature-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #2C3E50;
}

.feature-description {
  color: #546E7A;
  line-height: 1.6;
}

.stat-card {
  background: linear-gradient(145deg, #34495E, #2C3E50);
  border: 2px solid #4ECDC4;
  border-radius: 15px;
  color: white;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: scale(1.05);
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #4ECDC4;
  line-height: 1;
}

.stat-label {
  font-size: 1rem;
  color: #B0BEC5;
  margin-top: 8px;
}

.admin-card {
  background: linear-gradient(145deg, #2C3E50, #34495E);
  border: 2px solid #FFD700;
  border-radius: 15px;
  color: white;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
  
  .hero-btn {
    min-width: 150px;
    margin: 8px;
  }
}

@media (max-width: 600px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
}
</style>
