import { useAuthStore } from '@/stores/auth'
import CartPage from '@/views/CartPage.vue'
import DashboardView from '@/views/Dashboard-view.vue'
import Home from '@/views/Home-view.vue'
import Login from '@/views/Login-form.vue'
import ProductList from '@/views/ProductList.vue'
import ProductListAdmin from '@/views/products/ProductListAdmin.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: Home, meta: { requiresAuth: true } },

  { path: '/login', component: Login },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
  },
  {
    path: '/dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: '/cart',
    component: CartPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/products',
    name: 'ProductList',
    component: ProductList,
    meta: { requiresAuth: true },
  },
  {
    path: '/products-admin',
    name: 'ProductListAdmin',
    component: ProductListAdmin,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const user = authStore.user
  const token = authStore.access_token

  // Если страница требует авторизации
  if (to.meta.requiresAuth && !user) {
    // Если пользователь не на странице логина, перенаправляем его
    try {
      if (token) authStore.fetchUser()
    } catch (e) {
      console.log(e)
      if (to.path !== '/login') {
        next('/login')
      } else {
        next() // Если пользователь уже на /login, не перенаправляем
      }
    }
    next()
  } else {
    next() // Если авторизован или не требуется авторизация
  }
})

export default router
