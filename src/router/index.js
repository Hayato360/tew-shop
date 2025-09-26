import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
    meta: { guest: true }
  },
  {
    path: '/register', 
    name: 'register',
    component: () => import('../views/RegisterView.vue'),
    meta: { guest: true }
  },
  {
    path: '/products',
    name: 'products', 
    component: () => import('../views/ProductsView.vue')
  },
  {
    path: '/products/:id',
    name: 'product-detail',
    component: () => import('../views/ProductDetailView.vue')
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('../views/CartView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('../views/UserManagementView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// Navigation Guards
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated']
  const user = store.getters['auth/currentUser']
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  const hideForAuth = to.matched.some(record => record.meta.hideForAuth)

  // Check authentication on app start
  if (!store.state.auth.token && localStorage.getItem('token')) {
    store.dispatch('auth/checkAuth')
  }

  // Redirect authenticated users away from login/register pages
  if (isAuthenticated && hideForAuth) {
    next('/')
    return
  }

  // Redirect unauthenticated users to login
  if (requiresAuth && !isAuthenticated) {
    next('/login')
    return
  }

  // Check admin permissions
  if (requiresAdmin && (!user || user.role !== 'admin')) {
    next('/')
    return
  }

  next()
})

export default router
