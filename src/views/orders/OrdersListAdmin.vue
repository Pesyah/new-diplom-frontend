<template v-if="isAdmin">
  <div class="container text-white">
    <h2 class="mb-4">Заказы</h2>

    <div v-if="orders.length" class="list-group">
      <router-link
        v-for="order in orders"
        :key="order.id"
        :to="`/orders-detail/${order.id}`"
        class="list-group-item list-group-item-action bg-dark text-white border-secondary mb-4 rounded shadow-lg py-4 px-4"
        style="font-size: 1.1rem"
      >
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h5 class="mb-2 fw-bold">
              Заказ №{{ order.id }} от {{ formatDate(order.created_at) }}
            </h5>
            <p class="mb-2 d-flex align-items-center gap-2">
              <span :class="getStatusClass(order)" class="px-2 py-1 rounded">
                <i :class="getStatusIcon(order)" class="me-1"></i>
                {{ order.status.name }}
              </span>
            </p>
            <small class="text-muted">Товаров: {{ order.orderPart.length }}</small>
          </div>
          <div class="text-end fs-4">
            <i class="bi bi-chevron-right"></i>
          </div>
        </div>
      </router-link>
    </div>

    <div v-else class="text-center mt-5">
      <p>Пока нет заказов.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '@/services/api'
import { useAuthStore } from '../../stores/auth'

const orders = ref([])
const authStore = useAuthStore()

const isAdmin = computed(() => authStore.user?.role === 2)

const fetchOrders = async () => {
  try {
    const { data } = await api.get('/orders/to-admin')
    orders.value = data
  } catch (err) {
    console.error('Ошибка при загрузке заказов', err)
  }
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

const getStatusClass = (order: any) => {
  switch (order.status.id) {
    case 1:
      return 'badge bg-secondary'
    case 2:
      return 'badge bg-success'
    case 3:
      return 'badge bg-danger'
    default:
      return 'badge bg-light text-dark'
  }
}

const getStatusIcon = (order: any) => {
  switch (order.status.id) {
    case 1:
      return 'bi bi-clock-history'
    case 2:
      return 'bi bi-check-circle-fill'
    case 3:
      return 'bi bi-x-circle-fill'
    default:
      return 'bi bi-question-circle'
  }
}

onMounted(fetchOrders)
</script>
