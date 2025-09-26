import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#667eea',
        secondary: '#764ba2',
        accent: '#4ECDC4',
        error: '#FF6B6B',
        warning: '#FFD700',
        info: '#54a3ff',
        success: '#5cb85c'
      },
      dark: {
        primary: '#667eea',
        secondary: '#764ba2',
        accent: '#4ECDC4',
        error: '#FF6B6B',
        warning: '#FFD700',
        info: '#54a3ff',
        success: '#5cb85c'
      }
    }
  }
})
