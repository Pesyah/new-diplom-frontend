import { useAuthStore } from '@/stores/auth'
import CartPage from '@/views/CartPage.vue'
import DashboardView from '@/views/Dashboard-view.vue'
import Home from '@/views/Home-view.vue'
import Login from '@/views/Login-form.vue'
import OrderDetail from '@/views/orders/OrderDetail.vue'
import OrdersList from '@/views/orders/OrdersList.vue'
import OrdersListAdmin from '@/views/orders/OrdersListAdmin.vue'
import ProductList from '@/views/ProductList.vue'
import CreateProductAdmin from '@/views/products/CreateProductAdmin.vue'
import EditProductAdmin from '@/views/products/EditProductAdmin.vue'
import ProductListAdmin from '@/views/products/ProductListAdmin.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import UserReportPage from '@/views/report/UserReportPage.vue'
import UserReportSearch from '@/views/report/UserReportSearch.vue'
import UserProductView from '@/views/UserProductView.vue'
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
    // meta: { requiresAuth: true },
  },
  {
    path: '/products',
    name: 'ProductList',
    component: ProductList,
    // meta: { requiresAuth: true },
  },
  {
    path: '/products-admin',
    name: 'ProductListAdmin',
    component: ProductListAdmin,
    meta: { requiresAuth: true },
  },
  {
    path: '/products-admin/create',
    name: 'CreateProductAdmin',
    component: CreateProductAdmin,
    meta: { requiresAuth: true },
  },
  {
    path: '/products-admin/edit/:id',
    name: 'EditProductAdmin',
    component: EditProductAdmin,
    meta: { requiresAuth: true },
  },
  {
    path: '/products/:id',
    name: 'UserProductView',
    component: UserProductView,
    meta: { requiresAuth: true },
  },
  {
    path: '/orders',
    name: 'OrdersList',
    component: OrdersList,
    meta: { requiresAuth: true },
  },
  {
    path: '/orders-detail/:id',
    name: 'OrderDetail',
    component: OrderDetail,
    meta: { requiresAuth: true },
  },
  {
    path: '/orders-admin',
    name: 'OrdersListAdmin',
    component: OrdersListAdmin,
    meta: { requiresAuth: true },
  },
  {
    path: '/user-report-search',
    name: 'UserReportSearch',
    component: UserReportSearch,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/user-report',
    name: 'UserReportPage',
    component: UserReportPage,
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
      }
    }
    next()
  } else {
    next() // Если авторизован или не требуется авторизация
  }
})

export default router
