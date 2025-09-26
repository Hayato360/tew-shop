<template>
  <v-dialog v-model="dialogValue" max-width="600" persistent>
    <v-card class="user-form-card">
      <v-card-title class="form-title">
        <v-icon color="primary" class="mr-2">
          {{ isEdit ? 'mdi-account-edit' : 'mdi-account-plus' }}
        </v-icon>
        {{ isEdit ? 'Edit Adventurer' : 'Add New Adventurer' }}
      </v-card-title>

      <v-card-text>
        <v-form ref="userForm" v-model="valid">
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
                v-model="formData.username"
                :rules="usernameRules"
                :disabled="isEdit"
                label="🗡️ Username"
                prepend-icon="mdi-account-circle"
                outlined
                dense
                class="game-input"
                :hint="isEdit ? 'Username cannot be changed' : 'Choose a unique username'"
                persistent-hint
              />
            </v-col>

            <!-- Password -->
            <v-col cols="12" md="6" v-if="!isEdit">
              <v-text-field
                v-model="formData.password"
                :rules="passwordRules"
                :type="showPassword ? 'text' : 'password'"
                label="🔐 Password"
                prepend-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                outlined
                dense
                class="game-input"
              />
            </v-col>

            <!-- First Name -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.firstName"
                :rules="nameRules"
                label="🏷️ First Name"
                prepend-icon="mdi-account"
                outlined
                dense
                class="game-input"
              />
            </v-col>

            <!-- Last Name -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.lastName"
                :rules="nameRules"
                label="🏷️ Last Name"
                prepend-icon="mdi-account"
                outlined
                dense
                class="game-input"
              />
            </v-col>

            <!-- Gender -->
            <v-col cols="12" md="6">
              <v-select
                v-model="formData.gender"
                :items="genderOptions"
                :rules="genderRules"
                label="⚥ Gender"
                prepend-icon="mdi-human-male-female"
                outlined
                dense
                class="game-input"
              />
            </v-col>

            <!-- Age -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="formData.age"
                :rules="ageRules"
                label="🎂 Age"
                prepend-icon="mdi-calendar"
                type="number"
                min="13"
                max="99"
                outlined
                dense
                class="game-input"
              />
            </v-col>

            <!-- Role (Admin only) -->
            <v-col cols="12" v-if="canManageRoles">
              <v-select
                v-model="formData.role"
                :items="roleOptions"
                :rules="roleRules"
                label="🎭 Role"
                prepend-icon="mdi-shield-account"
                outlined
                dense
                class="game-input"
                hint="Assign role to the adventurer"
                persistent-hint
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn color="grey" text @click="handleClose" :disabled="loading">
          Cancel
        </v-btn>
        <v-btn
          :color="isEdit ? 'warning' : 'primary'"
          :disabled="!valid || loading"
          :loading="loading"
          @click="handleSave"
        >
          <v-icon left>
            {{ isEdit ? 'mdi-content-save' : 'mdi-account-plus' }}
          </v-icon>
          {{ isEdit ? 'Update' : 'Create' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'UserFormDialog',
  props: {
    dialog: {
      type: Boolean,
      required: true
    },
    user: {
      type: Object,
      default: null
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      valid: false,
      showPassword: false,
      formData: {
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        gender: '',
        age: null,
        role: 'user'
      },
      genderOptions: [
        { text: '🚹 Male', value: 'male' },
        { text: '🚺 Female', value: 'female' },
        { text: '⚥ Other', value: 'other' },
        { text: '🤐 Prefer not to say', value: 'not-specified' }
      ],
      roleOptions: [
        { text: '🗡️ User', value: 'user' },
        { text: '👑 Admin', value: 'admin' }
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
      ],
      roleRules: [
        v => !!v || 'Role is required'
      ]
    }
  },
  computed: {
    ...mapGetters(['isLoading', 'getError']),
    ...mapGetters('auth', ['currentUser']),
    loading() {
      return this.isLoading
    },
    error() {
      return this.getError
    },
    canManageRoles() {
      return this.currentUser?.role === 'admin'
    },
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
  watch: {
    dialog(val) {
      if (val) {
        this.resetForm()
        if (this.user && this.isEdit) {
          this.fillForm()
        }
      }
    }
  },
  methods: {
    resetForm() {
      this.formData = {
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        gender: '',
        age: null,
        role: 'user'
      }
      this.$refs.userForm?.resetValidation()
    },

    fillForm() {
      if (this.user) {
        this.formData = {
          username: this.user.username || '',
          password: '', // Don't populate password for edit
          firstName: this.user.firstName || '',
          lastName: this.user.lastName || '',
          gender: this.user.gender || '',
          age: this.user.age || null,
          role: this.user.role || 'user'
        }
      }
    },

    handleClose() {
      this.$emit('close')
    },

    handleSave() {
      if (this.$refs.userForm.validate()) {
        const dataToSave = { ...this.formData }
        
        // Remove password from update data if editing
        if (this.isEdit) {
          delete dataToSave.password
          delete dataToSave.username // Username cannot be changed
        }

        this.$emit('save', dataToSave)
      }
    },

    clearError() {
      this.$store.dispatch('clearError')
    }
  }
}
</script>

<style scoped>
.user-form-card {
  background: linear-gradient(145deg, #2C3E50, #34495E);
  border: 2px solid #FFD700;
  border-radius: 15px;
}

.form-title {
  color: #FFD700;
  font-weight: bold;
  background: linear-gradient(145deg, #34495E, #2C3E50);
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

.v-card-text {
  color: white;
}

.v-card-actions {
  background: linear-gradient(145deg, #34495E, #2C3E50);
}
</style>