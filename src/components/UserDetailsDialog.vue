<template>
  <v-dialog v-model="dialogValue" max-width="500">
    <v-card class="user-details-card">
      <v-card-title class="details-title">
        <v-icon color="primary" class="mr-2">mdi-account-details</v-icon>
        Adventurer Profile
      </v-card-title>

      <v-card-text v-if="user">
        <div class="user-profile">
          <!-- Avatar Section -->
          <div class="profile-avatar text-center mb-4">
            <v-avatar size="100" color="primary">
              <v-icon color="white" size="50">
                {{ user.gender === 'male' ? 'mdi-face-man' : 
                     user.gender === 'female' ? 'mdi-face-woman' : 'mdi-account' }}
              </v-icon>
            </v-avatar>
            <h3 class="username mt-2">{{ user.username }}</h3>
            <v-chip
              :color="user.role === 'admin' ? 'error' : 'success'"
              dark
              small
              class="role-chip"
            >
              <v-icon left small>
                {{ user.role === 'admin' ? 'mdi-crown' : 'mdi-sword' }}
              </v-icon>
              {{ user.role }}
            </v-chip>
          </div>

          <!-- User Details -->
          <v-list class="user-info">
            <!-- Full Name -->
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="primary">mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="info-label">Full Name</v-list-item-title>
                <v-list-item-subtitle class="info-value">
                  {{ user.firstName }} {{ user.lastName }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <!-- Gender -->
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="primary">{{ getGenderIcon(user.gender) }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="info-label">Gender</v-list-item-title>
                <v-list-item-subtitle class="info-value">
                  <v-chip
                    :color="getGenderColor(user.gender)"
                    dark
                    small
                    class="gender-chip"
                  >
                    {{ user.gender }}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <!-- Age -->
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="primary">mdi-calendar</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="info-label">Age</v-list-item-title>
                <v-list-item-subtitle class="info-value">
                  <div class="age-display">
                    <v-icon color="warning" small class="mr-1">mdi-star</v-icon>
                    {{ user.age }} years old
                  </div>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <!-- User ID -->
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="primary">mdi-identifier</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="info-label">User ID</v-list-item-title>
                <v-list-item-subtitle class="info-value user-id">
                  {{ user._id }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <!-- Account Status -->
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="success">mdi-check-circle</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="info-label">Status</v-list-item-title>
                <v-list-item-subtitle class="info-value">
                  <v-chip color="success" dark small>
                    <v-icon left small>mdi-shield-check</v-icon>
                    Active
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
      </v-card-text>

      <v-card-actions class="justify-center pa-4">
        <v-btn color="primary" @click="handleClose">
          <v-icon left>mdi-close</v-icon>
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'UserDetailsDialog',
  props: {
    dialog: {
      type: Boolean,
      required: true
    },
    user: {
      type: Object,
      default: null
    }
  },
  computed: {
    dialogValue: {
      get() {
        return this.dialog
      },
      set(value) {
        if (!value) {
          this.$emit('close')
        }
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
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
  }
}
</script>

<style scoped>
.user-details-card {
  background: linear-gradient(145deg, #2C3E50, #34495E);
  border: 2px solid #4ECDC4;
  border-radius: 15px;
}

.details-title {
  color: #4ECDC4;
  font-weight: bold;
  background: linear-gradient(145deg, #34495E, #2C3E50);
}

.user-profile {
  color: white;
}

.username {
  color: #4ECDC4;
  font-weight: bold;
  margin-top: 10px;
}

.role-chip {
  font-weight: bold;
}

.user-info {
  background: transparent;
}

.user-info >>> .v-list-item {
  background: rgba(52, 73, 94, 0.3);
  margin-bottom: 8px;
  border-radius: 8px;
}

.info-label {
  color: #FFD700 !important;
  font-weight: bold;
  font-size: 0.9rem;
}

.info-value {
  color: white !important;
  font-size: 1rem;
  margin-top: 4px;
}

.user-id {
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  color: #B0BEC5 !important;
}

.age-display {
  display: flex;
  align-items: center;
}

.gender-chip {
  font-weight: bold;
}

.v-card-actions {
  background: linear-gradient(145deg, #34495E, #2C3E50);
}
</style>