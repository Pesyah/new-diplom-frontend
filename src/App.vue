<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

const router = useRouter()
const authStore = useAuthStore()

const isLoggedIn = computed(() => !!authStore.user)

const goToDashboard = () => {
  router.push('/dashboard')
}

const goToCart = () => {
  router.push('/cart')
}

const goToOrders = () => {
  router.push('/orders')
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}
try {
  if (authStore.access_token) authStore.fetchUser()
} catch {
  router.push('/login')
}
const isAdmin = computed(() => authStore.user?.role === 2)
const isUser = computed(() => authStore.user?.role === 1)
</script>

<template>
  <div>
    <!-- Фиксированное меню -->
    <div class="top-menu border-bottom px-3 py-2 bg-dark" style="z-index: 10000">
      <template v-if="!isLoggedIn">
        <div class="d-flex flex-wrap gap-2">
          <button class="btn btn-primary" @click="router.push('/login')">Войти</button>
          <button class="btn btn-secondary" @click="router.push('/products')">
            Список продуктов
          </button>
          <button class="btn btn-primary" @click="goToCart">Перейти в корзину</button>
        </div>
      </template>

      <template v-else>
        <div v-if="isUser" class="d-flex flex-wrap gap-2">
          <button class="btn btn-primary" @click="goToDashboard">На главную</button>
          <button class="btn btn-primary" @click="goToOrders">Мои заказы</button>
          <button class="btn btn-primary" @click="goToCart">Перейти в корзину</button>
        </div>

        <div v-if="isAdmin" class="d-flex flex-wrap gap-2 mt-2">
          <button class="btn btn-primary" @click="goToDashboard">На главную</button>
          <button class="btn btn-secondary" @click="router.push('/products-admin')">
            Список продуктов (админ)
          </button>
          <button class="btn btn-secondary" @click="router.push('/orders-admin')">
            Список заказов (админ)
          </button>
          <button class="btn btn-secondary" @click="router.push('/user-report-search')">
            Формирование отчетов
          </button>
        </div>

        <div class="mt-2">
          <button class="btn btn-danger" @click="logout">Выйти</button>
        </div>
      </template>
    </div>

    <!-- Контент с отступом сверху -->
    <div class="page-content px-3 py-4">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.menu-bar {
  position: sticky;
  top: 0;
  z-index: 1000;
}
.top-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1050;
}

.page-content {
  margin-top: 140px; /* отступ под высоту меню */
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
button:hover {
  background-color: #45a049;
}
</style>
