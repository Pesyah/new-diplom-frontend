import { useAuthStore } from '@/stores/auth'
import CarCreate from '@/views/cars/CarCreate.vue'
import CarDetail from '@/views/cars/CarDetail.vue'
import CarList from '@/views/cars/CarList.vue'
import DashboardView from '@/views/Dashboard-view.vue'
import Home from '@/views/Home-view.vue'
import Login from '@/views/Login-form.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  {
    path: '/dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: '/cars/create',
    component: CarCreate,
    meta: { requiresAuth: true },
  },
  { path: '/cars', component: CarList, meta: { requiresAuth: true } },
  { path: '/cars/edit/:id', component: CarDetail, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const token = authStore.access_token

  // Если страница требует авторизации
  if (to.meta.requiresAuth && !token) {
    // Если пользователь не на странице логина, перенаправляем его
    if (to.path !== '/login') {
      next('/login')
    } else {
      next() // Если пользователь уже на /login, не перенаправляем
    }
  } else {
    next() // Если авторизован или не требуется авторизация
  }
})

export default router
