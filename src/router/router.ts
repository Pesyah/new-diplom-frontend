import { useAuthStore } from '@/stores/auth'
import DashboardView from '@/views/Dashboard-view.vue'
import CreateDriver from '@/views/drivers/CreateDriver.vue'
import DriverList from '@/views/drivers/DriverList.vue'
import EditDriver from '@/views/drivers/EditDriver.vue'
import Home from '@/views/Home-view.vue'
import Login from '@/views/Login-form.vue'
import TrailerCreate from '@/views/trailers/TrailerCreate.vue'
import TrailerEdit from '@/views/trailers/TrailerEdit.vue'
import TrailerList from '@/views/trailers/TrailerList.vue'
import TripsCreate from '@/views/trips/TripsCreate.vue'
import TripsEdit from '@/views/trips/TripsEdit.vue'
import TripsList from '@/views/trips/TripsList.vue'
import TruckCreate from '@/views/trucks/TruckCreate.vue'
import TruckEdit from '@/views/trucks/TruckEdit.vue'
import TrucksList from '@/views/trucks/TrucksList.vue'
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
    path: '/drivers/create',
    component: CreateDriver,
    meta: { requiresAuth: true },
  },
  { path: '/drivers', component: DriverList, meta: { requiresAuth: true } },
  { path: '/drivers/edit/:id', component: EditDriver, meta: { requiresAuth: true } },
  { path: '/trucks', component: TrucksList, meta: { requiresAuth: true } },
  {
    path: '/trucks/create',
    component: TruckCreate,
    meta: { requiresAuth: true },
  },
  { path: '/trucks/edit/:id', component: TruckEdit, meta: { requiresAuth: true } },
  { path: '/trailers', component: TrailerList, meta: { requiresAuth: true } },
  {
    path: '/trailers/create',
    component: TrailerCreate,
    meta: { requiresAuth: true },
  },
  { path: '/trailers/edit/:id', component: TrailerEdit, meta: { requiresAuth: true } },
  { path: '/trips', component: TripsList, meta: { requiresAuth: true } },
  {
    path: '/trips/create',
    component: TripsCreate,
    meta: { requiresAuth: true },
  },
  { path: '/trips/edit/:id', component: TripsEdit, meta: { requiresAuth: true } },
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
