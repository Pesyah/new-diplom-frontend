<template>
  <div class="container py-4 text-white">
    <h2 class="mb-4">Мои заказы</h2>

    <div v-if="orders.length" class="list-group">
      <router-link
        v-for="order in orders"
        :key="order.id"
        :to="`/orders-detail/${order.id}`"
        class="list-group-item list-group-item-action bg-dark text-white border-secondary mb-2 rounded"
      >
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h5 class="mb-1">Заказ от {{ formatDate(order.created_at) }}</h5>
            <p class="mb-1">Статус: {{ order.status.name }}</p>
            <small>Товаров: {{ order.orderPart.length }}</small>
          </div>
          <div>
            <i class="bi bi-chevron-right"></i>
          </div>
        </div>
      </router-link>
    </div>

    <div v-else class="text-center mt-5">
      <p>У вас пока нет заказов.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/services/api'

const orders = ref([])

const fetchOrders = async () => {
  try {
    const { data } = await api.get('/orders/by-user')
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

onMounted(fetchOrders)
</script>
