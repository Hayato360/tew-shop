<template>
  <div class="about-page">
    <!-- Hero Section -->
    <section class="about-hero">
      <v-container>
        <v-row align="center" justify="center">
          <v-col cols="12" md="8" class="text-center">
            <h1 class="about-title mb-4">
              🎮 About Game Shop
            </h1>
            <p class="about-subtitle">
              Your legendary destination for epic gaming adventures
            </p>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Story Section -->
    <section class="story-section">
      <v-container>
        <v-row>
          <v-col cols="12" md="6" class="d-flex align-center">
            <div class="story-content">
              <h2 class="story-title">📖 Our Epic Tale</h2>
              <p class="story-text">
                Born from the dreams of legendary gamers and forged in the fires of passion, 
                Game Shop emerged as a beacon for adventurers seeking the ultimate gaming experience. 
                Our quest began in the mystical realm of code and pixels, where we discovered the 
                ancient art of bringing virtual worlds to life.
              </p>
              <p class="story-text">
                Every game in our collection tells a story, every item holds power, and every 
                adventurer who joins our guild becomes part of an ever-growing legend. We believe 
                that gaming is not just entertainment – it's a journey of discovery, friendship, 
                and endless possibilities.
              </p>
            </div>
          </v-col>
          <v-col cols="12" md="6" class="text-center">
            <v-card class="story-card" elevation="12">
              <v-img
                src="/img/icons/android-chrome-512x512.png"
                height="300"
                class="story-image"
              />
              <v-card-text class="story-card-text">
                <h3 class="card-title">⚔️ Join the Adventure</h3>
                <p>Become part of our legendary guild and embark on epic quests!</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <v-container>
        <div class="section-header text-center mb-8">
          <h2 class="section-title">🏰 Our Legendary Features</h2>
          <p class="section-subtitle">Discover what makes our realm special</p>
        </div>

        <v-row>
          <v-col cols="12" md="4" v-for="feature in features" :key="feature.id" class="mb-4">
            <v-card class="feature-card h-100" elevation="8">
              <div class="feature-header">
                <v-icon size="60" :color="feature.color">{{ feature.icon }}</v-icon>
                <h3 class="feature-title">{{ feature.title }}</h3>
              </div>
              <v-card-text>
                <p class="feature-description">{{ feature.description }}</p>
                <ul class="feature-list">
                  <li v-for="item in feature.benefits" :key="item">{{ item }}</li>
                </ul>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Team Section -->
    <section class="team-section">
      <v-container>
        <div class="section-header text-center mb-8">
          <h2 class="section-title">🎭 Our Guild Masters</h2>
          <p class="section-subtitle">Meet the legendary heroes behind Game Shop</p>
        </div>

        <v-row justify="center">
          <v-col cols="12" md="4" v-for="member in team" :key="member.id" class="mb-4">
            <v-card class="team-card" elevation="8">
              <div class="team-avatar">
                <v-avatar size="100" :color="member.color">
                  <v-icon size="50" color="white">{{ member.icon }}</v-icon>
                </v-avatar>
              </div>
              <v-card-title class="justify-center">
                <span class="team-name">{{ member.name }}</span>
              </v-card-title>
              <v-card-subtitle class="text-center">
                <span class="team-role">{{ member.role }}</span>
              </v-card-subtitle>
              <v-card-text class="text-center">
                <p class="team-description">{{ member.description }}</p>
                <div class="team-skills">
                  <v-chip
                    v-for="skill in member.skills"
                    :key="skill"
                    small
                    :color="member.color"
                    dark
                    class="ma-1"
                  >
                    {{ skill }}
                  </v-chip>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- API Documentation Section -->
    <section class="api-section" v-if="isAuthenticated">
      <v-container>
        <div class="section-header text-center mb-8">
          <h2 class="section-title">🔌 API Documentation</h2>
          <p class="section-subtitle">For developers and adventurers who want to integrate</p>
        </div>

        <v-row>
          <v-col cols="12" md="6">
            <v-card class="api-card" elevation="8">
              <v-card-title>
                <v-icon color="primary" class="mr-2">mdi-shield-account</v-icon>
                Authentication API
              </v-card-title>
              <v-card-text>
                <div class="api-endpoints">
                  <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="path">/auth</span>
                    <span class="description">Test auth route</span>
                  </div>
                  <div class="endpoint">
                    <span class="method post">POST</span>
                    <span class="path">/auth/register</span>
                    <span class="description">Register new user</span>
                  </div>
                  <div class="endpoint">
                    <span class="method post">POST</span>
                    <span class="path">/auth/login</span>
                    <span class="description">User login</span>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card class="api-card" elevation="8">
              <v-card-title>
                <v-icon color="success" class="mr-2">mdi-account-group</v-icon>
                Users API
              </v-card-title>
              <v-card-text>
                <div class="api-endpoints">
                  <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="path">/users</span>
                    <span class="description">Get all users (Admin)</span>
                  </div>
                  <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="path">/users/:id</span>
                    <span class="description">Get user by ID</span>
                  </div>
                  <div class="endpoint">
                    <span class="method post">POST</span>
                    <span class="path">/users</span>
                    <span class="description">Create user (Admin)</span>
                  </div>
                  <div class="endpoint">
                    <span class="method put">PUT</span>
                    <span class="path">/users/:id</span>
                    <span class="description">Update user (Admin)</span>
                  </div>
                  <div class="endpoint">
                    <span class="method delete">DELETE</span>
                    <span class="path">/users/:id</span>
                    <span class="description">Delete user (Admin)</span>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <v-container>
        <v-row align="center" justify="center">
          <v-col cols="12" md="8" class="text-center">
            <h2 class="cta-title">🚀 Ready to Begin Your Adventure?</h2>
            <p class="cta-subtitle">
              Join thousands of adventurers who have already started their legendary journey
            </p>
            
            <div class="cta-actions" v-if="!isAuthenticated">
              <v-btn
                x-large
                color="primary"
                class="cta-btn mr-4 mb-4"
                to="/register"
              >
                <v-icon left>mdi-rocket</v-icon>
                Start Your Quest
              </v-btn>
              
              <v-btn
                x-large
                outlined
                color="white"
                class="cta-btn mb-4"
                to="/login"
              >
                <v-icon left>mdi-login</v-icon>
                Enter Realm
              </v-btn>
            </div>

            <div class="cta-actions" v-else>
              <v-btn
                x-large
                color="success"
                class="cta-btn mb-4"
                to="/"
              >
                <v-icon left>mdi-home</v-icon>
                Return Home
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AboutView',
  data() {
    return {
      features: [
        {
          id: 1,
          title: '🎮 Epic Game Collection',
          description: 'Curated selection of legendary games from various realms.',
          icon: 'mdi-gamepad-variant',
          color: 'primary',
          benefits: [
            'RPG Adventures',
            'Action Quests', 
            'Strategy Battles',
            'Puzzle Challenges'
          ]
        },
        {
          id: 2,
          title: '⚔️ Powerful Items',
          description: 'Collect rare weapons, armor, and magical artifacts.',
          icon: 'mdi-sword',
          color: 'warning',
          benefits: [
            'Legendary Weapons',
            'Mystical Armor',
            'Magic Potions',
            'Rare Collectibles'
          ]
        },
        {
          id: 3,
          title: '🏆 Achievement System',
          description: 'Track your progress and unlock amazing rewards.',
          icon: 'mdi-trophy',
          color: 'success',
          benefits: [
            'Quest Tracking',
            'Leaderboards',
            'Exclusive Rewards',
            'Guild Competitions'
          ]
        }
      ],
      team: [
        {
          id: 1,
          name: 'Alex the Code Wizard',
          role: '🧙‍♂️ Lead Developer',
          description: 'Master of the ancient arts of Vue.js and Node.js, wielder of the Sacred Database.',
          icon: 'mdi-wizard-hat',
          color: 'purple',
          skills: ['Vue.js', 'Node.js', 'MongoDB', 'Magic']
        },
        {
          id: 2,
          name: 'Sarah the Design Enchantress',
          role: '🎨 UX/UI Designer',
          description: 'Crafts beautiful interfaces and user experiences that captivate adventurers.',
          icon: 'mdi-palette',
          color: 'pink',
          skills: ['UI/UX', 'Figma', 'Photoshop', 'Creativity']
        },
        {
          id: 3,
          name: 'Mike the Quest Master',
          role: '🗡️ Product Manager',
          description: 'Guides the development journey and ensures every feature serves our adventurers.',
          icon: 'mdi-compass',
          color: 'orange',
          skills: ['Strategy', 'Management', 'Analytics', 'Leadership']
        }
      ]
    }
  },
  computed: {
    ...mapGetters('auth', ['isAuthenticated'])
  }
}
</script>

<style scoped>
.about-page {
  min-height: 100vh;
}

.about-hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 120px 0 80px 0;
  text-align: center;
}

.about-title {
  font-size: 3rem;
  font-weight: bold;
  color: white;
  text-shadow: 3px 3px 6px rgba(0,0,0,0.3);
}

.about-subtitle {
  font-size: 1.3rem;
  color: #E8EAF6;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
}

.story-section {
  background: linear-gradient(145deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 80px 0;
}

.story-title {
  font-size: 2.2rem;
  color: #2C3E50;
  margin-bottom: 20px;
  font-weight: bold;
}

.story-text {
  font-size: 1.1rem;
  color: #546E7A;
  line-height: 1.8;
  margin-bottom: 20px;
}

.story-card {
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  border-radius: 20px;
  border: 3px solid #4ECDC4;
}

.story-card-text {
  background: linear-gradient(145deg, #2C3E50, #34495E);
  color: white;
}

.card-title {
  color: #4ECDC4;
  font-weight: bold;
}

.features-section {
  background: linear-gradient(145deg, #2C3E50, #34495E);
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

.feature-card {
  background: linear-gradient(145deg, #34495E, #2C3E50);
  border: 2px solid #4ECDC4;
  border-radius: 15px;
  color: white;
  padding: 20px;
}

.feature-header {
  text-align: center;
  margin-bottom: 20px;
}

.feature-title {
  color: #4ECDC4;
  font-weight: bold;
  margin-top: 10px;
}

.feature-description {
  color: white;
  margin-bottom: 15px;
  line-height: 1.6;
}

.feature-list {
  color: #B0BEC5;
  padding-left: 20px;
}

.feature-list li {
  margin-bottom: 5px;
}

.team-section {
  background: linear-gradient(145deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 80px 0;
}

.team-section .section-title {
  color: #2C3E50;
}

.team-card {
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  border-radius: 20px;
  border: 3px solid #FFD700;
  text-align: center;
  padding: 20px;
}

.team-avatar {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.team-name {
  color: #2C3E50;
  font-weight: bold;
  font-size: 1.2rem;
}

.team-role {
  color: #7B68EE;
  font-weight: bold;
}

.team-description {
  color: #546E7A;
  line-height: 1.6;
  margin: 15px 0;
}

.team-skills {
  margin-top: 15px;
}

.api-section {
  background: linear-gradient(145deg, #1a1a2e, #16213e);
  padding: 80px 0;
  color: white;
}

.api-card {
  background: linear-gradient(145deg, #2C3E50, #34495E);
  border: 2px solid #4ECDC4;
  border-radius: 15px;
  color: white;
}

.api-endpoints {
  font-family: 'Courier New', monospace;
}

.endpoint {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 8px;
  background: rgba(78, 205, 196, 0.1);
  border-radius: 5px;
}

.method {
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  min-width: 60px;
  text-align: center;
  margin-right: 10px;
}

.method.get { background: #4CAF50; }
.method.post { background: #2196F3; }
.method.put { background: #FF9800; }
.method.delete { background: #F44336; }

.path {
  font-weight: bold;
  color: #4ECDC4;
  min-width: 120px;
  margin-right: 10px;
}

.description {
  color: #B0BEC5;
  font-size: 0.9rem;
}

.cta-section {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  padding: 80px 0;
  text-align: center;
  color: white;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.cta-subtitle {
  font-size: 1.2rem;
  margin-bottom: 40px;
  opacity: 0.9;
}

.cta-btn {
  font-size: 1.1rem;
  font-weight: bold;
  text-transform: none;
  border-radius: 15px;
  min-width: 180px;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .about-title {
    font-size: 2.5rem;
  }
  
  .story-title {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
}

@media (max-width: 600px) {
  .about-title {
    font-size: 2rem;
  }
  
  .cta-title {
    font-size: 2rem;
  }
  
  .cta-btn {
    min-width: 150px;
    margin: 8px;
  }
}
</style>
