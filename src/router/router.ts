import { useAuthStore } from '@/stores/auth'
import Dashboard from '@/views/Dashboard-view.vue'
import Home from '@/views/Home-view.vue'
import Login from '@/views/Login-form.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.access_token) {
    next('/login')
  } else {
    next()
  }
})

export default router
